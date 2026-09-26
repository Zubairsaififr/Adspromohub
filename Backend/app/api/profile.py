import re
from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.profile import (
    ChangePasswordRequest,
    UpdateBEP20Request,
    UpdateProfileRequest,
)


router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"],
)


# =========================================================
# HELPERS
# =========================================================

BEP20_PATTERN = re.compile(
    r"^0x[a-fA-F0-9]{40}$"
)


def utc_now():
    return (
        datetime
        .now(timezone.utc)
        .replace(tzinfo=None)
    )


def clean_optional_text(
    value: str | None,
) -> str | None:
    if value is None:
        return None

    cleaned = value.strip()

    return cleaned or None


def get_profile_response(
    user: User,
):
    """
    Common profile response.
    """

    bep20_is_set = bool(
        user.bep20_address
    )

    bep20_change_count = (
        user.bep20_change_count or 0
    )

    # Initial setup does NOT consume the user's
    # one allowed self-service replacement.
    #
    # 0 = user can still replace wallet once
    # 1 = self-service replacement already used
    bep20_can_change = (
        bep20_change_count < 1
    )

    return {
        "success": True,

        "user": {
            "id":
                user.id,

            "customer_id":
                user.customer_id,

            "referral_code":
                user.referral_id,

            "sponsor_id":
                user.referred_by,

            "full_name":
                user.full_name,

            "first_name":
                user.first_name,

            "last_name":
                user.last_name,

            "email":
                user.email,

            "phone_number":
                user.phone_number,

            "country":
                user.country,

            "gender":
                user.gender,

            "address":
                user.address,

            "bep20_address":
                user.bep20_address,

            "bep20_is_set":
                bep20_is_set,

            "bep20_change_count":
                bep20_change_count,

            "bep20_can_change":
                bep20_can_change,

            "bep20_updated_at":
                user.bep20_updated_at,

            "is_active":
                user.is_active,

            "joining_date":
                user.created_at,
        },
    }


# =========================================================
# GET PROFILE
# =========================================================

@router.get("")
def get_profile(
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_profile_response(
        current_user
    )


# =========================================================
# UPDATE GENERAL PROFILE
# =========================================================

@router.put("")
def update_profile(
    payload: UpdateProfileRequest,

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    first_name = (
        payload.first_name.strip()
    )

    last_name = (
        payload.last_name.strip()
    )

    if len(first_name) < 2:
        raise HTTPException(
            status_code=400,
            detail=(
                "First name must contain "
                "at least 2 characters."
            ),
        )

    if not last_name:
        raise HTTPException(
            status_code=400,
            detail="Last name is required.",
        )


    # -----------------------------------------------------
    # GENDER
    # -----------------------------------------------------

    gender = clean_optional_text(
        payload.gender
    )

    if gender:
        allowed_genders = {
            "male",
            "female",
            "other",
            "prefer_not_to_say",
        }

        normalized_gender = (
            gender
            .lower()
            .replace(" ", "_")
        )

        if (
            normalized_gender
            not in allowed_genders
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid gender option."
                ),
            )

        gender = normalized_gender


    # -----------------------------------------------------
    # UPDATE
    # -----------------------------------------------------

    current_user.first_name = (
        first_name
    )

    current_user.last_name = (
        last_name
    )

    # Keep old full_name field synchronized.
    current_user.full_name = (
        f"{first_name} {last_name}"
        .strip()
    )

    current_user.gender = gender

    current_user.address = (
        clean_optional_text(
            payload.address
        )
    )


    try:
        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update profile."
            ),
        )


    response = get_profile_response(
        current_user
    )

    response["message"] = (
        "Profile updated successfully."
    )

    return response


# =========================================================
# UPDATE BEP20 WALLET
# =========================================================

@router.put("/bep20-address")
def update_bep20_address(
    payload: UpdateBEP20Request,

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    new_address = (
        payload.bep20_address.strip()
    )


    # -----------------------------------------------------
    # VALIDATE FORMAT
    # -----------------------------------------------------

    if not BEP20_PATTERN.fullmatch(
        new_address
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid BEP20 wallet address. "
                "Address must start with 0x "
                "followed by 40 hexadecimal "
                "characters."
            ),
        )


    old_address = (
        current_user.bep20_address
    )

    change_count = (
        current_user.bep20_change_count
        or 0
    )


    # -----------------------------------------------------
    # FIRST WALLET SETUP
    # -----------------------------------------------------

    if not old_address:

        current_user.bep20_address = (
            new_address
        )

        # Initial setup does NOT count
        # as the one allowed replacement.
        current_user.bep20_change_count = 0

        current_user.bep20_updated_at = (
            utc_now()
        )

        try:
            db.commit()
            db.refresh(current_user)

        except Exception:
            db.rollback()

            raise HTTPException(
                status_code=500,
                detail=(
                    "Unable to save BEP20 "
                    "wallet address."
                ),
            )


        response = get_profile_response(
            current_user
        )

        response["message"] = (
            "BEP20 wallet address saved "
            "successfully. You will be "
            "allowed to change this address "
            "one time from your profile."
        )

        return response


    # -----------------------------------------------------
    # SAME ADDRESS
    # -----------------------------------------------------

    if (
        old_address.lower()
        == new_address.lower()
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "This BEP20 wallet address "
                "is already saved on your "
                "account."
            ),
        )


    # -----------------------------------------------------
    # SELF-SERVICE CHANGE ALREADY USED
    # -----------------------------------------------------

    if change_count >= 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your BEP20 wallet address "
                "change limit has been used. "
                "Please raise a support ticket "
                "to request another change."
            ),
        )


    # -----------------------------------------------------
    # ONE ALLOWED REPLACEMENT
    # -----------------------------------------------------

    current_user.bep20_address = (
        new_address
    )

    current_user.bep20_change_count = 1

    current_user.bep20_updated_at = (
        utc_now()
    )


    try:
        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update BEP20 "
                "wallet address."
            ),
        )


    response = get_profile_response(
        current_user
    )

    response["message"] = (
        "BEP20 wallet address changed "
        "successfully. Your self-service "
        "wallet change has now been used."
    )

    return response


# =========================================================
# CHANGE PASSWORD
# =========================================================

@router.put("/change-password")
def change_password(
    payload: ChangePasswordRequest,

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    # -----------------------------------------------------
    # CONFIRM PASSWORD
    # -----------------------------------------------------

    if (
        payload.new_password
        != payload.confirm_password
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "New password and confirm "
                "password do not match."
            ),
        )


    # -----------------------------------------------------
    # CURRENT PASSWORD
    # -----------------------------------------------------

    if not verify_password(
        payload.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Current password is incorrect."
            ),
        )


    # -----------------------------------------------------
    # DON'T ALLOW SAME PASSWORD
    # -----------------------------------------------------

    if verify_password(
        payload.new_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "New password must be "
                "different from your current "
                "password."
            ),
        )


    # -----------------------------------------------------
    # HASH + SAVE
    # -----------------------------------------------------

    try:
        current_user.password_hash = (
            hash_password(
                payload.new_password
            )
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


    try:
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to change password."
            ),
        )


    return {
        "success": True,
        "message": (
            "Password changed successfully."
        ),
    }