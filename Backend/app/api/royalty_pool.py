from decimal import Decimal
from app.services.royalty_pool_config import (
    find_highest_matching_slab,
)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user


from app.models.user import User
from app.models.royalty_pool import RoyaltyPoolIncome

from app.services.royalty_pool_service import (
    build_referral_tree,
    calculate_user_qualification,
    get_enabled_users,
    get_total_royalty_earned,
    money,
    process_single_user_royalty,
)

from app.schemas.royalty_pool import (
    RoyaltyLegItem,
    RoyaltyPoolHistoryResponse,
    RoyaltyPoolStatusResponse,
    RoyaltyPoolSummaryResponse,
)


router = APIRouter(
    prefix="/api/royalty-pool",
    tags=["Royalty Pool"],
)


# =========================================================
# HELPERS
# =========================================================

def build_leg_response(
    leg: dict,
    power_leg_user_id: int | None,
    current_threshold: int | None,
) -> RoyaltyLegItem:

    leg_user = leg["leg_user"]

    member_count = int(
        leg["team_count"] or 0
    )

    is_power_leg = (
        power_leg_user_id is not None
        and leg_user.id == power_leg_user_id
    )

    qualifies_current_slab = (
        not is_power_leg
        and current_threshold is not None
        and member_count >= current_threshold
    )

    return RoyaltyLegItem(
        user_id=leg_user.id,
        customer_id=leg_user.customer_id,
        full_name=leg_user.full_name,
        member_count=member_count,
        is_power_leg=is_power_leg,
        qualifies_current_slab=qualifies_current_slab,
    )


# =========================================================
# CURRENT STATUS
# =========================================================

@router.get(
    "/status",
    response_model=RoyaltyPoolStatusResponse,
)
def get_royalty_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    users = get_enabled_users(db)

    user_map = {
        user.id: user
        for user in users
    }

    # Logged-in user may theoretically become disabled
    # after token creation.
    user = user_map.get(
        current_user.id
    )

    if user is None:
        raise HTTPException(
            status_code=403,
            detail="User account is not active.",
        )

    children_map = build_referral_tree(
        users
    )

    qualification = (
        calculate_user_qualification(
            user,
            children_map,
        )
    )

    legs = qualification.get(
        "legs",
        [],
    )

    power_leg = qualification.get(
        "power_leg"
    )

    slab = qualification.get(
        "slab"
    )

    qualifying_legs = qualification.get(
        "qualifying_legs",
        [],
    )

    power_leg_user_id = None

    if power_leg:
        power_leg_user_id = (
            power_leg["leg_user"].id
        )

    current_threshold = None
    daily_per_leg = Decimal("0.00")
    current_cap = Decimal("0.00")

    if slab:
        current_threshold = int(
            slab["threshold"]
        )

        daily_per_leg = money(
            slab["daily_per_leg"]
        )

        current_cap = money(
            slab["total_cap"]
        )

    total_earned = (
        get_total_royalty_earned(
            db,
            user.id,
        )
    )

    remaining_cap = money(
        max(
            current_cap - total_earned,
            Decimal("0.00"),
        )
    )

    qualifying_leg_count = len(
        qualifying_legs
    )

    estimated_daily_royalty = (
        Decimal("0.00")
    )

    if qualification["qualified"]:

        estimated_daily_royalty = money(
            daily_per_leg
            *
            Decimal(
                qualifying_leg_count
            )
        )

        # Dashboard should show the amount that can
        # ACTUALLY still be credited under the cap.
        estimated_daily_royalty = money(
            min(
                estimated_daily_royalty,
                remaining_cap,
            )
        )

    response_legs = [

        build_leg_response(
            leg=leg,
            power_leg_user_id=(
                power_leg_user_id
            ),
            current_threshold=(
                current_threshold
            ),
        )

        for leg in legs
    ]

    power_leg_response = None

    if power_leg:

        power_leg_response = (
            build_leg_response(
                leg=power_leg,
                power_leg_user_id=(
                    power_leg_user_id
                ),
                current_threshold=(
                    current_threshold
                ),
            )
        )

    return RoyaltyPoolStatusResponse(
        qualified=bool(
            qualification[
                "qualified"
            ]
        ),

        qualification_reason=(
            qualification[
                "reason"
            ]
        ),

        current_slab=(
            current_threshold
        ),

        daily_per_leg=(
            daily_per_leg
        ),

        current_cap=(
            current_cap
        ),

        total_earned=(
            total_earned
        ),

        remaining_cap=(
            remaining_cap
        ),

        qualifying_leg_count=(
            qualifying_leg_count
        ),

        estimated_daily_royalty=(
            estimated_daily_royalty
        ),

        power_leg=(
            power_leg_response
        ),

        legs=response_legs,
    )


# =========================================================
# SUMMARY
# =========================================================

@router.get(
    "/summary",
    response_model=RoyaltyPoolSummaryResponse,
)
def get_royalty_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    total_earned = (
        get_total_royalty_earned(
            db,
            current_user.id,
        )
    )

    total_transactions = (
        db.query(RoyaltyPoolIncome)
        .filter(
            RoyaltyPoolIncome.user_id
            == current_user.id,

            RoyaltyPoolIncome.status
            == "credited",
        )
        .count()
    )

    last_income = (
        db.query(RoyaltyPoolIncome)
        .filter(
            RoyaltyPoolIncome.user_id
            == current_user.id,

            RoyaltyPoolIncome.status
            == "credited",
        )
        .order_by(
            RoyaltyPoolIncome.payout_date.desc(),
            RoyaltyPoolIncome.id.desc(),
        )
        .first()
    )

    users = get_enabled_users(db)

    user = next(
        (
            item
            for item in users
            if item.id == current_user.id
        ),
        None,
    )

    current_slab = None
    current_cap = Decimal("0.00")

    if user:

        children_map = (
            build_referral_tree(
                users
            )
        )

        qualification = (
            calculate_user_qualification(
                user,
                children_map,
            )
        )

        slab = qualification.get(
            "slab"
        )

        if slab:

            current_slab = int(
                slab["threshold"]
            )

            current_cap = money(
                slab["total_cap"]
            )

    remaining_cap = money(
        max(
            current_cap - total_earned,
            Decimal("0.00"),
        )
    )

    return RoyaltyPoolSummaryResponse(
        total_earned=total_earned,

        total_transactions=(
            total_transactions
        ),

        last_royalty_amount=(
            money(
                last_income.royalty_amount
            )
            if last_income
            else Decimal("0.00")
        ),

        last_payout_date=(
            last_income.payout_date
            if last_income
            else None
        ),

        current_slab=(
            current_slab
        ),

        current_cap=(
            current_cap
        ),

        remaining_cap=(
            remaining_cap
        ),
    )


# =========================================================
# HISTORY
# =========================================================

@router.get(
    "/history",
    response_model=RoyaltyPoolHistoryResponse,
)
def get_royalty_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    history = (
        db.query(RoyaltyPoolIncome)
        .filter(
            RoyaltyPoolIncome.user_id
            == current_user.id,

            RoyaltyPoolIncome.status
            == "credited",
        )
        .order_by(
            RoyaltyPoolIncome.payout_date.desc(),
            RoyaltyPoolIncome.id.desc(),
        )
        .all()
    )

    total_earned = money(
        sum(
            (
                money(
                    item.royalty_amount
                )
                for item in history
            ),
            Decimal("0.00"),
        )
    )

    return RoyaltyPoolHistoryResponse(
        total_earned=total_earned,
        count=len(history),
        history=history,
    )


# =========================================================
# DEVELOPMENT TEST ENDPOINT
# =========================================================
#
# IMPORTANT:
# This endpoint directly triggers today's Royalty.
#
# Keep this ONLY for development/testing.
# Before production we will either:
#
#   - remove it, or
#   - protect it with admin/dev authorization.
#
# =========================================================

@router.post("/dev/process-me")
def dev_process_my_royalty(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    result = process_single_user_royalty(
        db=db,
        user_id=current_user.id,
    )

    # ORM object is not useful in JSON response.
    result.pop(
        "royalty_income",
        None,
    )

    # Convert Decimal values to strings for
    # predictable testing output.
    for key, value in list(
        result.items()
    ):

        if isinstance(
            value,
            Decimal,
        ):
            result[key] = str(value)

    return result   




# =========================================================
# DEVELOPMENT ROYALTY SIMULATOR
# =========================================================
#
# IMPORTANT:
# - Development/testing only
# - Does NOT change referral tree
# - Does NOT credit wallet
# - Does NOT create Royalty history
#
# Example:
#
# POST:
# /api/royalty-pool/dev/simulate?leg_counts=30,25,25
#
# =========================================================

@router.post("/dev/simulate")
def dev_simulate_royalty(
    leg_counts: str,
    current_user: User = Depends(get_current_user),
):
    try:
        counts = [
            int(value.strip())
            for value in leg_counts.split(",")
            if value.strip()
        ]

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Leg counts must be comma-separated integers.",
        )

    if len(counts) < 3:
        raise HTTPException(
            status_code=400,
            detail=(
                "Minimum 3 legs required: "
                "1 Power Leg + 2 matching non-power legs."
            ),
        )

    if any(count < 0 for count in counts):
        raise HTTPException(
            status_code=400,
            detail="Leg member count cannot be negative.",
        )

    # Largest leg becomes Power Leg.
    sorted_counts = sorted(
        counts,
        reverse=True,
    )

    power_leg_count = sorted_counts[0]

    # Only ONE largest leg is removed as Power Leg.
    non_power_counts = sorted_counts[1:]

    slab = find_highest_matching_slab(
        non_power_counts
    )

    if slab is None:
        return {
            "success": True,
            "qualified": False,
            "reason": "matching_not_met",
            "input_legs": counts,
            "power_leg_count": power_leg_count,
            "non_power_leg_counts": non_power_counts,
            "current_slab": None,
            "qualifying_leg_count": 0,
            "daily_per_leg": "0.00",
            "daily_royalty": "0.00",
            "total_cap": "0.00",
        }

    threshold = int(
        slab["threshold"]
    )

    daily_per_leg = money(
        slab["daily_per_leg"]
    )

    total_cap = money(
        slab["total_cap"]
    )

    qualifying_counts = [
        count
        for count in non_power_counts
        if count >= threshold
    ]

    qualifying_leg_count = len(
        qualifying_counts
    )

    daily_royalty = money(
        daily_per_leg
        * Decimal(qualifying_leg_count)
    )

    return {
        "success": True,
        "qualified": True,

        "input_legs": counts,

        "power_leg_count": (
            power_leg_count
        ),

        "non_power_leg_counts": (
            non_power_counts
        ),

        "current_slab": (
            threshold
        ),

        "qualifying_leg_counts": (
            qualifying_counts
        ),

        "qualifying_leg_count": (
            qualifying_leg_count
        ),

        "daily_per_leg": str(
            daily_per_leg
        ),

        "daily_royalty": str(
            daily_royalty
        ),

        "total_cap": str(
            total_cap
        ),
    }
    


# =========================================================
# TEMPORARY DEV WALLET CREDIT TEST
# =========================================================
#
# ONLY FOR DEVELOPMENT.
# Remove before production.
#
# Purpose:
# Verify:
#   RoyaltyPoolIncome
#   IncomeWallet
#   IncomeWalletTransaction
#   same-day duplicate protection
#
# Fixed simulated case:
#
#   Power = 30
#   Leg 2 = 25
#   Leg 3 = 25
#
#   Royalty = $2
#   Cap = $100
#
# =========================================================

@router.post("/dev/test-credit")
def dev_test_royalty_credit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    from app.models.income_wallet import IncomeWallet
    from app.models.income_wallet_transaction import (
        IncomeWalletTransaction,
    )

    from app.services.royalty_pool_service import (
        get_or_create_income_wallet,
        get_business_date,
        get_total_royalty_earned,
    )

    today = get_business_date()

    # -----------------------------------------------------
    # DUPLICATE CHECK
    # -----------------------------------------------------

    existing = (
        db.query(RoyaltyPoolIncome)
        .filter(
            RoyaltyPoolIncome.user_id
            == current_user.id,

            RoyaltyPoolIncome.payout_date
            == today,
        )
        .first()
    )

    if existing:

        return {
            "success": True,
            "credited": False,
            "reason": "already_processed_today",
            "existing_amount": str(
                money(
                    existing.royalty_amount
                )
            ),
            "payout_date": str(today),
        }

    try:

        # -------------------------------------------------
        # FIXED VERIFIED TEST CASE
        # -------------------------------------------------

        threshold = 25

        daily_per_leg = Decimal("1.00")

        qualifying_leg_count = 2

        calculated_amount = Decimal("2.00")

        total_cap = Decimal("100.00")


        # -------------------------------------------------
        # EXISTING ROYALTY EARNINGS
        # -------------------------------------------------

        earned_before = (
            get_total_royalty_earned(
                db,
                current_user.id,
            )
        )

        remaining_cap = money(
            total_cap
            -
            earned_before
        )

        if remaining_cap <= Decimal("0.00"):

            return {
                "success": True,
                "credited": False,
                "reason": "cap_reached",
                "total_earned": str(
                    earned_before
                ),
                "cap": str(
                    total_cap
                ),
            }


        royalty_amount = money(
            min(
                calculated_amount,
                remaining_cap,
            )
        )

        earned_after = money(
            earned_before
            +
            royalty_amount
        )


        # -------------------------------------------------
        # WALLET
        # -------------------------------------------------

        wallet = (
            get_or_create_income_wallet(
                db,
                current_user.id,
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


        # -------------------------------------------------
        # ROYALTY HISTORY
        # -------------------------------------------------

        royalty_income = RoyaltyPoolIncome(

            user_id=current_user.id,

            slab_threshold=threshold,

            daily_per_leg=daily_per_leg,

            slab_total_cap=total_cap,

            # Simulated test:
            # no real Power Leg user attached.
            power_leg_user_id=None,

            power_leg_member_count=30,

            qualifying_leg_count=(
                qualifying_leg_count
            ),

            non_power_leg_count=2,

            calculated_daily_amount=(
                calculated_amount
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

            status="credited",

            payout_date=today,
        )

        db.add(
            royalty_income
        )

        db.flush()


        # -------------------------------------------------
        # COMMON WALLET LEDGER
        # -------------------------------------------------

        ledger = IncomeWalletTransaction(

            user_id=current_user.id,

            income_type="royalty",

            amount=royalty_amount,

            balance_before=(
                balance_before
            ),

            balance_after=(
                balance_after
            ),

            reference_type=(
                "royalty_pool"
            ),

            reference_id=(
                royalty_income.id
            ),

            description=(
                "DEV TEST Royalty Pool - "
                "25+ matching - "
                "2 qualifying legs"
            ),

            status="credited",
        )

        db.add(
            ledger
        )

        db.commit()

        db.refresh(
            royalty_income
        )

        return {
            "success": True,
            "credited": True,

            "royalty_income_id":
                royalty_income.id,

            "slab_threshold":
                threshold,

            "qualifying_leg_count":
                qualifying_leg_count,

            "royalty_amount":
                str(royalty_amount),

            "cap_earned_before":
                str(earned_before),

            "cap_earned_after":
                str(earned_after),

            "wallet_balance_before":
                str(balance_before),

            "wallet_balance_after":
                str(balance_after),

            "payout_date":
                str(today),
        }

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Royalty test credit failed: "
                f"{str(exc)}"
            ),
        )