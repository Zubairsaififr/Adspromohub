from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


# ============================================================
# FUND STATUS
# ============================================================

class RankAchieverFundStatus(BaseModel):
    rank: str
    fund_type: str

    # Frontend compatibility.
    # Actual fund eligibility is Team + Wallet.
    rank_unlocked: bool = True

    required_team_members: int
    team_members: int
    team_requirement_met: bool

    required_wallet_balance: Decimal
    wallet_balance: Decimal
    wallet_maintenance_met: bool

    monthly_amount: Decimal

    is_eligible: bool
    eligible_at: datetime | None = None

    paid_this_month: bool

    last_payout_date: date | None = None
    total_paid: Decimal


# ============================================================
# STATUS RESPONSE
# ============================================================

class RankAchieverStatusResponse(BaseModel):
    success: bool

    team_members: int
    wallet_balance: Decimal

    payout_year: int
    payout_month: int

    funds: list[RankAchieverFundStatus]


# ============================================================
# HISTORY ITEM
# ============================================================

class RankAchieverHistoryItem(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    rank_name: str
    fund_type: str

    team_members: int
    required_team_members: int

    wallet_balance: Decimal
    required_wallet_balance: Decimal

    amount: Decimal

    payout_year: int
    payout_month: int
    payout_date: date

    status: str

    created_at: datetime


# ============================================================
# HISTORY RESPONSE
# ============================================================

class RankAchieverHistoryResponse(BaseModel):
    success: bool

    total_paid: Decimal
    count: int

    history: list[
        RankAchieverHistoryItem
    ]


# ============================================================
# PROCESS RESPONSE
# ============================================================

class RankAchieverProcessResponse(BaseModel):
    success: bool

    user_id: int

    team_members: int

    credited_count: int

    total_credited: Decimal

    results: list[dict]