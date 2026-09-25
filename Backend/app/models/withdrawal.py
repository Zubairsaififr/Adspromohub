from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Index,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # -------------------------------------------------
    # USER
    # -------------------------------------------------

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # -------------------------------------------------
    # MONEY
    #
    # amount     = amount removed/reserved from wallet
    # fee        = 5% fee
    # net_amount = amount - fee
    # -------------------------------------------------

    amount = Column(
        Numeric(14, 4),
        nullable=False,
    )

    fee_percentage = Column(
        Numeric(6, 4),
        nullable=False,
        default=5,
    )

    fee = Column(
        Numeric(14, 4),
        nullable=False,
    )

    net_amount = Column(
        Numeric(14, 4),
        nullable=False,
    )

    # -------------------------------------------------
    # PAYMENT ADDRESS
    #
    # IMPORTANT:
    # Save snapshot of address used for this withdrawal.
    # If user changes BEP20 later, old withdrawal history
    # still keeps the original destination.
    # -------------------------------------------------

    bep20_address = Column(
        String(100),
        nullable=False,
    )

    # -------------------------------------------------
    # PROCESSING TYPE
    #
    # auto  = $5 - $20 inclusive
    # admin = above $20
    # -------------------------------------------------

    processing_type = Column(
        String(20),
        nullable=False,
        default="admin",
    )

    # -------------------------------------------------
    # STATUS
    #
    # otp_pending
    # pending
    # approved
    # paid
    # rejected
    # cancelled
    # -------------------------------------------------

    status = Column(
        String(30),
        nullable=False,
        default="otp_pending",
        index=True,
    )

    # -------------------------------------------------
    # OTP
    # -------------------------------------------------

    otp_verified = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    otp_verified_at = Column(
        DateTime,
        nullable=True,
    )

    # -------------------------------------------------
    # PAYMENT
    # -------------------------------------------------

    payment_reference = Column(
        String(255),
        nullable=True,
    )

    # -------------------------------------------------
    # ADMIN
    # -------------------------------------------------

    approved_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    rejected_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    admin_note = Column(
        Text,
        nullable=True,
    )

    # -------------------------------------------------
    # TIMESTAMPS
    # -------------------------------------------------

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

   

    approved_at = Column(
        DateTime,
        nullable=True,
    )

    paid_at = Column(
        DateTime,
        nullable=True,
    )

    rejected_at = Column(
        DateTime,
        nullable=True,
    )

    cancelled_at = Column(
        DateTime,
        nullable=True,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    # -------------------------------------------------
    # RELATIONSHIP
    # -------------------------------------------------

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )

    approver = relationship(
        "User",
        foreign_keys=[approved_by],
    )

    rejector = relationship(
        "User",
        foreign_keys=[rejected_by],
    )

    __table_args__ = (
        Index(
            "ix_withdrawals_user_status",
            "user_id",
            "status",
        ),
    )