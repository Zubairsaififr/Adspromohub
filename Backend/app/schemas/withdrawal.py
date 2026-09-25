from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


# ============================================================
# CREATE WITHDRAWAL
# ============================================================

class WithdrawalCreateRequest(BaseModel):
    amount: Decimal = Field(
        ...,
        gt=0,
        decimal_places=4,
    )


# ============================================================
# VERIFY OTP
# ============================================================

class WithdrawalOTPVerifyRequest(BaseModel):
    otp: str = Field(
        ...,
        min_length=6,
        max_length=6,
    )


# ============================================================
# ADMIN ACTION
# ============================================================

class WithdrawalAdminActionRequest(BaseModel):
    admin_note: Optional[str] = Field(
        default=None,
        max_length=1000,
    )


# ============================================================
# MARK PAID
# ============================================================

class WithdrawalMarkPaidRequest(BaseModel):
    payment_reference: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )