from decimal import Decimal, ROUND_DOWN


# ============================================================
# MONEY
# ============================================================

MONEY_ZERO = Decimal("0.00")
MONEY_QUANT = Decimal("0.01")


def money(value) -> Decimal:
    """
    Convert any numeric value safely to 2-decimal Decimal.
    """
    return Decimal(str(value or 0)).quantize(
        MONEY_QUANT,
        rounding=ROUND_DOWN,
    )


# ============================================================
# RANK ACHIEVER CONFIG
# ============================================================
#
# Rank Achiever is a separate monthly fund system.
#
# Eligibility:
#
#   Team Members >= Required Team
#                  AND
#   Income Wallet >= Required Wallet Maintain
#
# Both conditions must be true at payout/check time.
#
# Only one payout per fund per calendar month.
#
# PDF:
# Emerald      -> Business Development Fund
# Sapphire     -> Travel Fund
# Topaz        -> Car Fund
# Amethyst     -> Home Fund
# Diamond      -> Core Fund
# Crown Jewel  -> Lifetime Royalty
#
# ============================================================

RANK_ACHIEVER_CONFIG = {
    "Emerald": {
        "fund_type": "Business Development Fund",
        "required_team_members": 300,
        "required_wallet_balance": Decimal("100.00"),
        "monthly_amount": Decimal("50.00"),
    },

    "Sapphire": {
        "fund_type": "Travel Fund",
        "required_team_members": 500,
        "required_wallet_balance": Decimal("300.00"),
        "monthly_amount": Decimal("100.00"),
    },

    "Topaz": {
        "fund_type": "Car Fund",
        "required_team_members": 1000,
        "required_wallet_balance": Decimal("500.00"),
        "monthly_amount": Decimal("150.00"),
    },

    "Amethyst": {
        "fund_type": "Home Fund",
        "required_team_members": 2000,
        "required_wallet_balance": Decimal("1000.00"),
        "monthly_amount": Decimal("200.00"),
    },

    "Diamond": {
        "fund_type": "Core Fund",
        "required_team_members": 5000,
        "required_wallet_balance": Decimal("2000.00"),
        "monthly_amount": Decimal("500.00"),
    },

    "Crown Jewel": {
        "fund_type": "Lifetime Royalty",
        "required_team_members": 10000,
        "required_wallet_balance": Decimal("5000.00"),
        "monthly_amount": Decimal("1000.00"),
    },
}


# ============================================================
# COMMON LEDGER VALUES
# ============================================================

RANK_ACHIEVER_INCOME_TYPE = "rank_achiever"

RANK_ACHIEVER_REFERENCE_TYPE = "rank_achiever_fund"

RANK_ACHIEVER_STATUS_CREDITED = "credited"


# ============================================================
# CONFIG HELPERS
# ============================================================

def get_rank_achiever_config(
    rank_name: str,
) -> dict | None:

    return RANK_ACHIEVER_CONFIG.get(
        rank_name
    )


def get_all_rank_achiever_configs():
    return RANK_ACHIEVER_CONFIG.items()


# ============================================================
# VALIDATE CONFIG
# ============================================================

def validate_rank_achiever_config() -> None:

    for rank_name, config in RANK_ACHIEVER_CONFIG.items():

        required_team = int(
            config["required_team_members"]
        )

        required_wallet = money(
            config["required_wallet_balance"]
        )

        monthly_amount = money(
            config["monthly_amount"]
        )

        if required_team <= 0:
            raise ValueError(
                f"{rank_name}: required team must be greater than 0"
            )

        if required_wallet <= MONEY_ZERO:
            raise ValueError(
                f"{rank_name}: required wallet must be greater than 0"
            )

        if monthly_amount <= MONEY_ZERO:
            raise ValueError(
                f"{rank_name}: monthly amount must be greater than 0"
            )


validate_rank_achiever_config()