from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


# =========================================================
# ROYALTY HISTORY ITEM
# =========================================================

class RoyaltyPoolHistoryItem(BaseModel):

    id: int

    slab_threshold: int

    daily_per_leg: Decimal

    slab_total_cap: Decimal

    power_leg_user_id: Optional[int] = None

    power_leg_member_count: int

    qualifying_leg_count: int

    non_power_leg_count: int

    calculated_daily_amount: Decimal

    royalty_amount: Decimal

    cap_earned_before: Decimal

    cap_earned_after: Decimal

    status: str

    payout_date: date

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# LEG DETAILS
# =========================================================

class RoyaltyLegItem(BaseModel):

    user_id: int

    customer_id: str

    full_name: str

    member_count: int

    is_power_leg: bool = False

    qualifies_current_slab: bool = False


# =========================================================
# CURRENT ROYALTY STATUS
# =========================================================

class RoyaltyPoolStatusResponse(BaseModel):

    qualified: bool

    qualification_reason: str

    current_slab: Optional[int] = None

    daily_per_leg: Decimal = Decimal("0.00")

    current_cap: Decimal = Decimal("0.00")

    total_earned: Decimal = Decimal("0.00")

    remaining_cap: Decimal = Decimal("0.00")

    qualifying_leg_count: int = 0

    estimated_daily_royalty: Decimal = Decimal("0.00")

    power_leg: Optional[RoyaltyLegItem] = None

    legs: list[RoyaltyLegItem] = []


# =========================================================
# ROYALTY SUMMARY
# =========================================================

class RoyaltyPoolSummaryResponse(BaseModel):

    total_earned: Decimal

    total_transactions: int

    last_royalty_amount: Decimal = Decimal("0.00")

    last_payout_date: Optional[date] = None

    current_slab: Optional[int] = None

    current_cap: Decimal = Decimal("0.00")

    remaining_cap: Decimal = Decimal("0.00")


# =========================================================
# ROYALTY HISTORY RESPONSE
# =========================================================

class RoyaltyPoolHistoryResponse(BaseModel):

    total_earned: Decimal

    count: int

    history: list[RoyaltyPoolHistoryItem]