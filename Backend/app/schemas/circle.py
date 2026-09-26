from pydantic import BaseModel
from typing import List, Optional


class CircleMember(BaseModel):
    user_id: int
    customer_id: Optional[str] = None
    referral_id: Optional[str] = None
    full_name: str

    level: int

    parent_referral_id: Optional[str] = None

    root_leg_referral_id: Optional[str] = None
    root_leg_name: Optional[str] = None

    direct_team_count: int = 0
    total_team_count: int = 0

    is_power_leg: bool = False

    created_at: Optional[str] = None


class CircleSummary(BaseModel):
    success: bool

    direct_members: int
    all_circle_members: int

    total_legs: int

    power_leg_members: int
    other_legs_members: int

    power_leg_referral_id: Optional[str] = None
    power_leg_name: Optional[str] = None


class MyCircleResponse(BaseModel):
    success: bool
    total: int
    members: List[CircleMember]


class MyAllCircleResponse(BaseModel):
    success: bool
    total: int
    members: List[CircleMember]