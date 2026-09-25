from decimal import Decimal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.api.auth import (
    get_current_user,
)

from app.models.user import User

from app.models.income_wallet_transaction import (
    IncomeWalletTransaction,
)

from app.models.rank_achiever import (
    RankAchiever,
    RankAchieverPayout,
)

from app.schemas.rank_achiever import (
    RankAchieverStatusResponse,
    RankAchieverHistoryResponse,
)

from app.services.rank_achiever_service import (
    get_user_rank_achiever_status,
    get_user_rank_achiever_history,
    process_user_rank_achiever,
    calculate_fund_status,
    process_single_fund,
    get_or_create_income_wallet,
)

from app.services.rank_achiever_config import (
    RANK_ACHIEVER_CONFIG,
    RANK_ACHIEVER_INCOME_TYPE,
    RANK_ACHIEVER_REFERENCE_TYPE,
    RANK_ACHIEVER_STATUS_CREDITED,
    money,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/rank-achiever",
    tags=["Rank Achiever"],
)


# ============================================================
# SERIALIZER HELPER
# ============================================================

def serialize_value(value):

    if isinstance(
        value,
        Decimal,
    ):
        return str(value)

    if isinstance(
        value,
        dict,
    ):
        return {
            key: serialize_value(item)
            for key, item
            in value.items()
        }

    if isinstance(
        value,
        list,
    ):
        return [
            serialize_value(item)
            for item in value
        ]

    if hasattr(
        value,
        "isoformat",
    ):
        return value.isoformat()

    return value


# ============================================================
# CURRENT USER STATUS
# ============================================================

@router.get(
    "/status",
    response_model=RankAchieverStatusResponse,
)
def get_rank_achiever_status(
    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Live Rank Achiever eligibility.

    DOES NOT credit money.

    Eligibility:
        Team Maintain
            +
        Income Wallet Maintain
    """

    try:

        result = (
            get_user_rank_achiever_status(
                db=db,
                user=current_user,
            )
        )

        db.commit()

        return result

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to calculate "
                "Rank Achiever status."
            ),
        ) from exc


# ============================================================
# CURRENT USER PAYOUT HISTORY
# ============================================================

@router.get(
    "/history",
    response_model=RankAchieverHistoryResponse,
)
def get_rank_achiever_history(
    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Returns actual credited monthly
    Rank Achiever payouts.
    """

    try:

        rows = (
            get_user_rank_achiever_history(
                db=db,
                user_id=current_user.id,
            )
        )


        total_paid = sum(
            (
                Decimal(
                    str(
                        row.amount or 0
                    )
                )
                for row in rows
            ),
            Decimal("0.00"),
        )


        return {
            "success": True,

            "total_paid":
                total_paid,

            "count":
                len(rows),

            "history":
                rows,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to load "
                "Rank Achiever history."
            ),
        ) from exc


# ============================================================
# DEV: PROCESS CURRENT USER
# ============================================================

@router.post(
    "/dev/process-me",
)
def dev_process_my_rank_achiever(
    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    """
    DEVELOPMENT ONLY.

    Actually processes current user's
    Rank Achiever monthly rewards.

    REMOVE BEFORE PRODUCTION.
    """

    try:

        result = (
            process_user_rank_achiever(
                db=db,
                user_id=current_user.id,
            )
        )

        return serialize_value(
            result
        )

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to process "
                "Rank Achiever."
            ),
        ) from exc


# ============================================================
# DEV: SIMULATE ELIGIBILITY
# ============================================================

@router.post(
    "/dev/simulate",
)
def dev_simulate_rank_achiever(
    team_members: int,
    wallet_balance: Decimal,

    current_user: User = Depends(
        get_current_user
    ),
):
    """
    DEVELOPMENT ONLY.

    Simulates Rank Achiever eligibility.

    DOES NOT:
    - modify database
    - modify wallet
    - create payout
    - create ledger transaction
    """

    if team_members < 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "team_members cannot "
                "be negative."
            ),
        )


    if wallet_balance < 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "wallet_balance cannot "
                "be negative."
            ),
        )


    simulated_wallet = money(
        wallet_balance
    )


    funds = []

    total_monthly_reward = Decimal(
        "0.00"
    )


    for rank_name in (
        RANK_ACHIEVER_CONFIG.keys()
    ):

        status = (
            calculate_fund_status(
                rank_name=rank_name,
                team_members=team_members,
                wallet_balance=simulated_wallet,
            )
        )


        if status[
            "eligible"
        ]:

            total_monthly_reward += (
                status[
                    "monthly_amount"
                ]
            )


        funds.append(
            {
                "rank":
                    rank_name,

                "fund_type":
                    status[
                        "fund_type"
                    ],

                "team_members":
                    team_members,

                "required_team_members":
                    status[
                        "required_team_members"
                    ],

                "team_requirement_met":
                    status[
                        "team_requirement_met"
                    ],

                "wallet_balance":
                    simulated_wallet,

                "required_wallet_balance":
                    status[
                        "required_wallet_balance"
                    ],

                "wallet_maintenance_met":
                    status[
                        "wallet_maintenance_met"
                    ],

                "monthly_amount":
                    status[
                        "monthly_amount"
                    ],

                "is_eligible":
                    status[
                        "eligible"
                    ],
            }
        )


    return {
        "success": True,

        "simulation_only": True,

        "team_members":
            team_members,

        "wallet_balance":
            simulated_wallet,

        "eligible_funds":
            sum(
                1
                for fund in funds
                if fund[
                    "is_eligible"
                ]
            ),

        "total_monthly_reward":
            money(
                total_monthly_reward
            ),

        "funds":
            funds,
    }


# ============================================================
# DEV: CONTROLLED ACTUAL CREDIT TEST
# ============================================================

@router.post(
    "/dev/test-credit",
)
def dev_test_rank_achiever_credit(
    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    """
    DEVELOPMENT ONLY.

    Simulates:
        Team Members = 300
        Eligibility Wallet = $100

    Credits actual:
        Emerald
        Business Development Fund
        $50

    REMOVE BEFORE PRODUCTION.
    """

    try:

        simulated_team_members = 300

        simulated_eligibility_wallet = Decimal(
            "100.00"
        )

        test_rank = "Emerald"


        wallet = (
            get_or_create_income_wallet(
                db=db,
                user_id=current_user.id,
            )
        )


        actual_wallet_before = money(
            wallet.balance
        )


        result = (
            process_single_fund(
                db=db,

                user=current_user,

                rank_name=test_rank,

                team_members=(
                    simulated_team_members
                ),

                wallet=wallet,

                eligibility_wallet_balance=(
                    simulated_eligibility_wallet
                ),
            )
        )


        db.commit()

        db.refresh(
            wallet
        )


        actual_wallet_after = money(
            wallet.balance
        )


        return serialize_value(
            {
                "success": True,

                "development_test":
                    True,

                "warning":
                    (
                        "This endpoint performs "
                        "a real Income Wallet credit."
                    ),

                "simulated_conditions": {
                    "rank":
                        test_rank,

                    "team_members":
                        simulated_team_members,

                    "eligibility_wallet_balance":
                        simulated_eligibility_wallet,
                },

                "actual_wallet_before":
                    actual_wallet_before,

                "actual_wallet_after":
                    actual_wallet_after,

                "result":
                    result,
            }
        )


    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Rank Achiever controlled "
                "credit test failed."
            ),
        ) from exc


# ============================================================
# DEV: CLEANUP CONTROLLED TEST CREDIT
# ============================================================

@router.delete(
    "/dev/cleanup-test-credit",
)
def dev_cleanup_rank_achiever_test_credit(
    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    ),
):
    """
    DEVELOPMENT ONLY.

    Safely removes the controlled Emerald
    Rank Achiever test credit.

    It verifies:
        Rank = Emerald
        Fund = Business Development Fund
        Team snapshot = 300
        Wallet snapshot = $100
        Amount = $50
        Ledger income_type = rank_achiever
        Ledger reference_type = rank_achiever_fund

    Then:
        - reverses wallet balance
        - reverses wallet total_earned
        - deletes linked ledger row
        - deletes payout row
        - repairs RankAchiever total_paid
        - repairs last_payout_date

    It does NOT touch any other income.

    REMOVE BEFORE PRODUCTION.
    """

    try:

        test_rank = "Emerald"

        test_fund = (
            "Business Development Fund"
        )

        test_team_members = 300

        test_wallet_snapshot = money(
            Decimal("100.00")
        )

        test_amount = money(
            Decimal("50.00")
        )


        # ====================================================
        # FIND EXACT TEST PAYOUT
        # ====================================================

        payout = (
            db.query(
                RankAchieverPayout
            )
            .filter(
                RankAchieverPayout.user_id
                == current_user.id,

                RankAchieverPayout.rank_name
                == test_rank,

                RankAchieverPayout.fund_type
                == test_fund,

                RankAchieverPayout.team_members
                == test_team_members,

                RankAchieverPayout.status
                == RANK_ACHIEVER_STATUS_CREDITED,
            )
            .order_by(
                RankAchieverPayout.id.desc()
            )
            .first()
        )


        if not payout:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Controlled Rank Achiever "
                    "test payout was not found."
                ),
            )


        # ====================================================
        # VERIFY PAYOUT VALUES
        # ====================================================

        if (
            money(
                payout.amount
            )
            != test_amount
        ):

            raise HTTPException(
                status_code=409,
                detail=(
                    "Payout amount does not "
                    "match controlled test data."
                ),
            )


        if (
            money(
                payout.wallet_balance
            )
            != test_wallet_snapshot
        ):

            raise HTTPException(
                status_code=409,
                detail=(
                    "Payout wallet snapshot "
                    "does not match controlled "
                    "test data."
                ),
            )


        # ====================================================
        # FIND LINKED LEDGER TRANSACTION
        # ====================================================

        transaction = (
            db.query(
                IncomeWalletTransaction
            )
            .filter(
                IncomeWalletTransaction.user_id
                == current_user.id,

                IncomeWalletTransaction.income_type
                == RANK_ACHIEVER_INCOME_TYPE,

                IncomeWalletTransaction.reference_type
                == RANK_ACHIEVER_REFERENCE_TYPE,

                IncomeWalletTransaction.reference_id
                == payout.id,

                IncomeWalletTransaction.status
                == RANK_ACHIEVER_STATUS_CREDITED,
            )
            .first()
        )


        if not transaction:

            raise HTTPException(
                status_code=409,
                detail=(
                    "Linked Rank Achiever "
                    "wallet transaction "
                    "was not found."
                ),
            )


        if (
            money(
                transaction.amount
            )
            != test_amount
        ):

            raise HTTPException(
                status_code=409,
                detail=(
                    "Ledger amount does not "
                    "match controlled test data."
                ),
            )


        # ====================================================
        # GET ACTUAL WALLET
        # ====================================================

        wallet = (
            get_or_create_income_wallet(
                db=db,
                user_id=current_user.id,
            )
        )


        wallet_balance_before = money(
            wallet.balance
        )

        total_earned_before = money(
            wallet.total_earned
        )


        # ====================================================
        # SAFETY CHECK
        # ====================================================

        if (
            wallet_balance_before
            < test_amount
        ):

            raise HTTPException(
                status_code=409,
                detail=(
                    "Wallet balance is lower "
                    "than the test credit. "
                    "Cleanup stopped."
                ),
            )


        if (
            total_earned_before
            < test_amount
        ):

            raise HTTPException(
                status_code=409,
                detail=(
                    "Wallet total_earned is "
                    "lower than the test credit. "
                    "Cleanup stopped."
                ),
            )


        # ====================================================
        # REVERSE WALLET
        # ====================================================

        wallet_balance_after = money(
            wallet_balance_before
            - test_amount
        )

        total_earned_after = money(
            total_earned_before
            - test_amount
        )


        wallet.balance = (
            wallet_balance_after
        )

        wallet.total_earned = (
            total_earned_after
        )


        # ====================================================
        # GET RANK ACHIEVER STATUS RECORD
        # ====================================================

        rank_record = (
            db.query(
                RankAchiever
            )
            .filter(
                RankAchiever.user_id
                == current_user.id,

                RankAchiever.rank_name
                == test_rank,
            )
            .first()
        )


        if rank_record:

            current_total_paid = money(
                rank_record.total_paid
            )


            new_total_paid = money(
                current_total_paid
                - test_amount
            )


            # Never allow negative
            # historical total.
            if (
                new_total_paid
                < Decimal("0.00")
            ):
                new_total_paid = Decimal(
                    "0.00"
                )


            rank_record.total_paid = (
                new_total_paid
            )


            # Find previous payout excluding
            # the test payout being deleted.
            previous_payout = (
                db.query(
                    RankAchieverPayout
                )
                .filter(
                    RankAchieverPayout.user_id
                    == current_user.id,

                    RankAchieverPayout.rank_name
                    == test_rank,

                    RankAchieverPayout.status
                    == RANK_ACHIEVER_STATUS_CREDITED,

                    RankAchieverPayout.id
                    != payout.id,
                )
                .order_by(
                    RankAchieverPayout.payout_date.desc(),
                    RankAchieverPayout.id.desc(),
                )
                .first()
            )


            rank_record.last_payout_date = (
                previous_payout.payout_date
                if previous_payout
                else None
            )


        # ====================================================
        # SAVE IDs BEFORE DELETE
        # ====================================================

        deleted_payout_id = (
            payout.id
        )

        deleted_transaction_id = (
            transaction.id
        )


        # ====================================================
        # DELETE TEST LEDGER + PAYOUT
        # ====================================================

        db.delete(
            transaction
        )

        db.delete(
            payout
        )


        db.flush()

        db.commit()


        # ====================================================
        # REFRESH WALLET
        # ====================================================

        db.refresh(
            wallet
        )


        return serialize_value(
            {
                "success": True,

                "development_cleanup":
                    True,

                "message":
                    (
                        "Controlled Rank Achiever "
                        "test credit removed "
                        "successfully."
                    ),

                "deleted": {
                    "payout_id":
                        deleted_payout_id,

                    "transaction_id":
                        deleted_transaction_id,

                    "rank":
                        test_rank,

                    "fund_type":
                        test_fund,

                    "amount":
                        test_amount,
                },

                "wallet": {
                    "balance_before":
                        wallet_balance_before,

                    "balance_after":
                        money(
                            wallet.balance
                        ),

                    "total_earned_before":
                        total_earned_before,

                    "total_earned_after":
                        money(
                            wallet.total_earned
                        ),
                },
            }
        )


    except HTTPException:

        db.rollback()

        raise


    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to safely clean "
                "Rank Achiever test credit."
            ),
        ) from exc