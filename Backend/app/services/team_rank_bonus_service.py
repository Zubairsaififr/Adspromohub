from decimal import Decimal, ROUND_DOWN

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.rank import UserRank
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction
from app.models.team_rank_bonus import TeamRankBonus

from app.services.team_rank_bonus_config import (
    TEAM_RANK_BASE_PERCENT,
    TEAM_RANK_DISTRIBUTION_PERCENT,
    TEAM_RANK_WEIGHTS,
    TEAM_RANK_ORDER,
    TEAM_RANK_TOTAL_WEIGHT,
)


CENT = Decimal("0.01")


# =========================================================
# MONEY HELPERS
# =========================================================

def money(value) -> Decimal:
    """
    Convert a value to a 2-decimal monetary amount.

    ROUND_DOWN is intentionally used for allocation so that
    individual rank slots can never make the system distribute
    more than the available Team Rank pool.
    """
    return Decimal(str(value)).quantize(
        CENT,
        rounding=ROUND_DOWN,
    )


def calculate_percent(
    amount: Decimal,
    percentage: Decimal,
) -> Decimal:
    """
    Percentage calculation without prematurely rounding.

    Example:
        150 × 15% = 22.50
    """
    return (
        Decimal(str(amount))
        * Decimal(str(percentage))
        / Decimal("100")
    )


# =========================================================
# RANK HELPERS
# =========================================================

def get_highest_achieved_rank(
    db: Session,
    user_id: int,
):
    """
    Returns the user's highest structurally achieved rank.

    Rank achievement is permanent.
    A lower rank may have status='superseded', therefore
    we look at rank history and select the highest rank
    present according to TEAM_RANK_ORDER.
    """

    ranks = (
        db.query(UserRank)
        .filter(UserRank.user_id == user_id)
        .all()
    )

    achieved_names = {
        rank.rank_name.lower()
        for rank in ranks
        if rank.rank_name
    }

    highest_rank = None

    for rank_name in TEAM_RANK_ORDER:
        if rank_name in achieved_names:
            highest_rank = rank_name

    return highest_rank


def get_direct_upline(
    db: Session,
    user: User,
):
    """
    Find the direct sponsor/upline using:

        user.referred_by -> upline.referral_id
    """

    if not user.referred_by:
        return None

    return (
        db.query(User)
        .filter(User.referral_id == user.referred_by)
        .first()
    )


# =========================================================
# WALLET HELPER
# =========================================================

def get_locked_wallet(
    db: Session,
    user_id: int,
):
    """
    Get and lock the user's Income Wallet.

    Creates one if it does not already exist.
    """

    wallet = (
        db.query(IncomeWallet)
        .filter(IncomeWallet.user_id == user_id)
        .with_for_update()
        .first()
    )

    if wallet is None:
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
# EXACT RANK SLOT ALLOCATION
# =========================================================

def build_rank_slot_amounts(
    distribution_pool: Decimal,
):
    """
    Build all seven rank slot amounts BEFORE traversing
    the upline.

    BUSINESS RULE:

        Package
            ↓ 15%
        Team Rank Base
            ↓ 30%
        Actual Distribution Pool
            ↓
        5 : 5 : 5 : 5 : 4 : 3 : 3

    The total weight is 30.

    IMPORTANT:

    Each slot is first floored to cents so the system
    never overpays.

    Any remaining cents caused ONLY by decimal rounding
    are assigned in rank order to the fixed rank slots.

    This means:

    - full 7-rank allocation = exactly distribution pool
    - missing rank's entire pre-calculated slot stays unpaid
    - missing rank money is NOT transferred to another rank
    """

    distribution_pool = money(distribution_pool)

    slot_amounts = {}
    exact_amounts = {}

    allocated_total = Decimal("0.00")

    # -----------------------------------------------------
    # First pass:
    # calculate exact share and floor every rank to cents
    # -----------------------------------------------------

    for rank_name in TEAM_RANK_ORDER:

        rank_weight = TEAM_RANK_WEIGHTS[rank_name]

        exact_share = (
            distribution_pool
            * rank_weight
            / TEAM_RANK_TOTAL_WEIGHT
        )

        floored_share = exact_share.quantize(
            CENT,
            rounding=ROUND_DOWN,
        )

        exact_amounts[rank_name] = exact_share
        slot_amounts[rank_name] = floored_share

        allocated_total += floored_share

    allocated_total = money(allocated_total)

    # -----------------------------------------------------
    # Find rounding remainder.
    #
    # Example:
    #
    # Pool = 6.75
    #
    # Floored slots:
    #
    # Ruby         1.12
    # Emerald      1.12
    # Sapphire     1.12
    # Topaz        1.12
    # Amethyst     0.90
    # Diamond      0.67
    # Crown Jewel  0.67
    #
    # Total = 6.72
    #
    # Remaining = 0.03
    # -----------------------------------------------------

    remainder = money(
        distribution_pool - allocated_total
    )

    # -----------------------------------------------------
    # Largest remainder method
    #
    # Give remaining cents to ranks with the largest
    # discarded fractional remainder.
    #
    # Tie is resolved by TEAM_RANK_ORDER.
    # -----------------------------------------------------

    remainder_priority = sorted(
        TEAM_RANK_ORDER,
        key=lambda rank_name: (
            exact_amounts[rank_name]
            - slot_amounts[rank_name]
        ),
        reverse=True,
    )

    while remainder >= CENT:

        for rank_name in remainder_priority:

            if remainder < CENT:
                break

            slot_amounts[rank_name] += CENT
            remainder -= CENT

    # -----------------------------------------------------
    # Safety check:
    # all seven fixed slots MUST equal the distribution pool
    # -----------------------------------------------------

    final_total = sum(
        slot_amounts.values(),
        Decimal("0.00"),
    )

    final_total = money(final_total)

    if final_total != distribution_pool:
        raise RuntimeError(
            "Team Rank slot allocation mismatch. "
            f"Pool={distribution_pool}, "
            f"Allocated={final_total}"
        )

    return slot_amounts


# =========================================================
# CREDIT ONE RANK SLOT
# =========================================================

def credit_team_rank_bonus(
    db: Session,
    receiver: User,
    source_user: User,
    subscription_transaction,
    rank_name: str,
    package_amount: Decimal,
    distribution_pool: Decimal,
    rank_weight: Decimal,
    bonus_amount: Decimal,
):
    """
    Credit one already-calculated Team Rank slot.
    """

    # -----------------------------------------------------
    # DUPLICATE PROTECTION
    #
    # Same transaction + same rank can only be credited once.
    # -----------------------------------------------------

    existing = (
        db.query(TeamRankBonus)
        .filter(
            TeamRankBonus.subscription_transaction_id
            == subscription_transaction.id,
            TeamRankBonus.rank_name == rank_name,
        )
        .first()
    )

    if existing:
        return None

    bonus_amount = money(bonus_amount)

    if bonus_amount <= Decimal("0.00"):
        return None

    # -----------------------------------------------------
    # TEAM RANK BONUS RECORD
    # -----------------------------------------------------

    bonus = TeamRankBonus(
        user_id=receiver.id,
        source_user_id=source_user.id,
        subscription_transaction_id=subscription_transaction.id,

        rank_name=rank_name,

        package_amount=money(package_amount),

        # This now stores the ACTUAL Team Rank
        # distributable pool:
        #
        # Package × 15% × 30%
        rank_pool_amount=money(distribution_pool),

        # Existing DB column is called rank_percentage.
        # We store the configured rank weight here.
        rank_percentage=Decimal(str(rank_weight)),

        bonus_amount=bonus_amount,

        status="credited",
    )

    db.add(bonus)
    db.flush()

    # -----------------------------------------------------
    # CREDIT WALLET
    # -----------------------------------------------------

    wallet = get_locked_wallet(
        db=db,
        user_id=receiver.id,
    )

    balance_before = money(
        wallet.balance or Decimal("0.00")
    )

    balance_after = money(
        balance_before + bonus_amount
    )

    wallet.balance = balance_after

    wallet.total_earned = money(
        Decimal(str(wallet.total_earned or 0))
        + bonus_amount
    )

    # IMPORTANT:
    # total_withdrawn is untouched.

    # -----------------------------------------------------
    # COMMON INCOME WALLET LEDGER
    # -----------------------------------------------------

    ledger = IncomeWalletTransaction(
        user_id=receiver.id,

        income_type="team_rank_bonus",

        amount=bonus_amount,

        balance_before=balance_before,
        balance_after=balance_after,

        reference_type="team_rank_bonus",
        reference_id=bonus.id,

        description=(
            f"{rank_name.replace('_', ' ').title()} "
            f"Team Rank Bonus from "
            f"{source_user.customer_id} "
            f"new ${money(package_amount)} package"
        ),

        status="credited",
    )

    db.add(ledger)
    db.flush()

    return bonus


# =========================================================
# MAIN TEAM RANK BONUS PROCESSOR
# =========================================================

def process_team_rank_bonus(
    db: Session,
    source_user: User,
    subscription_transaction,
):
    """
    ========================================================
    TEAM RANK BONUS BUSINESS LOGIC
    ========================================================

    TRIGGER
    -------
    Only the user's FIRST / NEW subscription package.

    Upgrade:
        NO Team Rank Bonus

    Resubscribe:
        NO Team Rank Bonus


    CALCULATION
    -----------

    STEP 1:

        Package Amount × 15%

    STEP 2:

        15% result × 30%

        This becomes the actual Team Rank
        Distribution Pool.

    STEP 3:

        Distribution Pool is divided by:

        Ruby         = 5 / 30
        Emerald      = 5 / 30
        Sapphire     = 5 / 30
        Topaz        = 5 / 30
        Amethyst     = 4 / 30
        Diamond      = 3 / 30
        Crown Jewel  = 3 / 30


    UPLINE RULE
    -----------

    Traverse upward starting from the fresh user's
    direct sponsor.

    For every exact rank:

        nearest/first matching upline receives
        that rank slot.

    Example:

        Fresh User
            ↑
        Ruby A       -> Ruby slot
            ↑
        Ruby B       -> nothing
            ↑
        Emerald      -> Emerald slot


    MISSING RANK RULE
    -----------------

    If a rank does not exist in the upline:

        its fixed slot remains unpaid.

    It is NOT:
        - transferred upward
        - added to another rank
        - carried forward
        - redistributed


    DUPLICATE RULE
    --------------

    One transaction can pay each rank slot
    at most once.
    """

    # -----------------------------------------------------
    # ONLY NEW / FIRST PACKAGE
    # -----------------------------------------------------

    if subscription_transaction.transaction_type != "new":
        return []

    if subscription_transaction.status != "approved":
        return []

    package_amount = money(
        subscription_transaction.amount
    )

    if package_amount <= Decimal("0.00"):
        return []

    # -----------------------------------------------------
    # TRANSACTION-LEVEL IDEMPOTENCY
    # -----------------------------------------------------

    existing_bonus = (
        db.query(TeamRankBonus)
        .filter(
            TeamRankBonus.subscription_transaction_id
            == subscription_transaction.id
        )
        .first()
    )

    if existing_bonus:
        return []

    # =====================================================
    # STEP 1
    #
    # PACKAGE × 15%
    #
    # Example:
    #
    # $150 × 15%
    # = $22.50
    # =====================================================

    base_amount_exact = calculate_percent(
        package_amount,
        TEAM_RANK_BASE_PERCENT,
    )

    # =====================================================
    # STEP 2
    #
    # BASE × 30%
    #
    # $22.50 × 30%
    # = $6.75
    #
    # IMPORTANT:
    # Calculate from exact base, not a prematurely
    # rounded intermediate value.
    # =====================================================

    distribution_pool_exact = calculate_percent(
        base_amount_exact,
        TEAM_RANK_DISTRIBUTION_PERCENT,
    )

    distribution_pool = money(
        distribution_pool_exact
    )

    if distribution_pool <= Decimal("0.00"):
        return []

    # =====================================================
    # STEP 3
    #
    # PRE-CALCULATE ALL FIXED RANK SLOTS
    #
    # Missing ranks will simply leave their already
    # calculated slot unpaid.
    # =====================================================

    rank_slot_amounts = build_rank_slot_amounts(
        distribution_pool
    )

    # =====================================================
    # UPLINE TRAVERSAL
    # =====================================================

    credited_bonuses = []

    claimed_ranks = set()

    # Protect against malformed/circular referral trees.
    visited_user_ids = {
        source_user.id
    }

    current_upline = get_direct_upline(
        db=db,
        user=source_user,
    )

    while current_upline is not None:

        # -------------------------------------------------
        # LOOP / CYCLE PROTECTION
        # -------------------------------------------------

        if current_upline.id in visited_user_ids:
            break

        visited_user_ids.add(
            current_upline.id
        )

        # -------------------------------------------------
        # ONLY ENABLED USERS CAN RECEIVE
        # -------------------------------------------------

        if current_upline.is_active:

            rank_name = get_highest_achieved_rank(
                db=db,
                user_id=current_upline.id,
            )

            # ---------------------------------------------
            # Exact rank slot:
            #
            # - rank must be configured
            # - slot must not already be claimed
            # ---------------------------------------------

            if (
                rank_name
                and rank_name in TEAM_RANK_WEIGHTS
                and rank_name not in claimed_ranks
            ):

                rank_weight = (
                    TEAM_RANK_WEIGHTS[rank_name]
                )

                bonus_amount = (
                    rank_slot_amounts[rank_name]
                )

                bonus = credit_team_rank_bonus(
                    db=db,
                    receiver=current_upline,
                    source_user=source_user,
                    subscription_transaction=(
                        subscription_transaction
                    ),
                    rank_name=rank_name,
                    package_amount=package_amount,
                    distribution_pool=(
                        distribution_pool
                    ),
                    rank_weight=rank_weight,
                    bonus_amount=bonus_amount,
                )

                if bonus is not None:

                    credited_bonuses.append(
                        bonus
                    )

                    claimed_ranks.add(
                        rank_name
                    )

        # -------------------------------------------------
        # All seven slots found -> no need to go higher
        # -------------------------------------------------

        if len(claimed_ranks) == len(
            TEAM_RANK_ORDER
        ):
            break

        # -------------------------------------------------
        # MOVE ONE LEVEL UP
        # -------------------------------------------------

        current_upline = get_direct_upline(
            db=db,
            user=current_upline,
        )

    return credited_bonuses