from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class RankHierarchyHoldWallet(Base):
    """
    IMPORTANT:

    This is NOT an actual money wallet.

    Actual money is always credited to IncomeWallet.

    This table only stores permanent hierarchy progress/state
    for each user + rank so withdrawals, pauses and server
    restarts can never reset already-earned hierarchy income.
    """

    __tablename__ = "rank_hierarchy_hold_wallet"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "rank_name",
            name="uq_rank_hierarchy_hold_user_rank",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    rank_name = Column(
        String(50),
        nullable=False,
        index=True,
    )

    # Rank maintain/base amount.
    # Ruby = 50, Emerald = 100, etc.
    base_amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    # Internal hierarchy compounding value.
    #
    # Example Emerald:
    # 100.00 -> 100.50 -> 101.00... etc.
    #
    # This is NOT IncomeWallet.balance.
    compound_value = Column(
        Numeric(14, 2),
        nullable=False,
    )

    # Permanent amount already credited to IncomeWallet
    # from THIS rank hierarchy.
    #
    # Withdrawal never reduces this.
    total_credited = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    # Maximum hierarchy income entitlement for this rank.
    # Ruby 100, Emerald 200, etc.
    cap_amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    hierarchy_percentage = Column(
        Numeric(5, 2),
        nullable=False,
        default=Decimal("0.50"),
    )

    # active:
    # current rank and cap not completed
    #
    # superseded:
    # user moved to higher rank
    #
    # completed:
    # full hierarchy cap received
    status = Column(
        String(20),
        nullable=False,
        default="active",
        index=True,
    )

    started_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    last_growth_at = Column(
        DateTime,
        nullable=True,
    )

    cap_reached_at = Column(
        DateTime,
        nullable=True,
    )

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

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )