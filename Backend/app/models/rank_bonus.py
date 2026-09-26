from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class RankBonus(Base):
    __tablename__ = "rank_bonuses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    rank_name = Column(
        String(50),
        nullable=False,
    )

    # Wallet requirement at the time bonus was qualified.
    required_wallet_balance = Column(
        Numeric(14, 4),
        nullable=False,
    )

    # Actual wallet balance BEFORE bonus credit.
    wallet_balance_before = Column(
        Numeric(14, 4),
        nullable=False,
    )

    bonus_amount = Column(
        Numeric(14, 4),
        nullable=False,
    )

    wallet_balance_after = Column(
        Numeric(14, 4),
        nullable=False,
    )

    # credited / reversed
    status = Column(
        String(30),
        nullable=False,
        default="credited",
    )

    credited_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
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

    __table_args__ = (
        # CRITICAL:
        # One user can receive each rank's instant bonus only once.
        UniqueConstraint(
            "user_id",
            "rank_name",
            name="uq_rank_bonus_user_rank",
        ),

        Index(
            "ix_rank_bonuses_user_status",
            "user_id",
            "status",
        ),
    )