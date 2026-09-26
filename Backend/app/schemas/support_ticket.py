# app/schemas/support_ticket.py

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# CREATE TICKET
# ============================================================

class SupportTicketCreate(BaseModel):
    category: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    subject: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )

    description: str = Field(
        ...,
        min_length=3,
        max_length=10000,
    )

    priority: str = Field(
        default="normal",
        max_length=20,
    )


# ============================================================
# REPLY
# ============================================================

class SupportTicketReplyCreate(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
    )


# ============================================================
# ADMIN STATUS UPDATE
# ============================================================

class SupportTicketStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        max_length=30,
    )


# ============================================================
# ADMIN UPDATE
# ============================================================

class SupportTicketAdminUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None


# ============================================================
# MESSAGE RESPONSE
# ============================================================

class TicketMessageResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    sender_type: str

    sender_id: Optional[int] = None

    message: str

    created_at: datetime


# ============================================================
# TICKET RESPONSE
# ============================================================

class SupportTicketResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    ticket_number: str

    category: str

    subject: str

    description: str

    priority: str

    status: str

    created_at: datetime

    updated_at: datetime

    resolved_at: Optional[datetime] = None

    messages: List[TicketMessageResponse] = []


# ============================================================
# USER TICKET LIST
# ============================================================

class TicketsListResponse(BaseModel):
    success: bool = True

    tickets: List[SupportTicketResponse]


# ============================================================
# SINGLE TICKET
# ============================================================

class SingleTicketResponse(BaseModel):
    success: bool = True

    ticket: SupportTicketResponse