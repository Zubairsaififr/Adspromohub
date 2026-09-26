from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db

from app.api.auth import get_current_user

from app.models.user import User
from app.models.withdrawal import Withdrawal
from app.models.income_wallet import IncomeWallet

from app.schemas.withdrawal import (
    WithdrawalCreateRequest,
    WithdrawalOTPVerifyRequest,
)

from app.services.withdrawal_service import (
    create_withdrawal_request,
    verify_withdrawal_otp,
)


router = APIRouter(
    prefix="/withdrawals",
    tags=["Withdrawals"],
)


# ============================================================
# HELPERS
# ============================================================

def serialize_withdrawal(
    withdrawal: Withdrawal,
):
    return {
        "id": withdrawal.id,

        "amount": str(
            withdrawal.amount
        ),

        "fee": str(
            withdrawal.fee
        ),

        "net_amount": str(
            withdrawal.net_amount
        ),

        "fee_percentage": str(
            withdrawal.fee_percentage
        ),

        "bep20_address":
            withdrawal.bep20_address,

        "processing_type":
            withdrawal.processing_type,

        "status":
            withdrawal.status,

        "otp_verified":
            bool(
                withdrawal.otp_verified
            ),

        "payment_reference":
            withdrawal.payment_reference,

        "created_at":
            withdrawal.created_at,

        "otp_verified_at":
            withdrawal.otp_verified_at,

        "approved_at":
            withdrawal.approved_at,

        "paid_at":
            withdrawal.paid_at,

        "rejected_at":
            withdrawal.rejected_at,

        "cancelled_at":
            withdrawal.cancelled_at,
    }


def mask_phone_number(
    phone_number: str | None,
):
    """
    Example:
    +919876543210 -> +91******3210
    """

    if not phone_number:
        return ""

    phone = str(phone_number)

    if len(phone) <= 4:
        return "*" * len(phone)

    return (
        phone[:3]
        + "*" * max(
            len(phone) - 7,
            3,
        )
        + phone[-4:]
    )


# ============================================================
# CREATE WITHDRAWAL
#
# FRONTEND:
#
# POST /withdrawals/
# {
#     "amount": 10
# }
# ============================================================

@router.post("/")
def create_withdrawal(
    payload: WithdrawalCreateRequest,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    try:

        result = (
            create_withdrawal_request(
                db=db,
                user=current_user,
                requested_amount=payload.amount,
            )
        )

        withdrawal = result[
            "withdrawal"
        ]

        db.commit()

        db.refresh(
            withdrawal
        )

        response = {
            "success": True,

            "message": (
                "Withdrawal request created. "
                "Please verify the OTP."
            ),

            "withdrawal_id":
                withdrawal.id,

            "amount":
                float(
                    withdrawal.amount
                ),

            "fee":
                float(
                    withdrawal.fee
                ),

            "net_amount":
                float(
                    withdrawal.net_amount
                ),

            "processing_type":
                withdrawal.processing_type,

            "status":
                withdrawal.status,

            "phone_number":
                mask_phone_number(
                    current_user.phone_number
                ),
        }


        # ====================================================
        # DEVELOPMENT ONLY
        #
        # Until real SMS provider is connected.
        #
        # NEVER expose OTP in production.
        # ====================================================

        if (
            settings.APP_ENV.lower()
            == "development"
        ):
            response["dev_otp"] = (
                result["raw_otp"]
            )


        return response

    except HTTPException:
        db.rollback()
        raise

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to create withdrawal: "
                f"{str(exc)}"
            ),
        )


# ============================================================
# VERIFY OTP
#
# FRONTEND:
#
# POST /withdrawals/{withdrawal_id}/verify-otp
#
# {
#     "otp": "123456"
# }
# ============================================================

@router.post(
    "/{withdrawal_id}/verify-otp"
)
def verify_otp(
    withdrawal_id: int,

    payload: WithdrawalOTPVerifyRequest,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    try:

        result = verify_withdrawal_otp(
            db=db,

            user=current_user,

            withdrawal_id=
                withdrawal_id,

            otp=payload.otp,
        )

        withdrawal = result[
            "withdrawal"
        ]

        next_action = result[
            "next_action"
        ]

        db.commit()

        db.refresh(
            withdrawal
        )


        # ====================================================
        # AUTO CATEGORY
        # ====================================================

        if next_action == "auto_payment":

            message = (
                "OTP verified successfully. "
                "Your withdrawal is ready for "
                "automatic payment processing."
            )


        # ====================================================
        # ADMIN CATEGORY
        # ====================================================

        else:

            message = (
                "OTP verified successfully. "
                "Your withdrawal is pending "
                "admin approval."
            )


        return {
            "success": True,

            "message":
                message,

            "withdrawal_id":
                withdrawal.id,

            "otp_verified":
                withdrawal.otp_verified,

            "processing_type":
                withdrawal.processing_type,

            "status":
                withdrawal.status,

            "next_action":
                next_action,

            "amount":
                float(
                    withdrawal.amount
                ),

            "fee":
                float(
                    withdrawal.fee
                ),

            "net_amount":
                float(
                    withdrawal.net_amount
                ),
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to verify OTP: "
                f"{str(exc)}"
            ),
        )


# ============================================================
# MY WITHDRAWAL HISTORY
#
# FRONTEND:
#
# GET /withdrawals/me
# ============================================================

@router.get("/me")
def get_my_withdrawals(
    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    withdrawals = (
        db.query(
            Withdrawal
        )
        .filter(
            Withdrawal.user_id
            == current_user.id
        )
        .order_by(
            Withdrawal.id.desc()
        )
        .all()
    )

    return {
        "success": True,

        "count":
            len(withdrawals),

        "withdrawals": [
            serialize_withdrawal(
                withdrawal
            )
            for withdrawal
            in withdrawals
        ],
    }


# ============================================================
# SINGLE WITHDRAWAL
#
# Ownership protected.
# User cannot fetch another user's withdrawal.
# ============================================================

@router.get(
    "/{withdrawal_id}"
)
def get_my_withdrawal(
    withdrawal_id: int,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    withdrawal = (
        db.query(
            Withdrawal
        )
        .filter(
            Withdrawal.id
            == withdrawal_id,

            Withdrawal.user_id
            == current_user.id,
        )
        .first()
    )

    if not withdrawal:
        raise HTTPException(
            status_code=404,
            detail="Withdrawal not found.",
        )

    return {
        "success": True,

        "withdrawal":
            serialize_withdrawal(
                withdrawal
            ),
    }