from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user

from app.models.user import User

from app.schemas.support_ticket import (
    SupportTicketReplyCreate,
    SupportTicketStatusUpdate,
    SupportTicketAdminUpdate,
)

from app.services.support_ticket_service import (
    get_ticket_for_admin,
    add_admin_reply,
    update_ticket_status,
    update_ticket_priority,
)

from app.models.support_ticket import SupportTicket


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/admin/support",
    tags=["Admin Support Tickets"],
)


# ============================================================
# ADMIN AUTH
# ============================================================

def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:

    role = (current_user.role or "").strip().lower()

    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required.",
        )

    return current_user


# ============================================================
# SERIALIZE MESSAGE
# ============================================================

def serialize_message(message):
    return {
        "id": message.id,
        "ticket_id": message.ticket_id,
        "sender_type": message.sender_type,
        "sender_id": message.sender_id,
        "message": message.message,
        "created_at": message.created_at,
    }


# ============================================================
# SERIALIZE USER
# ============================================================

def serialize_user(user: Optional[User]):

    if not user:
        return None

    return {
        "id": user.id,
        "customer_id": user.customer_id,
        "referral_id": user.referral_id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
    }


# ============================================================
# SERIALIZE TICKET
# ============================================================

def serialize_ticket(
    ticket: SupportTicket,
    user: Optional[User] = None,
    include_messages: bool = False,
):

    data = {
        "id": ticket.id,
        "ticket_number": ticket.ticket_number,
        "user_id": ticket.user_id,

        "category": ticket.category,
        "subject": ticket.subject,
        "description": ticket.description,

        "priority": ticket.priority,
        "status": ticket.status,

        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "resolved_at": ticket.resolved_at,

        # Nested user object
        "user": serialize_user(user),

        # Also expose these directly for dashboard compatibility
        "full_name": user.full_name if user else None,
        "email": user.email if user else None,
        "phone_number": user.phone_number if user else None,
        "customer_id": user.customer_id if user else None,
        "referral_id": user.referral_id if user else None,
    }

    if include_messages:
        data["messages"] = [
            serialize_message(message)
            for message in ticket.messages
        ]

    return data


# ============================================================
# GET ALL SUPPORT TICKETS
#
# GET /api/admin/support/tickets
# ============================================================

@router.get("/tickets")
def get_all_support_tickets(
    status_filter: Optional[str] = Query(
        default=None
    ),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):

    query = db.query(SupportTicket)

    # --------------------------------------------------------
    # OPTIONAL STATUS FILTER
    # --------------------------------------------------------

    if (
        status_filter
        and status_filter.strip().lower() != "all"
    ):
        status_value = (
            status_filter
            .strip()
            .lower()
        )

        query = query.filter(
            SupportTicket.status == status_value
        )

    # --------------------------------------------------------
    # NEWEST / UPDATED FIRST
    # --------------------------------------------------------

    tickets = (
        query
        .order_by(
            SupportTicket.updated_at.desc(),
            SupportTicket.id.desc(),
        )
        .all()
    )

    # --------------------------------------------------------
    # LOAD USERS IN ONE QUERY
    # --------------------------------------------------------

    user_ids = list({
        ticket.user_id
        for ticket in tickets
    })

    users_map = {}

    if user_ids:
        users = (
            db.query(User)
            .filter(
                User.id.in_(user_ids)
            )
            .all()
        )

        users_map = {
            user.id: user
            for user in users
        }

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "count": len(tickets),
        "tickets": [
            serialize_ticket(
                ticket=ticket,
                user=users_map.get(
                    ticket.user_id
                ),
                include_messages=False,
            )
            for ticket in tickets
        ],
    }


# ============================================================
# GET SINGLE SUPPORT TICKET
#
# GET /api/admin/support/tickets/{ticket_id}
# ============================================================

@router.get("/tickets/{ticket_id}")
def get_admin_support_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):

    ticket = get_ticket_for_admin(
        db=db,
        ticket_id=ticket_id,
    )

    user = (
        db.query(User)
        .filter(
            User.id == ticket.user_id
        )
        .first()
    )

    return {
        "success": True,
        "ticket": serialize_ticket(
            ticket=ticket,
            user=user,
            include_messages=True,
        ),
    }


# ============================================================
# ADMIN REPLY
#
# POST /api/admin/support/tickets/{ticket_id}/reply
# ============================================================

@router.post("/tickets/{ticket_id}/reply")
def admin_reply_to_ticket(
    ticket_id: int,
    payload: SupportTicketReplyCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    ticket = add_admin_reply(
        db=db,
        admin=current_admin,
        ticket_id=ticket_id,
        message=payload.message,
    )

    user = (
        db.query(User)
        .filter(User.id == ticket.user_id)
        .first()
    )

    return {
        "success": True,
        "message": "Reply sent successfully.",
        "ticket": serialize_ticket(
            ticket=ticket,
            user=user,
            include_messages=True,
        ),
    }

# ============================================================
# UPDATE STATUS
#
# PUT /api/admin/support/tickets/{ticket_id}/status
# ============================================================

@router.put("/tickets/{ticket_id}/status")
def admin_update_ticket_status(
    ticket_id: int,
    payload: SupportTicketStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    ticket = update_ticket_status(
        db=db,
        ticket_id=ticket_id,
        new_status=payload.status,
    )

    user = (
        db.query(User)
        .filter(User.id == ticket.user_id)
        .first()
    )

    return {
        "success": True,
        "message": "Ticket status updated successfully.",
        "ticket": serialize_ticket(
            ticket=ticket,
            user=user,
            include_messages=True,
        ),
    }

# ============================================================
# UPDATE PRIORITY
#
# PUT /api/admin/support/tickets/{ticket_id}/priority
# ============================================================

@router.put("/tickets/{ticket_id}/priority")
def admin_update_ticket_priority(
    ticket_id: int,
    payload: SupportTicketAdminUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):

    if not payload.priority:
        raise HTTPException(
            status_code=400,
            detail="Priority is required.",
        )

    ticket = update_ticket_priority(
        db=db,
        ticket_id=ticket_id,
        priority=payload.priority,
    )

    user = (
        db.query(User)
        .filter(
            User.id == ticket.user_id
        )
        .first()
    )

    return {
        "success": True,
        "message": "Ticket priority updated successfully.",
        "ticket": serialize_ticket(
            ticket=ticket,
            user=user,
            include_messages=True,
        ),
    }