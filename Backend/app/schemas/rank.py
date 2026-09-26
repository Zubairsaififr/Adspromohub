from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class RankStatusResponse(BaseModel):
    current_rank: Optional[str] = None
    current_rank_display: Optional[str] = None
    rank_history: List[Dict[str, Any]]
    next_rank: Optional[Dict[str, Any]] = None