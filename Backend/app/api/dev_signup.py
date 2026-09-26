from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.auth import get_current_user, generate_customer_id
from app.core.database import get_db
from app.core.security import hash_password
from app.models.user import User
from app.services.rank_service import evaluate_upline_rank_chain


router = APIRouter(
    prefix="/api/admin/dev-signup",
    tags=["Admin Dev Signup"],
)

TEST_PASSWORD = "123456789"
MAX_USERS_PER_REQUEST = 10


class DevSignupRequest(BaseModel):
    sponsor_referral_id: str
    count: int = Field(default=10, ge=1, le=MAX_USERS_PER_REQUEST)


class CreatedTestUser(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: str
    customer_id: str
    referral_id: str
    referred_by: str
    password: str


class DevSignupResponse(BaseModel):
    success: bool
    message: str
    count: int
    users: List[CreatedTestUser]


def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if (current_user.role or "").lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user


def next_test_number(db: Session) -> int:
    number = 1
    while True:
        email = f"testuser{number}@gmail.com"
        exists = db.query(User.id).filter(User.email == email).first()
        if not exists:
            return number
        number += 1


def generate_test_phone(db: Session, number: int) -> str:
    candidate = 7000000000 + number
    while True:
        phone = f"+91{candidate:010d}"
        exists = (
            db.query(User.id)
            .filter(User.phone_number == phone)
            .first()
        )
        if not exists:
            return phone
        candidate += 1


@router.post(
    "/create-users",
    response_model=DevSignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_test_users(
    payload: DevSignupRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    sponsor_id = (
        payload.sponsor_referral_id
        .strip()
        .upper()
        .replace("-", "")
        .replace(" ", "")
    )

    if not sponsor_id.startswith("APH"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid sponsor referral ID.",
        )

    sponsor = (
        db.query(User)
        .filter(User.referral_id == sponsor_id)
        .first()
    )

    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor referral ID not found.",
        )

    if not sponsor.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sponsor account is inactive.",
        )

    try:
        password_hash = hash_password(TEST_PASSWORD)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to prepare test-user password.",
        )

    created_users = []
    test_number = next_test_number(db)

    try:
        for _ in range(payload.count):
            while (
                db.query(User.id)
                .filter(User.email == f"testuser{test_number}@gmail.com")
                .first()
            ):
                test_number += 1

            email = f"testuser{test_number}@gmail.com"
            full_name = f"Test User {test_number}"
            phone_number = generate_test_phone(db, test_number)
            customer_id = generate_customer_id(db)

            user = User(
                customer_id=customer_id,
                referral_id=customer_id,
                referred_by=sponsor_id,
                full_name=full_name,
                first_name="Test",
                last_name=f"User {test_number}",
                gender=None,
                address=None,
                bep20_address=None,
                bep20_change_count=0,
                bep20_updated_at=None,
                email=email,
                phone_number=phone_number,
                country="India",
                country_code="+91",
                password_hash=password_hash,
                role="user",
                is_active=True,
            )

            db.add(user)
            db.flush()

            created_users.append((user, TEST_PASSWORD))
            test_number += 1

        evaluate_upline_rank_chain(
            db=db,
            starting_user=sponsor,
        )

        db.commit()

        response_users = []
        for user, password in created_users:
            db.refresh(user)
            response_users.append(
                CreatedTestUser(
                    id=user.id,
                    full_name=user.full_name,
                    email=user.email,
                    phone_number=user.phone_number,
                    customer_id=user.customer_id,
                    referral_id=user.referral_id,
                    referred_by=user.referred_by,
                    password=password,
                )
            )

        return DevSignupResponse(
            success=True,
            message=f"{len(response_users)} test user(s) created successfully.",
            count=len(response_users),
            users=response_users,
        )

    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        print("Admin dev-signup error:", repr(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create test users.",
        )
