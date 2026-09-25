from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import secrets

from app.core.database import get_db
from app.core.config import settings
from app.core.security import hash_password
from app.api.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/dev",
    tags=["Development"],
)


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def generate_referral_id():
    return f"DEV{secrets.randbelow(90000000) + 10000000}"


@router.post("/create-10-directs")
def create_10_test_directs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # NEVER allow this endpoint in production
    if settings.APP_ENV.lower() != "development":
        raise HTTPException(
            status_code=403,
            detail="Development endpoint disabled.",
        )

    created_users = []

    try:
        for i in range(10):

            referral_id = generate_referral_id()

            # Extra collision protection
            while (
                db.query(User)
                .filter(User.referral_id == referral_id)
                .first()
            ):
                referral_id = generate_referral_id()

            unique_token = secrets.token_hex(4)

            test_user = User(
                customer_id=referral_id,
                referral_id=referral_id,

                # THIS makes them DIRECT referrals
                # of the logged-in user.
                referred_by=current_user.referral_id,

                full_name=f"DEV Direct {i + 1}",

                email=(
                    f"dev_{current_user.id}_"
                    f"{unique_token}@test.local"
                ),

                phone_number=(
                    f"+919{secrets.randbelow(900000000):09d}"
                ),

                country="India",
                country_code="+91",

                password_hash=hash_password(
                    "Dev@123456"
                ),

                role="user",
                is_active=True,

                created_at=utc_now(),
                updated_at=utc_now(),
            )

            db.add(test_user)
            db.flush()

            created_users.append(
                {
                    "id": test_user.id,
                    "customer_id": test_user.customer_id,
                    "referral_id": test_user.referral_id,
                    "full_name": test_user.full_name,
                    "referred_by": test_user.referred_by,
                }
            )

        db.commit()

        return {
            "success": True,
            "message": "10 development direct referrals created.",
            "parent": {
                "user_id": current_user.id,
                "referral_id": current_user.referral_id,
            },
            "created_count": len(created_users),
            "created_users": created_users,
        }

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create test directs: {str(exc)}",
        )