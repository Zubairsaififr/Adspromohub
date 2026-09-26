from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    Column,
    DateTime,
    DECIMAL,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


# =========================================================
# SUBSCRIPTION CYCLE
# =========================================================

class SubscriptionCycle(Base):
    __tablename__ = "subscription_cycles"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "cycle_number",
            name="uq_user_cycle",
        ),
        Index(
            "idx_subscription_cycles_user_id",
            "user_id",
        ),
        Index(
            "idx_subscription_cycles_status",
            "status",
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
    )

    cycle_number = Column(
        Integer,
        nullable=False,
    )

    # Current approved subscription value
    # Example:
    # $20 + $50 = $70
    current_amount = Column(
        DECIMAL(10, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    # Total qualifying earnings generated
    # during this particular cycle.
    total_cycle_earnings = Column(
        DECIMAL(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    status = Column(
        Enum(
            "pending",
            "active",
            "expired",
            "cancelled",
            name="subscription_cycle_status",
        ),
        nullable=False,
        default="pending",
    )

    started_at = Column(
        DateTime,
        nullable=True,
    )

    expired_at = Column(
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


# =========================================================
# SUBSCRIPTION TRANSACTION
# =========================================================

class SubscriptionTransaction(Base):
    __tablename__ = "subscription_transactions"

    __table_args__ = (
        Index(
            "idx_subscription_transactions_user_id",
            "user_id",
        ),
        Index(
            "idx_subscription_transactions_cycle_id",
            "cycle_id",
        ),
        Index(
            "idx_subscription_transactions_status",
            "status",
        ),
        Index(
            "idx_subscription_transactions_tx_hash",
            "tx_hash",
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
    )

    cycle_id = Column(
        Integer,
        ForeignKey(
            "subscription_cycles.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    transaction_type = Column(
        Enum(
            "new",
            "upgrade",
            "resubscribe",
            name="subscription_transaction_type",
        ),
        nullable=False,
    )

    amount = Column(
        DECIMAL(10, 2),
        nullable=False,
    )

    # Package before approval
    previous_amount = Column(
        DECIMAL(10, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    # Package after approval
    resulting_amount = Column(
        DECIMAL(10, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    payment_network = Column(
        String(30),
        nullable=False,
        default="BEP20",
    )

    tx_hash = Column(
        String(255),
        nullable=True,
    )

    from_wallet = Column(
        String(100),
        nullable=True,
    )

    status = Column(
        Enum(
            "pending",
            "approved",
            "rejected",
            name="subscription_transaction_status",
        ),
        nullable=False,
        default="pending",
    )

    rejection_reason = Column(
        String(500),
        nullable=True,
    )

    approved_by = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
            onupdate="CASCADE",
        ),
        nullable=True,
    )

    approved_at = Column(
        DateTime,
        nullable=True,
    )

    rejected_at = Column(
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