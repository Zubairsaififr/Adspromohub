# app/api/support_ticket.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User

from app.schemas.support_ticket import (
    SupportTicketCreate,
    SupportTicketReplyCreate,
)

from app.services.support_ticket_service import (
    get_user_tickets,
    get_user_ticket,
    create_ticket,
    add_user_reply,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/support",
    tags=["Support Tickets"],
)


# ============================================================
# SERIALIZE MESSAGE
# ============================================================

def serialize_message(message):

    return {
        "id": message.id,
        "sender_type": message.sender_type,
        "sender_id": message.sender_id,
        "message": message.message,
        "created_at": message.created_at,
    }


# ============================================================
# SERIALIZE TICKET
# ============================================================

def serialize_ticket(
    ticket,
    include_messages: bool = True,
):

    data = {
        "id": ticket.id,
        "ticket_number": ticket.ticket_number,
        "category": ticket.category,
        "subject": ticket.subject,
        "description": ticket.description,
        "priority": ticket.priority,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "resolved_at": ticket.resolved_at,
    }

    if include_messages:

        data["messages"] = [
            serialize_message(message)
            for message in (
                ticket.messages or []
            )
        ]

    return data


# ============================================================
# GET MY TICKETS
#
# GET /api/support/tickets
# ============================================================

@router.get("/tickets")
def my_support_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    tickets = get_user_tickets(
        db=db,
        user_id=current_user.id,
    )

    return {
        "success": True,
        "count": len(tickets),
        "tickets": [
            serialize_ticket(
                ticket,
                include_messages=False,
            )
            for ticket in tickets
        ],
    }


# ============================================================
# CREATE TICKET
#
# POST /api/support/tickets
# ============================================================

@router.post(
    "/tickets",
    status_code=status.HTTP_201_CREATED,
)
def create_support_ticket(
    payload: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    ticket = create_ticket(
        db=db,
        user=current_user,
        category=payload.category,
        subject=payload.subject,
        description=payload.description,
        priority=payload.priority,
    )

    return {
        "success": True,
        "message": (
            "Support ticket created successfully."
        ),
        "ticket": serialize_ticket(
            ticket,
            include_messages=True,
        ),
    }


# ============================================================
# GET SINGLE TICKET
#
# IMPORTANT:
# This query includes user_id.
# Therefore a user cannot access another user's ticket simply
# by changing the ticket ID in the URL.
#
# GET /api/support/tickets/{ticket_id}
# ============================================================

@router.get(
    "/tickets/{ticket_id}"
)
def support_ticket_detail(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    ticket = get_user_ticket(
        db=db,
        user_id=current_user.id,
        ticket_id=ticket_id,
    )

    return {
        "success": True,
        "ticket": serialize_ticket(
            ticket,
            include_messages=True,
        ),
    }


# ============================================================
# USER REPLY
#
# POST /api/support/tickets/{ticket_id}/reply
# ============================================================

@router.post(
    "/tickets/{ticket_id}/reply"
)
def reply_to_support_ticket(
    ticket_id: int,
    payload: SupportTicketReplyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    ticket = add_user_reply(
        db=db,
        user=current_user,
        ticket_id=ticket_id,
        message=payload.message,
    )

    return {
        "success": True,
        "message": (
            "Reply sent successfully."
        ),
        "ticket": serialize_ticket(
            ticket,
            include_messages=True,
        ),
    }