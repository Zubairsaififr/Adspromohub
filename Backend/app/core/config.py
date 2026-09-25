from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ==========================================
    # DATABASE
    # ==========================================

    DB_HOST: str
    DB_PORT: int = 3306
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    # ==========================================
    # JWT / AUTH
    # ==========================================

    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ==========================================
    # REFERRAL
    # ==========================================

    DEFAULT_REFERRAL_CODE: str = "APH5555"

    # ==========================================
    # ADMIN
    # ==========================================

    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    # ==========================================
    # ADS / DAILY COMPOUNDING
    # ==========================================

    # DEVELOPMENT:
    # 5 minutes
    #
    # PRODUCTION:
    # 720 minutes = 12 hours

    

    AD_WATCH_SECONDS: int = 5

# DEVELOPMENT = 5 minutes
# PRODUCTION = 720 minutes = 12 hours
    COMPOUNDING_CREDIT_DELAY_MINUTES: int = 1

    AD_WATCH_START_HOUR: int = 00
    AD_WATCH_END_HOUR: int = 24

    BUSINESS_TIMEZONE: str = "Asia/Kolkata"
    # ==========================================
    # ENV CONFIG
    # ==========================================
    APP_ENV: str = "development"



    WITHDRAWAL_MIN_AMOUNT: float = 5.0
    WITHDRAWAL_FEE_PERCENT: float = 5.0
    WITHDRAWAL_AUTO_MAX_AMOUNT: float = 20.0

    WITHDRAWAL_OTP_EXPIRE_MINUTES: int = 10
    WITHDRAWAL_OTP_MAX_ATTEMPTS: int = 5
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )



# ==============================================
# IMPORTANT
# This creates the settings object imported by:
#
# from app.core.config import settings
# ==============================================

settings = Settings()