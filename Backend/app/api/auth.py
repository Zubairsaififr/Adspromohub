import secrets
import hashlib

from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from datetime import datetime, timedelta, timezone
import phonenumbers
import pycountry

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Header,
    status,
)

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.password_reset_otp import PasswordResetOTP

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models.user import User

from app.services.rank_service import evaluate_upline_rank_chain

from app.schemas.auth import (
    SignupRequest,
    SignupResponse,
    SigninRequest,
    SigninResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    CurrentUserResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    VerifyOTPRequest,
    VerifyOTPResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
)

# =====================================================
# ROUTER
# =====================================================

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)
security = HTTPBearer()

def normalize_login(login: str) -> str:
    return login.strip()


def find_user_by_login(
    db: Session,
    login: str,
):
    clean_login = normalize_login(login)

    return (
        db.query(User)
        .filter(
            or_(
                User.email == clean_login.lower(),
                User.customer_id == clean_login.upper(),
            )
        )
        .first()
    )


def generate_reset_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_reset_otp(otp: str) -> str:
    return hashlib.sha256(
        otp.encode("utf-8")
    ).hexdigest()


def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(
        tzinfo=None
    )
# =====================================================
# STRONG PASSWORD VALIDATION
# =====================================================

def validate_strong_password(
    password: str,
) -> None:

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters.",
        )

    if not any(
        char.isupper()
        for char in password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter.",
        )

    if not any(
        char.islower()
        for char in password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one lowercase letter.",
        )

    if not any(
        char.isdigit()
        for char in password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number.",
        )

    if not any(
        not char.isalnum()
        for char in password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one special character.",
        )

    # bcrypt maximum = 72 UTF-8 bytes
    if len(
        password.encode("utf-8")
    ) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password is too long. "
                "Please use a shorter password."
            ),
        )
# =====================================================
# COUNTRY NAME -> ISO REGION
# =====================================================

# Some frontend/common country names do not exactly
# match the official pycountry names.
COUNTRY_ALIASES = {
    "bolivia": "BO",
    "brunei": "BN",
    "cabo verde": "CV",
    "congo": "CG",
    "iran": "IR",
    "laos": "LA",
    "micronesia": "FM",
    "moldova": "MD",
    "north korea": "KP",
    "palestine": "PS",
    "russia": "RU",
    "south korea": "KR",
    "syria": "SY",
    "taiwan": "TW",
    "tanzania": "TZ",
    "turkey": "TR",
    "venezuela": "VE",
    "vietnam": "VN",
    "vatican city": "VA",
}


def find_country_region(
    country_name: str,
) -> str | None:
    country_name = country_name.strip()

    if not country_name:
        return None

    normalized_name = country_name.lower()

    # First check aliases
    if normalized_name in COUNTRY_ALIASES:
        return COUNTRY_ALIASES[normalized_name]

    # Then search official country database
    try:
        country_data = pycountry.countries.lookup(
            country_name
        )

        return country_data.alpha_2

    except LookupError:
        return None


# =====================================================
# GENERATE CUSTOMER / REFERRAL ID
# =====================================================

def generate_customer_id(
    db: Session,
) -> str:
    while True:
        # Generates exactly 8 random digits
        random_number = (
            secrets.randbelow(90_000_000)
            + 10_000_000
        )

        # Final format:
        # APH58392147
        # NO DASH
        customer_id = f"APH{random_number}"

        existing_user = (
            db.query(User)
            .filter(
                (
                    User.customer_id
                    == customer_id
                )
                |
                (
                    User.referral_id
                    == customer_id
                )
            )
            .first()
        )

        if not existing_user:
            return customer_id


# =====================================================
# SIGNUP
# =====================================================

@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: SignupRequest,
    db: Session = Depends(get_db),
):
    # =================================================
    # CLEAN / NORMALIZE VALUES
    # =================================================

    full_name = payload.fullName.strip()

    email = (
        str(payload.email)
        .strip()
        .lower()
    )

    country = payload.country.strip()

    raw_phone = (
        payload.phoneNumber
        .strip()
    )

    # Referral is optional.
    # Blank referral -> APH5555
    if (
        payload.referralCode
        and payload.referralCode.strip()
    ):
        referral_code = (
            payload.referralCode
            .strip()
            .upper()
            .replace("-", "")
            .replace(" ", "")
        )
    else:
        referral_code = (
            settings.DEFAULT_REFERRAL_CODE
            .strip()
            .upper()
        )

    # =================================================
    # FULL NAME VALIDATION
    # =================================================

    if len(full_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid full name.",
        )

    # =================================================
    # PASSWORD VALIDATION
    # =================================================

    validate_strong_password(
        payload.password
    )

    if (
        payload.password
        != payload.confirmPassword
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )

    # =================================================
    # DUPLICATE EMAIL CHECK
    # =================================================

    existing_email = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This email address is already "
                "registered. Please sign in."
            ),
        )

    # =================================================
    # COUNTRY VALIDATION
    # =================================================

    region = find_country_region(country)

    if not region:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected country is currently unsupported.",
        )

    # =================================================
    # PHONE - DIGITS ONLY
    # =================================================

    if not raw_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your phone number.",
        )

    if not raw_phone.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Phone number must contain "
                "numbers only."
            ),
        )

    # =================================================
    # COUNTRY-SPECIFIC PHONE VALIDATION
    # =================================================

    try:
        parsed_phone = phonenumbers.parse(
            raw_phone,
            region,
        )

    except phonenumbers.NumberParseException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Please enter a valid phone "
                f"number for {country}."
            ),
        )

    # Check whether number is possible
    if not phonenumbers.is_possible_number(
        parsed_phone
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Please enter a valid phone "
                f"number for {country}."
            ),
        )

    # Check whether number is actually valid
    if not phonenumbers.is_valid_number(
        parsed_phone
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Please enter a valid phone "
                f"number for {country}."
            ),
        )

    # Extra safety:
    # parsed number must belong to selected country.
    phone_region = (
        phonenumbers.region_code_for_number(
            parsed_phone
        )
    )

    if (
        phone_region
        and phone_region != region
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Phone number does not match "
                f"the selected country ({country})."
            ),
        )

    # =================================================
    # FORMAT PHONE FOR DATABASE
    # =================================================

    international_phone = (
        phonenumbers.format_number(
            parsed_phone,
            phonenumbers.PhoneNumberFormat.E164,
        )
    )

    country_code = (
        f"+{parsed_phone.country_code}"
    )

    # Example:
    #
    # Input:
    # India
    # 9876543210
    #
    # Database:
    # phone_number = +919876543210
    # country_code = +91

    # =================================================
    # DUPLICATE PHONE CHECK
    # =================================================

    existing_phone = (
        db.query(User)
        .filter(
            User.phone_number
            == international_phone
        )
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This phone number is already "
                "registered. Please sign in."
            ),
        )

    # =================================================
    # REFERRAL FORMAT VALIDATION
    # =================================================

    if not referral_code.startswith("APH"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid referral code.",
        )

    # =================================================
    # REFERRAL EXISTENCE VALIDATION
    # =================================================

    referrer = (
        db.query(User)
        .filter(
            User.referral_id
            == referral_code
        )
        .first()
    )

    if not referrer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid referral code.",
        )

    # =================================================
    # REFERRER MUST BE ACTIVE
    # =================================================

    if not referrer.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This referral code is not active."
            ),
        )

    # =================================================
    # GENERATE CUSTOMER ID
    # =================================================

    customer_id = generate_customer_id(
        db
    )

    # IMPORTANT:
    # Customer ID and Referral ID are SAME.
    #
    # Example:
    # customer_id = APH58392147
    # referral_id = APH58392147

    referral_id = customer_id

    # =================================================
    # HASH PASSWORD
    # =================================================

    try:
        password_hash = hash_password(
            payload.password
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unable to process password. "
                "Please use a shorter password."
            ),
        )

    # =================================================
    # CREATE USER
    # =================================================

    user = User(
        customer_id=customer_id,

        referral_id=referral_id,

        referred_by=referral_code,

        full_name=full_name,

        email=email,

        phone_number=international_phone,

        country=country,

        country_code=country_code,

        password_hash=password_hash,

        role="user",

        is_active=True,
    )

    db.add(user)

    # =================================================
    # SAVE USER
    # =================================================

    try:
        # Flush first so the new direct referral is visible
        # to structural rank qualification queries.
        db.flush()

        # Re-evaluate only the affected structural upline chain.
        #
        # Ruby:
        #   referrer reaches 10 directs -> Ruby can be achieved.
        #
        # Higher ranks:
        #   a newly achieved downline rank can immediately make
        #   an ancestor eligible for the next structural rank.
        #
        # No commit happens inside this helper, so signup and
        # structural rank changes remain one DB transaction.
        evaluate_upline_rank_chain(
            db=db,
            starting_user=referrer,
        )

        db.commit()
        db.refresh(user)

    except Exception as exc:
        db.rollback()

        # Keep actual DB error in backend console
        print(
            "Signup / rank evaluation database error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Unable to create account. "
                "Please try again."
            ),
        )

    # =================================================
    # SUCCESS RESPONSE
    # =================================================

    return SignupResponse(
        success=True,

        message=(
            "Registration successful! "
            "Welcome to AdsPromoHub."
        ),

        customer_id=user.customer_id,

        referral_id=user.referral_id,

        full_name=user.full_name,

        email=user.email,

        phone_number=user.phone_number,

        country=user.country,
    )
    
    
# =====================================================
# GET USER FROM ACCESS TOKEN
# =====================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type. Access token required.",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
        )

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive.",
        )

    return user


# =====================================================
# SIGN IN
# =====================================================

@router.post(
    "/signin",
    response_model=SigninResponse,
)
def signin(
    payload: SigninRequest,
    db: Session = Depends(get_db),
):
    login = payload.login.strip()

    if not login:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Please enter your email "
                "or Customer ID."
            ),
        )

    # -------------------------------------------------
    # EMAIL OR CUSTOMER ID
    # -------------------------------------------------

    normalized_email = (
        login.lower()
    )

    normalized_customer_id = (
        login.upper()
        .replace("-", "")
        .replace(" ", "")
    )

    user = (
        db.query(User)
        .filter(
            or_(
                User.email
                == normalized_email,

                User.customer_id
                == normalized_customer_id,
            )
        )
        .first()
    )

    # -------------------------------------------------
    # ACCOUNT NOT FOUND
    # -------------------------------------------------

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "No account found with this "
                "email or Customer ID."
            ),
        )

    # -------------------------------------------------
    # ACTIVE CHECK
    # -------------------------------------------------

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account is inactive. "
                "Please contact support."
            ),
        )

    # -------------------------------------------------
    # PASSWORD
    # -------------------------------------------------

    if not verify_password(
        payload.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password.",
        )

    # -------------------------------------------------
    # TOKENS
    # -------------------------------------------------

    access_token = (
        create_access_token(
            user.id
        )
    )

    refresh_token = (
        create_refresh_token(
            user.id,
            payload.remember_me,
        )
    )

    # -------------------------------------------------
    # ADMIN
    # -------------------------------------------------

    is_admin = (
        user.role.lower() == "admin"
    )

    # Seeded:
    # admin@adspromohub.com
    #
    # We intentionally use DB role instead
    # of trusting an email string.

    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return SigninResponse(
        success=True,

        message="Login successful.",

        access_token=access_token,

        refresh_token=refresh_token,

        token_type="bearer",

        access_token_expires_in=(
            settings.ACCESS_TOKEN_EXPIRE_MINUTES
            * 60
        ),

        user_id=user.id,

        customer_id=user.customer_id,

        referral_code=user.referral_id,

        full_name=user.full_name,

        email=user.email,

        role=user.role,

        is_admin=is_admin,
    )


# =====================================================
# REFRESH ACCESS TOKEN
# =====================================================

@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
)
def refresh_access_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    token_payload = decode_token(
        payload.refresh_token
    )

    if not token_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Session expired. "
                "Please sign in again."
            ),
        )

    if (
        token_payload.get("type")
        != "refresh"
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token.",
        )

    user_id = token_payload.get(
        "sub"
    )

    try:
        user_id = int(user_id)

    except (
        TypeError,
        ValueError,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token.",
        )

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account is inactive. "
                "Please contact support."
            ),
        )

    new_access_token = (
        create_access_token(
            user.id
        )
    )

    return RefreshTokenResponse(
        success=True,

        access_token=(
            new_access_token
        ),

        token_type="bearer",

        access_token_expires_in=(
            settings.ACCESS_TOKEN_EXPIRE_MINUTES
            * 60
        ),
    )


# =====================================================
# CURRENT LOGGED-IN USER
# =====================================================

@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return CurrentUserResponse(
        success=True,

        user_id=current_user.id,

        customer_id=(
            current_user.customer_id
        ),

        referral_code=(
            current_user.referral_id
        ),

        full_name=(
            current_user.full_name
        ),

        email=current_user.email,

        role=current_user.role,

        is_admin=(
            current_user.role.lower()
            == "admin"
        ),

        is_active=(
            current_user.is_active
        ),
    )


# =====================================================
# LOGOUT
# =====================================================

@router.post(
    "/logout",
)
def logout():
    # JWT is stateless.
    # Frontend removes stored tokens.
    #   
    # Later we can add refresh-token
    # revocation in DB for stronger logout.

    return {
        "success": True,
        "message": "Logged out successfully.",
    }
    
@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = find_user_by_login(
        db,
        payload.login,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "No account found with this email "
                "or Customer ID."
            ),
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive.",
        )

    # Remove previous OTPs for this user
    (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.user_id == user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    otp = generate_reset_otp()

    otp_record = PasswordResetOTP(
        user_id=user.id,
        otp_hash=hash_reset_otp(otp),
        expires_at=utc_now() + timedelta(
            minutes=10
        ),
    )

    db.add(otp_record)
    db.commit()

    # DEVELOPMENT ONLY
    print("\n")
    print("=" * 50)
    print("ADSPROMOHUB PASSWORD RESET OTP")
    print("=" * 50)
    print(f"User: {user.full_name}")
    print(f"Customer ID: {user.customer_id}")
    print(f"Email: {user.email}")
    print(f"OTP: {otp}")
    print("OTP expires in 10 minutes.")
    print("=" * 50)
    print("\n")

    return ForgotPasswordResponse(
        success=True,
        message=(
            "OTP generated successfully. "
            "Please enter the 6-digit OTP."
        ),
    )


@router.post(
    "/verify-otp",
    response_model=VerifyOTPResponse,
)
def verify_reset_otp(
    payload: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    user = find_user_by_login(
        db,
        payload.login,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "No account found with this email "
                "or Customer ID."
            ),
        )

    clean_otp = payload.otp.strip()

    if (
        len(clean_otp) != 6
        or not clean_otp.isdigit()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 6-digit OTP.",
        )

    otp_record = (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.user_id == user.id
        )
        .order_by(
            PasswordResetOTP.id.desc()
        )
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "OTP not found. Please request a new OTP."
            ),
        )

    if otp_record.expires_at < utc_now():
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "OTP has expired. Please request a new OTP."
            ),
        )

    submitted_otp_hash = hash_reset_otp(
        clean_otp
    )

    if not secrets.compare_digest(
        submitted_otp_hash,
        otp_record.otp_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect OTP.",
        )

    otp_record.verified_at = utc_now()

    db.commit()

    return VerifyOTPResponse(
        success=True,
        message="OTP verified successfully.",
    )


@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    user = find_user_by_login(
        db,
        payload.login,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "No account found with this email "
                "or Customer ID."
            ),
        )

    clean_otp = payload.otp.strip()

    if (
        len(clean_otp) != 6
        or not clean_otp.isdigit()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 6-digit OTP.",
        )

    if (
        payload.new_password
        != payload.confirm_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )

    validate_strong_password(
        payload.new_password
    )

    otp_record = (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.user_id == user.id
        )
        .order_by(
            PasswordResetOTP.id.desc()
        )
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "OTP not found. Please request a new OTP."
            ),
        )

    if otp_record.expires_at < utc_now():
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "OTP has expired. Please request a new OTP."
            ),
        )

    if otp_record.verified_at is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please verify your OTP first.",
        )

    submitted_otp_hash = hash_reset_otp(
        clean_otp
    )

    if not secrets.compare_digest(
        submitted_otp_hash,
        otp_record.otp_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect OTP.",
        )

    # Update password
    user.password_hash = hash_password(
        payload.new_password
    )

    # OTP can never be reused
    (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.user_id == user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    db.commit()

    return ResetPasswordResponse(
        success=True,
        message=(
            "Password reset successfully. "
            "You can now sign in with your new password."
        ),
    )