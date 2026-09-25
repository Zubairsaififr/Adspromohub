from datetime import (
    datetime,
    timedelta,
    timezone,
)

import bcrypt

from jose import (
    JWTError,
    jwt,
)

from app.core.config import settings


# =====================================================
# PASSWORD HASH
# =====================================================

def hash_password(
    password: str,
) -> str:
    password_bytes = password.encode(
        "utf-8"
    )

    if len(password_bytes) > 72:
        raise ValueError(
            "Password is too long. "
            "Maximum supported length is 72 bytes."
        )

    salt = bcrypt.gensalt(
        rounds=12
    )

    hashed_password = bcrypt.hashpw(
        password_bytes,
        salt,
    )

    return hashed_password.decode(
        "utf-8"
    )


# =====================================================
# VERIFY PASSWORD
# =====================================================

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode(
                "utf-8"
            ),
            hashed_password.encode(
                "utf-8"
            ),
        )

    except (
        ValueError,
        TypeError,
    ):
        return False


# =====================================================
# CREATE ACCESS TOKEN
# =====================================================

def create_access_token(
    user_id: int,
) -> str:
    now = datetime.now(
        timezone.utc
    )

    expire = now + timedelta(
        minutes=(
            settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


# =====================================================
# CREATE REFRESH TOKEN
# =====================================================

def create_refresh_token(
    user_id: int,
    remember_me: bool = False,
) -> str:
    now = datetime.now(
        timezone.utc
    )

    # Remember Me:
    # use configured long refresh lifetime.
    #
    # Without Remember Me:
    # session refresh lasts 1 day.
    if remember_me:
        refresh_days = (
            settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    else:
        refresh_days = 1

    expire = now + timedelta(
        days=refresh_days
    )

    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


# =====================================================
# DECODE TOKEN
# =====================================================

def decode_token(
    token: str,
) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[
                settings.ALGORITHM
            ],
        )

        return payload

    except JWTError:
        return None