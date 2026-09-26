from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.api.auth import get_current_user


router = APIRouter(
    prefix="/api/user",
    tags=["User"],
)


@router.get("/details")
def get_user_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return details for the currently logged-in user.

    Subscription is not implemented yet,
    so subscription_status/amount remain pending.
    """

    # -------------------------------------------------
    # SPONSOR
    # -------------------------------------------------

    sponsor_name = None

    if current_user.referred_by:
        sponsor = (
            db.query(User)
            .filter(
                User.referral_id
                == current_user.referred_by
            )
            .first()
        )

        if sponsor:
            sponsor_name = sponsor.full_name


    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return {
        "success": True,

        "user": {
            "id": current_user.id,

            "full_name":
                current_user.full_name,

            "email":
                current_user.email,

            "customer_id":
                current_user.customer_id,

            "referral_code":
                current_user.referral_id,

            "sponsor_id":
                current_user.referred_by,

            "sponsor_name":
                sponsor_name,

            "joining_date":
                current_user.created_at,

            "is_active":
                current_user.is_active,

            "role":
                current_user.role,

            # Subscription later
            "subscription_status":
                "pending",

            "subscription_amount":
                None,
        },
    }