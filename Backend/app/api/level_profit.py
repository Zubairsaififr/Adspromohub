from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.user import User
from app.models.level_profit import LevelProfit

from app.api.auth import get_current_user

from app.services.level_profit_service import (
    get_direct_referral_count,
    get_today_level_profit_earned_for_levels,
    get_today_total_level_profit,
    get_unlocked_level,
)


router = APIRouter(
    prefix="/api/level-profit",
    tags=["Level Profit"],
)


ZERO = Decimal("0.0000")


# =========================================================
# HELPER
# =========================================================

def decimal_value(value) -> Decimal:
    if value is None:
        return ZERO

    return Decimal(str(value))


# =========================================================
# SUMMARY
#
# IMPORTANT:
#
# Each Level Profit slab has its OWN daily cap:
#
# L1-L2  = 5% = $10/day
# L3-L5  = 4% = $20/day
# L6-L8  = 3% = $30/day
# L9-L10 = 2% = $40/day
#
# These caps are NOT combined.
# =========================================================

@router.get("/summary")
def get_level_profit_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # -----------------------------------------------------
    # DIRECT REFERRALS
    # -----------------------------------------------------

    direct_count = get_direct_referral_count(
        db=db,
        user=current_user,
    )

    # -----------------------------------------------------
    # CURRENTLY UNLOCKED LEVEL
    # -----------------------------------------------------

    unlocked_up_to_level = get_unlocked_level(
        direct_count
    )

    # =====================================================
    # LEVEL 1-2
    # =====================================================

    level_1_2_percentage = Decimal("5.00")
    level_1_2_daily_cap = Decimal("10.00")

    if direct_count >= 4:

        level_1_2_today_earned = (
            get_today_level_profit_earned_for_levels(
                db=db,
                beneficiary_user_id=current_user.id,
                min_level=1,
                max_level=2,
            )
        )

        level_1_2_remaining_cap = max(
            level_1_2_daily_cap
            - level_1_2_today_earned,
            ZERO,
        )

        level_1_2_unlocked = True

    else:

        level_1_2_today_earned = ZERO
        level_1_2_remaining_cap = ZERO
        level_1_2_unlocked = False


    # =====================================================
    # LEVEL 3-5
    # =====================================================

    level_3_5_percentage = Decimal("4.00")
    level_3_5_daily_cap = Decimal("20.00")

    if direct_count >= 12:

        level_3_5_today_earned = (
            get_today_level_profit_earned_for_levels(
                db=db,
                beneficiary_user_id=current_user.id,
                min_level=3,
                max_level=5,
            )
        )

        level_3_5_remaining_cap = max(
            level_3_5_daily_cap
            - level_3_5_today_earned,
            ZERO,
        )

        level_3_5_unlocked = True

    else:

        level_3_5_today_earned = ZERO
        level_3_5_remaining_cap = ZERO
        level_3_5_unlocked = False


    # =====================================================
    # LEVEL 6-8
    # =====================================================

    level_6_8_percentage = Decimal("3.00")
    level_6_8_daily_cap = Decimal("30.00")

    if direct_count >= 20:

        level_6_8_today_earned = (
            get_today_level_profit_earned_for_levels(
                db=db,
                beneficiary_user_id=current_user.id,
                min_level=6,
                max_level=8,
            )
        )

        level_6_8_remaining_cap = max(
            level_6_8_daily_cap
            - level_6_8_today_earned,
            ZERO,
        )

        level_6_8_unlocked = True

    else:

        level_6_8_today_earned = ZERO
        level_6_8_remaining_cap = ZERO
        level_6_8_unlocked = False


    # =====================================================
    # LEVEL 9-10
    # =====================================================

    level_9_10_percentage = Decimal("2.00")
    level_9_10_daily_cap = Decimal("40.00")

    if direct_count >= 30:

        level_9_10_today_earned = (
            get_today_level_profit_earned_for_levels(
                db=db,
                beneficiary_user_id=current_user.id,
                min_level=9,
                max_level=10,
            )
        )

        level_9_10_remaining_cap = max(
            level_9_10_daily_cap
            - level_9_10_today_earned,
            ZERO,
        )

        level_9_10_unlocked = True

    else:

        level_9_10_today_earned = ZERO
        level_9_10_remaining_cap = ZERO
        level_9_10_unlocked = False


    # =====================================================
    # TODAY TOTAL
    #
    # Reporting only.
    # No combined cap is applied.
    # =====================================================

    today_total_level_profit = (
        get_today_total_level_profit(
            db=db,
            beneficiary_user_id=current_user.id,
        )
    )


    # =====================================================
    # LIFETIME LEVEL PROFIT
    # =====================================================

    total_level_profit = (
        db.query(
            func.coalesce(
                func.sum(
                    LevelProfit.credited_amount
                ),
                0,
            )
        )
        .filter(
            LevelProfit.beneficiary_user_id
            == current_user.id,

            LevelProfit.status.in_(
                [
                    "credited",
                    "capped",
                ]
            ),
        )
        .scalar()
    )

    total_level_profit = decimal_value(
        total_level_profit
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {
        "success": True,

        "direct_count": direct_count,

        "unlocked_up_to_level":
            unlocked_up_to_level,

        "today_total_level_profit":
            float(today_total_level_profit),

        "total_level_profit":
            float(total_level_profit),

        # -----------------------------------------
        # LEVEL 1-2
        # -----------------------------------------

        "level_1_2": {
            "levels": "1-2",
            "required_directs": 4,
            "unlocked":
                level_1_2_unlocked,
            "percentage":
                float(level_1_2_percentage),
            "daily_cap":
                float(level_1_2_daily_cap),
            "today_earned":
                float(level_1_2_today_earned),
            "remaining_cap":
                float(level_1_2_remaining_cap),
        },

        # -----------------------------------------
        # LEVEL 3-5
        # -----------------------------------------

        "level_3_5": {
            "levels": "3-5",
            "required_directs": 12,
            "unlocked":
                level_3_5_unlocked,
            "percentage":
                float(level_3_5_percentage),
            "daily_cap":
                float(level_3_5_daily_cap),
            "today_earned":
                float(level_3_5_today_earned),
            "remaining_cap":
                float(level_3_5_remaining_cap),
        },

        # -----------------------------------------
        # LEVEL 6-8
        # -----------------------------------------

        "level_6_8": {
            "levels": "6-8",
            "required_directs": 20,
            "unlocked":
                level_6_8_unlocked,
            "percentage":
                float(level_6_8_percentage),
            "daily_cap":
                float(level_6_8_daily_cap),
            "today_earned":
                float(level_6_8_today_earned),
            "remaining_cap":
                float(level_6_8_remaining_cap),
        },

        # -----------------------------------------
        # LEVEL 9-10
        # -----------------------------------------

        "level_9_10": {
            "levels": "9-10",
            "required_directs": 30,
            "unlocked":
                level_9_10_unlocked,
            "percentage":
                float(level_9_10_percentage),
            "daily_cap":
                float(level_9_10_daily_cap),
            "today_earned":
                float(level_9_10_today_earned),
            "remaining_cap":
                float(level_9_10_remaining_cap),
        },
    }


# =========================================================
# HISTORY
# =========================================================

@router.get("/history")
def get_level_profit_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    records = (
        db.query(LevelProfit)
        .filter(
            LevelProfit.beneficiary_user_id
            == current_user.id
        )
        .order_by(
            LevelProfit.id.desc()
        )
        .all()
    )

    history = []

    for record in records:

        source_user = (
            db.query(User)
            .filter(
                User.id
                == record.source_user_id
            )
            .first()
        )

        history.append(
            {
                "id":
                    record.id,

                "source_user_id":
                    record.source_user_id,

                "source_customer_id":
                    (
                        source_user.customer_id
                        if source_user
                        else None
                    ),

                "source_referral_id":
                    (
                        source_user.referral_id
                        if source_user
                        else None
                    ),

                "source_user_name":
                    (
                        source_user.full_name
                        if source_user
                        else None
                    ),

                "level":
                    record.level,

                "beneficiary_direct_count":
                    record.beneficiary_direct_count,

                "source_growth_amount":
                    float(
                        record.source_growth_amount
                        or 0
                    ),

                "percentage":
                    float(
                        record.percentage
                        or 0
                    ),

                "calculated_amount":
                    float(
                        record.calculated_amount
                        or 0
                    ),

                "credited_amount":
                    float(
                        record.credited_amount
                        or 0
                    ),

                "daily_cap":
                    float(
                        record.daily_cap
                        or 0
                    ),

                "daily_earned_before":
                    float(
                        record.daily_earned_before
                        or 0
                    ),

                "daily_earned_after":
                    float(
                        record.daily_earned_after
                        or 0
                    ),

                "business_date":
                    record.business_date,

                "status":
                    record.status,

                "created_at":
                    record.created_at,
            }
        )

    return {
        "success": True,
        "total": len(history),
        "history": history,
    }