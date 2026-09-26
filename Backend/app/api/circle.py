from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User

from app.api.auth import get_current_user

from app.services.circle_service import (
    get_circle_summary,
    get_my_circle,
    get_my_all_circle,
)


router = APIRouter(
    prefix="/api/circle",
    tags=["Circle"],
)


# =========================================================
# CIRCLE SUMMARY
# =========================================================

@router.get("/summary")
def circle_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    return get_circle_summary(
        db=db,
        user=current_user,
    )


# =========================================================
# MY CIRCLE
#
# Direct referrals only.
# =========================================================

@router.get("/my-circle")
def my_circle(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    members = get_my_circle(
        db=db,
        user=current_user,
    )

    return {
        "success": True,
        "total": len(members),
        "members": members,
    }


# =========================================================
# MY ALL CIRCLE
#
# Complete downline.
# =========================================================

@router.get("/my-all-circle")
def my_all_circle(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    members = get_my_all_circle(
        db=db,
        user=current_user,
    )

    return {
        "success": True,
        "total": len(members),
        "members": members,
    }