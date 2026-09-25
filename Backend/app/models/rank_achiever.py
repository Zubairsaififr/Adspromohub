from datetime import datetime, timezone

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


# ============================================================
# UTC HELPER
# ============================================================

def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(
        tzinfo=None
    )


# ============================================================
# RANK ACHIEVER STATUS
# ============================================================

class RankAchiever(Base):
    """
    Stores the user's current/live status for each
    Rank Achiever fund.

    One record:
        one user + one fund/rank.
    """

    __tablename__ = "rank_achievers"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "rank_name",
            name="uq_rank_achiever_user_rank",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # FUND
    # --------------------------------------------------------

    rank_name = Column(
        String(50),
        nullable=False,
        index=True,
    )

    fund_type = Column(
        String(100),
        nullable=False,
    )

    # --------------------------------------------------------
    # TEAM REQUIREMENT
    # --------------------------------------------------------

    required_team_members = Column(
        Integer,
        nullable=False,
    )

    team_members = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # --------------------------------------------------------
    # WALLET REQUIREMENT
    # --------------------------------------------------------

    required_wallet_balance = Column(
        Numeric(14, 2),
        nullable=False,
    )

    maintained_wallet_balance = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    # --------------------------------------------------------
    # MONTHLY REWARD
    # --------------------------------------------------------

    monthly_amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    # --------------------------------------------------------
    # LIVE ELIGIBILITY
    # --------------------------------------------------------

    is_eligible = Column(
        Integer,
        nullable=False,
        default=0,
    )

    eligible_at = Column(
        DateTime,
        nullable=True,
    )

    # --------------------------------------------------------
    # PAYOUT TRACKING
    # --------------------------------------------------------

    last_payout_date = Column(
        Date,
        nullable=True,
    )

    total_paid = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    # --------------------------------------------------------
    # TIMESTAMPS
    # --------------------------------------------------------

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    # --------------------------------------------------------
    # RELATIONSHIP
    # --------------------------------------------------------

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )


# ============================================================
# MONTHLY PAYOUT HISTORY
# ============================================================

class RankAchieverPayout(Base):
    """
    Actual monthly Rank Achiever wallet credit.

    UniqueConstraint guarantees:
    same user + same fund + same month
    can NEVER be paid twice.
    """

    __tablename__ = "rank_achiever_payouts"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "rank_name",
            "payout_year",
            "payout_month",
            name="uq_rank_achiever_monthly_payout",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    rank_achiever_id = Column(
        Integer,
        ForeignKey(
            "rank_achievers.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # FUND
    # --------------------------------------------------------

    rank_name = Column(
        String(50),
        nullable=False,
        index=True,
    )

    fund_type = Column(
        String(100),
        nullable=False,
    )

    # --------------------------------------------------------
    # SNAPSHOT WHEN PAID
    # --------------------------------------------------------

    team_members = Column(
        Integer,
        nullable=False,
    )

    required_team_members = Column(
        Integer,
        nullable=False,
    )

    wallet_balance = Column(
        Numeric(14, 2),
        nullable=False,
    )

    required_wallet_balance = Column(
        Numeric(14, 2),
        nullable=False,
    )

    # --------------------------------------------------------
    # PAYOUT
    # --------------------------------------------------------

    amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    payout_year = Column(
        Integer,
        nullable=False,
        index=True,
    )

    payout_month = Column(
        Integer,
        nullable=False,
        index=True,
    )

    payout_date = Column(
        Date,
        nullable=False,
    )

    status = Column(
        String(30),
        nullable=False,
        default="credited",
    )

    # --------------------------------------------------------
    # TIMESTAMP
    # --------------------------------------------------------

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    # --------------------------------------------------------
    # RELATIONSHIPS
    # --------------------------------------------------------

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )

    rank_achiever = relationship(
        "RankAchiever",
        foreign_keys=[rank_achiever_id],
    )