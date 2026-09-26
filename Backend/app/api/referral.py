from decimal import Decimal

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.api.auth import (
    get_current_user,
)

from app.models.user import User
from app.models.referral_income import (
    ReferralIncome,
)

from app.schemas.referral import (
    ReferralSummaryResponse,
    ReferralHistoryResponse,
)


router = APIRouter(
    prefix="/api/referral",
    tags=["Referral"],
)


def money(value):
    return Decimal(
        str(value or 0)
    ).quantize(
        Decimal("0.01")
    )


# =====================================================
# REFERRAL SUMMARY
# =====================================================

@router.get(
    "/summary",
    response_model=ReferralSummaryResponse,
)
def referral_summary(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # -------------------------------------------------
    # TOTAL
    # -------------------------------------------------

    total_income = (
        db.query(
            func.coalesce(
                func.sum(
                    ReferralIncome.referral_amount
                ),
                0,
            )
        )
        .filter(
            ReferralIncome.beneficiary_user_id
            == current_user.id,

            ReferralIncome.status
            == "credited",
        )
        .scalar()
    )


    # -------------------------------------------------
    # FIRST SUBSCRIPTION INCOME
    # -------------------------------------------------

    first_subscription_income = (
        db.query(
            func.coalesce(
                func.sum(
                    ReferralIncome.referral_amount
                ),
                0,
            )
        )
        .filter(
            ReferralIncome.beneficiary_user_id
            == current_user.id,

            ReferralIncome.income_type
            == "first_subscription",

            ReferralIncome.status
            == "credited",
        )
        .scalar()
    )


    # -------------------------------------------------
    # UPGRADE INCOME
    # -------------------------------------------------

    upgrade_income = (
        db.query(
            func.coalesce(
                func.sum(
                    ReferralIncome.referral_amount
                ),
                0,
            )
        )
        .filter(
            ReferralIncome.beneficiary_user_id
            == current_user.id,

            ReferralIncome.income_type
            == "upgrade",

            ReferralIncome.status
            == "credited",
        )
        .scalar()
    )


    # -------------------------------------------------
    # TRANSACTION COUNT
    # -------------------------------------------------

    total_transactions = (
        db.query(
            ReferralIncome
        )
        .filter(
            ReferralIncome.beneficiary_user_id
            == current_user.id,

            ReferralIncome.status
            == "credited",
        )
        .count()
    )


    return {
        "success": True,

        "total_referral_income":
            money(total_income),

        "first_subscription_income":
            money(
                first_subscription_income
            ),

        "upgrade_income":
            money(upgrade_income),

        "total_referral_transactions":
            total_transactions,
    }


# =====================================================
# REFERRAL HISTORY
# =====================================================

@router.get(
    "/history",
    response_model=ReferralHistoryResponse,
)
def referral_history(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    records = (
        db.query(
            ReferralIncome,
            User,
        )
        .join(
            User,
            User.id
            == ReferralIncome.source_user_id,
        )
        .filter(
            ReferralIncome.beneficiary_user_id
            == current_user.id
        )
        .order_by(
            ReferralIncome.id.desc()
        )
        .all()
    )


    items = []

    total_referral_income = (
        Decimal("0.00")
    )


    for (
        referral,
        source_user,
    ) in records:

        if referral.status == "credited":
            total_referral_income += money(
                referral.referral_amount
            )


        items.append(
            {
                "id":
                    referral.id,

                "source_user_id":
                    source_user.id,

                "source_customer_id":
                    source_user.customer_id,

                "source_name":
                    source_user.full_name,

                "income_type":
                    referral.income_type,

                "base_amount":
                    money(
                        referral.base_amount
                    ),

                "percentage":
                    money(
                        referral.percentage
                    ),

                "referral_amount":
                    money(
                        referral.referral_amount
                    ),

                "status":
                    referral.status,

                "created_at":
                    referral.created_at,
            }
        )


    return {
        "success": True,

        "total_referral_income":
            money(
                total_referral_income
            ),

        "count":
            len(items),

        "items":
            items,
    }