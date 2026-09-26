from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class IncomeWallet(Base):
    __tablename__ = "income_wallets"

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
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        nullable=False,
        unique=True,
        index=True,
    )

    balance = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    total_earned = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    total_withdrawn = Column(
        Numeric(14, 2),
        nullable=False,
        default=Decimal("0.00"),
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