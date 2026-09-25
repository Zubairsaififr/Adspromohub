from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user

from app.models.user import User
from app.models.withdrawal import Withdrawal

from app.schemas.withdrawal import (
    WithdrawalAdminActionRequest,
    WithdrawalMarkPaidRequest,
)

from app.services.withdrawal_service import (
    approve_withdrawal,
    reject_withdrawal,
    mark_withdrawal_paid,
)


router = APIRouter(
    prefix="/api/admin/withdrawals",
    tags=["Admin Withdrawals"],
)


# ============================================================
# ADMIN AUTH
# ============================================================

def require_admin(
    current_user: User = Depends(get_current_user),
):
    if str(current_user.role or "").lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required.",
        )

    if not current_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Admin account is inactive.",
        )

    return current_user


# ============================================================
# SERIALIZER
# ============================================================

def serialize_admin_withdrawal(
    withdrawal: Withdrawal,
):
    user = withdrawal.user

    return {
        "id": withdrawal.id,

        "user_id": withdrawal.user_id,

        "user": {
            "id": user.id if user else None,

            "customer_id": (
                getattr(user, "customer_id", None)
                if user
                else None
            ),

            "referral_id": (
                getattr(user, "referral_id", None)
                if user
                else None
            ),

            "full_name": (
                getattr(user, "full_name", None)
                if user
                else None
            ),

            "email": (
                getattr(user, "email", None)
                if user
                else None
            ),

            "phone_number": (
                getattr(user, "phone_number", None)
                if user
                else None
            ),
        },

        "amount": str(withdrawal.amount),

        "fee_percentage": str(
            withdrawal.fee_percentage
        ),

        "fee": str(withdrawal.fee),

        "net_amount": str(
            withdrawal.net_amount
        ),

        "bep20_address":
            withdrawal.bep20_address,

        "processing_type":
            withdrawal.processing_type,

        "status":
            withdrawal.status,

        "otp_verified":
            bool(withdrawal.otp_verified),

        "payment_reference":
            withdrawal.payment_reference,

        "admin_note":
            withdrawal.admin_note,

        "approved_by":
            withdrawal.approved_by,

        "rejected_by":
            withdrawal.rejected_by,

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

        "updated_at":
            withdrawal.updated_at,
    }


# ============================================================
# LIST WITHDRAWALS
#
# GET /api/admin/withdrawals
#
# Optional:
# ?status=pending
# ?processing_type=admin
# ============================================================

@router.get("")
def get_admin_withdrawals(
    status: Optional[str] = Query(
        default=None
    ),

    processing_type: Optional[str] = Query(
        default=None
    ),

    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),

    offset: int = Query(
        default=0,
        ge=0,
    ),

    admin_user: User = Depends(
        require_admin
    ),

    db: Session = Depends(get_db),
):
    query = db.query(Withdrawal)

    if status:
        query = query.filter(
            Withdrawal.status
            == status.lower().strip()
        )

    if processing_type:
        query = query.filter(
            Withdrawal.processing_type
            == processing_type.lower().strip()
        )

    total = query.count()

    withdrawals = (
        query
        .order_by(
            Withdrawal.id.desc()
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "success": True,

        "total": total,

        "count": len(withdrawals),

        "offset": offset,

        "limit": limit,

        "withdrawals": [
            serialize_admin_withdrawal(item)
            for item in withdrawals
        ],
    }


# ============================================================
# SINGLE WITHDRAWAL
#
# GET /api/admin/withdrawals/{id}
# ============================================================

@router.get("/{withdrawal_id}")
def get_admin_withdrawal(
    withdrawal_id: int,

    admin_user: User = Depends(
        require_admin
    ),

    db: Session = Depends(get_db),
):
    withdrawal = (
        db.query(Withdrawal)
        .filter(
            Withdrawal.id
            == withdrawal_id
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
            serialize_admin_withdrawal(
                withdrawal
            ),
    }


# ============================================================
# APPROVE
#
# ONLY:
# processing_type = admin
# otp_verified = true
# status = pending
#
# POST /api/admin/withdrawals/{id}/approve
# ============================================================

@router.post(
    "/{withdrawal_id}/approve"
)
def admin_approve_withdrawal(
    withdrawal_id: int,

    payload: WithdrawalAdminActionRequest,

    admin_user: User = Depends(
        require_admin
    ),

    db: Session = Depends(get_db),
):
    try:
        withdrawal = approve_withdrawal(
            db=db,

            withdrawal_id=
                withdrawal_id,

            admin_user=
                admin_user,

            admin_note=
                payload.admin_note,
        )

        db.commit()

        db.refresh(withdrawal)

        return {
            "success": True,

            "message":
                "Withdrawal approved successfully.",

            "withdrawal":
                serialize_admin_withdrawal(
                    withdrawal
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
                "Unable to approve withdrawal: "
                f"{str(exc)}"
            ),
        )


# ============================================================
# REJECT
#
# Reserved amount is returned to wallet.
#
# POST /api/admin/withdrawals/{id}/reject
# ============================================================

@router.post(
    "/{withdrawal_id}/reject"
)
def admin_reject_withdrawal(
    withdrawal_id: int,

    payload: WithdrawalAdminActionRequest,

    admin_user: User = Depends(
        require_admin
    ),

    db: Session = Depends(get_db),
):
    try:
        withdrawal = reject_withdrawal(
            db=db,

            withdrawal_id=
                withdrawal_id,

            admin_user=
                admin_user,

            admin_note=
                payload.admin_note,
        )

        db.commit()

        db.refresh(withdrawal)

        return {
            "success": True,

            "message": (
                "Withdrawal rejected and "
                "reserved amount refunded."
            ),

            "withdrawal":
                serialize_admin_withdrawal(
                    withdrawal
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
                "Unable to reject withdrawal: "
                f"{str(exc)}"
            ),
        )


# ============================================================
# MARK PAID
#
# ADMIN withdrawal:
# pending -> approve -> approved -> paid
#
# AUTO withdrawal:
# Actual automatic payment processor will call the payment
# service later. Admin endpoint is primarily for approved
# manual withdrawals.
#
# POST /api/admin/withdrawals/{id}/mark-paid
# ============================================================

@router.post(
    "/{withdrawal_id}/mark-paid"
)
def admin_mark_withdrawal_paid(
    withdrawal_id: int,

    payload: WithdrawalMarkPaidRequest,

    admin_user: User = Depends(
        require_admin
    ),

    db: Session = Depends(get_db),
):
    try:
        withdrawal = (
            db.query(Withdrawal)
            .filter(
                Withdrawal.id
                == withdrawal_id
            )
            .with_for_update()
            .first()
        )

        if not withdrawal:
            raise HTTPException(
                status_code=404,
                detail="Withdrawal not found.",
            )

        # --------------------------------------------
        # OTP REQUIRED
        # --------------------------------------------

        if not withdrawal.otp_verified:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Withdrawal OTP has not "
                    "been verified."
                ),
            )

        # --------------------------------------------
        # MANUAL ADMIN WITHDRAWAL
        #
        # Must be approved first.
        # --------------------------------------------

        if (
            withdrawal.processing_type
            == "admin"
            and withdrawal.status
            != "approved"
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Admin withdrawal must be "
                    "approved before marking it paid."
                ),
            )

        # --------------------------------------------
        # AUTO WITHDRAWAL
        #
        # During development/testing we permit
        # pending -> paid through this admin endpoint.
        #
        # Later automatic payment processor will call
        # mark_withdrawal_paid directly.
        # --------------------------------------------

        if (
            withdrawal.processing_type
            == "auto"
            and withdrawal.status
            != "pending"
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Auto withdrawal must be "
                    "pending before marking it paid."
                ),
            )

        payment_reference = (
            payload.payment_reference.strip()
        )

        if not payment_reference:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Payment reference is required."
                ),
            )

        withdrawal = mark_withdrawal_paid(
            db=db,

            withdrawal=withdrawal,

            payment_reference=
                payment_reference,
        )

        db.commit()

        db.refresh(withdrawal)

        return {
            "success": True,

            "message":
                "Withdrawal marked as paid.",

            "withdrawal":
                serialize_admin_withdrawal(
                    withdrawal
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
                "Unable to mark withdrawal paid: "
                f"{str(exc)}"
            ),
        )