from datetime import date, datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


# =========================================================
# TIME HELPER
# =========================================================

def utc_now():
    return datetime.now(timezone.utc).replace(
        tzinfo=None
    )


# =========================================================
# ROYALTY POOL INCOME
# =========================================================

class RoyaltyPoolIncome(Base):

    __tablename__ = "royalty_pool_incomes"

    __table_args__ = (

        # -------------------------------------------------
        # One Royalty payout per user per business day.
        #
        # This prevents duplicate payout if:
        #
        # - scheduler runs twice
        # - API is manually called twice
        # - server restarts
        # -------------------------------------------------

        UniqueConstraint(
            "user_id",
            "payout_date",
            name="uq_royalty_pool_user_date",
        ),
    )


    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )


    # =====================================================
    # USER
    # =====================================================

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )


    # =====================================================
    # SELECTED ROYALTY SLAB
    # =====================================================
    #
    # Example:
    #
    # 25
    # 50
    # 100
    # 300
    # 500
    # ...
    #
    # This is the HIGHEST matching threshold where
    # minimum 2 different NON-POWER legs qualify.
    # =====================================================

    slab_threshold = Column(
        Integer,
        nullable=False,
        index=True,
    )


    # =====================================================
    # DAILY RATE PER QUALIFYING LEG
    # =====================================================
    #
    # Examples:
    #
    # 25 matching  -> $1
    # 50 matching  -> $2
    # 100 matching -> $4
    # 500 matching -> $7
    # =====================================================

    daily_per_leg = Column(
        Numeric(
            14,
            2,
        ),
        nullable=False,
        default=Decimal("0.00"),
    )


    # =====================================================
    # TOTAL SLAB CAP
    # =====================================================
    #
    # Examples:
    #
    # 25  -> $100
    # 50  -> $200
    # 100 -> $300
    # 500 -> $1000
    # =====================================================

    slab_total_cap = Column(
        Numeric(
            14,
            2,
        ),
        nullable=False,
        default=Decimal("0.00"),
    )


    # =====================================================
    # POWER LEG SNAPSHOT
    # =====================================================
    #
    # Largest direct referral leg.
    #
    # Power Leg is excluded from Royalty matching.
    # =====================================================

    power_leg_user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )


    power_leg_member_count = Column(
        Integer,
        nullable=False,
        default=0,
    )


    # =====================================================
    # MATCHING LEGS
    # =====================================================
    #
    # Number of NON-POWER legs satisfying the selected
    # threshold.
    #
    # Example:
    #
    # Power = 100
    #
    # Other:
    #
    # 30
    # 27
    # 26
    #
    # selected slab = 25
    # qualifying_leg_count = 3
    # =====================================================

    qualifying_leg_count = Column(
        Integer,
        nullable=False,
        default=0,
    )


    # =====================================================
    # TOTAL NON-POWER LEGS
    # =====================================================

    non_power_leg_count = Column(
        Integer,
        nullable=False,
        default=0,
    )


    # =====================================================
    # DAILY CALCULATED AMOUNT
    # =====================================================
    #
    # Before cap adjustment:
    #
    # qualifying legs × daily_per_leg
    #
    # Example:
    #
    # 3 legs × $1 = $3
    # =====================================================

    calculated_daily_amount = Column(
        Numeric(
            14,
            2,
        ),
        nullable=False,
        default=Decimal("0.00"),
    )


    # =====================================================
    # ACTUAL CREDIT
    # =====================================================
    #
    # Usually same as calculated_daily_amount.
    #
    # Near the cap it can be smaller.
    #
    # Example:
    #
    # remaining cap = $0.50
    # calculated = $3
    #
    # credited = $0.50
    # =====================================================

    royalty_amount = Column(
        Numeric(
            14,
            2,
        ),
        nullable=False,
        default=Decimal("0.00"),
    )


    # =====================================================
    # CAP PROGRESS SNAPSHOT
    # =====================================================
    #
    # IMPORTANT:
    #
    # These values allow us to see exactly where
    # the user was before/after today's Royalty.
    #
    # If qualification disappears:
    #
    # - no row is credited
    # - previous earned amount remains unchanged
    #
    # When qualification returns:
    #
    # - service reads previous progress
    # - Royalty resumes
    # =====================================================

    cap_earned_before = Column(
        Numeric(
            14,
            2,
        ),
        nullable=False,
        default=Decimal("0.00"),
    )


    cap_earned_after = Column(
        Numeric(
            14,
            2,
        ),
        nullable=False,
        default=Decimal("0.00"),
    )


    # =====================================================
    # STATUS
    # =====================================================
    #
    # credited
    #
    # Future possibilities:
    #
    # reversed
    # cancelled
    # =====================================================

    status = Column(
        String(30),
        nullable=False,
        default="credited",
        index=True,
    )


    # =====================================================
    # PAYOUT DATE
    # =====================================================
    #
    # Business-day identifier.
    #
    # Duplicate protection is based on:
    #
    # user_id + payout_date
    # =====================================================

    payout_date = Column(
        Date,
        nullable=False,
        default=date.today,
        index=True,
    )


    # =====================================================
    # CREATED
    # =====================================================

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
        index=True,
    )


    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )


    power_leg_user = relationship(
        "User",
        foreign_keys=[
            power_leg_user_id
        ],
    )


    # =====================================================
    # DISPLAY
    # =====================================================

    def __repr__(self):

        return (
            "<RoyaltyPoolIncome("
            f"id={self.id}, "
            f"user_id={self.user_id}, "
            f"slab={self.slab_threshold}, "
            f"amount={self.royalty_amount}, "
            f"date={self.payout_date}"
            ")>"
        )