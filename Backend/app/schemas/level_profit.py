from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class LevelProfitHistoryItem(BaseModel):
    id: int

    source_user_id: int
    source_customer_id: Optional[str] = None
    source_user_name: Optional[str] = None

    level: int

    source_growth_amount: float
    percentage: float

    calculated_amount: float
    credited_amount: float

    daily_cap: float

    status: str

    created_at: datetime


class LevelProfitSummaryResponse(BaseModel):
    success: bool

    direct_count: int

    unlocked_up_to_level: int

    today_earned: float
    daily_cap: float
    remaining_daily_cap: float

    total_level_profit: float

    level_1_2_percentage: float
    level_3_5_percentage: float
    level_6_8_percentage: float
    level_9_10_percentage: float


class LevelProfitHistoryResponse(BaseModel):
    success: bool

    total: int

    history: List[
        LevelProfitHistoryItem
    ]