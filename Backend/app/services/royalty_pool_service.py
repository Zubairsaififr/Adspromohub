from collections import defaultdict
from datetime import datetime
from decimal import Decimal, ROUND_DOWN
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.royalty_pool import RoyaltyPoolIncome
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction

from app.services.royalty_pool_config import (
    MONEY_ZERO,
    MONEY_QUANT,
    ROYALTY_MINIMUM_MATCHING_LEGS,
    ROYALTY_STATUS_CREDITED,
    ROYALTY_INCOME_TYPE,
    ROYALTY_REFERENCE_TYPE,
    find_highest_matching_slab,
)


# =========================================================
# SETTINGS
# =========================================================

BUSINESS_TIMEZONE = ZoneInfo("Asia/Kolkata")


# =========================================================
# MONEY HELPER
# =========================================================

def money(value) -> Decimal:
    return Decimal(
        str(value or 0)
    ).quantize(
        MONEY_QUANT,
        rounding=ROUND_DOWN,
    )


# =========================================================
# BUSINESS DATE
# =========================================================

def get_business_now() -> datetime:
    return datetime.now(
        BUSINESS_TIMEZONE
    )


def get_business_date():
    return get_business_now().date()


# =========================================================
# WALLET
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
        balance=MONEY_ZERO,
        total_earned=MONEY_ZERO,
        total_withdrawn=MONEY_ZERO,
    )

    db.add(wallet)
    db.flush()

    return wallet


# =========================================================
# LOAD USERS
# =========================================================

def get_enabled_users(
    db: Session,
) -> list[User]:

    return (
        db.query(User)
        .filter(
            User.is_active.is_(True)
        )
        .all()
    )


# =========================================================
# BUILD REFERRAL TREE
# =========================================================

def build_referral_tree(
    users: list[User],
):
    """
    children_map:

        sponsor_user_id -> [direct referral users]

    IMPORTANT:
    Current APH uses:

        referral_id
        referred_by

    NOT old referral_code.
    """

    referral_owner = {}

    for user in users:

        referral_id = (
            user.referral_id or ""
        ).strip()

        if referral_id:
            referral_owner[
                referral_id
            ] = user


    children_map = defaultdict(list)


    for user in users:

        referred_by = (
            user.referred_by or ""
        ).strip()

        if not referred_by:
            continue

        sponsor = referral_owner.get(
            referred_by
        )

        if sponsor is None:
            continue

        # Safety against malformed self referral.
        if sponsor.id == user.id:
            continue

        children_map[
            sponsor.id
        ].append(
            user
        )


    return children_map


# =========================================================
# CALCULATE LEG SIZE
# =========================================================

def calculate_leg_member_count(
    root_user_id: int,
    children_map,
) -> int:
    """
    Count members inside ONE direct referral leg.

    IMPORTANT:

    The direct referral/root user itself IS counted.

    Example:

        User A
          |
          B  <- direct referral
          |
          C
          |
          D

    B's leg count = 3

        B + C + D

    Iterative traversal is used instead of recursion so
    very large teams do not hit Python recursion limits.
    """

    count = 0

    stack = [
        root_user_id
    ]

    visited = set()


    while stack:

        current_id = stack.pop()

        if current_id in visited:
            continue

        visited.add(
            current_id
        )

        count += 1


        for child in children_map.get(
            current_id,
            [],
        ):

            if child.id not in visited:
                stack.append(
                    child.id
                )


    return count


# =========================================================
# GET USER LEGS
# =========================================================

def get_user_legs(
    user: User,
    children_map,
):
    """
    Every direct referral = one root leg.
    """

    direct_users = children_map.get(
        user.id,
        [],
    )

    legs = []


    for direct_user in direct_users:

        team_count = (
            calculate_leg_member_count(
                direct_user.id,
                children_map,
            )
        )

        legs.append(
            {
                "leg_user": direct_user,
                "team_count": team_count,
            }
        )


    # Deterministic order.
    legs.sort(
        key=lambda item: (
            -item["team_count"],
            item["leg_user"].id,
        )
    )

    return legs


# =========================================================
# POWER LEG
# =========================================================

def split_power_leg(
    legs: list[dict],
):
    """
    Largest leg = Power Leg.

    Only ONE Power Leg is excluded.

    Tie rule:
        If multiple legs have the same largest count,
        smallest user ID is selected because get_user_legs()
        has deterministic ordering.
    """

    if not legs:
        return None, []


    power_leg = legs[0]

    non_power_legs = legs[1:]


    return (
        power_leg,
        non_power_legs,
    )


# =========================================================
# TOTAL ROYALTY ALREADY EARNED
# =========================================================

def get_total_royalty_earned(
    db: Session,
    user_id: int,
) -> Decimal:
    """
    Lifetime credited Royalty across ALL slabs.

    Example:

        25 slab earned = $60

        user later reaches 50 slab
        new cap = $200

        remaining = $140

    It does NOT reset to $0 when slab increases.
    """

    rows = (
        db.query(
            RoyaltyPoolIncome.royalty_amount
        )
        .filter(
            RoyaltyPoolIncome.user_id
            == user_id,

            RoyaltyPoolIncome.status
            == ROYALTY_STATUS_CREDITED,
        )
        .all()
    )


    total = sum(
        (
            money(row[0])
            for row in rows
        ),
        MONEY_ZERO,
    )


    return money(total)


# =========================================================
# CHECK TODAY PAYOUT
# =========================================================

def get_today_royalty(
    db: Session,
    user_id: int,
):
    today = get_business_date()

    return (
        db.query(RoyaltyPoolIncome)
        .filter(
            RoyaltyPoolIncome.user_id
            == user_id,

            RoyaltyPoolIncome.payout_date
            == today,
        )
        .first()
    )


# =========================================================
# CALCULATE QUALIFICATION
# =========================================================

def calculate_user_qualification(
    user: User,
    children_map,
):
    """
    Determine:

    - Power Leg
    - Non-Power Legs
    - Highest matched slab
    - Qualifying legs for selected slab
    """

    legs = get_user_legs(
        user,
        children_map,
    )


    # Need:
    #
    # 1 Power Leg
    # +
    # minimum 2 non-power matching legs
    #
    # Therefore minimum 3 root/direct legs are needed.
    if len(legs) < (
        1
        +
        ROYALTY_MINIMUM_MATCHING_LEGS
    ):

        return {
            "qualified": False,
            "reason": "minimum_legs_not_met",
            "legs": legs,
            "power_leg": (
                legs[0]
                if legs
                else None
            ),
            "non_power_legs": (
                legs[1:]
                if len(legs) > 1
                else []
            ),
            "slab": None,
            "qualifying_legs": [],
        }


    (
        power_leg,
        non_power_legs,
    ) = split_power_leg(
        legs
    )


    non_power_counts = [

        leg["team_count"]

        for leg
        in non_power_legs
    ]


    slab = find_highest_matching_slab(
        non_power_counts
    )


    if slab is None:

        return {
            "qualified": False,
            "reason": "matching_not_met",
            "legs": legs,
            "power_leg": power_leg,
            "non_power_legs": non_power_legs,
            "slab": None,
            "qualifying_legs": [],
        }


    threshold = int(
        slab["threshold"]
    )


    qualifying_legs = [

        leg

        for leg
        in non_power_legs

        if int(
            leg["team_count"]
        ) >= threshold
    ]


    if len(
        qualifying_legs
    ) < ROYALTY_MINIMUM_MATCHING_LEGS:

        return {
            "qualified": False,
            "reason": "matching_not_met",
            "legs": legs,
            "power_leg": power_leg,
            "non_power_legs": non_power_legs,
            "slab": slab,
            "qualifying_legs": [],
        }


    return {
        "qualified": True,
        "reason": "qualified",
        "legs": legs,
        "power_leg": power_leg,
        "non_power_legs": non_power_legs,
        "slab": slab,
        "qualifying_legs": qualifying_legs,
    }


# =========================================================
# PROCESS ONE USER
# =========================================================

def process_user_royalty(
    db: Session,
    user: User,
    children_map,
):
    """
    Process one user's Royalty for current business day.

    IMPORTANT:
    This function FLUSHES but does not commit.
    Caller controls the transaction.
    """

    # -----------------------------------------------------
    # DUPLICATE DAILY PROTECTION
    # -----------------------------------------------------

    existing_today = get_today_royalty(
        db,
        user.id,
    )

    if existing_today:

        return {
            "credited": False,
            "reason": "already_processed_today",
            "user_id": user.id,
            "royalty_income": existing_today,
        }


    # -----------------------------------------------------
    # QUALIFICATION
    # -----------------------------------------------------

    qualification = (
        calculate_user_qualification(
            user,
            children_map,
        )
    )


    if not qualification[
        "qualified"
    ]:

        return {
            "credited": False,
            "reason": qualification[
                "reason"
            ],
            "user_id": user.id,
            "qualification": qualification,
        }


    slab = qualification[
        "slab"
    ]

    power_leg = qualification[
        "power_leg"
    ]

    non_power_legs = qualification[
        "non_power_legs"
    ]

    qualifying_legs = qualification[
        "qualifying_legs"
    ]


    # -----------------------------------------------------
    # SLAB VALUES
    # -----------------------------------------------------

    threshold = int(
        slab["threshold"]
    )

    daily_per_leg = money(
        slab["daily_per_leg"]
    )

    total_cap = money(
        slab["total_cap"]
    )


    qualifying_leg_count = len(
        qualifying_legs
    )


    # -----------------------------------------------------
    # THEORETICAL DAILY PAYOUT
    # -----------------------------------------------------

    calculated_daily_amount = money(

        daily_per_leg
        *
        Decimal(
            qualifying_leg_count
        )
    )


    if calculated_daily_amount <= MONEY_ZERO:

        return {
            "credited": False,
            "reason": "zero_daily_amount",
            "user_id": user.id,
        }


    # -----------------------------------------------------
    # LIFETIME CAP PROGRESS
    # -----------------------------------------------------

    earned_before = (
        get_total_royalty_earned(
            db,
            user.id,
        )
    )


    # User may previously have reached a larger cap and
    # later fallen to a lower slab.
    #
    # We NEVER allow historical earnings to be erased.
    #
    # If current slab cap is already consumed:
    # no payout.
    remaining_cap = money(
        total_cap
        -
        earned_before
    )


    if remaining_cap <= MONEY_ZERO:

        return {
            "credited": False,
            "reason": "cap_reached",
            "user_id": user.id,
            "slab_threshold": threshold,
            "earned": earned_before,
            "cap": total_cap,
        }


    # -----------------------------------------------------
    # FINAL PAYOUT
    # -----------------------------------------------------

    royalty_amount = min(
        calculated_daily_amount,
        remaining_cap,
    )

    royalty_amount = money(
        royalty_amount
    )


    if royalty_amount <= MONEY_ZERO:

        return {
            "credited": False,
            "reason": "zero_credit",
            "user_id": user.id,
        }


    earned_after = money(
        earned_before
        +
        royalty_amount
    )


    # -----------------------------------------------------
    # WALLET
    # -----------------------------------------------------

    wallet = (
        get_or_create_income_wallet(
            db,
            user.id,
        )
    )


    balance_before = money(
        wallet.balance
    )

    balance_after = money(
        balance_before
        +
        royalty_amount
    )


    wallet.balance = (
        balance_after
    )

    wallet.total_earned = money(
        wallet.total_earned
        +
        royalty_amount
    )


    # -----------------------------------------------------
    # ROYALTY HISTORY
    # -----------------------------------------------------

    royalty_income = RoyaltyPoolIncome(

        user_id=user.id,

        slab_threshold=threshold,

        daily_per_leg=daily_per_leg,

        slab_total_cap=total_cap,

        power_leg_user_id=(
            power_leg[
                "leg_user"
            ].id
            if power_leg
            else None
        ),

        power_leg_member_count=(
            int(
                power_leg[
                    "team_count"
                ]
            )
            if power_leg
            else 0
        ),

        qualifying_leg_count=(
            qualifying_leg_count
        ),

        non_power_leg_count=(
            len(
                non_power_legs
            )
        ),

        calculated_daily_amount=(
            calculated_daily_amount
        ),

        royalty_amount=(
            royalty_amount
        ),

        cap_earned_before=(
            earned_before
        ),

        cap_earned_after=(
            earned_after
        ),

        status=(
            ROYALTY_STATUS_CREDITED
        ),

        payout_date=(
            get_business_date()
        ),
    )


    db.add(
        royalty_income
    )

    # Need Royalty ID before common ledger row.
    db.flush()


    # -----------------------------------------------------
    # COMMON INCOME WALLET LEDGER
    # -----------------------------------------------------

    ledger = IncomeWalletTransaction(

        user_id=user.id,

        income_type=(
            ROYALTY_INCOME_TYPE
        ),

        amount=(
            royalty_amount
        ),

        balance_before=(
            balance_before
        ),

        balance_after=(
            balance_after
        ),

        reference_type=(
            ROYALTY_REFERENCE_TYPE
        ),

        reference_id=(
            royalty_income.id
        ),

        description=(
            f"Royalty Pool - "
            f"{threshold}+ matching - "
            f"{qualifying_leg_count} "
            f"qualifying legs"
        ),

        status="credited",
    )


    db.add(
        ledger
    )

    db.flush()


    return {
        "credited": True,

        "reason": "credited",

        "user_id": user.id,

        "slab_threshold": threshold,

        "daily_per_leg": daily_per_leg,

        "qualifying_leg_count": (
            qualifying_leg_count
        ),

        "calculated_daily_amount": (
            calculated_daily_amount
        ),

        "royalty_amount": (
            royalty_amount
        ),

        "earned_before": (
            earned_before
        ),

        "earned_after": (
            earned_after
        ),

        "cap": total_cap,

        "power_leg_user_id": (
            power_leg[
                "leg_user"
            ].id
        ),

        "power_leg_member_count": (
            power_leg[
                "team_count"
            ]
        ),

        "royalty_income": (
            royalty_income
        ),
    }


# =========================================================
# PROCESS ALL USERS
# =========================================================

def process_all_royalties(
    db: Session,
):
    """
    Daily Royalty processor.

    One transaction for the whole run.

    If something fails:
        rollback everything from this run.

    NOTE:
    This function does NOT itself create a scheduler.
    We will connect it to API/dev testing first and then
    scheduler/cron separately.
    """

    try:

        users = get_enabled_users(
            db
        )


        children_map = (
            build_referral_tree(
                users
            )
        )


        results = []

        credited_users = 0

        total_credited = MONEY_ZERO


        for user in users:

            result = (
                process_user_royalty(
                    db=db,
                    user=user,
                    children_map=children_map,
                )
            )


            results.append(
                result
            )


            if result.get(
                "credited"
            ):

                credited_users += 1

                total_credited += money(
                    result.get(
                        "royalty_amount",
                        MONEY_ZERO,
                    )
                )


        db.commit()


        return {
            "success": True,

            "business_date": str(
                get_business_date()
            ),

            "users_checked": len(
                users
            ),

            "users_credited": (
                credited_users
            ),

            "total_credited": str(
                money(
                    total_credited
                )
            ),

            "results": results,
        }


    except Exception:

        db.rollback()

        raise


# =========================================================
# PROCESS SINGLE USER
# =========================================================

def process_single_user_royalty(
    db: Session,
    user_id: int,
):
    """
    Useful for development/testing.

    This commits the single-user payout.
    """

    try:

        users = get_enabled_users(
            db
        )


        user_map = {
            user.id: user
            for user in users
        }


        user = user_map.get(
            int(user_id)
        )


        if user is None:

            return {
                "success": False,
                "credited": False,
                "reason": "user_not_found_or_disabled",
                "user_id": user_id,
            }


        children_map = (
            build_referral_tree(
                users
            )
        )


        result = (
            process_user_royalty(
                db=db,
                user=user,
                children_map=children_map,
            )
        )


        db.commit()


        return {
            "success": True,
            **result,
        }


    except Exception:

        db.rollback()

        raise