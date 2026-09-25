# app/models/support_ticket.py

from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ============================================================
# SUPPORT TICKET
# ============================================================

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # Example:
    # TKT-000001
    ticket_number = Column(
        String(30),
        unique=True,
        nullable=True,
        index=True,
    )

    # Ticket owner
    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    subject = Column(
        String(255),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    # low / normal / high / urgent
    priority = Column(
        String(20),
        nullable=False,
        default="normal",
        index=True,
    )

    # open
    # in_progress
    # waiting_for_user
    # resolved
    # closed
    status = Column(
        String(30),
        nullable=False,
        default="open",
        index=True,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
        index=True,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    resolved_at = Column(
        DateTime,
        nullable=True,
    )

    # --------------------------------------------------------
    # RELATIONSHIPS
    # --------------------------------------------------------

    messages = relationship(
        "SupportTicketMessage",
        back_populates="ticket",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="SupportTicketMessage.created_at.asc()",
    )


# ============================================================
# SUPPORT TICKET MESSAGE
# ============================================================

class SupportTicketMessage(Base):
    __tablename__ = "support_ticket_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    ticket_id = Column(
        Integer,
        ForeignKey(
            "support_tickets.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # user / admin / system
    sender_type = Column(
        String(20),
        nullable=False,
        index=True,
    )

    # User ID or Admin User ID.
    # system message => NULL
    sender_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    message = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
        index=True,
    )

    # --------------------------------------------------------
    # RELATIONSHIP
    # --------------------------------------------------------

    ticket = relationship(
        "SupportTicket",
        back_populates="messages",
    )


# ============================================================
# OPTIONAL DB SAFETY / FUTURE EXTENSION
# ============================================================

class SupportTicketRead(Base):
    """
    Keeps track of who has read the latest ticket activity.

    Useful for:
    - Admin unread ticket badge
    - User unread support reply badge
    """

    __tablename__ = "support_ticket_reads"

    __table_args__ = (
        UniqueConstraint(
            "ticket_id",
            "user_id",
            name="uq_support_ticket_read_ticket_user",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    ticket_id = Column(
        Integer,
        ForeignKey(
            "support_tickets.id",
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

    last_read_at = Column(
        DateTime,
        nullable=False,
        default=utc_now,
    )