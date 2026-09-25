# app/services/support_ticket_service.py

from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.support_ticket import (
    SupportTicket,
    SupportTicketMessage,
)
from app.models.user import User


# ============================================================
# CONSTANTS
# ============================================================

VALID_PRIORITIES = {
    "low",
    "normal",
    "high",
    "urgent",
}


VALID_STATUSES = {
    "open",
    "in_progress",
    "waiting_for_user",
    "resolved",
    "closed",
}


VALID_CATEGORIES = {
    "Account / ID Activation",
    "Subscription Purchase",
    "Withdrawal Problem",
    "Earning / Compounding",
    "Referral / Direct Income",
    "Rank / Rank Achiever",
    "Wallet / Payment",
    "Technical Problem",
    "Other",
}


# ============================================================
# TIME
# ============================================================

def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(
        tzinfo=None
    )


# ============================================================
# CLEAN TEXT
# ============================================================

def clean_text(
    value: Optional[str]
) -> str:

    return (
        value or ""
    ).strip()


# ============================================================
# VALIDATE PRIORITY
# ============================================================

def validate_priority(
    priority: str
) -> str:

    priority = clean_text(
        priority
    ).lower()

    if priority not in VALID_PRIORITIES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ticket priority.",
        )

    return priority


# ============================================================
# VALIDATE STATUS
# ============================================================

def validate_status(
    ticket_status: str
) -> str:

    ticket_status = clean_text(
        ticket_status
    ).lower()

    if ticket_status not in VALID_STATUSES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ticket status.",
        )

    return ticket_status


# ============================================================
# VALIDATE CATEGORY
# ============================================================

def validate_category(
    category: str
) -> str:

    category = clean_text(
        category
    )

    if category not in VALID_CATEGORIES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid support ticket category.",
        )

    return category


# ============================================================
# GET USER TICKETS
# ============================================================

def get_user_tickets(
    db: Session,
    user_id: int,
):

    return (
        db.query(
            SupportTicket
        )
        .options(
            selectinload(
                SupportTicket.messages
            )
        )
        .filter(
            SupportTicket.user_id
            == user_id
        )
        .order_by(
            SupportTicket.updated_at.desc(),
            SupportTicket.id.desc(),
        )
        .all()
    )


# ============================================================
# GET USER TICKET
# SECURITY:
# User can only access his own ticket.
# ============================================================

def get_user_ticket(
    db: Session,
    user_id: int,
    ticket_id: int,
):

    ticket = (
        db.query(
            SupportTicket
        )
        .options(
            selectinload(
                SupportTicket.messages
            )
        )
        .filter(
            SupportTicket.id
            == ticket_id,
            SupportTicket.user_id
            == user_id,
        )
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found.",
        )

    return ticket


# ============================================================
# GET ANY TICKET
# ADMIN ONLY
# ============================================================

def get_ticket_for_admin(
    db: Session,
    ticket_id: int,
):

    ticket = (
        db.query(
            SupportTicket
        )
        .options(
            selectinload(
                SupportTicket.messages
            )
        )
        .filter(
            SupportTicket.id
            == ticket_id
        )
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found.",
        )

    return ticket


# ============================================================
# CREATE TICKET
# ============================================================

def create_ticket(
    db: Session,
    user: User,
    category: str,
    subject: str,
    description: str,
    priority: str = "normal",
):

    category = validate_category(
        category
    )

    priority = validate_priority(
        priority
    )

    subject = clean_text(
        subject
    )

    description = clean_text(
        description
    )

    if len(subject) < 3:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket subject is too short.",
        )

    if len(description) < 3:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please describe your problem.",
        )

    try:

        # ----------------------------------------------------
        # CREATE TICKET
        # ----------------------------------------------------

        ticket = SupportTicket(
            user_id=user.id,
            ticket_number=None,
            category=category,
            subject=subject,
            description=description,
            priority=priority,
            status="open",
            created_at=utc_now(),
            updated_at=utc_now(),
        )

        db.add(
            ticket
        )

        db.flush()

        # ----------------------------------------------------
        # UNIQUE TICKET NUMBER
        # ----------------------------------------------------

        ticket.ticket_number = (
            f"TKT-{ticket.id:06d}"
        )

        # ----------------------------------------------------
        # SYSTEM MESSAGE
        # ----------------------------------------------------

        system_message = (
            SupportTicketMessage(
                ticket_id=ticket.id,
                sender_type="system",
                sender_id=None,
                message=(
                    "Your support ticket has been created successfully. "
                    "Our support team will review your query."
                ),
                created_at=utc_now(),
            )
        )

        db.add(
            system_message
        )

        db.commit()

        # ----------------------------------------------------
        # RELOAD WITH MESSAGES
        # ----------------------------------------------------

        return get_user_ticket(
            db=db,
            user_id=user.id,
            ticket_id=ticket.id,
        )

    except HTTPException:

        db.rollback()
        raise

    except Exception as exc:

        db.rollback()

        print(
            "Create support ticket error:",
            exc,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create support ticket.",
        )


# ============================================================
# USER REPLY
# ============================================================

def add_user_reply(
    db: Session,
    user: User,
    ticket_id: int,
    message: str,
):

    ticket = get_user_ticket(
        db=db,
        user_id=user.id,
        ticket_id=ticket_id,
    )

    # --------------------------------------------------------
    # CLOSED / RESOLVED CANNOT BE REPLIED
    # --------------------------------------------------------

    if ticket.status in {
        "resolved",
        "closed",
    }:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This ticket is already closed.",
        )

    message = clean_text(
        message
    )

    if not message:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reply message is required.",
        )

    try:

        reply = SupportTicketMessage(
            ticket_id=ticket.id,
            sender_type="user",
            sender_id=user.id,
            message=message,
            created_at=utc_now(),
        )

        db.add(
            reply
        )

        # ----------------------------------------------------
        # USER HAS REPLIED
        # ADMIN NEEDS TO REVIEW IT AGAIN
        # ----------------------------------------------------

        ticket.status = (
            "in_progress"
        )

        ticket.updated_at = (
            utc_now()
        )

        db.commit()

        return get_user_ticket(
            db=db,
            user_id=user.id,
            ticket_id=ticket.id,
        )

    except HTTPException:

        db.rollback()
        raise

    except Exception as exc:

        db.rollback()

        print(
            "User support reply error:",
            exc,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send ticket reply.",
        )


# ============================================================
# ADMIN REPLY
# ============================================================

def add_admin_reply(
    db: Session,
    admin: User,
    ticket_id: int,
    message: str,
):

    ticket = get_ticket_for_admin(
        db=db,
        ticket_id=ticket_id,
    )

    if ticket.status == "closed":

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Closed ticket cannot be replied to.",
        )

    message = clean_text(
        message
    )

    if not message:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reply message is required.",
        )

    try:

        reply = SupportTicketMessage(
            ticket_id=ticket.id,
            sender_type="admin",
            sender_id=admin.id,
            message=message,
            created_at=utc_now(),
        )

        db.add(
            reply
        )

        # ----------------------------------------------------
        # AFTER ADMIN REPLY:
        # Waiting for user response.
        # ----------------------------------------------------

        if ticket.status != "resolved":

            ticket.status = (
                "waiting_for_user"
            )

        ticket.updated_at = (
            utc_now()
        )

        db.commit()

        return get_ticket_for_admin(
            db=db,
            ticket_id=ticket.id,
        )

    except HTTPException:

        db.rollback()
        raise

    except Exception as exc:

        db.rollback()

        print(
            "Admin support reply error:",
            exc,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send admin reply.",
        )


# ============================================================
# ADMIN UPDATE STATUS
# ============================================================

def update_ticket_status(
    db: Session,
    ticket_id: int,
    new_status: str,
):

    ticket = get_ticket_for_admin(
        db=db,
        ticket_id=ticket_id,
    )

    new_status = validate_status(
        new_status
    )

    old_status = (
        ticket.status
    )

    try:

        ticket.status = (
            new_status
        )

        ticket.updated_at = (
            utc_now()
        )

        # ----------------------------------------------------
        # RESOLVED DATE
        # ----------------------------------------------------

        if new_status in {
            "resolved",
            "closed",
        }:

            if not ticket.resolved_at:

                ticket.resolved_at = (
                    utc_now()
                )

        else:

            ticket.resolved_at = None

        # ----------------------------------------------------
        # SYSTEM STATUS MESSAGE
        # ----------------------------------------------------

        if old_status != new_status:

            readable_status = (
                new_status
                .replace(
                    "_",
                    " ",
                )
                .title()
            )

            system_message = (
                SupportTicketMessage(
                    ticket_id=ticket.id,
                    sender_type="system",
                    sender_id=None,
                    message=(
                        "Ticket status changed to "
                        f"{readable_status}."
                    ),
                    created_at=utc_now(),
                )
            )

            db.add(
                system_message
            )

        db.commit()

        return get_ticket_for_admin(
            db=db,
            ticket_id=ticket.id,
        )

    except HTTPException:

        db.rollback()
        raise

    except Exception as exc:

        db.rollback()

        print(
            "Ticket status update error:",
            exc,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update ticket status.",
        )


# ============================================================
# ADMIN UPDATE PRIORITY
# ============================================================

def update_ticket_priority(
    db: Session,
    ticket_id: int,
    priority: str,
):

    ticket = get_ticket_for_admin(
        db=db,
        ticket_id=ticket_id,
    )

    priority = validate_priority(
        priority
    )

    try:

        ticket.priority = priority
        ticket.updated_at = utc_now()

        db.commit()

        return get_ticket_for_admin(
            db=db,
            ticket_id=ticket.id,
        )

    except Exception as exc:

        db.rollback()

        print(
            "Ticket priority update error:",
            exc,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update ticket priority.",
        )