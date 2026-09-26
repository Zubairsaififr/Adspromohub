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


class ReferralIncome(Base):
    __tablename__ = "referral_incomes"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # User receiving referral income
    beneficiary_user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Direct referral who generated the income
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

    subscription_transaction_id = Column(
        Integer,
        ForeignKey(
            "subscription_transactions.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    subscription_cycle_id = Column(
        Integer,
        ForeignKey(
            "subscription_cycles.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    income_type = Column(
        Enum(
            "first_subscription",
            "upgrade",
            name="referral_income_type",
        ),
        nullable=False,
    )

    base_amount = Column(
        Numeric(12, 2),
        nullable=False,
    )

    percentage = Column(
        Numeric(5, 2),
        nullable=False,
    )

    referral_amount = Column(
        Numeric(12, 2),
        nullable=False,
    )

    status = Column(
        Enum(
            "credited",
            "reversed",
            name="referral_income_status",
        ),
        nullable=False,
        default="credited",
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    reversed_at = Column(
        DateTime,
        nullable=True,
    )

    reversal_reason = Column(
        String(500),
        nullable=True,
    )

    beneficiary = relationship(
        "User",
        foreign_keys=[beneficiary_user_id],
    )

    source_user = relationship(
        "User",
        foreign_keys=[source_user_id],
    )

    subscription_transaction = relationship(
        "SubscriptionTransaction",
        foreign_keys=[subscription_transaction_id],
    )

    subscription_cycle = relationship(
        "SubscriptionCycle",
        foreign_keys=[subscription_cycle_id],
    )