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


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class RankHierarchyGrowth(Base):
    __tablename__ = "rank_hierarchy_growth"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "rank_name",
            "business_date",
            name="uq_rank_hierarchy_user_rank_date",
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

    business_date = Column(
        Date,
        nullable=False,
        index=True,
    )

    # Actual IncomeWallet balance when eligibility
    # was checked.
    income_wallet_balance = Column(
        Numeric(14, 2),
        nullable=False,
    )

    # Rank's internal hierarchy compound value
    # before today's growth.
    compound_before = Column(
        Numeric(14, 2),
        nullable=False,
    )

    growth_percentage = Column(
        Numeric(5, 2),
        nullable=False,
        default=0.50,
    )

    # Actual hierarchy income credited today.
    growth_amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    compound_after = Column(
        Numeric(14, 2),
        nullable=False,
    )

    total_credited_after = Column(
        Numeric(14, 2),
        nullable=False,
    )

    cap_amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    # credited / paused
    status = Column(
        String(20),
        nullable=False,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )