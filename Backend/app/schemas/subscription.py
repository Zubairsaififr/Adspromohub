from decimal import Decimal
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class SubscriptionPurchaseRequest(BaseModel):
    amount: Decimal = Field(gt=0)
    # tx_hash: str = Field(min_length=5, max_length=255)
    # from_wallet: str | None = Field(default=None, max_length=100)


class SubscriptionPurchaseResponse(BaseModel):
    success: bool
    message: str

    transaction_id: int
    cycle_id: int
    cycle_number: int

    transaction_type: str

    amount: Decimal
    current_approved_amount: Decimal
    projected_amount: Decimal

    payment_network: str
    tx_hash: str | None

    status: str


class CurrentSubscriptionResponse(BaseModel):
    success: bool

    subscription_active: bool
    subscription_status: str

    cycle_id: int | None = None
    cycle_number: int | None = None

    current_amount: Decimal = Decimal("0.00")
    total_cycle_earnings: Decimal = Decimal("0.00")

    pending_amount: Decimal = Decimal("0.00")

    started_at: datetime | None = None
    expired_at: datetime | None = None


class SubscriptionTransactionResponse(BaseModel):
    id: int
    cycle_id: int

    transaction_type: str

    amount: Decimal
    previous_amount: Decimal
    resulting_amount: Decimal

    payment_network: str

    tx_hash: str | None
    from_wallet: str | None

    status: str
    rejection_reason: str | None

    approved_at: datetime | None
    rejected_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class SubscriptionHistoryResponse(BaseModel):
    success: bool
    transactions: list[SubscriptionTransactionResponse]