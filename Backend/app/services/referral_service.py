from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy.orm import Session

from app.models.user import User

from app.models.subscription import (
    SubscriptionCycle,
    SubscriptionTransaction,
)

from app.models.income_wallet import (
    IncomeWallet,
)

from app.models.referral_income import (
    ReferralIncome,
)


# =========================================================
# REFERRAL BUSINESS RULES
# =========================================================

FIRST_SUBSCRIPTION_RATE = Decimal("10.00")

UPGRADE_RATE = Decimal("5.00")


# =========================================================
# MONEY HELPER
# =========================================================

def money(value) -> Decimal:
    """
    Convert monetary value safely to 2 decimal places.
    """

    return Decimal(
        str(value or 0)
    ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


# =========================================================
# CALCULATE PERCENTAGE
# =========================================================

def calculate_percentage(
    amount: Decimal,
    percentage: Decimal,
) -> Decimal:

    return money(
        amount
        * percentage
        / Decimal("100")
    )


# =========================================================
# GET DIRECT UPLINE
# =========================================================

def get_direct_upline(
    db: Session,
    source_user: User,
):
    """
    Find direct upline using source_user.referred_by.

    Example:

        A referral_id = APH11111111

        B joined using A's referral link.

        B.referred_by = APH11111111

        Therefore:
            B's direct upline = A
    """

    referred_by = getattr(
        source_user,
        "referred_by",
        None,
    )

    if not referred_by:
        return None


    referred_by = str(
        referred_by
    ).strip()


    if not referred_by:
        return None


    # -----------------------------------------------------
    # APH5555 = platform/default referral.
    #
    # No normal user referral commission is generated.
    # -----------------------------------------------------

    if (
        referred_by.upper()
        == "APH5555"
    ):
        return None


    # -----------------------------------------------------
    # First try referral_id
    # -----------------------------------------------------

    upline = (
        db.query(User)
        .filter(
            User.referral_id
            == referred_by
        )
        .first()
    )


    # -----------------------------------------------------
    # Fallback for older records using customer_id
    # -----------------------------------------------------

    if not upline:

        upline = (
            db.query(User)
            .filter(
                User.customer_id
                == referred_by
            )
            .first()
        )


    return upline


# =========================================================
# GET UPLINE ACTIVE SUBSCRIPTION
# =========================================================

def get_upline_active_subscription(
    db: Session,
    upline_user_id: int,
):
    """
    Return upline's current ACTIVE subscription cycle.

    Referral first-purchase calculation uses the
    LOWER amount between:

        1. Upline's active package amount
        2. Referred user's first subscription amount

    Example:

        A = $100
        B = $50

        referral base = $50

        10% = $5
    """

    return (
        db.query(
            SubscriptionCycle
        )
        .filter(
            SubscriptionCycle.user_id
            == upline_user_id,

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
# GET UPLINE ACTIVE PACKAGE AMOUNT
# =========================================================

def get_upline_active_package_amount(
    db: Session,
    upline_user_id: int,
) -> Decimal:
    """
    Return upline's active package amount.

    If upline has no active subscription,
    return $0.
    """

    upline_cycle = (
        get_upline_active_subscription(
            db=db,
            upline_user_id=(
                upline_user_id
            ),
        )
    )


    if not upline_cycle:
        return Decimal("0.00")


    upline_amount = money(
        upline_cycle.current_amount
    )


    if (
        upline_amount
        <= Decimal("0.00")
    ):
        return Decimal("0.00")


    return upline_amount


# =========================================================
# GET OR CREATE INCOME WALLET
# =========================================================

def get_or_create_income_wallet(
    db: Session,
    user_id: int,
) -> IncomeWallet:

    wallet = (
        db.query(
            IncomeWallet
        )
        .filter(
            IncomeWallet.user_id
            == user_id
        )
        .first()
    )


    if wallet:
        return wallet


    wallet = IncomeWallet(

        user_id=user_id,

        balance=Decimal(
            "0.00"
        ),

        total_earned=Decimal(
            "0.00"
        ),

        total_withdrawn=Decimal(
            "0.00"
        ),
    )


    db.add(
        wallet
    )


    # -----------------------------------------------------
    # Make wallet available in current DB transaction.
    #
    # This does NOT commit.
    # -----------------------------------------------------

    db.flush()


    return wallet


# =========================================================
# CHECK FIRST-EVER SUBSCRIPTION
# =========================================================

def is_first_ever_subscription(
    db: Session,
    source_user_id: int,
    current_transaction_id: int,
) -> bool:
    """
    10% referral bonus is allowed ONLY on the user's
    first-ever approved subscription.

    Repurchase/resubscribe is NEVER considered a
    first subscription.
    """

    previous_approved_subscription = (

        db.query(
            SubscriptionTransaction
        )

        .filter(

            SubscriptionTransaction.user_id
            == source_user_id,

            SubscriptionTransaction.status
            == "approved",

            SubscriptionTransaction.id
            != current_transaction_id,
        )

        .first()
    )


    return (
        previous_approved_subscription
        is None
    )


# =========================================================
# FIRST SUBSCRIPTION REFERRAL BASE
# =========================================================

def get_first_subscription_referral_base(
    db: Session,
    upline: User,
    referred_subscription_amount: Decimal,
) -> Decimal:
    """
    FIRST SUBSCRIPTION REFERRAL RULE

    Referral Base =
        LOWER OF:

        A) Upline's current active subscription
        B) Referred user's first subscription


    Examples
    --------

    A = $100
    B = $50

    Base = $50
    10% = $5


    A = $50
    B = $100

    Base = $50
    10% = $5


    A = $100
    B = $100

    Base = $100
    10% = $10
    """

    referred_amount = money(
        referred_subscription_amount
    )


    if (
        referred_amount
        <= Decimal("0.00")
    ):
        return Decimal("0.00")


    # -----------------------------------------------------
    # Get A's ACTIVE subscription amount
    # -----------------------------------------------------

    upline_amount = (
        get_upline_active_package_amount(
            db=db,
            upline_user_id=upline.id,
        )
    )


    # -----------------------------------------------------
    # No active package on upline = no referral base
    # -----------------------------------------------------

    if (
        upline_amount
        <= Decimal("0.00")
    ):
        return Decimal("0.00")


    # -----------------------------------------------------
    # LOWER OF BOTH AMOUNTS
    # -----------------------------------------------------

    referral_base = min(
        upline_amount,
        referred_amount,
    )


    return money(
        referral_base
    )


# =========================================================
# PROCESS REFERRAL INCOME
# =========================================================

def process_referral_income(
    db: Session,
    source_user: User,
    subscription_transaction: SubscriptionTransaction,
    subscription_cycle: SubscriptionCycle,
):
    """
    ======================================================
    APH REFERRAL RULES
    ======================================================


    1. FIRST-EVER SUBSCRIPTION
    --------------------------

    Direct upline receives 10%.

    BUT referral is calculated on LOWER amount between:

        Upline active subscription
        VS
        Referred user's first subscription.


    Example:

        A package = $100
        B first subscription = $50

        Base = $50

        Referral =
            $50 x 10%
            = $5


    Example:

        A package = $50
        B first subscription = $100

        Base = $50

        Referral =
            $50 x 10%
            = $5


    Example:

        A package = $100
        B first subscription = $100

        Base = $100

        Referral =
            $100 x 10%
            = $10


    2. ACTIVE PACKAGE UPGRADE
    --------------------------

    Direct upline receives:

        5% of ONLY the amount being added.

    Example:

        B existing package = $100
        B adds = $50

        Referral =
            $50 x 5%
            = $2.50


    3. RESUBSCRIBE / REPURCHASE
    ----------------------------

    NO referral income.

    When old earning cycle expires after
    applicable 10X / 2.5X condition and
    user purchases a new cycle:

        Referral = $0


    ======================================================
    IMPORTANT
    ======================================================

    This function DOES NOT commit.

    Caller commits:

        Subscription
        +
        Referral ledger
        +
        Income wallet

    together in ONE database transaction.
    """


    # =====================================================
    # SAFETY
    # =====================================================

    if not source_user:
        return None


    if not subscription_transaction:
        return None


    if not subscription_cycle:
        return None


    if (
        subscription_transaction.status
        != "approved"
    ):
        return None


    # =====================================================
    # PREVENT DUPLICATE REFERRAL CREDIT
    # =====================================================

    existing_referral = (

        db.query(
            ReferralIncome
        )

        .filter(
            ReferralIncome
            .subscription_transaction_id
            == subscription_transaction.id
        )

        .first()
    )


    if existing_referral:
        return existing_referral


    # =====================================================
    # TRANSACTION TYPE
    # =====================================================

    transaction_type = str(
        subscription_transaction
        .transaction_type
    ).lower()


    # =====================================================
    # RESUBSCRIBE = ZERO REFERRAL
    # =====================================================

    if (
        transaction_type
        == "resubscribe"
    ):

        return None


    # =====================================================
    # ONLY NEW / UPGRADE SUPPORTED
    # =====================================================

    if transaction_type not in (
        "new",
        "upgrade",
    ):
        return None


    # =====================================================
    # DIRECT UPLINE
    # =====================================================

    upline = get_direct_upline(
        db=db,
        source_user=source_user,
    )


    if not upline:
        return None


    # -----------------------------------------------------
    # Never credit referral from own transaction
    # -----------------------------------------------------

    if (
        upline.id
        == source_user.id
    ):
        return None


    # =====================================================
    # TRANSACTION AMOUNT
    # =====================================================

    transaction_amount = money(
        subscription_transaction.amount
    )


    if (
        transaction_amount
        <= Decimal("0.00")
    ):
        return None


    # =====================================================
    # CASE 1:
    # FIRST-EVER SUBSCRIPTION
    # =====================================================

    if (
        transaction_type
        == "new"
    ):

        # -------------------------------------------------
        # Must actually be user's first-ever approved
        # subscription transaction.
        # -------------------------------------------------

        if not is_first_ever_subscription(

            db=db,

            source_user_id=(
                source_user.id
            ),

            current_transaction_id=(
                subscription_transaction.id
            ),

        ):

            return None


        percentage = (
            FIRST_SUBSCRIPTION_RATE
        )


        income_type = (
            "first_subscription"
        )


        # -------------------------------------------------
        # IMPORTANT NEW RULE
        #
        # LOWER OF:
        #
        # Upline active package
        # VS
        # referred user's first package
        # -------------------------------------------------

        base_amount = (
            get_first_subscription_referral_base(

                db=db,

                upline=upline,

                referred_subscription_amount=(
                    transaction_amount
                ),
            )
        )


    # =====================================================
    # CASE 2:
    # ACTIVE SUBSCRIPTION UPGRADE
    # =====================================================

    elif (
        transaction_type
        == "upgrade"
    ):

        percentage = (
            UPGRADE_RATE
        )


        income_type = (
            "upgrade"
        )


        # -------------------------------------------------
        # Current confirmed upgrade rule:
        #
        # 5% is calculated ONLY on amount added.
        #
        # Example:
        #
        # Existing = $100
        # Add      = $50
        #
        # Base = $50
        # Referral = $2.50
        # -------------------------------------------------

        base_amount = (
            transaction_amount
        )


    else:

        return None


    # =====================================================
    # ZERO BASE = NO REFERRAL
    # =====================================================

    base_amount = money(
        base_amount
    )


    if (
        base_amount
        <= Decimal("0.00")
    ):
        return None


    # =====================================================
    # CALCULATE REFERRAL AMOUNT
    # =====================================================

    referral_amount = (
        calculate_percentage(

            amount=(
                base_amount
            ),

            percentage=(
                percentage
            ),
        )
    )


    if (
        referral_amount
        <= Decimal("0.00")
    ):
        return None


    # =====================================================
    # CREATE REFERRAL LEDGER ENTRY
    # =====================================================

    referral_income = (
        ReferralIncome(

            # -----------------------------------------
            # A = person receiving income
            # -----------------------------------------

            beneficiary_user_id=(
                upline.id
            ),

            # -----------------------------------------
            # B = person whose subscription generated
            # the referral income
            # -----------------------------------------

            source_user_id=(
                source_user.id
            ),

            # -----------------------------------------
            # Subscription transaction reference
            # -----------------------------------------

            subscription_transaction_id=(
                subscription_transaction.id
            ),

            # -----------------------------------------
            # Subscription cycle reference
            # -----------------------------------------

            subscription_cycle_id=(
                subscription_cycle.id
            ),

            # -----------------------------------------
            # first_subscription / upgrade
            # -----------------------------------------

            income_type=(
                income_type
            ),

            # -----------------------------------------
            # Actual amount referral calculated on
            # -----------------------------------------

            base_amount=(
                base_amount
            ),

            # -----------------------------------------
            # 10.00 / 5.00
            # -----------------------------------------

            percentage=(
                percentage
            ),

            # -----------------------------------------
            # Final referral earning
            # -----------------------------------------

            referral_amount=(
                referral_amount
            ),

            status="credited",
        )
    )


    db.add(
        referral_income
    )


    # =====================================================
    # GET / CREATE UPLINE INCOME WALLET
    # =====================================================

    wallet = (
        get_or_create_income_wallet(

            db=db,

            user_id=(
                upline.id
            ),
        )
    )


    # =====================================================
    # CREDIT WALLET BALANCE
    # =====================================================

    wallet.balance = money(

        money(
            wallet.balance
        )

        +

        referral_amount
    )


    # =====================================================
    # UPDATE TOTAL EARNED
    # =====================================================

    wallet.total_earned = money(

        money(
            wallet.total_earned
        )

        +

        referral_amount
    )


    # =====================================================
    # FLUSH
    #
    # NO COMMIT HERE.
    # Subscription API performs final commit.
    # =====================================================

    db.flush()


    return referral_income