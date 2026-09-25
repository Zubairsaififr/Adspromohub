from datetime import datetime, timezone
from decimal import Decimal, ROUND_DOWN
from typing import Dict, List, Optional, Set
from zoneinfo import ZoneInfo

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings

from app.models.user import User
from app.models.level_profit import LevelProfit
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction


# =========================================================
# CONSTANTS
# =========================================================

ZERO = Decimal("0.0000")
MONEY_QUANT = Decimal("0.0001")
MAX_LEVEL = 10


# =========================================================
# TIME HELPERS
# =========================================================

def utc_now() -> datetime:
    """
    UTC-naive timestamp.
    Keeps this service consistent with the existing backend.
    """
    return datetime.now(
        timezone.utc
    ).replace(
        tzinfo=None
    )


def business_now() -> datetime:
    """
    Current datetime in APH business timezone.
    """
    timezone_name = getattr(
        settings,
        "BUSINESS_TIMEZONE",
        "Asia/Kolkata",
    )

    return datetime.now(
        ZoneInfo(timezone_name)
    )


def get_business_date():
    """
    Current APH business date.
    """
    return business_now().date()


# =========================================================
# DECIMAL HELPERS
# =========================================================

def to_decimal(value) -> Decimal:
    if value is None:
        return ZERO

    return Decimal(str(value))


def money(value) -> Decimal:
    """
    Keep Level Profit calculations at 4 decimal places.
    """
    return to_decimal(value).quantize(
        MONEY_QUANT,
        rounding=ROUND_DOWN,
    )


# =========================================================
# DIRECT REFERRAL COUNT
# =========================================================

def get_direct_referral_count(
    db: Session,
    user: User,
) -> int:

    if not user.referral_id:
        return 0

    return (
        db.query(User)
        .filter(
            User.referred_by == user.referral_id
        )
        .count()
    )


# =========================================================
# LEVEL PROFIT RULES
#
# CUMULATIVE LEVEL UNLOCKING:
#
# 4+ directs:
#   Levels 1-2
#   5%
#   Max $10/day from this slab
#
# 12+ directs:
#   Levels 1-2 remain active
#   Levels 3-5 unlock
#   4%
#   Max $20/day from Levels 3-5
#
# 20+ directs:
#   Previous levels remain active
#   Levels 6-8 unlock
#   3%
#   Max $30/day from Levels 6-8
#
# 30+ directs:
#   Previous levels remain active
#   Levels 9-10 unlock
#   2%
#   Max $40/day from Levels 9-10
#
# IMPORTANT:
# Each slab has its OWN daily cap.
# =========================================================

def get_level_profit_rule(
    direct_count: int,
    level: int,
) -> Optional[Dict]:

    # -----------------------------------------------------
    # LEVEL 1-2
    # -----------------------------------------------------

    if 1 <= level <= 2:

        if direct_count < 4:
            return None

        return {
            "percentage": Decimal("5.00"),
            "daily_cap": Decimal("10.00"),
            "min_level": 1,
            "max_level": 2,
            "slab": "level_1_2",
        }

    # -----------------------------------------------------
    # LEVEL 3-5
    # -----------------------------------------------------

    if 3 <= level <= 5:

        if direct_count < 12:
            return None

        return {
            "percentage": Decimal("4.00"),
            "daily_cap": Decimal("20.00"),
            "min_level": 3,
            "max_level": 5,
            "slab": "level_3_5",
        }

    # -----------------------------------------------------
    # LEVEL 6-8
    # -----------------------------------------------------

    if 6 <= level <= 8:

        if direct_count < 20:
            return None

        return {
            "percentage": Decimal("3.00"),
            "daily_cap": Decimal("30.00"),
            "min_level": 6,
            "max_level": 8,
            "slab": "level_6_8",
        }

    # -----------------------------------------------------
    # LEVEL 9-10
    # -----------------------------------------------------

    if 9 <= level <= 10:

        if direct_count < 30:
            return None

        return {
            "percentage": Decimal("2.00"),
            "daily_cap": Decimal("40.00"),
            "min_level": 9,
            "max_level": 10,
            "slab": "level_9_10",
        }

    return None


# =========================================================
# UNLOCKED LEVEL
# =========================================================

def get_unlocked_level(
    direct_count: int,
) -> int:

    if direct_count >= 30:
        return 10

    if direct_count >= 20:
        return 8

    if direct_count >= 12:
        return 5

    if direct_count >= 4:
        return 2

    return 0


# =========================================================
# TODAY LEVEL PROFIT FOR ONE SLAB
# =========================================================

def get_today_level_profit_earned_for_levels(
    db: Session,
    beneficiary_user_id: int,
    min_level: int,
    max_level: int,
) -> Decimal:

    today = get_business_date()

    total = (
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
            == beneficiary_user_id,

            LevelProfit.business_date
            == today,

            LevelProfit.level
            >= min_level,

            LevelProfit.level
            <= max_level,

            LevelProfit.status.in_(
                [
                    "credited",
                    "capped",
                ]
            ),
        )
        .scalar()
    )

    return money(total)


# =========================================================
# TODAY TOTAL LEVEL PROFIT
#
# This is only for reporting/summary.
# It does NOT apply one combined cap.
# =========================================================

def get_today_total_level_profit(
    db: Session,
    beneficiary_user_id: int,
) -> Decimal:

    today = get_business_date()

    total = (
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
            == beneficiary_user_id,

            LevelProfit.business_date
            == today,

            LevelProfit.status.in_(
                [
                    "credited",
                    "capped",
                ]
            ),
        )
        .scalar()
    )

    return money(total)


# =========================================================
# GET OR CREATE INCOME WALLET
# =========================================================

def get_or_create_income_wallet(
    db: Session,
    user_id: int,
) -> IncomeWallet:

    wallet = (
        db.query(IncomeWallet)
        .filter(
            IncomeWallet.user_id == user_id
        )
        .first()
    )

    if wallet:
        return wallet

    wallet = IncomeWallet(
        user_id=user_id,
        balance=Decimal("0.00"),
        total_earned=Decimal("0.00"),
        total_withdrawn=Decimal("0.00"),
    )

    db.add(wallet)
    db.flush()

    return wallet


# =========================================================
# FIND USER BY REFERRAL ID
# =========================================================

def get_user_by_referral_id(
    db: Session,
    referral_id: Optional[str],
) -> Optional[User]:

    if not referral_id:
        return None

    return (
        db.query(User)
        .filter(
            User.referral_id == referral_id
        )
        .first()
    )


# =========================================================
# BUILD UPLINE CHAIN
#
# Example:
#
# A -> B -> C -> D
#
# D gets Daily Compounding:
#
# C = Level 1 for D
# B = Level 2 for D
# A = Level 3 for D
# =========================================================

def get_upline_chain(
    db: Session,
    source_user: User,
    max_levels: int = MAX_LEVEL,
) -> List[Dict]:

    result: List[Dict] = []

    visited: Set[int] = {
        source_user.id
    }

    current_user = source_user

    for level in range(
        1,
        max_levels + 1,
    ):

        parent_referral_id = (
            current_user.referred_by
        )

        if not parent_referral_id:
            break

        upline = get_user_by_referral_id(
            db=db,
            referral_id=parent_referral_id,
        )

        if not upline:
            break

        # Prevent referral-tree cycle.
        if upline.id in visited:
            break

        visited.add(upline.id)

        result.append(
            {
                "user": upline,
                "level": level,
            }
        )

        current_user = upline

    return result


# =========================================================
# DUPLICATE CHECK
#
# Same Daily Compounding record must never pay
# the same beneficiary twice.
# =========================================================

def level_profit_already_exists(
    db: Session,
    beneficiary_user_id: int,
    source_compounding_id: int,
) -> bool:

    existing = (
        db.query(LevelProfit.id)
        .filter(
            LevelProfit.beneficiary_user_id
            == beneficiary_user_id,

            LevelProfit.source_compounding_id
            == source_compounding_id,
        )
        .first()
    )

    return existing is not None


# =========================================================
# CREDIT ONE UPLINE
# =========================================================

def credit_level_profit_to_upline(
    db: Session,
    beneficiary: User,
    source_user: User,
    source_compounding_id: int,
    source_growth_amount,
    level: int,
) -> Optional[LevelProfit]:

    # -----------------------------------------------------
    # DUPLICATE PROTECTION
    # -----------------------------------------------------

    if level_profit_already_exists(
        db=db,
        beneficiary_user_id=beneficiary.id,
        source_compounding_id=source_compounding_id,
    ):
        return None

    # -----------------------------------------------------
    # BENEFICIARY DIRECT COUNT
    # -----------------------------------------------------

    direct_count = get_direct_referral_count(
        db=db,
        user=beneficiary,
    )

    # -----------------------------------------------------
    # LEVEL RULE
    # -----------------------------------------------------

    rule = get_level_profit_rule(
        direct_count=direct_count,
        level=level,
    )

    # Level is not unlocked.
    if not rule:
        return None

    percentage = rule["percentage"]
    daily_cap = rule["daily_cap"]

    # -----------------------------------------------------
    # SOURCE ACTUAL DAILY COMPOUNDING
    #
    # Level Profit is calculated ONLY from the actual
    # Daily Compounding amount credited to source user.
    # -----------------------------------------------------

    source_amount = money(
        source_growth_amount
    )

    if source_amount <= ZERO:
        return None

    # -----------------------------------------------------
    # LEVEL PROFIT CALCULATION
    #
    # Example:
    #
    # Source compounding = $1
    # Level percentage = 5%
    #
    # $1 × 5% = $0.05
    # -----------------------------------------------------

    calculated_amount = money(
        source_amount
        *
        percentage
        /
        Decimal("100")
    )

    if calculated_amount <= ZERO:
        return None

    # -----------------------------------------------------
    # CHECK ONLY THIS SLAB'S DAILY EARNING
    #
    # Example:
    #
    # L1-L2 checks only L1-L2 earnings against $10.
    #
    # L3-L5 earnings do NOT consume L1-L2's $10 cap.
    # -----------------------------------------------------

    daily_earned_before = (
        get_today_level_profit_earned_for_levels(
            db=db,
            beneficiary_user_id=beneficiary.id,
            min_level=rule["min_level"],
            max_level=rule["max_level"],
        )
    )

    # -----------------------------------------------------
    # REMAINING SLAB CAP
    # -----------------------------------------------------

    remaining_cap = money(
        daily_cap
        -
        daily_earned_before
    )

    if remaining_cap <= ZERO:
        return None

    # -----------------------------------------------------
    # ACTUAL CREDIT
    # -----------------------------------------------------

    credited_amount = min(
        calculated_amount,
        remaining_cap,
    )

    credited_amount = money(
        credited_amount
    )

    if credited_amount <= ZERO:
        return None

    daily_earned_after = money(
        daily_earned_before
        +
        credited_amount
    )

    # -----------------------------------------------------
    # STATUS
    #
    # "capped" means this transaction reached the
    # slab's daily maximum OR was partially limited.
    # -----------------------------------------------------

    if (
        credited_amount < calculated_amount
        or
        daily_earned_after >= daily_cap
    ):
        status = "capped"

    else:
        status = "credited"

    # -----------------------------------------------------
    # CREATE LEVEL PROFIT RECORD
    # -----------------------------------------------------

    level_profit = LevelProfit(
        beneficiary_user_id=beneficiary.id,
        source_user_id=source_user.id,
        source_compounding_id=source_compounding_id,

        level=level,

        beneficiary_direct_count=direct_count,

        source_growth_amount=source_amount,
        percentage=percentage,

        calculated_amount=calculated_amount,
        credited_amount=credited_amount,

        daily_cap=daily_cap,

        daily_earned_before=daily_earned_before,
        daily_earned_after=daily_earned_after,

        business_date=get_business_date(),

        status=status,

        created_at=utc_now(),
        updated_at=utc_now(),
    )

    db.add(level_profit)

    # Generate LevelProfit.id before ledger record.
    db.flush()

    # -----------------------------------------------------
    # INCOME WALLET
    # -----------------------------------------------------

    wallet = get_or_create_income_wallet(
        db=db,
        user_id=beneficiary.id,
    )

    balance_before = money(
        wallet.balance
    )

    balance_after = money(
        balance_before
        +
        credited_amount
    )

    wallet.balance = balance_after

    wallet.total_earned = money(
        to_decimal(
            wallet.total_earned
        )
        +
        credited_amount
    )

    # -----------------------------------------------------
    # COMMON INCOME WALLET LEDGER
    # -----------------------------------------------------

    source_identifier = (
        source_user.customer_id
        or
        source_user.referral_id
        or
        str(source_user.id)
    )

    wallet_transaction = IncomeWalletTransaction(
        user_id=beneficiary.id,

        income_type="level_profit",

        amount=credited_amount,

        balance_before=balance_before,
        balance_after=balance_after,

        reference_type="level_profit",
        reference_id=level_profit.id,

        description=(
            f"Level {level} profit "
            f"from user {source_identifier}"
        ),

        status="credited",

        created_at=utc_now(),
    )

    db.add(wallet_transaction)
    db.flush()

    return level_profit


# =========================================================
# PROCESS LEVEL PROFIT
#
# IMPORTANT:
#
# Call this function ONLY AFTER source user's
# Daily Compounding has actually been CREDITED.
#
# Ad started:
#   NO Level Profit
#
# Ad watched / compounding pending:
#   NO Level Profit
#
# Daily Compounding credited:
#   YES -> process Level Profit
#
# This function intentionally does NOT db.commit().
# The caller controls the final transaction.
# =========================================================

def process_level_profit(
    db: Session,
    source_user: User,
    source_compounding_id: int,
    source_growth_amount,
) -> List[LevelProfit]:

    credited_records: List[LevelProfit] = []

    if not source_user:
        return credited_records

    source_amount = money(
        source_growth_amount
    )

    if source_amount <= ZERO:
        return credited_records

    # -----------------------------------------------------
    # FIND MAXIMUM 10 UPLINES
    # -----------------------------------------------------

    uplines = get_upline_chain(
        db=db,
        source_user=source_user,
        max_levels=MAX_LEVEL,
    )

    # -----------------------------------------------------
    # PROCESS EVERY UPLINE
    # -----------------------------------------------------

    for item in uplines:

        beneficiary: User = item["user"]
        level: int = item["level"]

        record = credit_level_profit_to_upline(
            db=db,

            beneficiary=beneficiary,
            source_user=source_user,

            source_compounding_id=
                source_compounding_id,

            source_growth_amount=
                source_amount,

            level=level,
        )

        if record:
            credited_records.append(
                record
            )

    return credited_records