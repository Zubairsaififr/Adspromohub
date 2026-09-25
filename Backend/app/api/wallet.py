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

from app.models.royalty_pool import (
    RoyaltyPoolIncome,
)

from app.services.royalty_pool_service import (
    build_referral_tree,
    calculate_user_qualification,
    get_enabled_users,
    get_total_royalty_earned,
    money as royalty_money,
    process_single_user_royalty,
)

from app.schemas.royalty_pool import (
    RoyaltyLegItem,
    RoyaltyPoolHistoryResponse,
    RoyaltyPoolStatusResponse,
    RoyaltyPoolSummaryResponse,
)

from app.models.income_wallet import (
    IncomeWallet,
)

from app.models.income_wallet_transaction import (
    IncomeWalletTransaction,
)

from app.schemas.wallet import (
    IncomeWalletResponse,
)


# =====================================================
# ROUTER
# =====================================================

router = APIRouter(
    prefix="/api/income-wallet",
    tags=["Income Wallet"],
)


# =====================================================
# MONEY HELPER
# =====================================================

def money(value):
    """
    Convert wallet values to Decimal
    with exactly 2 decimal places.
    """

    return Decimal(
        str(value or 0)
    ).quantize(
        Decimal("0.01")
    )


# =====================================================
# CURRENT INCOME WALLET
#
# GET /api/income-wallet
# =====================================================

@router.get(
    "",
    response_model=IncomeWalletResponse,
)
def get_income_wallet(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    wallet = (
        db.query(
            IncomeWallet
        )
        .filter(
            IncomeWallet.user_id
            == current_user.id
        )
        .first()
    )


    # -------------------------------------------------
    # NO WALLET YET
    # -------------------------------------------------

    if not wallet:

        return {
            "success": True,

            "balance":
                Decimal("0.00"),

            "total_earned":
                Decimal("0.00"),

            "total_withdrawn":
                Decimal("0.00"),
        }


    # -------------------------------------------------
    # WALLET FOUND
    # -------------------------------------------------

    return {
        "success": True,

        "balance":
            money(
                wallet.balance
            ),

        "total_earned":
            money(
                wallet.total_earned
            ),

        "total_withdrawn":
            money(
                wallet.total_withdrawn
            ),
    }


# =====================================================
# INCOME SOURCE SUMMARY
#
# GET /api/income-wallet/summary
# =====================================================

@router.get(
    "/summary"
)
def get_income_wallet_income_summary(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    # -------------------------------------------------
    # SUM ALL CREDITED TRANSACTIONS
    # GROUPED BY INCOME TYPE
    # -------------------------------------------------

    rows = (
        db.query(
            IncomeWalletTransaction.income_type,

            func.coalesce(
                func.sum(
                    IncomeWalletTransaction.amount
                ),
                0,
            ).label(
                "total"
            ),
        )
        .filter(
            IncomeWalletTransaction.user_id
            == current_user.id,

            IncomeWalletTransaction.status
            == "credited",
        )
        .group_by(
            IncomeWalletTransaction.income_type
        )
        .all()
    )


    # -------------------------------------------------
    # CONVERT RESULTS TO DICTIONARY
    # -------------------------------------------------

    totals = {
        str(
            row.income_type
        ):
            float(
                row.total or 0
            )

        for row in rows
    }


    # -------------------------------------------------
    # KNOWN INCOME SOURCES
    # -------------------------------------------------

    daily_compounding = (
        totals.get(
            "daily_compounding",
            0.0,
        )
    )

    level_profit = (
        totals.get(
            "level_profit",
            0.0,
        )
    )

    rank_bonus = (
        totals.get(
            "rank_bonus",
            0.0,
        )
    )

    rank_hierarchy = (
        totals.get(
            "rank_hierarchy",
            0.0,
        )
    )

    team_rank_bonus = (
        totals.get(
            "team_rank_bonus",
            0.0,
        )
    )

    royalty = (
        totals.get(
            "royalty",
            0.0,
        )
    )

    # -------------------------------------------------
    # RANK ACHIEVER FUND
    #
    # Ledger:
    # income_type = rank_achiever
    #
    # Includes:
    # - Business Development Fund
    # - Travel Fund
    # - Car Fund
    # - Home Fund
    # - Core Fund
    # - Lifetime Royalty
    # -------------------------------------------------

    rank_achiever = (
        totals.get(
            "rank_achiever",
            0.0,
        )
    )


    # -------------------------------------------------
    # TOTAL FROM CREDITED LEDGER
    # -------------------------------------------------

    total_income = sum(
        float(
            value or 0
        )
        for value in totals.values()
    )


    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return {
        "success": True,

        # =============================================
        # DAILY COMPOUNDING
        # =============================================

        "daily_compounding":
            daily_compounding,


        # =============================================
        # LEVEL PROFIT
        # =============================================

        "level_profit":
            level_profit,


        # =============================================
        # INSTANT RANK BONUS
        # =============================================

        "rank_bonus":
            rank_bonus,


        # =============================================
        # RANK HIERARCHY
        # =============================================

        "rank_hierarchy":
            rank_hierarchy,


        # =============================================
        # TEAM RANK BONUS
        # =============================================

        "team_rank_bonus":
            team_rank_bonus,


        # =============================================
        # ROYALTY POOL
        # =============================================

        "royalty":
            royalty,


        # =============================================
        # RANK ACHIEVER FUNDS
        # =============================================

        "rank_achiever":
            rank_achiever,


        # =============================================
        # ALL CREDITED INCOME
        # =============================================

        "total_income":
            total_income,
    }


# =====================================================
# INCOME WALLET TRANSACTION HISTORY
#
# GET /api/income-wallet/transactions
#
# Shows ALL credited/reversed wallet ledger entries.
# =====================================================

@router.get(
    "/transactions"
)
def get_income_wallet_transactions(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    transactions = (
        db.query(
            IncomeWalletTransaction
        )
        .filter(
            IncomeWalletTransaction.user_id
            == current_user.id
        )
        .order_by(
            IncomeWalletTransaction.created_at.desc(),
            IncomeWalletTransaction.id.desc(),
        )
        .all()
    )


    history = []


    for transaction in transactions:

        history.append(
            {
                "id":
                    transaction.id,

                "income_type":
                    transaction.income_type,

                "amount":
                    money(
                        transaction.amount
                    ),

                "balance_before":
                    money(
                        transaction.balance_before
                    ),

                "balance_after":
                    money(
                        transaction.balance_after
                    ),

                "reference_type":
                    transaction.reference_type,

                "reference_id":
                    transaction.reference_id,

                "description":
                    transaction.description,

                "status":
                    transaction.status,

                "created_at":
                    transaction.created_at,
            }
        )


    return {
        "success": True,

        "count":
            len(history),

        "transactions":
            history,
    }


# =====================================================
# RANK ACHIEVER WALLET TRANSACTIONS
#
# GET /api/income-wallet/rank-achiever
#
# Only Rank Achiever fund credits.
# =====================================================

@router.get(
    "/rank-achiever"
)
def get_rank_achiever_wallet_transactions(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    transactions = (
        db.query(
            IncomeWalletTransaction
        )
        .filter(
            IncomeWalletTransaction.user_id
            == current_user.id,

            IncomeWalletTransaction.income_type
            == "rank_achiever",
        )
        .order_by(
            IncomeWalletTransaction.created_at.desc(),
            IncomeWalletTransaction.id.desc(),
        )
        .all()
    )


    history = []


    total_credited = Decimal(
        "0.00"
    )


    for transaction in transactions:

        amount = money(
            transaction.amount
        )


        if (
            transaction.status
            == "credited"
        ):
            total_credited = money(
                total_credited
                + amount
            )


        history.append(
            {
                "id":
                    transaction.id,

                "income_type":
                    transaction.income_type,

                "amount":
                    amount,

                "balance_before":
                    money(
                        transaction.balance_before
                    ),

                "balance_after":
                    money(
                        transaction.balance_after
                    ),

                "reference_type":
                    transaction.reference_type,

                "reference_id":
                    transaction.reference_id,

                "description":
                    transaction.description,

                "status":
                    transaction.status,

                "created_at":
                    transaction.created_at,
            }
        )


    return {
        "success": True,

        "total_credited":
            money(
                total_credited
            ),

        "count":
            len(history),

        "transactions":
            history,
    }