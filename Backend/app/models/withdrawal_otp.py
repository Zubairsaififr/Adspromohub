from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Index,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class WithdrawalOTP(Base):
    __tablename__ = "withdrawal_otps"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    withdrawal_id = Column(
        Integer,
        ForeignKey(
            "withdrawals.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Never store raw OTP here.
    otp_hash = Column(
        String(255),
        nullable=False,
    )

    attempts = Column(
        Integer,
        nullable=False,
        default=0,
    )

    max_attempts = Column(
        Integer,
        nullable=False,
        default=5,
    )

    is_used = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    expires_at = Column(
        DateTime,
        nullable=False,
    )

    verified_at = Column(
        DateTime,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    withdrawal = relationship(
        "Withdrawal",
    )

    user = relationship(
        "User",
    )

    __table_args__ = (
        Index(
            "ix_withdrawal_otp_lookup",
            "withdrawal_id",
            "user_id",
            "is_used",
        ),
    )