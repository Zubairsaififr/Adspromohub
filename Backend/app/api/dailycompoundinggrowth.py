from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User

from app.services.dailycompoundinggrowth import (
    get_compounding_status,
    start_ad_session,
    finish_ad_watch,
    complete_ad_session,
)


router = APIRouter(
    prefix="/api/daily-compounding",
    tags=["Daily Compounding"],
)


# =========================================================
# STATUS
# =========================================================

@router.get("/status")
def daily_compounding_status(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    return get_compounding_status(
        db=db,
        user=current_user,
    )


# =========================================================
# START 30-SECOND AD
# =========================================================

@router.post("/start")
def start_daily_ad(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    session = start_ad_session(
        db=db,
        user=current_user,
    )

    return {
        "success": True,

        "message":
            "Advertisement started successfully.",

        "session": {
            "id":
                session.id,

            "status":
                session.status,

            "ad_started_at":
                session.ad_started_at,

            "ad_watch_seconds":
                30,

            "direct_referral_count":
                session.direct_referral_count,

            "growth_percentage":
                session.growth_percentage,

            "earning_category":
                session.earning_category,

            "earning_multiplier":
                session.earning_multiplier,
        },
    }


# =========================================================
# FINISH 30-SECOND WATCH
#
# NO MONEY CREDITED HERE
# =========================================================

@router.post(
    "/finish-watch/{session_id}"
)
def finish_daily_ad_watch(
    session_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    session = finish_ad_watch(
        db=db,
        user=current_user,
        session_id=session_id,
    )

    return {
        "success": True,

        "message":
            "Advertisement completed successfully. "
            "Compounding income is now pending.",

        "session": {
            "id":
                session.id,

            "status":
                session.status,

            "ad_started_at":
                session.ad_started_at,

            "ad_completed_at":
                session.ad_completed_at,

            "eligible_at":
                session.eligible_at,
        },
    }


# =========================================================
# CREDIT / CLAIM COMPOUNDING
#
# DEV: after 5 minutes
# PROD: after 12 hours
# =========================================================

@router.post(
    "/complete/{session_id}"
)
def complete_daily_compounding(
    session_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    result = complete_ad_session(
        db=db,
        user=current_user,
        session_id=session_id,
    )

    session = result["session"]
    wallet = result["wallet"]

    return {
        "success": True,

        "message":
            "Daily compounding growth credited successfully.",

        "growth": {
            "session_id":
                session.id,

            "subscription_amount":
                session.subscription_amount,

            "wallet_balance_before":
                session.wallet_balance_before,

            "base_amount":
                session.growth_base_amount,

            "direct_referral_count":
                session.direct_referral_count,

            "percentage":
                session.growth_percentage,

            "growth_amount":
                session.growth_amount,

            "wallet_balance_after":
                session.wallet_balance_after,

            "earning_category":
                session.earning_category,

            "earning_multiplier":
                session.earning_multiplier,

            "ad_completed_at":
                session.ad_completed_at,

            "credited_at":
                session.updated_at,
        },

        "wallet": {
            "balance":
                wallet.balance,

            "total_earned":
                wallet.total_earned,

            "total_withdrawn":
                wallet.total_withdrawn,
        },
    }