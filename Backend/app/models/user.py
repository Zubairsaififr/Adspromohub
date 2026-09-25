from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
)


from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # Normal users: APH-XXXXXXXX
    # System/admin: APH5555
    customer_id = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    # Same as customer_id for normal users
    referral_id = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    # Referral ID used while registering
    referred_by = Column(
        String(30),
        nullable=False,
        index=True,
        default="APH5555",
    )




    full_name = Column(
    String(150),
    nullable=False,
    )

    first_name = Column(
    String(75),
    nullable=True,
    )

    last_name = Column(
    String(75),
    nullable=True,
    )

    gender = Column(
    String(20),
    nullable=True,
    )

    address = Column(
    String(500),
    nullable=True,
    )

    bep20_address = Column(
    String(100),
    nullable=True,
    )

    bep20_change_count = Column(
    Integer,
    nullable=False,
    default=0,
    )

    bep20_updated_at = Column(
    DateTime,
    nullable=True,
    )   

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    # Full international number, e.g. +919876543210
    phone_number = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    country = Column(
        String(100),
        nullable=False,
    )

    # e.g. +91
    country_code = Column(
        String(10),
        nullable=False,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(20),
        nullable=False,
        default="user",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
    )
    updated_at = Column(
    DateTime,
    nullable=False,
    default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
    onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
    )