from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class ReferralSummaryResponse(BaseModel):
    success: bool

    total_referral_income: Decimal

    first_subscription_income: Decimal

    upgrade_income: Decimal

    total_referral_transactions: int


class ReferralHistoryItem(BaseModel):
    id: int

    source_user_id: int

    source_customer_id: str

    source_name: str

    income_type: str

    base_amount: Decimal

    percentage: Decimal

    referral_amount: Decimal

    status: str

    created_at: datetime


class ReferralHistoryResponse(BaseModel):
    success: bool

    total_referral_income: Decimal

    count: int

    items: list[ReferralHistoryItem]