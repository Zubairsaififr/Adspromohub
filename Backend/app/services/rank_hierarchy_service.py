# from datetime import datetime, timezone
# from decimal import Decimal, ROUND_HALF_UP
# from zoneinfo import ZoneInfo

# from sqlalchemy.exc import IntegrityError
# from sqlalchemy.orm import Session

# from app.core.config import settings
# from app.models.rank import UserRank
# from app.models.rank_hierarchy_hold_wallet import RankHierarchyHoldWallet
# from app.models.rank_hierarchy_growth import RankHierarchyGrowth
# from app.services.rank_config import RANK_CONFIG


# CENT = Decimal("0.01")
# HIERARCHY_DAILY_PERCENT = Decimal("0.50")
# HUNDRED = Decimal("100")


# # ============================================================
# # TIME HELPERS
# # ============================================================

# def utc_now():
#     return datetime.now(timezone.utc).replace(tzinfo=None)


# def get_business_date():
#     """
#     Returns today's date according to BUSINESS_TIMEZONE.

#     Example:
#         Asia/Kolkata
#     """
#     timezone_name = getattr(
#         settings,
#         "BUSINESS_TIMEZONE",
#         "Asia/Kolkata",
#     )

#     return datetime.now(
#         ZoneInfo(timezone_name)
#     ).date()


# # ============================================================
# # MONEY HELPER
# # ============================================================

# def money(value) -> Decimal:
#     return Decimal(str(value or 0)).quantize(
#         CENT,
#         rounding=ROUND_HALF_UP,
#     )


# # ============================================================
# # RANK ACHIEVEMENT CHECK
# # ============================================================

# def has_achieved_rank(
#     db: Session,
#     user_id: int,
#     rank_name: str,
# ) -> bool:
#     """
#     Historical rank achievement counts.

#     A superseded rank is still an achieved rank.
#     """

#     record = (
#         db.query(UserRank)
#         .filter(
#             UserRank.user_id == user_id,
#             UserRank.rank_name == rank_name,
#         )
#         .first()
#     )

#     return record is not None


# # ============================================================
# # GET / CREATE HOLD WALLET
# # ============================================================

# def get_or_create_rank_hierarchy_wallet(
#     db: Session,
#     user_id: int,
#     rank_name: str,
# ):
#     """
#     Creates one hold wallet per user + achieved rank.

#     Example Ruby:
#         Start = $50
#         Cap   = $100
#     """

#     rank_name = rank_name.lower()

#     config = RANK_CONFIG.get(rank_name)

#     if not config:
#         return None

#     if not has_achieved_rank(
#         db=db,
#         user_id=user_id,
#         rank_name=rank_name,
#     ):
#         return None

#     existing = (
#         db.query(RankHierarchyHoldWallet)
#         .filter(
#             RankHierarchyHoldWallet.user_id == user_id,
#             RankHierarchyHoldWallet.rank_name == rank_name,
#         )
#         .with_for_update()
#         .first()
#     )

#     if existing:
#         return existing

#     starting_amount = money(
#         config["wallet_maintain"]
#     )

#     cap_amount = money(
#         config["hierarchy_cap"]
#     )

#     now = utc_now()

#     wallet = RankHierarchyHoldWallet(
#         user_id=user_id,
#         rank_name=rank_name,

#         starting_amount=starting_amount,
#         current_amount=starting_amount,
#         cap_amount=cap_amount,

#         total_growth=Decimal("0.00"),

#         hierarchy_percentage=HIERARCHY_DAILY_PERCENT,

#         status=(
#             "completed"
#             if starting_amount >= cap_amount
#             else "active"
#         ),

#         started_at=now,

#         cap_reached_at=(
#             now
#             if starting_amount >= cap_amount
#             else None
#         ),

#         last_growth_at=None,
#     )

#     db.add(wallet)
#     db.flush()

#     return wallet


# # ============================================================
# # INITIALIZE ALL HISTORICALLY ACHIEVED RANKS
# # ============================================================

# def initialize_user_rank_hierarchy_wallets(
#     db: Session,
#     user_id: int,
# ):
#     """
#     Creates missing hold wallets for every rank the user
#     has historically achieved.

#     Existing wallets are NEVER reset.
#     """

#     wallets = []

#     for rank_name in RANK_CONFIG.keys():

#         if not has_achieved_rank(
#             db=db,
#             user_id=user_id,
#             rank_name=rank_name,
#         ):
#             continue

#         wallet = get_or_create_rank_hierarchy_wallet(
#             db=db,
#             user_id=user_id,
#             rank_name=rank_name,
#         )

#         if wallet:
#             wallets.append(wallet)

#     return wallets


# # ============================================================
# # TODAY'S GROWTH CHECK
# # ============================================================

# def get_today_growth(
#     db: Session,
#     hold_wallet_id: int,
#     business_date=None,
# ):
#     if business_date is None:
#         business_date = get_business_date()

#     return (
#         db.query(RankHierarchyGrowth)
#         .filter(
#             RankHierarchyGrowth.hold_wallet_id
#             == hold_wallet_id,

#             RankHierarchyGrowth.business_date
#             == business_date,
#         )
#         .first()
#     )


# # ============================================================
# # COMPOUND ONE HOLD WALLET
# # ============================================================

# def compound_rank_hierarchy_wallet(
#     db: Session,
#     wallet: RankHierarchyHoldWallet,
#     business_date=None,
# ):
#     """
#     Apply exactly ONE 0.50% hierarchy compound for the
#     supplied business date.

#     Formula:

#         growth = current_balance * 0.50%

#         new_balance = current_balance + growth

#     Growth is capped at hierarchy_cap.

#     Duplicate protection:
#         one hold_wallet_id + business_date only.
#     """

#     if business_date is None:
#         business_date = get_business_date()

#     # Lock wallet row.
#     wallet = (
#         db.query(RankHierarchyHoldWallet)
#         .filter(
#             RankHierarchyHoldWallet.id == wallet.id
#         )
#         .with_for_update()
#         .first()
#     )

#     if not wallet:
#         return {
#             "processed": False,
#             "reason": "wallet_not_found",
#         }

#     current_amount = money(
#         wallet.current_amount
#     )

#     cap_amount = money(
#         wallet.cap_amount
#     )

#     # --------------------------------------------------------
#     # CAP ALREADY REACHED
#     # --------------------------------------------------------

#     if (
#         wallet.status == "completed"
#         or current_amount >= cap_amount
#     ):
#         wallet.current_amount = cap_amount
#         wallet.status = "completed"

#         if not wallet.cap_reached_at:
#             wallet.cap_reached_at = utc_now()

#         db.flush()

#         return {
#             "processed": False,
#             "reason": "cap_reached",
#             "wallet": wallet,
#         }

#     # --------------------------------------------------------
#     # SAME BUSINESS DATE CHECK
#     # --------------------------------------------------------

#     existing_growth = get_today_growth(
#         db=db,
#         hold_wallet_id=wallet.id,
#         business_date=business_date,
#     )

#     if existing_growth:
#         return {
#             "processed": False,
#             "reason": "already_processed_today",
#             "wallet": wallet,
#             "growth": existing_growth,
#         }

#     # --------------------------------------------------------
#     # TRUE 0.50% COMPOUNDING
#     # --------------------------------------------------------

#     raw_growth = (
#         current_amount
#         * HIERARCHY_DAILY_PERCENT
#         / HUNDRED
#     )

#     growth_amount = money(raw_growth)

#     # Never allow a positive active balance to become
#     # permanently stuck because of 2-decimal rounding.
#     if (
#         current_amount > Decimal("0.00")
#         and growth_amount <= Decimal("0.00")
#     ):
#         growth_amount = CENT

#     remaining_to_cap = money(
#         cap_amount - current_amount
#     )

#     actual_growth = min(
#         growth_amount,
#         remaining_to_cap,
#     )

#     actual_growth = money(
#         actual_growth
#     )

#     new_amount = money(
#         current_amount + actual_growth
#     )

#     # --------------------------------------------------------
#     # CREATE DAILY HISTORY FIRST
#     # --------------------------------------------------------

#     growth_record = RankHierarchyGrowth(
#         user_id=wallet.user_id,
#         hold_wallet_id=wallet.id,
#         rank_name=wallet.rank_name,

#         business_date=business_date,

#         balance_before=current_amount,

#         growth_percentage=HIERARCHY_DAILY_PERCENT,

#         growth_amount=actual_growth,

#         balance_after=new_amount,

#         cap_amount=cap_amount,

#         status="credited",
#     )

#     db.add(growth_record)

#     # --------------------------------------------------------
#     # UPDATE HOLD WALLET
#     # --------------------------------------------------------

#     wallet.current_amount = new_amount

#     wallet.total_growth = money(
#         Decimal(str(wallet.total_growth or 0))
#         + actual_growth
#     )

#     wallet.last_growth_at = utc_now()

#     if new_amount >= cap_amount:
#         wallet.current_amount = cap_amount
#         wallet.status = "completed"
#         wallet.cap_reached_at = utc_now()

#     db.flush()

#     return {
#         "processed": True,
#         "reason": "growth_credited",
#         "wallet": wallet,
#         "growth": growth_record,
#     }


# # ============================================================
# # PROCESS ONE USER
# # ============================================================

# def process_user_rank_hierarchy_daily(
#     db: Session,
#     user_id: int,
# ):
#     """
#     Process hierarchy compounding for all historically
#     achieved ranks of one user.

#     IMPORTANT:
#         This function does NOT commit.
#         Caller owns the transaction.
#     """

#     business_date = get_business_date()

#     wallets = initialize_user_rank_hierarchy_wallets(
#         db=db,
#         user_id=user_id,
#     )

#     results = []

#     for wallet in wallets:

#         before = money(
#             wallet.current_amount
#         )

#         result = compound_rank_hierarchy_wallet(
#             db=db,
#             wallet=wallet,
#             business_date=business_date,
#         )

#         after = money(
#             wallet.current_amount
#         )

#         results.append(
#             {
#                 "rank_name":
#                     wallet.rank_name,

#                 "processed":
#                     result["processed"],

#                 "reason":
#                     result["reason"],

#                 "starting_amount":
#                     float(
#                         money(wallet.starting_amount)
#                     ),

#                 "balance_before":
#                     float(before),

#                 "balance_after":
#                     float(after),

#                 "growth_amount":
#                     float(
#                         money(after - before)
#                     ),

#                 "cap_amount":
#                     float(
#                         money(wallet.cap_amount)
#                     ),

#                 "total_growth":
#                     float(
#                         money(wallet.total_growth)
#                     ),

#                 "percentage":
#                     float(
#                         wallet.hierarchy_percentage
#                     ),

#                 "status":
#                     wallet.status,

#                 "business_date":
#                     str(business_date),
#             }
#         )

#     return results


# # ============================================================
# # SAFE TRANSACTION WRAPPER
# # ============================================================

# def run_user_rank_hierarchy_daily(
#     db: Session,
#     user_id: int,
# ):
#     """
#     Transaction wrapper.

#     DB unique constraint on:
#         hold_wallet_id + business_date

#     provides final duplicate protection.
#     """

#     try:

#         results = process_user_rank_hierarchy_daily(
#             db=db,
#             user_id=user_id,
#         )

#         db.commit()

#         return {
#             "success": True,
#             "business_date": str(
#                 get_business_date()
#             ),
#             "results": results,
#         }

#     except IntegrityError:

#         db.rollback()

#         return {
#             "success": True,
#             "business_date": str(
#                 get_business_date()
#             ),
#             "results": [],
#             "message":
#                 "Hierarchy growth was already processed.",
#         }

#     except Exception:
#         db.rollback()
#         raise








from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.core.config import settings

from app.models.rank import UserRank
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction
from app.models.rank_hierarchy_hold_wallet import RankHierarchyHoldWallet
from app.models.rank_hierarchy_growth import RankHierarchyGrowth

from app.services.rank_config import (
    RANK_CONFIG,
    RANK_ORDER,
)


CENT = Decimal("0.01")
DAILY_PERCENT = Decimal("0.50")
HUNDRED = Decimal("100")


# ============================================================
# HELPERS
# ============================================================

def money(value) -> Decimal:
    return Decimal(str(value or 0)).quantize(
        CENT,
        rounding=ROUND_HALF_UP,
    )


def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(tzinfo=None)


def business_date():
    timezone_name = getattr(
        settings,
        "BUSINESS_TIMEZONE",
        "Asia/Kolkata",
    )

    return datetime.now(
        ZoneInfo(timezone_name)
    ).date()


# ============================================================
# CURRENT / HIGHEST ACHIEVED RANK
# ============================================================

def get_current_rank_record(
    db: Session,
    user_id: int,
):
    """
    Only the user's CURRENT highest rank participates
    in hierarchy income.

    Old/superseded ranks never continue hierarchy income.
    """

    rank_records = (
        db.query(UserRank)
        .filter(
            UserRank.user_id == user_id
        )
        .all()
    )

    if not rank_records:
        return None

    rank_index = {
        rank_name: index
        for index, rank_name in enumerate(RANK_ORDER)
    }

    valid_records = [
        record
        for record in rank_records
        if record.rank_name in rank_index
    ]

    if not valid_records:
        return None

    return max(
        valid_records,
        key=lambda record: rank_index[record.rank_name],
    )


# ============================================================
# SUPERSEDE OLD HIERARCHY STATES
# ============================================================

def supersede_old_hierarchy_states(
    db: Session,
    user_id: int,
    current_rank_name: str,
):
    """
    When user upgrades rank:

        Ruby -> Emerald

    Ruby hierarchy permanently stops.
    Only Emerald can continue.
    """

    states = (
        db.query(RankHierarchyHoldWallet)
        .filter(
            RankHierarchyHoldWallet.user_id == user_id,
            RankHierarchyHoldWallet.rank_name != current_rank_name,
            RankHierarchyHoldWallet.status == "active",
        )
        .with_for_update()
        .all()
    )

    for state in states:
        state.status = "superseded"

    db.flush()


# ============================================================
# GET / CREATE CURRENT RANK STATE
# ============================================================

def get_or_create_current_rank_state(
    db: Session,
    user_id: int,
    rank_name: str,
):
    config = RANK_CONFIG.get(rank_name)

    if not config:
        return None

    state = (
        db.query(RankHierarchyHoldWallet)
        .filter(
            RankHierarchyHoldWallet.user_id == user_id,
            RankHierarchyHoldWallet.rank_name == rank_name,
        )
        .with_for_update()
        .first()
    )

    if state:
        return state

    base_amount = money(
        config["wallet_maintain"]
    )

    cap_amount = money(
        config["hierarchy_cap"]
    )

    state = RankHierarchyHoldWallet(
        user_id=user_id,
        rank_name=rank_name,

        base_amount=base_amount,

        # Hierarchy calculation always starts from
        # the rank maintain amount.
        compound_value=base_amount,

        total_credited=Decimal("0.00"),

        cap_amount=cap_amount,

        hierarchy_percentage=DAILY_PERCENT,

        status="active",

        started_at=utc_now(),
    )

    db.add(state)
    db.flush()

    return state


# ============================================================
# PROCESS ONE USER / ONE BUSINESS DAY
# ============================================================

def process_user_rank_hierarchy(
    db: Session,
    user_id: int,
):
    """
    Process today's hierarchy income for one user.

    RULES:

    1. Only current highest achieved rank is eligible.
    2. Actual IncomeWallet must maintain rank base amount.
    3. Daily rate = 0.50%.
    4. Compound calculation starts from rank base.
    5. Withdrawal below maintain pauses earning.
    6. Previous hierarchy earnings are NEVER reset.
    7. Rank upgrade permanently stops previous rank.
    8. Current rank can receive only its remaining cap.
    9. Maximum one processing record per rank/day.
    """

    today = business_date()

    # --------------------------------------------------------
    # CURRENT RANK
    # --------------------------------------------------------

    rank_record = get_current_rank_record(
        db=db,
        user_id=user_id,
    )

    if not rank_record:
        return {
            "processed": False,
            "reason": "no_rank",
        }

    rank_name = rank_record.rank_name

    config = RANK_CONFIG.get(rank_name)

    if not config:
        return {
            "processed": False,
            "reason": "invalid_rank",
        }

    # --------------------------------------------------------
    # STOP OLD RANKS
    # --------------------------------------------------------

    supersede_old_hierarchy_states(
        db=db,
        user_id=user_id,
        current_rank_name=rank_name,
    )

    # --------------------------------------------------------
    # CURRENT RANK STATE
    # --------------------------------------------------------

    state = get_or_create_current_rank_state(
        db=db,
        user_id=user_id,
        rank_name=rank_name,
    )

    if not state:
        return {
            "processed": False,
            "reason": "state_not_found",
        }

    # --------------------------------------------------------
    # CAP COMPLETED
    # --------------------------------------------------------

    total_credited = money(
        state.total_credited
    )

    cap_amount = money(
        state.cap_amount
    )

    if total_credited >= cap_amount:

        state.total_credited = cap_amount
        state.status = "completed"

        if not state.cap_reached_at:
            state.cap_reached_at = utc_now()

        db.flush()

        return {
            "processed": False,
            "reason": "cap_completed",
            "rank_name": rank_name,
            "total_credited": float(cap_amount),
            "remaining_cap": 0.0,
        }

    # --------------------------------------------------------
    # DUPLICATE-DAY PROTECTION
    # --------------------------------------------------------

    existing_today = (
        db.query(RankHierarchyGrowth)
        .filter(
            RankHierarchyGrowth.user_id == user_id,
            RankHierarchyGrowth.rank_name == rank_name,
            RankHierarchyGrowth.business_date == today,
        )
        .first()
    )

    if existing_today:

        return {
            "processed": False,
            "reason": "already_processed_today",
            "rank_name": rank_name,
            "business_date": str(today),
        }

    # --------------------------------------------------------
    # LOCK REAL INCOME WALLET
    # --------------------------------------------------------

    wallet = (
        db.query(IncomeWallet)
        .filter(
            IncomeWallet.user_id == user_id
        )
        .with_for_update()
        .first()
    )

    wallet_balance = money(
        wallet.balance if wallet else 0
    )

    required_balance = money(
        config["wallet_maintain"]
    )

    compound_before = money(
        state.compound_value
    )

    # --------------------------------------------------------
    # MAINTAIN CONDITION FAILED -> PAUSE
    # --------------------------------------------------------

    if (
        wallet is None
        or wallet_balance < required_balance
    ):

        paused_record = RankHierarchyGrowth(
            user_id=user_id,
            rank_name=rank_name,

            business_date=today,

            income_wallet_balance=wallet_balance,

            compound_before=compound_before,

            growth_percentage=DAILY_PERCENT,

            growth_amount=Decimal("0.00"),

            compound_after=compound_before,

            total_credited_after=total_credited,

            cap_amount=cap_amount,

            status="paused",
        )

        db.add(paused_record)
        db.flush()

        return {
            "processed": False,
            "reason": "wallet_maintenance_failed",
            "rank_name": rank_name,
            "wallet_balance": float(wallet_balance),
            "required_balance": float(required_balance),
            "total_credited": float(total_credited),
            "remaining_cap": float(
                money(cap_amount - total_credited)
            ),
        }

    # --------------------------------------------------------
    # DAILY 0.50% TRUE COMPOUNDING
    # --------------------------------------------------------

    raw_growth = (
        compound_before
        * DAILY_PERCENT
        / HUNDRED
    )

    daily_growth = money(raw_growth)

    if daily_growth <= Decimal("0.00"):
        daily_growth = CENT

    remaining_cap = money(
        cap_amount - total_credited
    )

    actual_credit = money(
        min(
            daily_growth,
            remaining_cap,
        )
    )

    # --------------------------------------------------------
    # CREDIT ACTUAL INCOME WALLET
    # --------------------------------------------------------

    balance_before = money(
        wallet.balance
    )

    balance_after = money(
        balance_before + actual_credit
    )

    wallet.balance = balance_after

    wallet.total_earned = money(
        Decimal(str(wallet.total_earned or 0))
        + actual_credit
    )

    # --------------------------------------------------------
    # UPDATE HIERARCHY COMPOUND VALUE
    #
    # Only hierarchy growth changes compound_value.
    # Other wallet income / withdrawal does not change it.
    # --------------------------------------------------------

    compound_after = money(
        compound_before + actual_credit
    )

    total_credited_after = money(
        total_credited + actual_credit
    )

    state.compound_value = compound_after
    state.total_credited = total_credited_after
    state.last_growth_at = utc_now()

    # --------------------------------------------------------
    # DAILY HISTORY
    # --------------------------------------------------------

    growth_record = RankHierarchyGrowth(
        user_id=user_id,
        rank_name=rank_name,

        business_date=today,

        income_wallet_balance=balance_before,

        compound_before=compound_before,

        growth_percentage=DAILY_PERCENT,

        growth_amount=actual_credit,

        compound_after=compound_after,

        total_credited_after=total_credited_after,

        cap_amount=cap_amount,

        status="credited",
    )

    db.add(growth_record)
    db.flush()

    # --------------------------------------------------------
    # COMMON INCOME WALLET LEDGER
    # --------------------------------------------------------

    transaction = IncomeWalletTransaction(
        user_id=user_id,

        income_type="rank_hierarchy",

        amount=actual_credit,

        balance_before=balance_before,
        balance_after=balance_after,

        reference_type="rank_hierarchy_growth",
        reference_id=growth_record.id,

        description=(
            f"{config['display_name']} Rank Hierarchy "
            f"0.50% daily income"
        ),

        status="credited",
    )

    db.add(transaction)

    # --------------------------------------------------------
    # CAP COMPLETE
    # --------------------------------------------------------

    if total_credited_after >= cap_amount:

        state.total_credited = cap_amount
        state.status = "completed"
        state.cap_reached_at = utc_now()

    db.flush()

    return {
        "processed": True,
        "reason": "hierarchy_income_credited",

        "rank_name": rank_name,

        "business_date": str(today),

        "required_balance":
            float(required_balance),

        "wallet_balance_before":
            float(balance_before),

        "growth_percentage":
            float(DAILY_PERCENT),

        "compound_before":
            float(compound_before),

        "credited_today":
            float(actual_credit),

        "compound_after":
            float(compound_after),

        "wallet_balance_after":
            float(balance_after),

        "total_credited":
            float(state.total_credited),

        "cap_amount":
            float(cap_amount),

        "remaining_cap":
            float(
                max(
                    Decimal("0.00"),
                    money(
                        cap_amount
                        - state.total_credited
                    ),
                )
            ),

        "status":
            state.status,
    }


# ============================================================
# TRANSACTION WRAPPER
# ============================================================

def run_user_rank_hierarchy(
    db: Session,
    user_id: int,
):
    try:

        result = process_user_rank_hierarchy(
            db=db,
            user_id=user_id,
        )

        db.commit()

        return {
            "success": True,
            **result,
        }

    except Exception:

        db.rollback()
        raise