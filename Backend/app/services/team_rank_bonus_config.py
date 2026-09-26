from decimal import Decimal


# =========================================================
# TEAM RANK BONUS
# =========================================================

# Step 1:
# 15% of fresh user's NEW package
TEAM_RANK_BASE_PERCENT = Decimal("15.00")

# Step 2:
# 30% of that 15% base becomes the
# actual Team Rank distribution pool
TEAM_RANK_DISTRIBUTION_PERCENT = Decimal("30.00")


# =========================================================
# RANK DISTRIBUTION WEIGHTS
# =========================================================
#
# Total weight = 30
#
# The actual distribution pool is divided
# according to these weights.
#
# Ruby         = 5 / 30
# Emerald      = 5 / 30
# Sapphire     = 5 / 30
# Topaz        = 5 / 30
# Amethyst     = 4 / 30
# Diamond      = 3 / 30
# Crown Jewel  = 3 / 30
# =========================================================

TEAM_RANK_WEIGHTS = {
    "ruby": Decimal("5.00"),
    "emerald": Decimal("5.00"),
    "sapphire": Decimal("5.00"),
    "topaz": Decimal("5.00"),
    "amethyst": Decimal("4.00"),
    "diamond": Decimal("3.00"),
    "crown_jewel": Decimal("3.00"),
}


TEAM_RANK_ORDER = [
    "ruby",
    "emerald",
    "sapphire",
    "topaz",
    "amethyst",
    "diamond",
    "crown_jewel",
]


TEAM_RANK_TOTAL_WEIGHT = sum(
    TEAM_RANK_WEIGHTS.values(),
    Decimal("0.00"),
)


if TEAM_RANK_TOTAL_WEIGHT != Decimal("30.00"):
    raise RuntimeError(
        "Team Rank Bonus rank weights must total 30."
    )