from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db

from app.models.subscription import (
    SubscriptionCycle,
    SubscriptionTransaction,
)
from app.models.user import User

from app.schemas.subscription import (
    CurrentSubscriptionResponse,
    SubscriptionHistoryResponse,
    SubscriptionPurchaseRequest,
    SubscriptionPurchaseResponse,
)

# =========================================================
# REFERRAL SERVICE
# =========================================================

from app.services.referral_service import (
    process_referral_income,
)

# =========================================================
# TEAM RANK BONUS SERVICE
# =========================================================

from app.services.team_rank_bonus_service import (
    process_team_rank_bonus,
)

# =========================================================
# STRUCTURAL RANK SERVICE
# =========================================================

from app.services.rank_service import (
    evaluate_user_rank,
    evaluate_upline_rank_chain,
)

# =========================================================
# INSTANT RANK BONUS SERVICE
# =========================================================

from app.services.rank_bonus_service import (
    process_pending_rank_bonuses,
)


router = APIRouter(
    prefix="/api/subscription",
    tags=["Subscription"],
)


# =========================================================
# SUBSCRIPTION BUSINESS RULES
# =========================================================

MIN_FIRST_SUBSCRIPTION = Decimal("20.00")
MIN_UPGRADE = Decimal("10.00")
MAX_SUBSCRIPTION = Decimal("200.00")
SUBSCRIPTION_STEP = Decimal("10.00")


# =========================================================
# HELPERS
# =========================================================

def utc_now():
    """
    Store UTC datetime without timezone information
    because MySQL DATETIME is timezone-naive.
    """
    return datetime.now(
        timezone.utc
    ).replace(tzinfo=None)


def money(value) -> Decimal:
    """
    Convert monetary values safely to 2 decimal places.
    """
    return Decimal(
        str(value or 0)
    ).quantize(
        Decimal("0.01")
    )


def validate_subscription_amount(
    amount: Decimal,
    current_amount: Decimal,
) -> Decimal:

    amount = money(amount)
    current_amount = money(
        current_amount
    )

    # =====================================================
    # AMOUNT MUST BE POSITIVE
    # =====================================================

    if amount <= Decimal("0.00"):
        raise HTTPException(
            status_code=400,
            detail=(
                "Subscription amount must be "
                "greater than $0."
            ),
        )

    # =====================================================
    # ONLY $10 MULTIPLES
    # =====================================================

    if (
        amount %
        SUBSCRIPTION_STEP
        != 0
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Subscription amount must be "
                "in multiples of $10."
            ),
        )

    # =====================================================
    # NEW SUBSCRIPTION / NEW CYCLE
    # =====================================================

    if (
        current_amount
        == Decimal("0.00")
    ):

        if (
            amount
            < MIN_FIRST_SUBSCRIPTION
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Minimum subscription amount "
                    "for a new cycle is $20."
                ),
            )

    # =====================================================
    # UPGRADE
    # =====================================================

    else:

        if (
            amount
            < MIN_UPGRADE
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Minimum subscription upgrade "
                    "amount is $10."
                ),
            )

    resulting_amount = (
        current_amount
        + amount
    )

    # =====================================================
    # MAXIMUM PACKAGE = $200
    # =====================================================

    if (
        resulting_amount
        > MAX_SUBSCRIPTION
    ):

        remaining = (
            MAX_SUBSCRIPTION
            - current_amount
        )

        if (
            remaining
            <= Decimal("0.00")
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Your current subscription "
                    "has already reached the "
                    "maximum amount of $200."
                ),
            )

        raise HTTPException(
            status_code=400,
            detail=(
                "Maximum subscription per cycle "
                "is $200. "
                f"You can add only up to "
                f"${remaining:.2f}."
            ),
        )

    return resulting_amount


# =========================================================
# GET CURRENT ACTIVE CYCLE
# =========================================================

def get_current_open_cycle(
    db: Session,
    user_id: int,
):
    return (
        db.query(
            SubscriptionCycle
        )
        .filter(
            SubscriptionCycle.user_id
            == user_id,

            SubscriptionCycle.status
            == "active",
        )
        .order_by(
            SubscriptionCycle
            .cycle_number
            .desc()
        )
        .first()
    )


# =========================================================
# GET LATEST CYCLE
# =========================================================

def get_latest_cycle(
    db: Session,
    user_id: int,
):
    return (
        db.query(
            SubscriptionCycle
        )
        .filter(
            SubscriptionCycle.user_id
            == user_id
        )
        .order_by(
            SubscriptionCycle
            .cycle_number
            .desc()
        )
        .first()
    )


# =========================================================
# GET NEXT CYCLE NUMBER
# =========================================================

def get_next_cycle_number(
    db: Session,
    user_id: int,
) -> int:

    latest_number = (
        db.query(
            func.max(
                SubscriptionCycle
                .cycle_number
            )
        )
        .filter(
            SubscriptionCycle.user_id
            == user_id
        )
        .scalar()
    )

    return int(
        latest_number or 0
    ) + 1


# =========================================================
# PENDING AMOUNT
# =========================================================

def get_pending_amount(
    db: Session,
    cycle_id: int,
) -> Decimal:

    result = (
        db.query(
            func.coalesce(
                func.sum(
                    SubscriptionTransaction
                    .amount
                ),
                0,
            )
        )
        .filter(
            SubscriptionTransaction.cycle_id
            == cycle_id,

            SubscriptionTransaction.status
            == "pending",
        )
        .scalar()
    )

    return money(
        result
    )


# =========================================================
# PURCHASE / UPGRADE / RESUBSCRIBE
# =========================================================

@router.post(
    "/purchase",
    response_model=SubscriptionPurchaseResponse,
)
def purchase_subscription(
    payload: SubscriptionPurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    amount = money(
        payload.amount
    )

    # =====================================================
    # CURRENT ACTIVE SUBSCRIPTION
    # =====================================================

    cycle = get_current_open_cycle(
        db,
        current_user.id,
    )

    # =====================================================
    # LATEST HISTORICAL CYCLE
    # =====================================================

    latest_cycle = get_latest_cycle(
        db,
        current_user.id,
    )

    # =====================================================
    # CASE 1:
    # NO ACTIVE SUBSCRIPTION
    # =====================================================

    if cycle is None:

        previous_amount = Decimal(
            "0.00"
        )

        resulting_amount = (
            validate_subscription_amount(
                amount=amount,
                current_amount=(
                    previous_amount
                ),
            )
        )

        cycle_number = (
            get_next_cycle_number(
                db,
                current_user.id,
            )
        )

        # -------------------------------------------------
        # FIRST EVER = NEW
        # EXPIRED PREVIOUS CYCLE = RESUBSCRIBE
        # -------------------------------------------------

        if (
            latest_cycle is not None
            and
            latest_cycle.status
            == "expired"
        ):
            transaction_type = (
                "resubscribe"
            )

        else:
            transaction_type = (
                "new"
            )

        # -------------------------------------------------
        # CREATE ACTIVE CYCLE
        # -------------------------------------------------

        cycle = SubscriptionCycle(
            user_id=(
                current_user.id
            ),

            cycle_number=(
                cycle_number
            ),

            current_amount=(
                resulting_amount
            ),

            total_cycle_earnings=(
                Decimal("0.00")
            ),

            status="active",

            started_at=utc_now(),

            expired_at=None,
        )

        db.add(
            cycle
        )

        # Need cycle.id
        db.flush()

    # =====================================================
    # CASE 2:
    # ACTIVE SUBSCRIPTION = UPGRADE
    # =====================================================

    else:

        previous_amount = money(
            cycle.current_amount
        )

        resulting_amount = (
            validate_subscription_amount(
                amount=amount,
                current_amount=(
                    previous_amount
                ),
            )
        )

        transaction_type = (
            "upgrade"
        )

        cycle.current_amount = (
            resulting_amount
        )

    # =====================================================
    # CREATE SUBSCRIPTION TRANSACTION
    # =====================================================

    transaction = (
        SubscriptionTransaction(

            user_id=(
                current_user.id
            ),

            cycle_id=(
                cycle.id
            ),

            transaction_type=(
                transaction_type
            ),

            # For upgrade:
            # this is only the added amount.
            amount=amount,

            previous_amount=(
                previous_amount
            ),

            resulting_amount=(
                resulting_amount
            ),

            payment_network=(
                "TEST_GATEWAY"
            ),

            tx_hash=None,

            from_wallet=None,

            # Development mode:
            # payment approved immediately.
            status="approved",

            approved_by=None,

            approved_at=utc_now(),

            rejected_at=None,

            rejection_reason=None,
        )
    )

    db.add(
        transaction
    )

    # =====================================================
    # SUBSCRIPTION + REFERRAL + TEAM RANK BONUS + RANK REWARD
    # ONE DATABASE TRANSACTION
    # =====================================================

    try:

        # -------------------------------------------------
        # Get transaction.id before income processing
        # -------------------------------------------------

        db.flush()

        # =================================================
        # 1. REFERRAL INCOME
        # =================================================

        referral_income = (
            process_referral_income(
                db=db,

                source_user=(
                    current_user
                ),

                subscription_transaction=(
                    transaction
                ),

                subscription_cycle=(
                    cycle
                ),
            )
        )

        # =================================================
        # 2. TEAM RANK BONUS
        # =================================================
        #
        # Service rules:
        #
        # NEW:
        #   Team Rank Bonus allowed
        #
        # UPGRADE:
        #   No Team Rank Bonus
        #
        # RESUBSCRIBE:
        #   No Team Rank Bonus
        #
        # Calculation:
        #
        # package amount × 15% = Team Rank Pool
        #
        # Ruby         = 5% of pool
        # Emerald      = 5% of pool
        # Sapphire     = 5% of pool
        # Topaz        = 5% of pool
        # Amethyst     = 4% of pool
        # Diamond      = 3% of pool
        # Crown Jewel  = 3% of pool
        #
        # Missing rank:
        #   no carry forward
        #
        # Duplicate same rank:
        #   nearest upline only
        # =================================================

        team_rank_bonuses = (
            process_team_rank_bonus(
                db=db,

                source_user=(
                    current_user
                ),

                subscription_transaction=(
                    transaction
                ),
            )
        )

        # =================================================
        # 3. STRUCTURAL RANK RECALCULATION
        # =================================================
        # Evaluate the subscriber first, then the complete sponsor
        # upline so newly completed Ruby / Emerald / Sapphire /
        # higher-rank conditions are applied immediately.
        # =================================================

        # Keep all users whose rank can be affected by this
        # subscription so their pending one-time rank bonuses
        # can be processed in the same database transaction.
        affected_users = [current_user]

        evaluate_user_rank(
            db=db,
            user=current_user,
        )

        db.flush()

        sponsor = None

        if current_user.referred_by:
            sponsor = (
                db.query(User)
                .filter(
                    User.referral_id
                    == current_user.referred_by
                )
                .first()
            )

        if sponsor is not None:
            evaluate_upline_rank_chain(
                db=db,
                starting_user=sponsor,
            )

            # Build the same sponsor/upline chain for bonus
            # processing. The rank bonus service itself prevents
            # duplicate credits for previously-paid ranks.
            seen_user_ids = {current_user.id}
            upline_user = sponsor

            while (
                upline_user is not None
                and upline_user.id not in seen_user_ids
            ):
                affected_users.append(
                    upline_user
                )
                seen_user_ids.add(
                    upline_user.id
                )

                if not upline_user.referred_by:
                    break

                upline_user = (
                    db.query(User)
                    .filter(
                        User.referral_id
                        == upline_user.referred_by
                    )
                    .first()
                )

        db.flush()

        # =================================================
        # 4. INSTANT RANK BONUSES
        # =================================================
        # Process pending rewards only after the complete
        # structural rank chain has been recalculated.
        # rank_bonus_service verifies rank achievement, wallet
        # maintenance and one-time/duplicate protection.
        # =================================================

        for affected_user in affected_users:
            process_pending_rank_bonuses(
                db=db,
                user=affected_user,
            )

        db.flush()

        # =================================================
        # ONE FINAL COMMIT
        # =================================================
        #
        # Saves together:
        #
        # - Subscription Cycle
        # - Subscription Transaction
        # - Referral Income
        # - Referral Wallet Credit
        # - Team Rank Bonus
        # - Team Rank Wallet Credit
        # - Income Wallet Transactions
        # - Eligible One-Time Instant Rank Bonuses
        #
        # If anything fails -> everything rolls back.
        # =================================================

        db.commit()

        # =================================================
        # REFRESH
        # =================================================

        db.refresh(
            cycle
        )

        db.refresh(
            transaction
        )

        if referral_income is not None:
            db.refresh(
                referral_income
            )

        for team_bonus in team_rank_bonuses:
            db.refresh(
                team_bonus
            )

    except Exception as exc:

        db.rollback()

        print(
            "Subscription / referral / "
            "team rank bonus processing error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to activate subscription."
            ),
        )

    # =====================================================
    # RESPONSE MESSAGE
    # =====================================================

    if (
        transaction_type
        == "upgrade"
    ):

        message = (
            "Subscription upgraded "
            "successfully. "
            "Your current subscription is "
            f"${money(cycle.current_amount):.2f}."
        )

    elif (
        transaction_type
        == "resubscribe"
    ):

        message = (
            "Re-subscription completed "
            "successfully. "
            "Your new cycle has started with "
            f"${money(cycle.current_amount):.2f}."
        )

    else:

        message = (
            "Subscription activated "
            "successfully."
        )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {
        "success": True,

        "message": (
            message
        ),

        "transaction_id": (
            transaction.id
        ),

        "cycle_id": (
            cycle.id
        ),

        "cycle_number": (
            cycle.cycle_number
        ),

        "transaction_type": (
            transaction.transaction_type
        ),

        "amount": money(
            transaction.amount
        ),

        "current_approved_amount": (
            money(
                cycle.current_amount
            )
        ),

        "projected_amount": (
            money(
                cycle.current_amount
            )
        ),

        "payment_network": (
            transaction.payment_network
        ),

        "tx_hash": (
            transaction.tx_hash
        ),

        "status": (
            transaction.status
        ),
    }


# =========================================================
# CURRENT SUBSCRIPTION
# =========================================================

@router.get(
    "/current",
    response_model=CurrentSubscriptionResponse,
)
def current_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    cycle = get_current_open_cycle(
        db,
        current_user.id,
    )

    # =====================================================
    # NO ACTIVE SUBSCRIPTION
    # =====================================================

    if cycle is None:

        return {
            "success": True,

            "subscription_active": False,

            "subscription_status": (
                "inactive"
            ),

            "cycle_id": None,

            "cycle_number": None,

            "current_amount": (
                Decimal("0.00")
            ),

            "total_cycle_earnings": (
                Decimal("0.00")
            ),

            "pending_amount": (
                Decimal("0.00")
            ),

            "started_at": None,

            "expired_at": None,
        }

    # =====================================================
    # ACTIVE SUBSCRIPTION
    # =====================================================

    pending_amount = (
        get_pending_amount(
            db,
            cycle.id,
        )
    )

    subscription_active = (
        cycle.status == "active"
        and
        money(
            cycle.current_amount
        ) > Decimal("0.00")
    )

    return {
        "success": True,

        "subscription_active": (
            subscription_active
        ),

        "subscription_status": (
            "active"
            if subscription_active
            else "inactive"
        ),

        "cycle_id": (
            cycle.id
        ),

        "cycle_number": (
            cycle.cycle_number
        ),

        "current_amount": (
            money(
                cycle.current_amount
            )
        ),

        "total_cycle_earnings": (
            money(
                cycle.total_cycle_earnings
            )
        ),

        "pending_amount": (
            pending_amount
        ),

        "started_at": (
            cycle.started_at
        ),

        "expired_at": (
            cycle.expired_at
        ),
    }


# =========================================================
# SUBSCRIPTION TRANSACTION HISTORY
# =========================================================

@router.get(
    "/history",
    response_model=SubscriptionHistoryResponse,
)
def subscription_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    transactions = (
        db.query(
            SubscriptionTransaction
        )
        .filter(
            SubscriptionTransaction.user_id
            == current_user.id
        )
        .order_by(
            SubscriptionTransaction
            .id
            .desc()
        )
        .all()
    )

    return {
        "success": True,

        "transactions": (
            transactions
        ),
    }