from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class UserRank(Base):
    __tablename__ = "user_ranks"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    # ruby, emerald, sapphire, topaz,
    # amethyst, diamond, crown_jewel
    rank_name = Column(
        String(50),
        nullable=False,
    )

    # achieved / superseded
    status = Column(
        String(30),
        nullable=False,
        default="achieved",
    )

    achieved_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )

    superseded_at = Column(
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

    user = relationship(
        "User",
        foreign_keys=[user_id],
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "rank_name",
            name="uq_user_rank_once",
        ),

        Index(
            "ix_user_ranks_user_status",
            "user_id",
            "status",
        ),
    )