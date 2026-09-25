from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class IncomeWalletTransaction(Base):
    __tablename__ = "income_wallet_transactions"

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

    income_type = Column(
        String(50),
        nullable=False,
        index=True,
    )

    amount = Column(
        Numeric(14, 2),
        nullable=False,
    )

    balance_before = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    balance_after = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    reference_type = Column(
        String(50),
        nullable=True,
    )

    reference_id = Column(
        Integer,
        nullable=True,
    )

    description = Column(
        String(255),
        nullable=True,
    )

    status = Column(
        Enum(
            "credited",
            "reversed",
            name="income_wallet_transaction_status",
        ),
        nullable=False,
        default="credited",
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