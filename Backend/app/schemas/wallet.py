from decimal import Decimal

from pydantic import BaseModel


class IncomeWalletResponse(BaseModel):
    success: bool

    balance: Decimal

    total_earned: Decimal

    total_withdrawn: Decimal