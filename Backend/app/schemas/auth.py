from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict,
)


# =====================================================
# SIGNUP
# =====================================================

class SignupRequest(BaseModel):
    referralCode: str | None = None

    fullName: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    phoneNumber: str = Field(
        min_length=4,
        max_length=30,
    )

    country: str = Field(
        min_length=2,
        max_length=100,
    )

    password: str = Field(
    min_length=8,
    max_length=72,
    )

    confirmPassword: str = Field(
    min_length=8,
    max_length=72,
    )


class SignupResponse(BaseModel):
    success: bool
    message: str

    customer_id: str
    referral_id: str

    full_name: str
    email: str
    phone_number: str
    country: str

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================================
# SIGN IN
# =====================================================

class SigninRequest(BaseModel):
    # Email OR Customer ID
    login: str = Field(
        min_length=3,
        max_length=255,
    )

    password: str = Field(
        min_length=1,
        max_length=128,
    )

    remember_me: bool = False


class SigninResponse(BaseModel):
    success: bool
    message: str

    access_token: str
    refresh_token: str
    token_type: str = "bearer"

    access_token_expires_in: int

    user_id: int
    customer_id: str
    referral_code: str

    full_name: str
    email: str

    role: str
    is_admin: bool


# =====================================================
# REFRESH TOKEN
# =====================================================

class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    success: bool

    access_token: str
    token_type: str = "bearer"

    access_token_expires_in: int


# =====================================================
# CURRENT USER / ME
# =====================================================

class CurrentUserResponse(BaseModel):
    success: bool

    user_id: int
    customer_id: str
    referral_code: str

    full_name: str
    email: str

    role: str
    is_admin: bool
    is_active: bool
    

class ForgotPasswordRequest(BaseModel):
    login: str = Field(
        min_length=3,
        max_length=255,
    )


class ForgotPasswordResponse(BaseModel):
    success: bool
    message: str


class VerifyOTPRequest(BaseModel):
    login: str = Field(
        min_length=3,
        max_length=255,
    )

    otp: str = Field(
        min_length=6,
        max_length=6,
    )


class VerifyOTPResponse(BaseModel):
    success: bool
    message: str


class ResetPasswordRequest(BaseModel):
    login: str = Field(
        min_length=3,
        max_length=255,
    )

    otp: str = Field(
        min_length=6,
        max_length=6,
    )

    new_password: str = Field(
        min_length=8,
        max_length=72,
    )

    confirm_password: str = Field(
        min_length=8,
        max_length=72,
    )


class ResetPasswordResponse(BaseModel):
    success: bool
    message: str