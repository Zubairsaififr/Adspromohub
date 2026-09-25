from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    String,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    Index,
)

from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class LevelProfit(Base):
    __tablename__ = "level_profits"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # =====================================================
    # WHO RECEIVES LEVEL PROFIT
    # =====================================================

    beneficiary_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # =====================================================
    # WHO GENERATED THE ORIGINAL COMPOUNDING
    # =====================================================

    source_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # =====================================================
    # SOURCE DAILY COMPOUNDING RECORD
    # =====================================================

    source_compounding_id = Column(
        Integer,
        ForeignKey("daily_compounding_growth.id"),
        nullable=False,
        index=True,
    )

    # =====================================================
    # TREE LEVEL
    #
    # 1 - 10
    # =====================================================

    level = Column(
        Integer,
        nullable=False,
    )

    # =====================================================
    # BENEFICIARY DIRECT COUNT AT CREDIT TIME
    # =====================================================

    beneficiary_direct_count = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # =====================================================
    # ORIGINAL COMPOUNDING AMOUNT
    #
    # Example:
    # B received $1 compounding.
    # source_growth_amount = 1.00
    # =====================================================

    source_growth_amount = Column(
        Numeric(14, 4),
        nullable=False,
        default=0,
    )

    # =====================================================
    # LEVEL PROFIT PERCENT
    #
    # Level 1-2 = 5
    # Level 3-5 = 4
    # Level 6-8 = 3
    # Level 9-10 = 2
    # =====================================================

    percentage = Column(
        Numeric(5, 2),
        nullable=False,
    )

    # =====================================================
    # RAW CALCULATED PROFIT
    #
    # Example:
    # $1 × 5% = $0.05
    # =====================================================

    calculated_amount = Column(
        Numeric(14, 4),
        nullable=False,
        default=0,
    )

    # =====================================================
    # ACTUAL CREDITED AMOUNT
    #
    # Can be lower than calculated_amount
    # when daily cap remaining is smaller.
    #
    # Example:
    # calculated = $0.50
    # daily cap remaining = $0.20
    # credited = $0.20
    # =====================================================

    credited_amount = Column(
        Numeric(14, 4),
        nullable=False,
        default=0,
    )

    # =====================================================
    # DAILY CAP FOR BENEFICIARY
    #
    # 4 directs  = $10
    # 12 directs = $20
    # 20 directs = $30
    # 30 directs = $40
    # =====================================================

    daily_cap = Column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    # =====================================================
    # TOTAL LEVEL PROFIT ALREADY EARNED THAT DAY
    # BEFORE THIS TRANSACTION
    # =====================================================

    daily_earned_before = Column(
        Numeric(14, 4),
        nullable=False,
        default=0,
    )

    # =====================================================
    # TOTAL AFTER THIS CREDIT
    # =====================================================

    daily_earned_after = Column(
        Numeric(14, 4),
        nullable=False,
        default=0,
    )

    # =====================================================
    # BUSINESS DATE
    #
    # Asia/Kolkata business day.
    # =====================================================

    business_date = Column(
        Date,
        nullable=False,
        index=True,
    )

    # =====================================================
    # STATUS
    #
    # credited
    # capped
    # reversed
    # =====================================================

    status = Column(
        String(30),
        nullable=False,
        default="credited",
        index=True,
    )

    # =====================================================
    # CREATED TIME
    #
    # Keep UTC-naive same as existing backend.
    # =====================================================

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    beneficiary = relationship(
        "User",
        foreign_keys=[beneficiary_user_id],
    )

    source_user = relationship(
        "User",
        foreign_keys=[source_user_id],
    )

    source_compounding = relationship(
        "DailyCompoundingGrowth",
        foreign_keys=[source_compounding_id],
    )

    # =====================================================
    # DUPLICATE PROTECTION
    #
    # Same compounding event cannot pay the same
    # beneficiary twice.
    # =====================================================

    __table_args__ = (

        UniqueConstraint(
            "beneficiary_user_id",
            "source_compounding_id",
            name="uq_level_profit_beneficiary_compounding",
        ),

        Index(
            "ix_level_profit_user_business_date",
            "beneficiary_user_id",
            "business_date",
        ),

        Index(
            "ix_level_profit_source_user",
            "source_user_id",
        ),
    )