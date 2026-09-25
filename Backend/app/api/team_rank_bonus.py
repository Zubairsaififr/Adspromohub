from decimal import Decimal
from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.api.auth import (
    get_current_user,
)

from app.core.database import (
    get_db,
)

from app.models.user import (
    User,
)

from app.models.team_rank_bonus import (
    TeamRankBonus,
)


router = APIRouter(
    prefix="/api/team-rank-bonus",
    tags=["Team Rank Bonus"],
)


# =========================================================
# MY TEAM RANK BONUS
# =========================================================

@router.get("/me")
def get_my_team_rank_bonus(
    db: Session = Depends(
        get_db
    ),
    current_user: User = Depends(
        get_current_user
    ),
):

    records = (
        db.query(
            TeamRankBonus
        )
        .filter(
            TeamRankBonus.user_id
            == current_user.id
        )
        .order_by(
            TeamRankBonus.id.desc()
        )
        .all()
    )

    total_earned = sum(
        (
            record.bonus_amount
            for record in records
            if record.status
            == "credited"
        ),
        Decimal("0.00"),
    )

    return {
        "success": True,

        "total_earned": (
            total_earned
        ),

        "count": len(
            records
        ),

        "bonuses": [
            {
                "id": record.id,

                "source_user_id": (
                    record.source_user_id
                ),

                "source_user": {
                    "id": (
                        record.source_user.id
                    ),

                    "customer_id": (
                        record.source_user
                        .customer_id
                    ),

                    "full_name": (
                        record.source_user
                        .full_name
                    ),
                }
                if record.source_user
                else None,

                "subscription_transaction_id": (
                    record
                    .subscription_transaction_id
                ),

                "rank_name": (
                    record.rank_name
                ),

                "package_amount": (
                    record.package_amount
                ),

                "rank_pool_amount": (
                    record.rank_pool_amount
                ),

                "rank_percentage": (
                    record.rank_percentage
                ),

                "bonus_amount": (
                    record.bonus_amount
                ),

                "status": (
                    record.status
                ),

                "created_at": (
                    record.created_at
                ),
            }

            for record in records
        ],
    }