from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction

from app.models.rank_achiever import (
    RankAchiever,
    RankAchieverPayout,
)

from app.services.rank_achiever_config import (
    RANK_ACHIEVER_CONFIG,
    RANK_ACHIEVER_INCOME_TYPE,
    RANK_ACHIEVER_REFERENCE_TYPE,
    RANK_ACHIEVER_STATUS_CREDITED,
    MONEY_ZERO,
    money,
)


# ============================================================
# BUSINESS TIMEZONE
# ============================================================

BUSINESS_TIMEZONE = ZoneInfo(
    "Asia/Kolkata"
)


def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(
        tzinfo=None
    )


def get_business_now():
    return datetime.now(
        BUSINESS_TIMEZONE
    )


def get_business_date():
    return get_business_now().date()


# ============================================================
# GET / CREATE INCOME WALLET
# ============================================================

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


# ============================================================
# ENABLED USERS
# ============================================================

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


# ============================================================
# BUILD REFERRAL TREE
# ============================================================

def build_referral_tree(
    users: list[User],
) -> dict[int, list[User]]:
    """
    Current APH referral structure:

        sponsor.referral_id
                ↓
        child.referred_by

    Returns:
        {
            sponsor_user_id: [
                direct_child_1,
                direct_child_2,
                ...
            ]
        }
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


    children_map: dict[
        int,
        list[User]
    ] = defaultdict(list)


    for user in users:

        referred_by = (
            user.referred_by or ""
        ).strip()

        if not referred_by:
            continue

        sponsor = referral_owner.get(
            referred_by
        )

        if not sponsor:
            continue

        # Safety:
        # user cannot be his own child.
        if sponsor.id == user.id:
            continue

        children_map[
            sponsor.id
        ].append(user)


    return dict(
        children_map
    )


# ============================================================
# COMPLETE TEAM COUNT
# ============================================================

def count_team_members(
    user_id: int,
    children_map: dict[
        int,
        list[User]
    ],
) -> int:
    """
    Count complete downline.

    User himself is NOT counted.

    Example:

        A
        ├── B
        │   ├── X
        │   └── Y
        └── C
            └── Z

    A team = 5
    B team = 2
    C team = 1
    """

    direct_children = (
        children_map.get(
            user_id,
            [],
        )
    )

    if not direct_children:
        return 0


    total = 0

    visited = {
        user_id
    }

    stack = list(
        direct_children
    )


    while stack:

        member = stack.pop()

        if member.id in visited:
            continue

        visited.add(
            member.id
        )

        total += 1


        children = (
            children_map.get(
                member.id,
                [],
            )
        )

        stack.extend(
            children
        )


    return total


# ============================================================
# GET RANK ACHIEVER STATUS RECORD
# ============================================================

def get_rank_achiever_record(
    db: Session,
    user_id: int,
    rank_name: str,
) -> RankAchiever | None:

    return (
        db.query(RankAchiever)
        .filter(
            RankAchiever.user_id
            == user_id,

            RankAchiever.rank_name
            == rank_name,
        )
        .first()
    )


# ============================================================
# GET / CREATE STATUS RECORD
# ============================================================

def get_or_create_rank_achiever_record(
    db: Session,
    user: User,
    rank_name: str,
    team_members: int,
    wallet_balance: Decimal,
    eligible: bool,
) -> RankAchiever:

    config = (
        RANK_ACHIEVER_CONFIG[
            rank_name
        ]
    )


    record = (
        get_rank_achiever_record(
            db=db,
            user_id=user.id,
            rank_name=rank_name,
        )
    )


    now = utc_now()


    if not record:

        record = RankAchiever(
            user_id=user.id,

            rank_name=rank_name,

            fund_type=config[
                "fund_type"
            ],

            required_team_members=int(
                config[
                    "required_team_members"
                ]
            ),

            team_members=team_members,

            required_wallet_balance=money(
                config[
                    "required_wallet_balance"
                ]
            ),

            maintained_wallet_balance=money(
                wallet_balance
            ),

            monthly_amount=money(
                config[
                    "monthly_amount"
                ]
            ),

            is_eligible=(
                1 if eligible else 0
            ),

            eligible_at=(
                now
                if eligible
                else None
            ),

            total_paid=MONEY_ZERO,

            created_at=now,
            updated_at=now,
        )

        db.add(record)
        db.flush()

        return record


    # ========================================================
    # UPDATE LIVE STATUS
    # ========================================================

    was_eligible = bool(
        record.is_eligible
    )


    record.fund_type = (
        config["fund_type"]
    )

    record.required_team_members = int(
        config[
            "required_team_members"
        ]
    )

    record.required_wallet_balance = money(
        config[
            "required_wallet_balance"
        ]
    )

    record.monthly_amount = money(
        config[
            "monthly_amount"
        ]
    )


    record.team_members = (
        team_members
    )

    record.maintained_wallet_balance = money(
        wallet_balance
    )


    record.is_eligible = (
        1 if eligible else 0
    )


    # First time / newly eligible again.
    if (
        eligible
        and not was_eligible
    ):
        record.eligible_at = now


    record.updated_at = now

    db.flush()

    return record


# ============================================================
# CHECK MONTHLY PAYOUT
# ============================================================

def get_monthly_payout(
    db: Session,
    user_id: int,
    rank_name: str,
    year: int,
    month: int,
) -> RankAchieverPayout | None:

    return (
        db.query(
            RankAchieverPayout
        )
        .filter(
            RankAchieverPayout.user_id
            == user_id,

            RankAchieverPayout.rank_name
            == rank_name,

            RankAchieverPayout.payout_year
            == year,

            RankAchieverPayout.payout_month
            == month,

            RankAchieverPayout.status
            == RANK_ACHIEVER_STATUS_CREDITED,
        )
        .first()
    )


# ============================================================
# CHECK SINGLE FUND LIVE STATUS
# ============================================================

def calculate_fund_status(
    rank_name: str,
    team_members: int,
    wallet_balance: Decimal,
) -> dict:

    config = (
        RANK_ACHIEVER_CONFIG[
            rank_name
        ]
    )


    required_team = int(
        config[
            "required_team_members"
        ]
    )

    required_wallet = money(
        config[
            "required_wallet_balance"
        ]
    )

    monthly_amount = money(
        config[
            "monthly_amount"
        ]
    )


    current_wallet = money(
        wallet_balance
    )


    team_requirement_met = (
        team_members
        >= required_team
    )


    wallet_maintenance_met = (
        current_wallet
        >= required_wallet
    )


    eligible = (
        team_requirement_met
        and wallet_maintenance_met
    )


    return {
        "rank_name":
            rank_name,

        "fund_type":
            config[
                "fund_type"
            ],

        "required_team_members":
            required_team,

        "team_members":
            team_members,

        "team_requirement_met":
            team_requirement_met,

        "required_wallet_balance":
            required_wallet,

        "wallet_balance":
            current_wallet,

        "wallet_maintenance_met":
            wallet_maintenance_met,

        "monthly_amount":
            monthly_amount,

        "eligible":
            eligible,
    }


# ============================================================
# GET USER LIVE STATUS
# ============================================================

def get_user_rank_achiever_status(
    db: Session,
    user: User,
) -> dict:

    users = (
        get_enabled_users(
            db
        )
    )


    children_map = (
        build_referral_tree(
            users
        )
    )


    team_members = (
        count_team_members(
            user_id=user.id,
            children_map=children_map,
        )
    )


    wallet = (
        get_or_create_income_wallet(
            db=db,
            user_id=user.id,
        )
    )


    wallet_balance = money(
        wallet.balance
    )


    business_now = (
        get_business_now()
    )

    year = (
        business_now.year
    )

    month = (
        business_now.month
    )


    funds = []


    for (
        rank_name,
        config,
    ) in RANK_ACHIEVER_CONFIG.items():

        status = (
            calculate_fund_status(
                rank_name=rank_name,
                team_members=team_members,
                wallet_balance=wallet_balance,
            )
        )


        record = (
            get_or_create_rank_achiever_record(
                db=db,
                user=user,
                rank_name=rank_name,
                team_members=team_members,
                wallet_balance=wallet_balance,
                eligible=status[
                    "eligible"
                ],
            )
        )


        monthly_payout = (
            get_monthly_payout(
                db=db,
                user_id=user.id,
                rank_name=rank_name,
                year=year,
                month=month,
            )
        )


        funds.append(
            {
                "rank":
                    rank_name,

                "fund_type":
                    config[
                        "fund_type"
                    ],

                # Frontend compatibility.
                # Rank Achiever eligibility
                # is Team + Wallet.
                "rank_unlocked":
                    True,

                "required_team_members":
                    status[
                        "required_team_members"
                    ],

                "team_members":
                    team_members,

                "team_requirement_met":
                    status[
                        "team_requirement_met"
                    ],

                "required_wallet_balance":
                    status[
                        "required_wallet_balance"
                    ],

                "wallet_balance":
                    wallet_balance,

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

                "eligible_at":
                    record.eligible_at,

                "paid_this_month":
                    monthly_payout
                    is not None,

                "last_payout_date":
                    record.last_payout_date,

                "total_paid":
                    money(
                        record.total_paid
                    ),
            }
        )


    db.flush()


    return {
        "success": True,

        "team_members":
            team_members,

        "wallet_balance":
            wallet_balance,

        "payout_year":
            year,

        "payout_month":
            month,

        "funds":
            funds,
    }


# ============================================================
# PROCESS SINGLE FUND
# ============================================================

def process_single_fund(
    db: Session,
    user: User,
    rank_name: str,
    team_members: int,
    wallet: IncomeWallet,
    eligibility_wallet_balance: Decimal | None = None,
) -> dict:
    """
    Process one Rank Achiever fund.

    IMPORTANT:

    eligibility_wallet_balance
    is the wallet snapshot taken BEFORE
    any Rank Achiever rewards are credited
    during this processing run.

    This prevents a lower fund payout from
    artificially unlocking a higher fund
    in the same run.
    """

    if (
        rank_name
        not in
        RANK_ACHIEVER_CONFIG
    ):

        return {
            "success": False,
            "credited": False,
            "reason":
                "invalid_fund",
            "rank_name":
                rank_name,
        }


    config = (
        RANK_ACHIEVER_CONFIG[
            rank_name
        ]
    )


    # ========================================================
    # WALLET SNAPSHOT FOR ELIGIBILITY
    # ========================================================

    actual_wallet_balance = money(
        wallet.balance
    )


    if eligibility_wallet_balance is None:

        eligibility_wallet_balance = (
            actual_wallet_balance
        )


    eligibility_wallet_balance = money(
        eligibility_wallet_balance
    )


    # ========================================================
    # CALCULATE ELIGIBILITY USING SNAPSHOT
    # ========================================================

    status = (
        calculate_fund_status(
            rank_name=rank_name,
            team_members=team_members,
            wallet_balance=(
                eligibility_wallet_balance
            ),
        )
    )


    record = (
        get_or_create_rank_achiever_record(
            db=db,
            user=user,
            rank_name=rank_name,
            team_members=team_members,
            wallet_balance=(
                eligibility_wallet_balance
            ),
            eligible=status[
                "eligible"
            ],
        )
    )


    # ========================================================
    # NOT ELIGIBLE
    # ========================================================

    if not status[
        "eligible"
    ]:

        reason = (
            "team_and_wallet_not_met"
        )


        if (
            not status[
                "team_requirement_met"
            ]
            and status[
                "wallet_maintenance_met"
            ]
        ):

            reason = (
                "team_requirement_not_met"
            )


        elif (
            status[
                "team_requirement_met"
            ]
            and not status[
                "wallet_maintenance_met"
            ]
        ):

            reason = (
                "wallet_maintenance_not_met"
            )


        return {
            "success": True,

            "credited": False,

            "reason":
                reason,

            "rank_name":
                rank_name,

            "fund_type":
                config[
                    "fund_type"
                ],

            "team_members":
                team_members,

            "required_team_members":
                status[
                    "required_team_members"
                ],

            # This is the balance used
            # to determine eligibility.
            "wallet_balance":
                eligibility_wallet_balance,

            "eligibility_wallet_balance":
                eligibility_wallet_balance,

            "actual_wallet_balance":
                actual_wallet_balance,

            "required_wallet_balance":
                status[
                    "required_wallet_balance"
                ],
        }


    # ========================================================
    # CURRENT BUSINESS MONTH
    # ========================================================

    business_now = (
        get_business_now()
    )

    payout_date = (
        business_now.date()
    )

    payout_year = (
        business_now.year
    )

    payout_month = (
        business_now.month
    )


    # ========================================================
    # DUPLICATE PROTECTION
    # ========================================================

    existing_payout = (
        get_monthly_payout(
            db=db,
            user_id=user.id,
            rank_name=rank_name,
            year=payout_year,
            month=payout_month,
        )
    )


    if existing_payout:

        return {
            "success": True,

            "credited": False,

            "reason":
                "already_paid_this_month",

            "rank_name":
                rank_name,

            "fund_type":
                config[
                    "fund_type"
                ],

            "payout_id":
                existing_payout.id,

            "payout_date":
                existing_payout.payout_date,

            "amount":
                money(
                    existing_payout.amount
                ),

            "eligibility_wallet_balance":
                eligibility_wallet_balance,

            "actual_wallet_balance":
                actual_wallet_balance,
        }


    # ========================================================
    # CREDIT AMOUNT
    # ========================================================

    amount = money(
        config[
            "monthly_amount"
        ]
    )


    # ========================================================
    # CREATE PAYOUT
    # ========================================================

    payout = RankAchieverPayout(
        user_id=user.id,

        rank_achiever_id=record.id,

        rank_name=rank_name,

        fund_type=config[
            "fund_type"
        ],

        team_members=team_members,

        required_team_members=status[
            "required_team_members"
        ],

        # Store the actual eligibility snapshot,
        # not a wallet balance increased by
        # previous fund rewards.
        wallet_balance=(
            eligibility_wallet_balance
        ),

        required_wallet_balance=status[
            "required_wallet_balance"
        ],

        amount=amount,

        payout_year=payout_year,

        payout_month=payout_month,

        payout_date=payout_date,

        status=(
            RANK_ACHIEVER_STATUS_CREDITED
        ),
    )


    db.add(
        payout
    )

    db.flush()


    # ========================================================
    # CREDIT ACTUAL INCOME WALLET
    # ========================================================
    #
    # Unlike eligibility, ledger balances MUST use
    # the wallet's actual current balance.
    # ========================================================

    balance_before = money(
        wallet.balance
    )


    balance_after = money(
        balance_before
        + amount
    )


    wallet.balance = (
        balance_after
    )


    wallet.total_earned = money(
        money(
            wallet.total_earned
        )
        + amount
    )


    # ========================================================
    # UPDATE STATUS RECORD
    # ========================================================

    record.last_payout_date = (
        payout_date
    )


    record.total_paid = money(
        money(
            record.total_paid
        )
        + amount
    )


    record.updated_at = (
        utc_now()
    )


    db.flush()


    # ========================================================
    # COMMON INCOME WALLET LEDGER
    # ========================================================

    transaction = (
        IncomeWalletTransaction(
            user_id=user.id,

            income_type=(
                RANK_ACHIEVER_INCOME_TYPE
            ),

            amount=amount,

            balance_before=(
                balance_before
            ),

            balance_after=(
                balance_after
            ),

            reference_type=(
                RANK_ACHIEVER_REFERENCE_TYPE
            ),

            reference_id=(
                payout.id
            ),

            description=(
                f"{config['fund_type']} "
                f"- {rank_name} "
                f"- {payout_year}-"
                f"{payout_month:02d}"
            ),

            status=(
                RANK_ACHIEVER_STATUS_CREDITED
            ),
        )
    )


    db.add(
        transaction
    )

    db.flush()


    return {
        "success": True,

        "credited": True,

        "reason":
            "credited",

        "user_id":
            user.id,

        "rank_name":
            rank_name,

        "fund_type":
            config[
                "fund_type"
            ],

        "team_members":
            team_members,

        "required_team_members":
            status[
                "required_team_members"
            ],

        "required_wallet_balance":
            status[
                "required_wallet_balance"
            ],

        # Wallet used for eligibility
        "eligibility_wallet_balance":
            eligibility_wallet_balance,

        # Actual balance immediately
        # before this fund credit.
        "wallet_balance_before":
            balance_before,

        "monthly_amount":
            amount,

        "wallet_balance_after":
            balance_after,

        "payout_id":
            payout.id,

        "payout_date":
            payout_date,

        "payout_year":
            payout_year,

        "payout_month":
            payout_month,
    }


# ============================================================
# PROCESS USER
# ============================================================

def process_user_rank_achiever(
    db: Session,
    user_id: int,
) -> dict:

    users = (
        get_enabled_users(
            db
        )
    )


    user_map = {
        user.id: user
        for user in users
    }


    user = user_map.get(
        user_id
    )


    if not user:

        return {
            "success": False,

            "credited": False,

            "reason":
                "user_not_found_or_disabled",

            "user_id":
                user_id,
        }


    children_map = (
        build_referral_tree(
            users
        )
    )


    team_members = (
        count_team_members(
            user_id=user.id,
            children_map=children_map,
        )
    )


    wallet = (
        get_or_create_income_wallet(
            db=db,
            user_id=user.id,
        )
    )


    # ========================================================
    # IMPORTANT:
    # ONE WALLET SNAPSHOT FOR ALL FUNDS
    # ========================================================
    #
    # Example:
    #
    # Starting wallet = $480
    #
    # Emerald pays $50
    # Sapphire pays $100
    #
    # Actual wallet can become $630,
    # BUT Topaz still checks against $480.
    #
    # ========================================================

    eligibility_wallet_balance = money(
        wallet.balance
    )


    results = []


    try:

        for rank_name in (
            RANK_ACHIEVER_CONFIG.keys()
        ):

            result = (
                process_single_fund(
                    db=db,
                    user=user,
                    rank_name=rank_name,
                    team_members=team_members,
                    wallet=wallet,
                    eligibility_wallet_balance=(
                        eligibility_wallet_balance
                    ),
                )
            )

            results.append(
                result
            )


        db.commit()


    except Exception:

        db.rollback()

        raise


    credited_results = [
        result
        for result in results
        if result.get(
            "credited"
        )
    ]


    total_credited = sum(
        (
            money(
                result.get(
                    "monthly_amount",
                    MONEY_ZERO,
                )
            )
            for result
            in credited_results
        ),
        MONEY_ZERO,
    )


    return {
        "success": True,

        "user_id":
            user.id,

        "team_members":
            team_members,

        "eligibility_wallet_balance":
            eligibility_wallet_balance,

        "credited_count":
            len(
                credited_results
            ),

        "total_credited":
            money(
                total_credited
            ),

        "wallet_balance_after":
            money(
                wallet.balance
            ),

        "results":
            results,
    }


# ============================================================
# PROCESS ALL USERS
# ============================================================

def process_all_rank_achievers(
    db: Session,
) -> dict:

    users = (
        get_enabled_users(
            db
        )
    )


    children_map = (
        build_referral_tree(
            users
        )
    )


    results = []


    try:

        for user in users:

            team_members = (
                count_team_members(
                    user_id=user.id,
                    children_map=children_map,
                )
            )


            wallet = (
                get_or_create_income_wallet(
                    db=db,
                    user_id=user.id,
                )
            )


            # =================================================
            # ONE WALLET SNAPSHOT PER USER
            # =================================================

            eligibility_wallet_balance = money(
                wallet.balance
            )


            user_results = []


            for rank_name in (
                RANK_ACHIEVER_CONFIG.keys()
            ):

                result = (
                    process_single_fund(
                        db=db,
                        user=user,
                        rank_name=rank_name,
                        team_members=team_members,
                        wallet=wallet,
                        eligibility_wallet_balance=(
                            eligibility_wallet_balance
                        ),
                    )
                )

                user_results.append(
                    result
                )


            results.append(
                {
                    "user_id":
                        user.id,

                    "customer_id":
                        user.customer_id,

                    "team_members":
                        team_members,

                    "eligibility_wallet_balance":
                        eligibility_wallet_balance,

                    "wallet_balance_after":
                        money(
                            wallet.balance
                        ),

                    "results":
                        user_results,
                }
            )


        db.commit()


    except Exception:

        db.rollback()

        raise


    total_credited = (
        MONEY_ZERO
    )

    credited_count = 0


    for user_result in results:

        for result in (
            user_result[
                "results"
            ]
        ):

            if not result.get(
                "credited"
            ):
                continue


            credited_count += 1

            total_credited += money(
                result.get(
                    "monthly_amount"
                )
            )


    return {
        "success": True,

        "users_checked":
            len(users),

        "credited_count":
            credited_count,

        "total_credited":
            money(
                total_credited
            ),

        "results":
            results,
    }


# ============================================================
# PAYOUT HISTORY
# ============================================================

def get_user_rank_achiever_history(
    db: Session,
    user_id: int,
) -> list[RankAchieverPayout]:

    return (
        db.query(
            RankAchieverPayout
        )
        .filter(
            RankAchieverPayout.user_id
            == user_id,

            RankAchieverPayout.status
            == RANK_ACHIEVER_STATUS_CREDITED,
        )
        .order_by(
            RankAchieverPayout.created_at.desc()
        )
        .all()
    )