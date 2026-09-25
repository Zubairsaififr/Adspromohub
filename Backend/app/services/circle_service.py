from typing import Dict, List, Optional, Set

from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.daily_compounding_growth import DailyCompoundingGrowth


# =========================================================
# DIRECT CHILDREN
# =========================================================

def get_direct_children(
    db: Session,
    referral_id: Optional[str],
) -> List[User]:

    if not referral_id:
        return []

    return (
        db.query(User)
        .filter(
            User.referred_by == referral_id
        )
        .order_by(
            User.id.asc()
        )
        .all()
    )


# =========================================================
# COUNT COMPLETE BRANCH
#
# Example:
#
# A
# └── B
#     ├── C
#     │   └── D
#     └── E
#
# B branch size = B + C + D + E = 4
#
# =========================================================

def count_complete_branch(
    db: Session,
    user: User,
    visited: Optional[Set[int]] = None,
) -> int:

    if visited is None:
        visited = set()

    # Safety against accidental circular referral data.
    if user.id in visited:
        return 0

    visited.add(user.id)

    total = 1

    children = get_direct_children(
        db=db,
        referral_id=user.referral_id,
    )

    for child in children:

        total += count_complete_branch(
            db=db,
            user=child,
            visited=visited,
        )

    return total


# =========================================================
# COUNT TEAM BELOW USER
#
# Does NOT include the user himself.
#
# =========================================================

def count_team_below_user(
    db: Session,
    user: User,
) -> int:

    complete_branch = count_complete_branch(
        db=db,
        user=user,
        visited=set(),
    )

    return max(
        complete_branch - 1,
        0,
    )


# =========================================================
# DIRECT COUNT
# =========================================================

def get_user_direct_count(
    db: Session,
    user: User,
) -> int:

    return len(
        get_direct_children(
            db=db,
            referral_id=user.referral_id,
        )
    )


# =========================================================
# ROOT LEGS
#
# Every direct referral of current user creates one leg.
# =========================================================

def get_root_legs(
    db: Session,
    user: User,
):

    direct_members = get_direct_children(
        db=db,
        referral_id=user.referral_id,
    )

    legs = []

    for member in direct_members:

        branch_size = count_complete_branch(
            db=db,
            user=member,
            visited=set(),
        )

        legs.append({
            "user": member,
            "branch_size": branch_size,
        })

    return legs


# =========================================================
# POWER LEG
#
# Power leg = branch with highest TOTAL member count.
#
# If multiple legs have same highest size,
# all tied legs are treated as power legs.
# =========================================================

def get_power_leg_ids(
    legs,
) -> Set[int]:

    if not legs:
        return set()

    highest_size = max(
        leg["branch_size"]
        for leg in legs
    )

    return {
        leg["user"].id
        for leg in legs
        if leg["branch_size"] == highest_size
    }


# =========================================================
# SERIALIZE DATE
# =========================================================

def serialize_created_at(user: User):

    created_at = getattr(
        user,
        "created_at",
        None,
    )

    if not created_at:
        return None

    return created_at.isoformat()


# =========================================================
# TODAY AD WATCH STATUS
#
# Business timezone: Asia/Kolkata (UTC +05:30)
#
# Returns True only when the user has actually completed
# today's advertisement watch.
# =========================================================

def has_watched_ad_today(
    db: Session,
    user_id: int,
) -> bool:

    ist = timezone(
        timedelta(
            hours=5,
            minutes=30,
        )
    )

    now_ist = datetime.now(ist)

    start_ist = now_ist.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    end_ist = (
        start_ist
        + timedelta(days=1)
    )

    # Database timestamps are stored as naive UTC.
    start_utc = (
        start_ist
        .astimezone(timezone.utc)
        .replace(tzinfo=None)
    )

    end_utc = (
        end_ist
        .astimezone(timezone.utc)
        .replace(tzinfo=None)
    )

    record = (
        db.query(
            DailyCompoundingGrowth.id
        )
        .filter(
            DailyCompoundingGrowth.user_id
            == user_id,

            DailyCompoundingGrowth.ads_completed
            .is_(True),

            DailyCompoundingGrowth.ad_completed_at
            .isnot(None),

            DailyCompoundingGrowth.ad_completed_at
            >= start_utc,

            DailyCompoundingGrowth.ad_completed_at
            < end_utc,
        )
        .first()
    )

    return record is not None


# =========================================================
# MY CIRCLE
#
# ONLY direct referrals.
# =========================================================

def get_my_circle(
    db: Session,
    user: User,
):

    legs = get_root_legs(
        db=db,
        user=user,
    )

    power_leg_ids = get_power_leg_ids(
        legs
    )

    members = []

    for leg in legs:

        member = leg["user"]

        direct_team_count = (
            get_user_direct_count(
                db=db,
                user=member,
            )
        )

        # Excludes the direct member himself.
        total_team_count = max(
            leg["branch_size"] - 1,
            0,
        )

        members.append({

            "user_id":
                member.id,

            "customer_id":
                getattr(
                    member,
                    "customer_id",
                    None,
                ),

            "referral_id":
                member.referral_id,

            "full_name":
                member.full_name,

            "level":
                1,

            "parent_referral_id":
                member.referred_by,

            "root_leg_referral_id":
                member.referral_id,

            "root_leg_name":
                member.full_name,

            "direct_team_count":
                direct_team_count,

            "total_team_count":
                total_team_count,

            "branch_member_count":
                leg["branch_size"],

            "is_power_leg":
                member.id
                in power_leg_ids,

            "ads_watched_today":
                has_watched_ad_today(
                    db=db,
                    user_id=member.id,
                ),

            "created_at":
                serialize_created_at(
                    member
                ),
        })

    return members


# =========================================================
# RECURSIVE ALL CIRCLE BUILDER
# =========================================================

def build_all_circle_branch(
    db: Session,

    current_user: User,

    level: int,

    root_leg: User,

    power_leg_ids: Set[int],

    result: List[Dict],

    visited: Set[int],
):

    if current_user.id in visited:
        return

    visited.add(
        current_user.id
    )

    direct_team_count = (
        get_user_direct_count(
            db=db,
            user=current_user,
        )
    )

    total_team_count = (
        count_team_below_user(
            db=db,
            user=current_user,
        )
    )

    result.append({

        "user_id":
            current_user.id,

        "customer_id":
            getattr(
                current_user,
                "customer_id",
                None,
            ),

        "referral_id":
            current_user.referral_id,

        "full_name":
            current_user.full_name,

        "level":
            level,

        "parent_referral_id":
            current_user.referred_by,

        # This tells us which main branch
        # this downline member belongs to.
        "root_leg_referral_id":
            root_leg.referral_id,

        "root_leg_name":
            root_leg.full_name,

        "direct_team_count":
            direct_team_count,

        "total_team_count":
            total_team_count,

        "is_power_leg":
            root_leg.id
            in power_leg_ids,

        "created_at":
            serialize_created_at(
                current_user
            ),
    })


    children = get_direct_children(
        db=db,
        referral_id=current_user.referral_id,
    )


    for child in children:

        build_all_circle_branch(

            db=db,

            current_user=child,

            level=level + 1,

            root_leg=root_leg,

            power_leg_ids=power_leg_ids,

            result=result,

            visited=visited,
        )


# =========================================================
# MY ALL CIRCLE
# =========================================================

def get_my_all_circle(
    db: Session,
    user: User,
):

    legs = get_root_legs(
        db=db,
        user=user,
    )

    power_leg_ids = get_power_leg_ids(
        legs
    )

    result = []

    visited = set()


    for leg in legs:

        root_member = leg["user"]

        build_all_circle_branch(

            db=db,

            current_user=root_member,

            level=1,

            root_leg=root_member,

            power_leg_ids=power_leg_ids,

            result=result,

            visited=visited,
        )


    return result


# =========================================================
# SUMMARY
# =========================================================

def get_circle_summary(
    db: Session,
    user: User,
):

    legs = get_root_legs(
        db=db,
        user=user,
    )


    direct_members = len(
        legs
    )


    all_circle_members = sum(
        leg["branch_size"]
        for leg in legs
    )


    if not legs:

        return {

            "success":
                True,

            "direct_members":
                0,

            "all_circle_members":
                0,

            "total_legs":
                0,

            "power_leg_members":
                0,

            "other_legs_members":
                0,

            "power_leg_referral_id":
                None,

            "power_leg_name":
                None,

            "power_legs":
                [],
        }


    highest_size = max(
        leg["branch_size"]
        for leg in legs
    )


    power_legs = [

        leg

        for leg in legs

        if leg["branch_size"]
        ==
        highest_size
    ]


    # If there is only one largest leg,
    # these fields give quick access to it.
    #
    # If tied, power_legs below contains all tied branches.

    primary_power_leg = (
        power_legs[0]
        if power_legs
        else None
    )


    power_leg_members = (
        highest_size
        if power_legs
        else 0
    )


    other_legs_members = max(
        all_circle_members
        -
        power_leg_members,
        0,
    )


    return {

        "success":
            True,

        "direct_members":
            direct_members,

        "all_circle_members":
            all_circle_members,

        "total_legs":
            direct_members,

        "power_leg_members":
            power_leg_members,

        "other_legs_members":
            other_legs_members,

        "power_leg_referral_id":
            (
                primary_power_leg[
                    "user"
                ].referral_id

                if primary_power_leg

                else None
            ),

        "power_leg_name":
            (
                primary_power_leg[
                    "user"
                ].full_name

                if primary_power_leg

                else None
            ),

        "power_legs": [

            {
                "user_id":
                    leg["user"].id,

                "customer_id":
                    getattr(
                        leg["user"],
                        "customer_id",
                        None,
                    ),

                "referral_id":
                    leg["user"].referral_id,

                "full_name":
                    leg["user"].full_name,

                "branch_member_count":
                    leg["branch_size"],
            }

            for leg in power_legs
        ],
    }