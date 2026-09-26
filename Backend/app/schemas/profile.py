from pydantic import BaseModel, Field


# =========================================================
# PROFILE
# =========================================================

class UpdateProfileRequest(BaseModel):
    first_name: str = Field(
        min_length=2,
        max_length=75,
    )

    last_name: str = Field(
        min_length=1,
        max_length=75,
    )

    gender: str | None = Field(
        default=None,
        max_length=20,
    )

    address: str | None = Field(
        default=None,
        max_length=500,
    )


# =========================================================
# BEP20
# =========================================================

class UpdateBEP20Request(BaseModel):
    bep20_address: str = Field(
        min_length=42,
        max_length=42,
    )


# =========================================================
# PASSWORD
# =========================================================

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(
        min_length=1,
        max_length=72,
    )

    new_password: str = Field(
        min_length=8,
        max_length=72,
    )

    confirm_password: str = Field(
        min_length=8,
        max_length=72,
    )