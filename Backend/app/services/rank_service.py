from datetime import datetime, timezone
from typing import Dict, List, Optional, Set, Tuple

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.rank import UserRank
from app.models.subscription import SubscriptionCycle
from app.services.rank_config import RANK_CONFIG, RANK_ORDER


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ============================================================
# BASIC RANK HELPERS
# ============================================================

def get_rank_index(rank_name: Optional[str]) -> int:
    if not rank_name:
        return -1

    try:
        return RANK_ORDER.index(rank_name)
    except ValueError:
        return -1


def get_user_rank_history(
    db: Session,
    user_id: int,
) -> List[UserRank]:
    return (
        db.query(UserRank)
        .filter(UserRank.user_id == user_id)
        .order_by(UserRank.achieved_at.asc())
        .all()
    )


def get_highest_achieved_rank(
    db: Session,
    user_id: int,
) -> Optional[UserRank]:

    records = get_user_rank_history(db, user_id)

    if not records:
        return None

    return max(
        records,
        key=lambda record: get_rank_index(record.rank_name),
    )


def has_achieved_rank(
    db: Session,
    user_id: int,
    required_rank: str,
) -> bool:
    """
    IMPORTANT:
    This checks whether the EXACT rank was ever achieved.

    Example:
    If user has achieved Ruby and later Emerald,
    Ruby still exists in rank history as superseded.

    Therefore Ruby achievement is still known historically.
    """

    return (
        db.query(UserRank)
        .filter(
            UserRank.user_id == user_id,
            UserRank.rank_name == required_rank,
        )
        .first()
        is not None
    )


# ============================================================
# ACTIVE SUBSCRIPTION HELPER
# ============================================================

def has_active_subscription(
    db: Session,
    user: User,
) -> bool:
    """
    Structural rank activation/upgrade requires the user's
    OWN subscription cycle to be active.

    IMPORTANT:
    - User.is_active is only the account/login status.
    - Ad watching does NOT belong to structural rank activation.
    - Already achieved ranks are historical and are not removed here.
    """

    return (
        db.query(SubscriptionCycle.id)
        .filter(
            SubscriptionCycle.user_id == user.id,
            SubscriptionCycle.status == "active",
        )
        .first()
        is not None
    )


# ============================================================
# REFERRAL TREE HELPERS
# ============================================================

def get_direct_children(
    db: Session,
    referral_id: str,
) -> List[User]:

    return (
        db.query(User)
        .filter(User.referred_by == referral_id)
        .order_by(User.id.asc())
        .all()
    )


def get_direct_count(
    db: Session,
    user: User,
) -> int:
    """
    Counts only DIRECT referrals whose own subscription is ACTIVE.

    Business rule:
    - A registered referral without an active subscription does NOT
      count toward Ruby's direct requirement.
    - User.is_active is account/login status and is not used here.
    """

    return (
        db.query(User)
        .join(
            SubscriptionCycle,
            SubscriptionCycle.user_id == User.id,
        )
        .filter(
            User.referred_by == user.referral_id,
            SubscriptionCycle.status == "active",
        )
        .distinct()
        .count()
    )


def collect_branch_users(
    db: Session,
    root_user: User,
) -> List[User]:
    """
    Returns the complete branch starting from one DIRECT referral.

    The direct referral itself is included.

    Example:

        Main User
           |
         Direct A       <- root_user
         /     \\
       B        C
       |
       D

    Returned:
        [A, B, C, D]

    Every direct referral of the main user therefore represents
    one separate ROOT LEG.
    """

    result: List[User] = []
    visited: Set[int] = set()

    stack: List[User] = [root_user]

    while stack:

        current = stack.pop()

        if current.id in visited:
            continue

        visited.add(current.id)
        result.append(current)

        children = get_direct_children(
            db,
            current.referral_id,
        )

        stack.extend(children)

    return result


def get_root_legs(
    db: Session,
    user: User,
) -> List[Dict]:
    """
    Every direct referral creates one independent root leg.
    """

    directs = get_direct_children(
        db,
        user.referral_id,
    )

    legs = []

    for direct in directs:

        members = collect_branch_users(
            db,
            direct,
        )

        legs.append(
            {
                "root_user": direct,
                "root_referral_id": direct.referral_id,
                "members": members,
            }
        )

    return legs


# ============================================================
# RANK PRESENCE INSIDE ONE LEG
# ============================================================

def get_leg_rank_candidates(
    db: Session,
    leg: Dict,
) -> Dict[str, List[User]]:
    """
    Returns which users inside this root leg have historically
    achieved each rank.

    Example:

    {
        "ruby": [UserA, UserB],
        "emerald": [UserC],
        "sapphire": [],
        ...
    }

    IMPORTANT:
    Multiple Ruby users inside the SAME leg do NOT create
    multiple qualifying legs.

    This function only tells us that the rank exists in the leg.
    Distinct-leg assignment happens later.
    """

    result = {
        rank_name: []
        for rank_name in RANK_ORDER
    }

    for member in leg["members"]:

        rank_records = (
            db.query(UserRank)
            .filter(UserRank.user_id == member.id)
            .all()
        )

        for rank_record in rank_records:

            if rank_record.rank_name in result:
                result[rank_record.rank_name].append(member)

    return result


# ============================================================
# DISTINCT LEG MATCHING
# ============================================================

def expand_requirements(
    requirements: Dict[str, int],
) -> List[str]:
    """
    Example:

    {
        "emerald": 1,
        "ruby": 2
    }

    becomes:

    [
        "emerald",
        "ruby",
        "ruby"
    ]

    Each item represents ONE required slot.

    Every slot MUST be filled by a DIFFERENT root leg.
    """

    slots: List[str] = []

    # Higher ranks first generally reduces ambiguous matching.
    sorted_requirements = sorted(
        requirements.items(),
        key=lambda item: get_rank_index(item[0]),
        reverse=True,
    )

    for rank_name, count in sorted_requirements:

        for _ in range(count):
            slots.append(rank_name)

    return slots


def find_distinct_leg_assignment(
    slots: List[str],
    leg_candidates: List[Dict],
) -> Optional[List[Dict]]:
    """
    Backtracking matcher.

    CRITICAL BUSINESS RULE:

    ONE ROOT LEG CAN ONLY SATISFY ONE REQUIRED RANK SLOT.

    Example Sapphire:

        Emerald = 1
        Ruby    = 2

    Valid:

        Leg A -> Emerald
        Leg B -> Ruby
        Leg C -> Ruby

    Invalid:

        Leg A -> Emerald + Ruby
        Leg B -> Ruby

    because only 2 different root legs are being used.
    """

    used_leg_indexes: Set[int] = set()
    assignment: List[Dict] = []


    def backtrack(slot_index: int) -> bool:

        if slot_index >= len(slots):
            return True

        required_rank = slots[slot_index]

        for leg_index, leg_data in enumerate(leg_candidates):

            if leg_index in used_leg_indexes:
                continue

            candidates = leg_data["rank_candidates"].get(
                required_rank,
                [],
            )

            if not candidates:
                continue

            # This root leg is now reserved for this one slot.
            used_leg_indexes.add(leg_index)

            selected_user = candidates[0]

            assignment.append(
                {
                    "required_rank": required_rank,

                    "root_leg_referral_id":
                        leg_data["root_referral_id"],

                    "root_leg_user_id":
                        leg_data["root_user"].id,

                    "root_leg_user_name":
                        leg_data["root_user"].full_name,

                    "matched_user_id":
                        selected_user.id,

                    "matched_user_referral_id":
                        selected_user.referral_id,

                    "matched_user_name":
                        selected_user.full_name,
                }
            )

            if backtrack(slot_index + 1):
                return True

            assignment.pop()
            used_leg_indexes.remove(leg_index)

        return False


    if backtrack(0):
        return assignment

    return None


# ============================================================
# CHECK ONE RANK
# ============================================================

def check_ruby_qualification(
    db: Session,
    user: User,
) -> Dict:

    required_directs = int(
        RANK_CONFIG["ruby"]["requirements"]["directs"]
    )

    direct_count = get_direct_count(
        db,
        user,
    )

    qualified = direct_count >= required_directs

    return {
        "rank_name": "ruby",
        "qualified": qualified,

        "direct_count": direct_count,
        "required_directs": required_directs,

        "requirements": {
            "directs": required_directs,
        },

        "matched_legs": [],
    }


def check_group_rank_qualification(
    db: Session,
    user: User,
    rank_name: str,
) -> Dict:

    config = RANK_CONFIG[rank_name]
    requirements = config["requirements"]

    root_legs = get_root_legs(
        db,
        user,
    )

    slots = expand_requirements(
        requirements,
    )

    # Quick failure:
    # If rank needs 5 slots, at least 5 root legs are required.
    if len(root_legs) < len(slots):

        return {
            "rank_name": rank_name,
            "qualified": False,

            "requirements": requirements,

            "required_distinct_legs": len(slots),
            "available_root_legs": len(root_legs),

            "matched_legs": [],
        }


    leg_candidates = []

    for leg in root_legs:

        rank_candidates = get_leg_rank_candidates(
            db,
            leg,
        )

        leg_candidates.append(
            {
                **leg,
                "rank_candidates": rank_candidates,
            }
        )


    assignment = find_distinct_leg_assignment(
        slots=slots,
        leg_candidates=leg_candidates,
    )


    return {
        "rank_name": rank_name,

        "qualified": assignment is not None,

        "requirements": requirements,

        "required_distinct_legs": len(slots),
        "available_root_legs": len(root_legs),

        "matched_legs": assignment or [],
    }


def check_rank_qualification(
    db: Session,
    user: User,
    rank_name: str,
) -> Dict:

    if rank_name not in RANK_CONFIG:
        raise ValueError(
            f"Invalid rank: {rank_name}"
        )

    if rank_name == "ruby":
        return check_ruby_qualification(
            db,
            user,
        )

    return check_group_rank_qualification(
        db,
        user,
        rank_name,
    )


# ============================================================
# ACHIEVE / UPGRADE RANK
# ============================================================

def achieve_rank(
    db: Session,
    user: User,
    rank_name: str,
) -> Tuple[UserRank, bool]:
    """
    Creates the rank only once.

    Returns:
        (rank_record, newly_created)
    """

    existing = (
        db.query(UserRank)
        .filter(
            UserRank.user_id == user.id,
            UserRank.rank_name == rank_name,
        )
        .first()
    )

    if existing:
        return existing, False


    now = utc_now()


    # Supersede only the currently active/achieved rank.
    current_records = (
        db.query(UserRank)
        .filter(
            UserRank.user_id == user.id,
            UserRank.status == "achieved",
        )
        .all()
    )

    for record in current_records:

        if get_rank_index(record.rank_name) < get_rank_index(rank_name):

            record.status = "superseded"
            record.superseded_at = now
            record.updated_at = now


    new_rank = UserRank(
        user_id=user.id,
        rank_name=rank_name,
        status="achieved",
        achieved_at=now,
        created_at=now,
        updated_at=now,
    )

    db.add(new_rank)
    db.flush()

    return new_rank, True


# ============================================================
# EVALUATE USER'S NEXT RANKS
# ============================================================

def evaluate_user_rank(
    db: Session,
    user: User,
) -> Dict:
    """
    Evaluates ranks in hierarchy order.

    IMPORTANT:
    We intentionally process sequentially:

        Ruby
        Emerald
        Sapphire
        Topaz
        Amethyst
        Diamond
        Crown Jewel

    A rank achievement is permanent historical data.

    Activity, wallet maintenance, instant bonus and hierarchy
    compounding DO NOT belong here.
    """

    newly_achieved = []

    current_rank_record = get_highest_achieved_rank(
        db,
        user.id,
    )

    # ------------------------------------------------------------
    # OWN ACTIVE SUBSCRIPTION GATE
    # ------------------------------------------------------------
    # A user cannot newly achieve Ruby or upgrade to any higher
    # structural rank until their own subscription cycle is active.
    #
    # This does NOT remove an already achieved historical rank.
    # Ad-watching / instant-bonus / 10X eligibility remain separate.
    if not has_active_subscription(db, user):
        return {
            "user_id": user.id,
            "referral_id": user.referral_id,

            "current_rank": (
                current_rank_record.rank_name
                if current_rank_record
                else None
            ),

            "current_rank_display": (
                RANK_CONFIG[current_rank_record.rank_name]["display_name"]
                if current_rank_record
                else None
            ),

            "newly_achieved": [],

            "qualification_results": [
                {
                    "qualified": False,
                    "reason": "own_subscription_not_active",
                }
            ],
        }

    current_rank_index = (
        get_rank_index(current_rank_record.rank_name)
        if current_rank_record
        else -1
    )


    qualification_results = []


    for rank_index, rank_name in enumerate(RANK_ORDER):

        # Already achieved historically.
        if rank_index <= current_rank_index:
            continue


        result = check_rank_qualification(
            db,
            user,
            rank_name,
        )

        qualification_results.append(result)


        if not result["qualified"]:

            # Rank hierarchy is sequential.
            #
            # If Emerald is not qualified,
            # we do not jump directly to Sapphire.
            break


        rank_record, created = achieve_rank(
            db,
            user,
            rank_name,
        )


        if created:

            newly_achieved.append(
                {
                    "rank_name": rank_name,

                    "display_name":
                        RANK_CONFIG[rank_name]["display_name"],

                    "rank_id": rank_record.id,

                    "qualification": result,
                }
            )


        # Flush so newly achieved ranks are immediately visible
        # if another calculation inside this transaction needs them.
        db.flush()


    final_rank = get_highest_achieved_rank(
        db,
        user.id,
    )


    return {
        "user_id": user.id,
        "referral_id": user.referral_id,

        "current_rank": (
            final_rank.rank_name
            if final_rank
            else None
        ),

        "current_rank_display": (
            RANK_CONFIG[final_rank.rank_name]["display_name"]
            if final_rank
            else None
        ),

        "newly_achieved": newly_achieved,

        "qualification_results": qualification_results,
    }


# ============================================================
# OPTIONAL NETWORK RECALCULATION
# ============================================================

def evaluate_all_users(
    db: Session,
) -> List[Dict]:
    """
    Useful for admin/testing/recalculation.

    Why multiple passes?

    Example:

    Pass 1:
        Downline users become Ruby.

    Pass 2:
        Their uplines may now qualify for Emerald.

    Pass 3:
        Higher ranks may become available.

    Maximum passes = number of ranks + 1.
    """

    users = (
        db.query(User)
        .filter(User.is_active == True)
        .order_by(User.id.desc())
        .all()
    )

    all_results = []


    for _ in range(len(RANK_ORDER) + 1):

        created_something = False
        pass_results = []


        for user in users:

            result = evaluate_user_rank(
                db,
                user,
            )

            pass_results.append(result)

            if result["newly_achieved"]:
                created_something = True


        db.flush()

        all_results = pass_results


        if not created_something:
            break


    return all_results

# ============================================================
# TARGETED UPLINE RANK PROPAGATION
# ============================================================

def evaluate_upline_rank_chain(
    db: Session,
    starting_user: User,
) -> List[Dict]:
    """
    Re-evaluate only the affected structural upline chain.

    Pass the direct referrer as starting_user after a new signup.

    This function:
    - evaluates the referrer and each ancestor
    - allows newly achieved downline ranks to be visible upstream
    - prevents infinite loops if referral data contains a cycle
    - does NOT commit; the caller owns the transaction
    - does NOT process instant rank bonuses
    """

    results: List[Dict] = []
    visited_user_ids: Set[int] = set()

    current_user: Optional[User] = starting_user

    while current_user is not None:

        if current_user.id in visited_user_ids:
            break

        visited_user_ids.add(current_user.id)

        result = evaluate_user_rank(
            db,
            current_user,
        )

        results.append(result)

        # Newly created rank history must be visible while
        # evaluating the next ancestor in this transaction.
        db.flush()

        parent_referral_id = (
            current_user.referred_by.strip()
            if current_user.referred_by
            else None
        )

        if not parent_referral_id:
            break

        parent_user = (
            db.query(User)
            .filter(
                User.referral_id == parent_referral_id
            )
            .first()
        )

        if parent_user is None:
            break

        current_user = parent_user

    return results

