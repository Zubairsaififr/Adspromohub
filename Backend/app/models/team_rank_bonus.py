from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(tzinfo=None)


class TeamRankBonus(Base):
    __tablename__ = "team_rank_bonuses"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # User who receives the bonus
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

    # Fresh user whose NEW package
    # generated this Team Rank Bonus
    source_user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Exact NEW subscription transaction
    subscription_transaction_id = Column(
        Integer,
        ForeignKey(
            "subscription_transactions.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ruby / emerald / sapphire / topaz /
    # amethyst / diamond / crown_jewel
    rank_name = Column(
        String(50),
        nullable=False,
    )

    # Fresh user's package amount
    package_amount = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    # 15% of package amount
    rank_pool_amount = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    # Fixed slab:
    # Ruby         = 5%
    # Emerald      = 5%
    # Sapphire     = 5%
    # Topaz        = 5%
    # Amethyst     = 4%
    # Diamond      = 3%
    # Crown Jewel  = 3%
    rank_percentage = Column(
        Numeric(6, 2),
        nullable=False,
    )

    # Actual wallet credit
    bonus_amount = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    status = Column(
        String(30),
        nullable=False,
        default="credited",
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    receiver = relationship(
        "User",
        foreign_keys=[user_id],
    )

    source_user = relationship(
        "User",
        foreign_keys=[source_user_id],
    )

    subscription_transaction = relationship(
        "SubscriptionTransaction",
        foreign_keys=[subscription_transaction_id],
    )

    __table_args__ = (
        # One rank slot can be paid only once
        # for a particular NEW transaction.
        UniqueConstraint(
            "subscription_transaction_id",
            "rank_name",
            name="uq_team_rank_bonus_transaction_rank",
        ),

        Index(
            "ix_team_rank_bonus_user_created",
            "user_id",
            "created_at",
        ),
    )