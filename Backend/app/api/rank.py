from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user

from app.models.user import User
from app.models.rank import UserRank
from app.models.rank_bonus import RankBonus
from app.services.rank_config import (
    RANK_CONFIG,
    RANK_ORDER,
)

from app.services.rank_service import (
    evaluate_user_rank,
    check_rank_qualification,
    get_highest_achieved_rank,
    get_rank_index,
)
from app.services.rank_bonus_service import (
    check_rank_bonus_eligibility,
    process_pending_rank_bonuses,
)


router = APIRouter(
    prefix="/api/rank",
    tags=["Rank"],
)


# ============================================================
# CURRENT RANK STATUS
# ============================================================

@router.get("/status")
def get_rank_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    rank_records = (
        db.query(UserRank)
        .filter(
            UserRank.user_id == current_user.id
        )
        .order_by(
            UserRank.achieved_at.asc()
        )
        .all()
    )

    highest_rank = get_highest_achieved_rank(
        db,
        current_user.id,
    )
    history = []

    for record in rank_records:

        config = RANK_CONFIG.get(
        record.rank_name,
        {},
    )

        bonus_record = (
            db.query(RankBonus)
            .filter(
            RankBonus.user_id == current_user.id,
            RankBonus.rank_name == record.rank_name,
            RankBonus.status == "credited",
        )
        .first()
    )

        history.append(
        {
            "rank_name": record.rank_name,

            "display_name": config.get(
                "display_name",
                record.rank_name,
            ),

            "status": record.status,

            "achieved_at": record.achieved_at,
            "superseded_at": record.superseded_at,

            # -------------------------------
            # Instant Rank Bonus
            # -------------------------------

            "instant_bonus": config.get(
                "instant_bonus",
                0,
            ),

            "instant_bonus_credited":
                bonus_record is not None,

            "instant_bonus_received": (
                float(bonus_record.bonus_amount)
                if bonus_record
                else 0
            ),

            # -------------------------------
            # Future hierarchy information
            # -------------------------------

            "wallet_maintain": config.get(
                "wallet_maintain",
                0,
            ),

            "hierarchy_cap": config.get(
                "hierarchy_cap",
                0,
            ),
        }
    )

    # --------------------------------------------
    # Determine next rank
    # --------------------------------------------

    if highest_rank:

        current_index = get_rank_index(
            highest_rank.rank_name
        )

        next_index = current_index + 1

    else:

        next_index = 0

    next_rank_data = None

    if next_index < len(RANK_ORDER):

        next_rank_name = RANK_ORDER[next_index]

        qualification = check_rank_qualification(
            db,
            current_user,
            next_rank_name,
        )

        config = RANK_CONFIG[next_rank_name]

        next_rank_data = {
            "rank_name": next_rank_name,
            "display_name": config["display_name"],

            "qualified": qualification["qualified"],

            "requirements": config["requirements"],

            "wallet_maintain":
                config["wallet_maintain"],

            "instant_bonus":
                config["instant_bonus"],

            "hierarchy_cap":
                config["hierarchy_cap"],

            "qualification":
                qualification,
        }

    return {
        "current_rank": (
            highest_rank.rank_name
            if highest_rank
            else None
        ),

        "current_rank_display": (
            RANK_CONFIG[
                highest_rank.rank_name
            ]["display_name"]
            if highest_rank
            else None
        ),

        "rank_history": history,

        "next_rank": next_rank_data,
    }


# ============================================================
# EVALUATE / ACHIEVE CURRENT USER RANK
# ============================================================
@router.post("/evaluate")
def evaluate_my_rank(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        # --------------------------------------------------
        # STEP 1: Structural Rank Evaluation
        # --------------------------------------------------
        rank_result = evaluate_user_rank(
            db,
            current_user,
        )

        # Flush so newly achieved rank is immediately
        # visible to Rank Bonus service.
        db.flush()

        # --------------------------------------------------
        # STEP 2: Process eligible one-time Rank Bonuses
        # --------------------------------------------------
        bonus_result = process_pending_rank_bonuses(
            db,
            current_user,
        )

        # Rank + bonus commit together.
        db.commit()

        return {
            "success": True,
            "message": "Rank evaluation completed.",
            "rank": rank_result,
            "instant_bonus": bonus_result,
        }

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Rank evaluation failed: {str(exc)}",
        )
        
        
        
@router.get("/bonus-status")
def get_rank_bonus_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    results = []

    for rank_name in RANK_ORDER:

        config = RANK_CONFIG[rank_name]

        eligibility = check_rank_bonus_eligibility(
            db,
            current_user,
            rank_name,
        )

        results.append(
            {
                "rank_name": rank_name,
                "display_name": config["display_name"],
                "required_wallet_balance": config["wallet_maintain"],
                "instant_bonus": config["instant_bonus"],
                "status": eligibility,
            }
        )

    return {
        "success": True,
        "ranks": results,
    }