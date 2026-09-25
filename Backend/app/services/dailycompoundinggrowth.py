from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
from zoneinfo import ZoneInfo

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings

from app.models.user import User
from app.models.subscription import SubscriptionCycle
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction
from app.models.daily_compounding_growth import DailyCompoundingGrowth
from app.services.level_profit_service import process_level_profit


# =========================================================
# CONSTANTS
# =========================================================

ZERO = Decimal("0.00")

NON_WORKING_MULTIPLIER = Decimal("2.50")

MAX_WORKING_MULTIPLIER = Decimal("10.00")

DAILY_AD_LIMIT = 1


# =========================================================
# MONEY
# =========================================================

def money(value) -> Decimal:
    return Decimal(
        str(value or 0)
    ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


# =========================================================
# TIME
# =========================================================

def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(
        tzinfo=None
    )


def business_now():
    return datetime.now(
        ZoneInfo(
            settings.BUSINESS_TIMEZONE
        )
    )


# =========================================================
# CURRENT BUSINESS DAY -> UTC RANGE
#
# One-ad-per-day follows BUSINESS_TIMEZONE.
# Example:
# BUSINESS_TIMEZONE=Asia/Kolkata
#
# 00:00 IST -> next 00:00 IST
# converted to UTC for database comparison.
# =========================================================

def get_business_day_utc_range():

    local_now = business_now()

    local_start = local_now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    local_end = (
        local_start
        +
        timedelta(days=1)
    )

    utc_start = (
        local_start
        .astimezone(
            timezone.utc
        )
        .replace(
            tzinfo=None
        )
    )

    utc_end = (
        local_end
        .astimezone(
            timezone.utc
        )
        .replace(
            tzinfo=None
        )
    )

    return (
        utc_start,
        utc_end,
    )


# =========================================================
# ADS WINDOW
# =========================================================

def is_inside_ad_window() -> bool:

    now = business_now()

    start_hour = (
        settings.AD_WATCH_START_HOUR
    )

    end_hour = (
        settings.AD_WATCH_END_HOUR
    )

    return (
        start_hour
        <= now.hour
        < end_hour
    )


# =========================================================
# ACTIVE SUBSCRIPTION
# =========================================================

def get_active_subscription(
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
# WALLET
# =========================================================

def get_or_create_income_wallet(
    db: Session,
    user_id: int,
):

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
        balance=ZERO,
        total_earned=ZERO,
        total_withdrawn=ZERO,
    )

    db.add(
        wallet
    )

    db.flush()

    return wallet


# =========================================================
# DIRECT REFERRALS
# =========================================================

def get_direct_referral_count(
    db: Session,
    user: User,
) -> int:

    if not user.referral_id:
        return 0

    return (
        db.query(
            User
        )
        .filter(
            User.referred_by
            == user.referral_id
        )
        .count()
    )


# =========================================================
# DAILY RATE
#
# 0 - 3 = 2%
# 4 - 7 = 2.5%
# 8+    = 3%
# =========================================================

def get_daily_growth_percentage(
    direct_referrals: int,
) -> Decimal:

    if direct_referrals >= 8:
        return Decimal(
            "3.00"
        )

    if direct_referrals >= 4:
        return Decimal(
            "2.50"
        )

    return Decimal(
        "2.00"
    )


# =========================================================
# CATEGORY
# =========================================================

def get_earning_category(
    direct_referrals: int,
) -> str:

    if direct_referrals >= 10:
        return "working"

    return "non_working"


# =========================================================
# CURRENT MULTIPLIER
# =========================================================

def get_current_earning_multiplier(
    direct_referrals: int,
) -> Decimal:

    return NON_WORKING_MULTIPLIER


# =========================================================
# CYCLE CAP
# =========================================================

def get_cycle_max_earning(
    subscription_amount: Decimal,
    multiplier: Decimal,
) -> Decimal:

    return money(
        money(
            subscription_amount
        )
        *
        money(
            multiplier
        )
    )


def get_remaining_cycle_earning(
    cycle: SubscriptionCycle,
    multiplier: Decimal,
) -> Decimal:

    subscription_amount = money(
        cycle.current_amount
    )

    total_cycle_earnings = money(
        cycle.total_cycle_earnings
    )

    max_earning = (
        get_cycle_max_earning(
            subscription_amount,
            multiplier,
        )
    )

    remaining = money(
        max_earning
        -
        total_cycle_earnings
    )

    if remaining < ZERO:
        return ZERO

    return remaining


# =========================================================
# GROWTH CALCULATION
#
# Subscription + CURRENT Income Wallet
# =========================================================

def calculate_growth(
    subscription_amount: Decimal,
    wallet_balance: Decimal,
    direct_referrals: int,
):

    subscription_amount = money(
        subscription_amount
    )

    wallet_balance = money(
        wallet_balance
    )

    base_amount = money(
        subscription_amount
        +
        wallet_balance
    )

    percentage = (
        get_daily_growth_percentage(
            direct_referrals
        )
    )

    growth_amount = money(
        base_amount
        *
        percentage
        /
        Decimal("100")
    )

    return (
        base_amount,
        percentage,
        growth_amount,
    )


# =========================================================
# OPEN SESSION
#
# started   = ad currently running
# completed = watched, waiting for credit
# =========================================================

def get_open_ad_session(
    db: Session,
    user_id: int,
):

    return (
        db.query(
            DailyCompoundingGrowth
        )
        .filter(
            DailyCompoundingGrowth.user_id
            == user_id,

            DailyCompoundingGrowth.status.in_(
                [
                    "started",
                    "completed",
                ]
            ),
        )
        .order_by(
            DailyCompoundingGrowth
            .id
            .desc()
        )
        .first()
    )


# =========================================================
# TODAY'S AD SESSION
#
# ONE USER = ONE AD SESSION PER BUSINESS DAY
# =========================================================

def get_today_ad_session(
    db: Session,
    user_id: int,
):

    (
        utc_start,
        utc_end,
    ) = (
        get_business_day_utc_range()
    )

    return (
        db.query(
            DailyCompoundingGrowth
        )
        .filter(
            DailyCompoundingGrowth.user_id
            == user_id,

            DailyCompoundingGrowth.ad_started_at
            >= utc_start,

            DailyCompoundingGrowth.ad_started_at
            < utc_end,

            DailyCompoundingGrowth.status.in_(
                [
                    "started",
                    "completed",
                    "credited",
                ]
            ),
        )
        .order_by(
            DailyCompoundingGrowth
            .id
            .desc()
        )
        .first()
    )


# =========================================================
# TODAY'S COMPLETED ADS COUNT
#
# started   = 0/1
# completed = 1/1
# credited  = 1/1
#
# Maximum today = 1
# =========================================================

def get_today_ads_watched(
    db: Session,
    user_id: int,
) -> int:

    today_session = (
        get_today_ad_session(
            db=db,
            user_id=user_id,
        )
    )

    if not today_session:
        return 0

    if today_session.status in (
        "completed",
        "credited",
    ):
        return 1

    return 0


# =========================================================
# BACKWARDS COMPATIBLE
# =========================================================

def get_active_ad_session(
    db: Session,
    user_id: int,
):

    return get_open_ad_session(
        db=db,
        user_id=user_id,
    )


# =========================================================
# STATUS
# =========================================================

def get_compounding_status(
    db: Session,
    user: User,
):

    now = utc_now()

    cycle = (
        get_active_subscription(
            db=db,
            user_id=user.id,
        )
    )

    direct_count = (
        get_direct_referral_count(
            db=db,
            user=user,
        )
    )

    percentage = (
        get_daily_growth_percentage(
            direct_count
        )
    )

    category = (
        get_earning_category(
            direct_count
        )
    )

    multiplier = (
        get_current_earning_multiplier(
            direct_count
        )
    )


    # =====================================================
    # TODAY'S ADS WATCHED
    # =====================================================

    today_ads_watched = (
        get_today_ads_watched(
            db=db,
            user_id=user.id,
        )
    )


    # =====================================================
    # COMMON RESPONSE
    # =====================================================

    base_response = {

        "success":
            True,

        "subscription_active":
            cycle is not None,

        "ad_window": {

            "start":
                f"{settings.AD_WATCH_START_HOUR:02d}:00",

            "end":
                f"{settings.AD_WATCH_END_HOUR:02d}:00",
        },

        "inside_ad_window":
            is_inside_ad_window(),

        "direct_referral_count":
            direct_count,

        "growth_percentage":
            float(
                percentage
            ),

        "earning_category":
            category,

        "earning_multiplier":
            float(
                multiplier
            ),

        "ad_watch_seconds":
            settings.AD_WATCH_SECONDS,

        "credit_delay_minutes":
            settings
            .COMPOUNDING_CREDIT_DELAY_MINUTES,


        # =================================================
        # ADS WATCHING PROGRESS
        # =================================================

        "today_ads_watched":
            today_ads_watched,

        "daily_ad_limit":
            DAILY_AD_LIMIT,

        "ads_remaining_today":
            max(
                DAILY_AD_LIMIT
                -
                today_ads_watched,
                0,
            ),
    }


    # =====================================================
    # NO ACTIVE SUBSCRIPTION
    # =====================================================

    if not cycle:

        return {
            **base_response,

            "can_watch_ad":
                False,

            "reason":
                "subscription_inactive",

            "message":
                "An active subscription is required.",

            "active_session":
                False,

            "daily_ad_used":
                today_ads_watched
                >=
                DAILY_AD_LIMIT,

            "session":
                None,
        }


    # =====================================================
    # OPEN SESSION
    # =====================================================

    session = (
        get_open_ad_session(
            db=db,
            user_id=user.id,
        )
    )


    # =====================================================
    # AD CURRENTLY RUNNING
    # =====================================================

    if (
        session
        and
        session.status
        ==
        "started"
    ):

        watch_complete_at = (
            session.ad_started_at
            +
            timedelta(
                seconds=
                    settings
                    .AD_WATCH_SECONDS
            )
        )

        remaining_seconds = max(
            int(
                (
                    watch_complete_at
                    -
                    now
                )
                .total_seconds()
            ),
            0,
        )

        return {
            **base_response,

            "can_watch_ad":
                False,

            "reason":
                "ad_running",

            "message":
                "Advertisement is currently running.",

            "active_session":
                True,

            # Started does not count as successfully
            # watched yet.
            "daily_ad_used":
                True,

            "session": {

                "id":
                    session.id,

                "status":
                    session.status,

                "ad_started_at":
                    session.ad_started_at,

                "watch_complete_at":
                    watch_complete_at,

                "watch_remaining_seconds":
                    remaining_seconds,

                "eligible_at":
                    session.eligible_at,
            },
        }


    # =====================================================
    # AD COMPLETED - CREDIT PENDING
    # =====================================================

    if (
        session
        and
        session.status
        ==
        "completed"
    ):

        remaining_seconds = 0

        if session.eligible_at:

            remaining_seconds = max(
                int(
                    (
                        session.eligible_at
                        -
                        now
                    )
                    .total_seconds()
                ),
                0,
            )

        credit_ready = (
            session.eligible_at
            is not None
            and
            now
            >=
            session.eligible_at
        )

        return {
            **base_response,

            "can_watch_ad":
                False,

            "reason":
                (
                    "credit_ready"
                    if credit_ready
                    else
                    "credit_pending"
                ),

            "message":
                (
                    "Your compounding income is ready to be credited."
                    if credit_ready
                    else
                    "Ad completed. Compounding income is pending."
                ),

            "active_session":
                True,

            "daily_ad_used":
                True,

            "credit_ready":
                credit_ready,

            "session": {

                "id":
                    session.id,

                "status":
                    session.status,

                "ad_started_at":
                    session.ad_started_at,

                "ad_completed_at":
                    session.ad_completed_at,

                "eligible_at":
                    session.eligible_at,

                "credit_remaining_seconds":
                    remaining_seconds,
            },
        }


    # =====================================================
    # ONE AD PER DAY CHECK
    #
    # Mainly catches today's credited session.
    # =====================================================

    today_session = (
        get_today_ad_session(
            db=db,
            user_id=user.id,
        )
    )

    if today_session:

        return {
            **base_response,

            "can_watch_ad":
                False,

            "reason":
                "daily_ad_completed",

            "message":
                (
                    "You already watched today's ad. "
                    "Please come back tomorrow to watch your next ad."
                ),

            "active_session":
                False,

            "daily_ad_used":
                True,

            "session":
                None,
        }


    # =====================================================
    # OUTSIDE AD WINDOW
    # =====================================================

    if not is_inside_ad_window():

        return {
            **base_response,

            "can_watch_ad":
                False,

            "reason":
                "outside_ad_window",

            "message":
                (
                    "Ads are available between "
                    f"{settings.AD_WATCH_START_HOUR:02d}:00 "
                    "and "
                    f"{settings.AD_WATCH_END_HOUR:02d}:00."
                ),

            "active_session":
                False,

            "daily_ad_used":
                False,

            "session":
                None,
        }


    # =====================================================
    # CYCLE LIMIT
    # =====================================================

    remaining_cycle_earning = (
        get_remaining_cycle_earning(
            cycle=cycle,
            multiplier=multiplier,
        )
    )

    if (
        remaining_cycle_earning
        <=
        ZERO
    ):

        return {
            **base_response,

            "can_watch_ad":
                False,

            "reason":
                "cycle_limit_reached",

            "message":
                (
                    "Your current subscription cycle "
                    "has reached its earning limit."
                ),

            "active_session":
                False,

            "daily_ad_used":
                False,

            "session":
                None,
        }


    # =====================================================
    # AVAILABLE
    # =====================================================

    return {
        **base_response,

        "can_watch_ad":
            True,

        "reason":
            "available",

        "message":
            "Watch Ads & Earn is available.",

        "active_session":
            False,

        "daily_ad_used":
            False,

        "session":
            None,
    }


# =========================================================
# START AD
# =========================================================

def start_ad_session(
    db: Session,
    user: User,
):

    now = utc_now()


    # =====================================================
    # AD WINDOW
    # =====================================================

    if not is_inside_ad_window():

        raise HTTPException(
            status_code=400,
            detail=(
                "Ads are available between "
                f"{settings.AD_WATCH_START_HOUR:02d}:00 "
                "and "
                f"{settings.AD_WATCH_END_HOUR:02d}:00."
            ),
        )


    # =====================================================
    # ACTIVE SUBSCRIPTION
    # =====================================================

    cycle = (
        get_active_subscription(
            db=db,
            user_id=user.id,
        )
    )

    if not cycle:

        raise HTTPException(
            status_code=400,
            detail=(
                "An active subscription is required "
                "to watch ads."
            ),
        )


    subscription_amount = money(
        cycle.current_amount
    )

    if (
        subscription_amount
        <=
        ZERO
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Your active subscription amount "
                "must be greater than zero."
            ),
        )


    # =====================================================
    # EXISTING OPEN SESSION
    #
    # Refresh/reload must return same session.
    # =====================================================

    existing_session = (
        get_open_ad_session(
            db=db,
            user_id=user.id,
        )
    )

    if existing_session:

        return existing_session


    # =====================================================
    # ONE AD PER BUSINESS DAY
    #
    # Backend protection - cannot bypass from Postman,
    # browser devtools, frontend, etc.
    # =====================================================

    today_session = (
        get_today_ad_session(
            db=db,
            user_id=user.id,
        )
    )

    if today_session:

        raise HTTPException(
            status_code=400,
            detail=(
                "You already watched today's ad. "
                "Please come back tomorrow to watch your next ad."
            ),
        )


    # =====================================================
    # DIRECTS / RATE
    # =====================================================

    direct_count = (
        get_direct_referral_count(
            db=db,
            user=user,
        )
    )

    percentage = (
        get_daily_growth_percentage(
            direct_count
        )
    )

    category = (
        get_earning_category(
            direct_count
        )
    )

    multiplier = (
        get_current_earning_multiplier(
            direct_count
        )
    )


    # =====================================================
    # CYCLE CAP
    # =====================================================

    remaining_cycle_earning = (
        get_remaining_cycle_earning(
            cycle=cycle,
            multiplier=multiplier,
        )
    )

    if (
        remaining_cycle_earning
        <=
        ZERO
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Your current subscription cycle "
                "has reached its earning limit."
            ),
        )


    # =====================================================
    # CREATE SESSION
    # =====================================================

    session = DailyCompoundingGrowth(

        user_id=
            user.id,

        subscription_cycle_id=
            cycle.id,

        subscription_amount=
            subscription_amount,

        wallet_balance_before=
            ZERO,

        growth_base_amount=
            ZERO,

        direct_referral_count=
            direct_count,

        growth_percentage=
            percentage,

        growth_amount=
            ZERO,

        wallet_balance_after=
            ZERO,

        earning_category=
            category,

        earning_multiplier=
            multiplier,

        ads_completed=
            False,

        ad_started_at=
            now,

        ad_completed_at=
            None,

        eligible_at=
            None,

        status=
            "started",
    )


    db.add(
        session
    )

    db.commit()

    db.refresh(
        session
    )

    return session


# =========================================================
# FINISH AD WATCH
#
# NO MONEY CREDITED HERE.
#
# Once this succeeds:
# today_ads_watched becomes 1.
# =========================================================

def finish_ad_watch(
    db: Session,
    user: User,
    session_id: int,
):

    now = utc_now()

    try:

        session = (
            db.query(
                DailyCompoundingGrowth
            )
            .filter(
                DailyCompoundingGrowth.id
                ==
                session_id,

                DailyCompoundingGrowth.user_id
                ==
                user.id,
            )
            .with_for_update()
            .first()
        )


        if not session:

            raise HTTPException(
                status_code=404,
                detail=
                    "Ad session not found.",
            )


        # =================================================
        # IDEMPOTENT
        # =================================================

        if (
            session.status
            ==
            "completed"
        ):
            return session


        if (
            session.status
            ==
            "credited"
        ):
            return session


        if (
            session.status
            !=
            "started"
        ):

            raise HTTPException(
                status_code=400,
                detail=
                    "Invalid ad session status.",
            )


        # =================================================
        # SERVER WATCH TIME CHECK
        # =================================================

        watch_complete_at = (
            session.ad_started_at
            +
            timedelta(
                seconds=
                    settings
                    .AD_WATCH_SECONDS
            )
        )


        if (
            now
            <
            watch_complete_at
        ):

            remaining_seconds = max(
                int(
                    (
                        watch_complete_at
                        -
                        now
                    )
                    .total_seconds()
                ),
                0,
            )

            raise HTTPException(
                status_code=400,
                detail={

                    "message":
                        (
                            "Please complete the "
                            "advertisement before continuing."
                        ),

                    "remaining_seconds":
                        remaining_seconds,
                },
            )


        # =================================================
        # AD SUCCESSFULLY WATCHED
        # =================================================

        session.ads_completed = (
            True
        )

        session.ad_completed_at = (
            now
        )


        # =================================================
        # CREDIT DELAY
        #
        # DEV  = 5 minutes
        # PROD = 720 minutes / 12 hours
        # =================================================

        session.eligible_at = (
            now
            +
            timedelta(
                minutes=
                    settings
                    .COMPOUNDING_CREDIT_DELAY_MINUTES
            )
        )

        session.status = (
            "completed"
        )


        db.commit()

        db.refresh(
            session
        )

        return session


    except HTTPException:

        db.rollback()

        raise


    except Exception as exc:

        db.rollback()

        print(
            "Finish ad error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=
                "Unable to complete advertisement.",
        )


# =========================================================
# CREDIT COMPOUNDING
# =========================================================

def complete_ad_session(
    db: Session,
    user: User,
    session_id: int,
):

    now = utc_now()

    try:


        # =================================================
        # SESSION LOCK
        # =================================================

        session = (
            db.query(
                DailyCompoundingGrowth
            )
            .filter(
                DailyCompoundingGrowth.id
                ==
                session_id,

                DailyCompoundingGrowth.user_id
                ==
                user.id,
            )
            .with_for_update()
            .first()
        )


        if not session:

            raise HTTPException(
                status_code=404,
                detail=
                    "Ad session not found.",
            )


        # =================================================
        # DUPLICATE CREDIT PROTECTION
        # =================================================

        if (
            session.status
            ==
            "credited"
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Income for this ad session "
                    "has already been credited."
                ),
            )


        if (
            session.status
            !=
            "completed"
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Please complete the advertisement "
                    "before claiming income."
                ),
            )


        # =================================================
        # WAIT UNTIL ELIGIBLE
        # =================================================

        if (
            not session.eligible_at
            or
            now
            <
            session.eligible_at
        ):

            remaining_seconds = 0

            if session.eligible_at:

                remaining_seconds = max(
                    int(
                        (
                            session.eligible_at
                            -
                            now
                        )
                        .total_seconds()
                    ),
                    0,
                )


            raise HTTPException(
                status_code=400,
                detail={

                    "message":
                        "Compounding income is not ready yet.",

                    "eligible_at":
                        (
                            session
                            .eligible_at
                            .isoformat()
                            if session.eligible_at
                            else None
                        ),

                    "remaining_seconds":
                        remaining_seconds,
                },
            )


        # =================================================
        # ACTIVE CYCLE
        # =================================================

        cycle = (
            db.query(
                SubscriptionCycle
            )
            .filter(
                SubscriptionCycle.id
                ==
                session.subscription_cycle_id,

                SubscriptionCycle.user_id
                ==
                user.id,

                SubscriptionCycle.status
                ==
                "active",
            )
            .with_for_update()
            .first()
        )


        if not cycle:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Your subscription cycle "
                    "is no longer active."
                ),
            )


        # =================================================
        # WALLET LOCK
        # =================================================

        wallet = (
            db.query(
                IncomeWallet
            )
            .filter(
                IncomeWallet.user_id
                ==
                user.id
            )
            .with_for_update()
            .first()
        )


        if not wallet:

            wallet = IncomeWallet(

                user_id=
                    user.id,

                balance=
                    ZERO,

                total_earned=
                    ZERO,

                total_withdrawn=
                    ZERO,
            )

            db.add(
                wallet
            )

            db.flush()


        # =================================================
        # CURRENT DIRECTS
        # =================================================

        direct_count = (
            get_direct_referral_count(
                db=db,
                user=user,
            )
        )

        category = (
            get_earning_category(
                direct_count
            )
        )

        multiplier = (
            get_current_earning_multiplier(
                direct_count
            )
        )


        subscription_amount = money(
            cycle.current_amount
        )

        wallet_before = money(
            wallet.balance
        )


        # =================================================
        # CALCULATE GROWTH
        # =================================================

        (
            base_amount,
            percentage,
            calculated_growth,
        ) = calculate_growth(

            subscription_amount=
                subscription_amount,

            wallet_balance=
                wallet_before,

            direct_referrals=
                direct_count,
        )


        # =================================================
        # CYCLE CAP
        # =================================================

        remaining_cycle_earning = (
            get_remaining_cycle_earning(
                cycle=cycle,
                multiplier=multiplier,
            )
        )


        if (
            remaining_cycle_earning
            <=
            ZERO
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Your subscription cycle "
                    "has reached its earning limit."
                ),
            )


        growth_amount = money(
            min(
                calculated_growth,
                remaining_cycle_earning,
            )
        )


        if (
            growth_amount
            <=
            ZERO
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "No daily growth is available "
                    "for this cycle."
                ),
            )


        # =================================================
        # WALLET UPDATE
        # =================================================

        wallet_after = money(
            wallet_before
            +
            growth_amount
        )


        wallet.balance = (
            wallet_after
        )


        # Lifetime earned does NOT decrease on withdrawal.

        wallet.total_earned = money(
            wallet.total_earned
            +
            growth_amount
        )


        # =================================================
        # CYCLE EARNINGS
        # =================================================

        cycle.total_cycle_earnings = money(
            cycle.total_cycle_earnings
            +
            growth_amount
        )


        # =================================================
        # UPDATE SESSION
        # =================================================

        session.subscription_amount = (
            subscription_amount
        )

        session.wallet_balance_before = (
            wallet_before
        )

        session.growth_base_amount = (
            base_amount
        )

        session.direct_referral_count = (
            direct_count
        )

        session.growth_percentage = (
            percentage
        )

        session.growth_amount = (
            growth_amount
        )

        session.wallet_balance_after = (
            wallet_after
        )

        session.earning_category = (
            category
        )

        session.earning_multiplier = (
            multiplier
        )

        session.status = (
            "credited"
        )


        db.flush()


        # =================================================
        # DUPLICATE WALLET TRANSACTION CHECK
        # =================================================

        existing_transaction = (
            db.query(
                IncomeWalletTransaction
            )
            .filter(
                IncomeWalletTransaction.user_id
                ==
                user.id,

                IncomeWalletTransaction.income_type
                ==
                "daily_compounding",

                IncomeWalletTransaction.reference_type
                ==
                "daily_compounding_growth",

                IncomeWalletTransaction.reference_id
                ==
                session.id,

                IncomeWalletTransaction.status
                ==
                "credited",
            )
            .first()
        )


        if existing_transaction:

            raise HTTPException(
                status_code=400,
                detail=(
                    "This compounding income "
                    "has already been credited."
                ),
            )


        # =================================================
        # WALLET TRANSACTION
        # =================================================

        wallet_transaction = (
            IncomeWalletTransaction(

                user_id=
                    user.id,

                income_type=
                    "daily_compounding",

                amount=
                    growth_amount,

                balance_before=
                    wallet_before,

                balance_after=
                    wallet_after,

                reference_type=
                    "daily_compounding_growth",

                reference_id=
                    session.id,

                description=(
                    f"Daily compounding growth "
                    f"at {percentage}%"
                ),

                status=
                    "credited",
            )
        )


        db.add(
            wallet_transaction
        )


        # =================================================
        # LEVEL PROFIT
        #
        # IMPORTANT:
        #
        # Level Profit is generated ONLY after the source
        # user's Daily Compounding has actually reached
        # the credit stage.
        #
        # It is calculated from growth_amount, NOT from
        # subscription amount.
        #
        # Example:
        #
        # Source user's actual growth = $1.00
        #
        # Level 1 upline:
        # $1 × 5% = $0.05
        #
        # process_level_profit() handles:
        #
        # - maximum 10 uplines
        # - direct referral eligibility
        # - level percentage
        # - independent slab daily caps
        # - duplicate protection
        # - beneficiary Income Wallet credit
        # - Income Wallet ledger
        #
        # It does NOT commit internally.
        # =================================================

        level_profit_records = (
            process_level_profit(
                db=db,

                source_user=user,

                source_compounding_id=
                    session.id,

                source_growth_amount=
                    growth_amount,
            )
        )


        # =================================================
        # SINGLE FINAL COMMIT
        #
        # Commits together:
        #
        # 1. Source Daily Compounding
        # 2. Source wallet transaction
        # 3. Eligible Level Profit records
        # 4. Upline wallet credits
        # 5. Upline wallet ledger transactions
        # =================================================

        db.commit()


        db.refresh(
            session
        )

        db.refresh(
            wallet
        )


        return {

            "session":
                session,

            "wallet":
                wallet,

            "wallet_transaction":
                wallet_transaction,

            "level_profit": {

                "processed":
                    True,

                "credited_uplines":
                    len(
                        level_profit_records
                    ),

                "records": [
                    {
                        "id":
                            record.id,

                        "beneficiary_user_id":
                            record.beneficiary_user_id,

                        "source_user_id":
                            record.source_user_id,

                        "level":
                            record.level,

                        "percentage":
                            float(
                                record.percentage
                            ),

                        "source_growth_amount":
                            float(
                                record.source_growth_amount
                            ),

                        "calculated_amount":
                            float(
                                record.calculated_amount
                            ),

                        "credited_amount":
                            float(
                                record.credited_amount
                            ),

                        "daily_cap":
                            float(
                                record.daily_cap
                            ),

                        "status":
                            record.status,
                    }

                    for record
                    in level_profit_records
                ],
            },
        }


        db.refresh(
            session
        )

        db.refresh(
            wallet
        )


        return {

            "session":
                session,

            "wallet":
                wallet,

            "wallet_transaction":
                wallet_transaction,
        }


    except HTTPException:

        db.rollback()

        raise


    except Exception as exc:

        db.rollback()

        print(
            "Daily compounding credit error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process "
                "daily compounding growth."
            ),
        )