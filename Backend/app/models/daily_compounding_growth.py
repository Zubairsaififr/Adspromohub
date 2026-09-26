from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class DailyCompoundingGrowth(Base):
    __tablename__ = "daily_compounding_growth"

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

    subscription_cycle_id = Column(
        Integer,
        ForeignKey(
            "subscription_cycles.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    subscription_amount = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    wallet_balance_before = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    growth_base_amount = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    direct_referral_count = Column(
        Integer,
        nullable=False,
        default=0,
    )

    growth_percentage = Column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    growth_amount = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    wallet_balance_after = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    earning_category = Column(
        Enum(
            "non_working",
            "working",
            name="daily_growth_category",
        ),
        nullable=False,
        default="non_working",
    )

    earning_multiplier = Column(
        Numeric(5, 2),
        nullable=False,
        default=2.50,
    )

    ads_completed = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    ad_started_at = Column(
        DateTime,
        nullable=True,
    )

    ad_completed_at = Column(
        DateTime,
        nullable=True,
    )

    eligible_at = Column(
        DateTime,
        nullable=True,
    )

    status = Column(
        Enum(
            "started",
            "completed",
            "credited",
            "rejected",
            name="daily_growth_status",
        ),
        nullable=False,
        default="started",
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

    subscription_cycle = relationship(
        "SubscriptionCycle",
        foreign_keys=[subscription_cycle_id],
    )