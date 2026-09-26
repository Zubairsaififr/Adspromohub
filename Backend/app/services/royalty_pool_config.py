from decimal import Decimal


# =========================================================
# ROYALTY POOL CONFIGURATION
# =========================================================
#
# BUSINESS RULE:
#
# 1. Every direct referral creates a separate leg.
#
# 2. The largest leg is the POWER LEG.
#
# 3. Power Leg is NOT applicable for Royalty matching.
#
# 4. After excluding the Power Leg, minimum 2 DIFFERENT
#    legs must satisfy the same matching threshold.
#
# 5. Once a matching slab is qualified, Royalty is paid
#    PER QUALIFYING NON-POWER LEG.
#
# 6. Additional non-power legs satisfying the selected
#    matching slab can also receive the same per-leg
#    daily Royalty amount.
#
# 7. Highest currently qualified matching slab applies.
#
# 8. If team strength drops below the qualification,
#    Royalty pauses.
#
# 9. While paused:
#       - no Royalty is credited
#       - cap progress does NOT increase
#       - previous earned amount is preserved
#
# 10. When qualification becomes valid again,
#     earning resumes from the previous cap progress.
#
# 11. Royalty must never exceed the slab's total cap.
#
# =========================================================


# =========================================================
# GENERAL SETTINGS
# =========================================================

ROYALTY_MINIMUM_MATCHING_LEGS = 2

ROYALTY_POWER_LEG_COUNT = 1

ROYALTY_STATUS_CREDITED = "credited"

ROYALTY_INCOME_TYPE = "royalty"

ROYALTY_REFERENCE_TYPE = "royalty_pool"


# =========================================================
# MONEY
# =========================================================

MONEY_ZERO = Decimal("0.00")

MONEY_QUANT = Decimal("0.01")


# =========================================================
# ROYALTY SLABS
# =========================================================
#
# threshold
#     Minimum member count required in EACH matching
#     non-power leg.
#
# daily_per_leg
#     Amount paid per qualifying non-power leg per day.
#
# total_cap
#     Maximum Royalty earning limit for that slab.
#
# IMPORTANT:
#
# Higher slab replaces lower slab for CURRENT DAILY
# calculation.
#
# Example:
#
# Power Leg = 700
#
# Other Legs:
#
#   Leg B = 520
#   Leg C = 510
#   Leg D = 310
#
# B + C satisfy 500 / 500.
#
# Therefore current matching slab = 500.
#
# Daily rate = $7 per qualifying leg.
#
# At the selected 500 slab:
#
#   B qualifies
#   C qualifies
#   D does NOT qualify
#
# Daily Royalty:
#
#   2 × $7 = $14
#
# =========================================================

ROYALTY_SLABS = [

    {
        "threshold": 100_000,
        "daily_per_leg": Decimal("300.00"),
        "total_cap": Decimal("100000.00"),
    },

    {
        "threshold": 50_000,
        "daily_per_leg": Decimal("200.00"),
        "total_cap": Decimal("50000.00"),
    },

    {
        "threshold": 30_000,
        "daily_per_leg": Decimal("100.00"),
        "total_cap": Decimal("30000.00"),
    },

    {
        "threshold": 20_000,
        "daily_per_leg": Decimal("50.00"),
        "total_cap": Decimal("15000.00"),
    },

    {
        "threshold": 10_000,
        "daily_per_leg": Decimal("40.00"),
        "total_cap": Decimal("10000.00"),
    },

    {
        "threshold": 5_000,
        "daily_per_leg": Decimal("30.00"),
        "total_cap": Decimal("5000.00"),
    },

    {
        "threshold": 3_000,
        "daily_per_leg": Decimal("20.00"),
        "total_cap": Decimal("3000.00"),
    },

    {
        "threshold": 1_000,
        "daily_per_leg": Decimal("10.00"),
        "total_cap": Decimal("2000.00"),
    },

    {
        "threshold": 500,
        "daily_per_leg": Decimal("7.00"),
        "total_cap": Decimal("1000.00"),
    },

    {
        "threshold": 300,
        "daily_per_leg": Decimal("5.00"),
        "total_cap": Decimal("500.00"),
    },

    {
        "threshold": 100,
        "daily_per_leg": Decimal("4.00"),
        "total_cap": Decimal("300.00"),
    },

    {
        "threshold": 50,
        "daily_per_leg": Decimal("2.00"),
        "total_cap": Decimal("200.00"),
    },

    {
        "threshold": 25,
        "daily_per_leg": Decimal("1.00"),
        "total_cap": Decimal("100.00"),
    },
]


# =========================================================
# VALIDATION
# =========================================================

def validate_royalty_config() -> None:
    """
    Validate Royalty Pool configuration when module loads.

    This protects us from accidentally adding an invalid
    slab later.
    """

    if ROYALTY_MINIMUM_MATCHING_LEGS < 2:
        raise RuntimeError(
            "Royalty Pool requires at least "
            "2 matching non-power legs."
        )

    if not ROYALTY_SLABS:
        raise RuntimeError(
            "Royalty Pool slabs are empty."
        )

    previous_threshold = None

    seen_thresholds = set()

    for slab in ROYALTY_SLABS:

        threshold = int(
            slab["threshold"]
        )

        daily_per_leg = Decimal(
            str(
                slab["daily_per_leg"]
            )
        )

        total_cap = Decimal(
            str(
                slab["total_cap"]
            )
        )

        if threshold <= 0:
            raise RuntimeError(
                "Royalty threshold must be greater than 0."
            )

        if threshold in seen_thresholds:
            raise RuntimeError(
                f"Duplicate Royalty threshold: {threshold}"
            )

        seen_thresholds.add(
            threshold
        )

        if daily_per_leg <= MONEY_ZERO:
            raise RuntimeError(
                f"Royalty daily amount for "
                f"{threshold}+ must be greater than 0."
            )

        if total_cap <= MONEY_ZERO:
            raise RuntimeError(
                f"Royalty cap for "
                f"{threshold}+ must be greater than 0."
            )

        # Slabs must remain highest -> lowest.
        if (
            previous_threshold is not None
            and threshold >= previous_threshold
        ):
            raise RuntimeError(
                "ROYALTY_SLABS must be ordered "
                "from highest threshold to lowest."
            )

        previous_threshold = threshold


# =========================================================
# GET SLAB BY THRESHOLD
# =========================================================

def get_royalty_slab_by_threshold(
    threshold: int,
):
    """
    Return exact Royalty slab by threshold.
    """

    threshold = int(
        threshold or 0
    )

    for slab in ROYALTY_SLABS:

        if int(
            slab["threshold"]
        ) == threshold:

            return slab

    return None


# =========================================================
# FIND HIGHEST MATCHING SLAB
# =========================================================

def find_highest_matching_slab(
    non_power_leg_counts: list[int],
):
    """
    Find the highest slab where at least TWO
    different non-power legs satisfy the threshold.

    Example:

        [520, 510, 310]

    500 threshold:
        520 >= 500
        510 >= 500

    Therefore selected slab = 500.

    310 does not qualify for the selected slab.
    """

    normalized_counts = [

        max(
            0,
            int(count or 0),
        )

        for count
        in non_power_leg_counts
    ]


    for slab in ROYALTY_SLABS:

        threshold = int(
            slab["threshold"]
        )


        matching_count = sum(

            1

            for count
            in normalized_counts

            if count >= threshold
        )


        if (
            matching_count
            >=
            ROYALTY_MINIMUM_MATCHING_LEGS
        ):

            return slab


    return None


# =========================================================
# GET QUALIFYING LEG COUNTS
# =========================================================

def get_qualifying_leg_counts(
    non_power_leg_counts: list[int],
    threshold: int,
) -> list[int]:
    """
    Return only non-power legs that satisfy
    the selected matching threshold.
    """

    threshold = int(
        threshold or 0
    )


    if threshold <= 0:
        return []


    return [

        max(
            0,
            int(count or 0),
        )

        for count
        in non_power_leg_counts

        if int(count or 0)
        >= threshold
    ]


# =========================================================
# CALCULATE DAILY ROYALTY
# =========================================================

def calculate_daily_royalty(
    qualifying_leg_count: int,
    daily_per_leg: Decimal,
) -> Decimal:
    """
    Calculate theoretical daily Royalty BEFORE cap.

    Example:

        qualifying legs = 3
        daily per leg = $1

        total = $3/day
    """

    qualifying_leg_count = max(
        0,
        int(
            qualifying_leg_count or 0
        ),
    )


    daily_per_leg = Decimal(
        str(
            daily_per_leg or 0
        )
    )


    if (
        qualifying_leg_count
        <
        ROYALTY_MINIMUM_MATCHING_LEGS
    ):
        return MONEY_ZERO


    if daily_per_leg <= MONEY_ZERO:
        return MONEY_ZERO


    return (
        daily_per_leg
        *
        Decimal(
            qualifying_leg_count
        )
    ).quantize(
        MONEY_QUANT
    )


# =========================================================
# MODULE VALIDATION
# =========================================================

validate_royalty_config()