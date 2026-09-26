from contextlib import asynccontextmanager
from app.core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.core.seed import seed_admin

# IMPORTANT:
# Import all models so SQLAlchemy registers them before create_all().
import app.models

# ============================================
# API ROUTERS
# ============================================

from app.api.auth import router as auth_router
from app.api.user import router as user_router
from app.api.profile import router as profile_router
from app.api.subscription import router as subscription_router

from app.api import (
    referral,
    wallet,
    dailycompoundinggrowth,
    circle,
    level_profit,
    rank,
    dev,
    dev_signup,   
    withdrawal,
    admin_withdrawal,
    team_rank_bonus,
    royalty_pool,
    rank_achiever,
    support_ticket,
    admin_support_ticket,
)


# ============================================
# LIFESPAN
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Create any missing database tables.
    Base.metadata.create_all(bind=engine)

    # Create/default APH5555 admin account.
    seed_admin()

    yield


# ============================================
# FASTAPI APP
# ============================================

app = FastAPI(
    title="AdsPromoHub API",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================
# CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://testerajeet.tech",
        "https://www.testerajeet.tech",
    ],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
)


# ============================================
# ROUTERS
# ============================================

# Authentication
app.include_router(auth_router)

# User
app.include_router(user_router)
app.include_router(profile_router)

# Subscription
app.include_router(subscription_router)

# Referral / Wallet / Income
app.include_router(referral.router)
app.include_router(wallet.router)
app.include_router(dailycompoundinggrowth.router)
app.include_router(circle.router)
app.include_router(level_profit.router)

# Rank systems
app.include_router(rank.router)
app.include_router(team_rank_bonus.router)
app.include_router(royalty_pool.router)
app.include_router(rank_achiever.router)

# Withdrawal
app.include_router(withdrawal.router)
app.include_router(admin_withdrawal.router)

# Support
app.include_router(support_ticket.router)
app.include_router(admin_support_ticket.router)

# Development/testing routes
# Development-only routes
if settings.APP_ENV == "development":
    app.include_router(dev.router)

# Admin-only signup tool, enabled for current live testing
app.include_router(dev_signup.router)
# ============================================
# ROOT
# ============================================

@app.get("/")
def root():
    return {
        "success": True,
        "message": "AdsPromoHub API is running",
    }


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
    }