from decimal import Decimal, ROUND_DOWN
from typing import Dict, Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.rank import UserRank
from app.models.rank_bonus import RankBonus
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction

from app.services.rank_config import RANK_CONFIG


MONEY = Decimal("0.0001")


def money(value) -> Decimal:
    return Decimal(str(value or 0)).quantize(
        MONEY,
        rounding=ROUND_DOWN,
    )


# ============================================================
# BASIC HELPERS
# ============================================================

def get_income_wallet(
    db: Session,
    user_id: int,
) -> Optional[IncomeWallet]:

    return (
        db.query(IncomeWallet)
        .filter(
            IncomeWallet.user_id == user_id
        )
        .first()
    )


def get_achieved_rank(
    db: Session,
    user_id: int,
    rank_name: str,
) -> Optional[UserRank]:

    return (
        db.query(UserRank)
        .filter(
            UserRank.user_id == user_id,
            UserRank.rank_name == rank_name,
        )
        .first()
    )


def get_existing_rank_bonus(
    db: Session,
    user_id: int,
    rank_name: str,
) -> Optional[RankBonus]:

    return (
        db.query(RankBonus)
        .filter(
            RankBonus.user_id == user_id,
            RankBonus.rank_name == rank_name,
        )
        .first()
    )


# ============================================================
# CHECK BONUS ELIGIBILITY
# ============================================================

def check_rank_bonus_eligibility(
    db: Session,
    user: User,
    rank_name: str,
) -> Dict:

    if rank_name not in RANK_CONFIG:
        raise ValueError(
            f"Invalid rank: {rank_name}"
        )

    config = RANK_CONFIG[rank_name]

    required_wallet = money(
        config["wallet_maintain"]
    )

    bonus_amount = money(
        config["instant_bonus"]
    )

    # --------------------------------------------------------
    # Rank must have been structurally achieved.
    # --------------------------------------------------------

    rank_record = get_achieved_rank(
        db,
        user.id,
        rank_name,
    )

    rank_achieved = rank_record is not None

    # --------------------------------------------------------
    # Bonus must NEVER have been credited before.
    # --------------------------------------------------------

    existing_bonus = get_existing_rank_bonus(
        db,
        user.id,
        rank_name,
    )

    already_claimed = existing_bonus is not None

    # --------------------------------------------------------
    # Current Income Wallet check.
    # --------------------------------------------------------

    wallet = get_income_wallet(
        db,
        user.id,
    )

    current_balance = money(
        wallet.balance if wallet else 0
    )

    wallet_maintained = (
        current_balance >= required_wallet
    )

    eligible = (
        rank_achieved
        and wallet_maintained
        and not already_claimed
    )

    return {
        "rank_name": rank_name,

        "rank_achieved": rank_achieved,

        "required_wallet_balance":
            float(required_wallet),

        "current_wallet_balance":
            float(current_balance),

        "wallet_maintained":
            wallet_maintained,

        "bonus_amount":
            float(bonus_amount),

        "already_claimed":
            already_claimed,

        "eligible":
            eligible,
    }


# ============================================================
# CREDIT ONE RANK BONUS
# ============================================================

def credit_rank_bonus(
    db: Session,
    user: User,
    rank_name: str,
) -> Dict:
    """
    IMPORTANT BUSINESS RULES:

    1. Rank must already be achieved.
    2. Required Income Wallet balance must be maintained.
    3. Instant rank bonus is ONE TIME ONLY.
    4. Bonus goes into the same Income Wallet.
    5. Bonus is also recorded in common wallet ledger.
    """

    eligibility = check_rank_bonus_eligibility(
        db,
        user,
        rank_name,
    )

    if not eligibility["rank_achieved"]:

        return {
            "credited": False,
            "reason": "rank_not_achieved",
            "eligibility": eligibility,
        }

    if eligibility["already_claimed"]:

        return {
            "credited": False,
            "reason": "already_claimed",
            "eligibility": eligibility,
        }

    if not eligibility["wallet_maintained"]:

        return {
            "credited": False,
            "reason": "wallet_requirement_not_met",
            "eligibility": eligibility,
        }

    config = RANK_CONFIG[rank_name]

    required_wallet = money(
        config["wallet_maintain"]
    )

    bonus_amount = money(
        config["instant_bonus"]
    )

    # Lock wallet row while modifying it.
    wallet = (
        db.query(IncomeWallet)
        .filter(
            IncomeWallet.user_id == user.id
        )
        .with_for_update()
        .first()
    )

    if not wallet:

        return {
            "credited": False,
            "reason": "income_wallet_not_found",
            "eligibility": eligibility,
        }

    # --------------------------------------------------------
    # Re-check after row lock.
    # Prevent withdrawal/race-condition mismatch.
    # --------------------------------------------------------

    wallet_before = money(
        wallet.balance
    )

    if wallet_before < required_wallet:

        return {
            "credited": False,
            "reason": "wallet_requirement_not_met",
            "eligibility": {
                **eligibility,
                "current_wallet_balance":
                    float(wallet_before),
                "wallet_maintained": False,
                "eligible": False,
            },
        }

    # --------------------------------------------------------
    # Duplicate protection again inside transaction.
    # --------------------------------------------------------

    existing_bonus = get_existing_rank_bonus(
        db,
        user.id,
        rank_name,
    )

    if existing_bonus:

        return {
            "credited": False,
            "reason": "already_claimed",
            "eligibility": eligibility,
        }

    wallet_after = money(
        wallet_before + bonus_amount
    )

    # --------------------------------------------------------
    # Create permanent bonus record FIRST.
    # --------------------------------------------------------

    bonus_record = RankBonus(
        user_id=user.id,
        rank_name=rank_name,

        required_wallet_balance=
            required_wallet,

        wallet_balance_before=
            wallet_before,

        bonus_amount=
            bonus_amount,

        wallet_balance_after=
            wallet_after,

        status="credited",
    )

    db.add(bonus_record)
    db.flush()

    # --------------------------------------------------------
    # Credit wallet
    # --------------------------------------------------------

    wallet.balance = wallet_after

    wallet.total_earned = money(
        wallet.total_earned
    ) + bonus_amount

    # --------------------------------------------------------
    # Common Income Wallet ledger
    # --------------------------------------------------------

    ledger = IncomeWalletTransaction(
        user_id=user.id,

        income_type="rank_bonus",

        amount=bonus_amount,

        balance_before=wallet_before,
        balance_after=wallet_after,

        reference_type="rank_bonus",
        reference_id=bonus_record.id,

        description=(
            f"{config['display_name']} "
            f"one-time instant rank bonus"
        ),

        status="credited",
    )

    db.add(ledger)
    db.flush()

    return {
        "credited": True,

        "reason": "rank_bonus_credited",

        "rank_name": rank_name,
        "rank_display_name":
            config["display_name"],

        "bonus_id":
            bonus_record.id,

        "bonus_amount":
            float(bonus_amount),

        "required_wallet_balance":
            float(required_wallet),

        "wallet_balance_before":
            float(wallet_before),

        "wallet_balance_after":
            float(wallet_after),
    }


# ============================================================
# PROCESS ALL ACHIEVED RANK BONUSES
# ============================================================

def process_pending_rank_bonuses(
    db: Session,
    user: User,
) -> Dict:
    """
    Checks every rank historically achieved by this user.

    This does NOT mean every rank will receive a bonus.

    Each rank:
        - must be achieved
        - must meet its wallet requirement
        - must never have received that bonus before
    """

    results = []

    for rank_name in RANK_CONFIG.keys():

        rank_record = get_achieved_rank(
            db,
            user.id,
            rank_name,
        )

        if not rank_record:
            continue

        result = credit_rank_bonus(
            db,
            user,
            rank_name,
        )

        results.append(result)

    credited = [
        result
        for result in results
        if result.get("credited")
    ]

    return {
        "user_id": user.id,
        "processed": len(results),

        "credited_count":
            len(credited),

        "credited":
            credited,

        "results":
            results,
    }