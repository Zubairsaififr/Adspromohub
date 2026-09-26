from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_DOWN
import hashlib
import hmac
import secrets

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings

from app.models.user import User
from app.models.income_wallet import IncomeWallet
from app.models.income_wallet_transaction import IncomeWalletTransaction
from app.models.withdrawal import Withdrawal
from app.models.withdrawal_otp import WithdrawalOTP


# ============================================================
# CONSTANTS
# ============================================================

FOUR_PLACES = Decimal("0.0001")

MIN_WITHDRAWAL = Decimal(
    str(settings.WITHDRAWAL_MIN_AMOUNT)
)

FEE_PERCENT = Decimal(
    str(settings.WITHDRAWAL_FEE_PERCENT)
)

AUTO_MAX_AMOUNT = Decimal(
    str(settings.WITHDRAWAL_AUTO_MAX_AMOUNT)
)


# ============================================================
# HELPERS
# ============================================================

def utc_now():
    return datetime.now(
        timezone.utc
    ).replace(tzinfo=None)


def decimal_money(value) -> Decimal:
    return Decimal(
        str(value or 0)
    ).quantize(
        FOUR_PLACES,
        rounding=ROUND_DOWN,
    )


def calculate_withdrawal(amount):
    """
    Backend is the source of truth.

    Never trust fee/net amount sent by frontend.
    """

    amount = decimal_money(amount)

    fee = (
        amount
        * FEE_PERCENT
        / Decimal("100")
    ).quantize(
        FOUR_PLACES,
        rounding=ROUND_DOWN,
    )

    net_amount = (
        amount - fee
    ).quantize(
        FOUR_PLACES,
        rounding=ROUND_DOWN,
    )

    return amount, fee, net_amount


# ============================================================
# OTP SECURITY
# ============================================================

def generate_otp() -> str:
    """
    Cryptographically secure 6-digit OTP.
    """

    return f"{secrets.randbelow(1000000):06d}"


def hash_otp(otp: str) -> str:
    """
    Hash OTP using application SECRET_KEY.

    Raw OTP is never stored in database.
    """

    payload = (
        f"{otp}:{settings.SECRET_KEY}"
    ).encode("utf-8")

    return hashlib.sha256(
        payload
    ).hexdigest()


def verify_otp_hash(
    otp: str,
    stored_hash: str,
) -> bool:

    incoming_hash = hash_otp(otp)

    return hmac.compare_digest(
        incoming_hash,
        stored_hash,
    )


# ============================================================
# GET WALLET WITH DATABASE LOCK
# ============================================================

def get_locked_wallet(
    db: Session,
    user_id: int,
):
    """
    SELECT ... FOR UPDATE

    Prevents two simultaneous withdrawals from spending
    the same wallet balance.
    """

    wallet = (
        db.query(IncomeWallet)
        .filter(
            IncomeWallet.user_id == user_id
        )
        .with_for_update()
        .first()
    )

    if not wallet:
        raise HTTPException(
            status_code=400,
            detail="Income wallet not found.",
        )

    return wallet


# ============================================================
# GET USER BEP20 ADDRESS
# ============================================================

def get_user_bep20_address(
    user: User,
) -> str:

    address = (
        getattr(
            user,
            "bep20_address",
            None,
        )
        or ""
    ).strip()

    if not address:
        raise HTTPException(
            status_code=400,
            detail=(
                "Please add your BEP20 wallet address "
                "before requesting a withdrawal."
            ),
        )

    # Existing profile module already validates address when saved.
    # Still perform defensive validation here.

    if (
        len(address) != 42
        or not address.startswith("0x")
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid BEP20 wallet address.",
        )

    try:
        int(
            address[2:],
            16,
        )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid BEP20 wallet address.",
        )

    return address


# ============================================================
# CREATE WITHDRAWAL
# ============================================================

def create_withdrawal_request(
    db: Session,
    user: User,
    requested_amount,
):
    """
    Creates withdrawal and immediately reserves the amount.

    IMPORTANT:
    balance decreases now.

    total_withdrawn DOES NOT increase yet.
    It increases only when payment succeeds.
    """

    amount, fee, net_amount = (
        calculate_withdrawal(
            requested_amount
        )
    )

    # --------------------------------------------------------
    # MINIMUM
    # --------------------------------------------------------

    if amount < MIN_WITHDRAWAL:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Minimum withdrawal amount is "
                f"${MIN_WITHDRAWAL:.2f}."
            ),
        )

    # --------------------------------------------------------
    # BEP20
    # --------------------------------------------------------

    bep20_address = (
        get_user_bep20_address(user)
    )

    # --------------------------------------------------------
    # LOCK WALLET
    # --------------------------------------------------------

    wallet = get_locked_wallet(
        db,
        user.id,
    )

    wallet_balance = decimal_money(
        wallet.balance
    )

    if amount > wallet_balance:
        raise HTTPException(
            status_code=400,
            detail=(
                "Insufficient wallet balance. "
                f"Available balance is "
                f"${wallet_balance:.2f}."
            ),
        )

    # --------------------------------------------------------
    # PROCESSING TYPE
    #
    # $5 - $20 = auto
    # > $20     = admin
    # --------------------------------------------------------

    if amount <= AUTO_MAX_AMOUNT:
        processing_type = "auto"
    else:
        processing_type = "admin"

    # --------------------------------------------------------
    # CREATE WITHDRAWAL
    # --------------------------------------------------------

    withdrawal = Withdrawal(
        user_id=user.id,

        amount=amount,

        fee_percentage=FEE_PERCENT,

        fee=fee,

        net_amount=net_amount,

        bep20_address=bep20_address,

        processing_type=processing_type,

        status="otp_pending",

        otp_verified=False,

        created_at=utc_now(),
        updated_at=utc_now(),
    )

    db.add(withdrawal)
    db.flush()

    # --------------------------------------------------------
    # RESERVE MONEY
    # --------------------------------------------------------

    balance_before = wallet_balance

    balance_after = decimal_money(
        balance_before - amount
    )

    wallet.balance = balance_after

    # DO NOT change:
    #
    # wallet.total_earned
    # wallet.total_withdrawn
    #
    # total_withdrawn changes only after actual payment.

    # --------------------------------------------------------
    # WALLET LEDGER
    # --------------------------------------------------------

    ledger = IncomeWalletTransaction(
        user_id=user.id,

        income_type="withdrawal_reserve",

        amount=-amount,

        balance_before=balance_before,

        balance_after=balance_after,

        reference_type="withdrawal",

        reference_id=withdrawal.id,

        description=(
            f"Withdrawal #{withdrawal.id} "
            f"amount reserved"
        ),

        status="credited",

        created_at=utc_now(),
    )

    db.add(ledger)

    # --------------------------------------------------------
    # INVALIDATE PREVIOUS ACTIVE OTPs
    # --------------------------------------------------------

    (
        db.query(WithdrawalOTP)
        .filter(
            WithdrawalOTP.user_id
            == user.id,

            WithdrawalOTP.is_used
            == False,  # noqa: E712
        )
        .update(
            {
                WithdrawalOTP.is_used: True,
            },
            synchronize_session=False,
        )
    )

    # --------------------------------------------------------
    # GENERATE OTP
    # --------------------------------------------------------

    raw_otp = generate_otp()

    otp_record = WithdrawalOTP(
        withdrawal_id=withdrawal.id,

        user_id=user.id,

        otp_hash=hash_otp(
            raw_otp
        ),

        attempts=0,

        max_attempts=
            settings.WITHDRAWAL_OTP_MAX_ATTEMPTS,

        is_used=False,

        expires_at=(
            utc_now()
            + timedelta(
                minutes=
                    settings
                    .WITHDRAWAL_OTP_EXPIRE_MINUTES
            )
        ),

        created_at=utc_now(),
    )

    db.add(otp_record)
    db.flush()

    return {
        "withdrawal": withdrawal,

        # IMPORTANT:
        # API should expose this only in development.
        "raw_otp": raw_otp,

        "wallet_balance_before":
            balance_before,

        "wallet_balance_after":
            balance_after,
    }


# ============================================================
# VERIFY WITHDRAWAL OTP
# ============================================================

def verify_withdrawal_otp(
    db: Session,
    user: User,
    withdrawal_id: int,
    otp: str,
):
    """
    Verify ownership + status + expiry + attempts + OTP.
    """

    withdrawal = (
        db.query(Withdrawal)
        .filter(
            Withdrawal.id
            == withdrawal_id,

            Withdrawal.user_id
            == user.id,
        )
        .with_for_update()
        .first()
    )

    if not withdrawal:
        raise HTTPException(
            status_code=404,
            detail="Withdrawal not found.",
        )

    # --------------------------------------------------------
    # ALREADY VERIFIED
    # --------------------------------------------------------

    if withdrawal.otp_verified:
        raise HTTPException(
            status_code=400,
            detail=(
                "Withdrawal OTP has already "
                "been verified."
            ),
        )

    # --------------------------------------------------------
    # STATUS CHECK
    # --------------------------------------------------------

    if withdrawal.status != "otp_pending":
        raise HTTPException(
            status_code=400,
            detail=(
                "This withdrawal cannot be "
                "OTP verified."
            ),
        )

    otp_record = (
        db.query(WithdrawalOTP)
        .filter(
            WithdrawalOTP.withdrawal_id
            == withdrawal.id,

            WithdrawalOTP.user_id
            == user.id,

            WithdrawalOTP.is_used
            == False,  # noqa: E712
        )
        .order_by(
            WithdrawalOTP.id.desc()
        )
        .with_for_update()
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail=(
                "Withdrawal OTP not found "
                "or already used."
            ),
        )

    # --------------------------------------------------------
    # ATTEMPT LIMIT
    # --------------------------------------------------------

    if (
        otp_record.attempts
        >= otp_record.max_attempts
    ):
        otp_record.is_used = True

        raise HTTPException(
            status_code=400,
            detail=(
                "Maximum OTP attempts exceeded."
            ),
        )

    # --------------------------------------------------------
    # EXPIRY
    # --------------------------------------------------------

    if utc_now() > otp_record.expires_at:

        otp_record.is_used = True

        raise HTTPException(
            status_code=400,
            detail=(
                "OTP has expired. "
                "Please create a new withdrawal request."
            ),
        )

    # --------------------------------------------------------
    # FORMAT
    # --------------------------------------------------------

    otp = str(otp).strip()

    if (
        len(otp) != 6
        or not otp.isdigit()
    ):
        raise HTTPException(
            status_code=400,
            detail="OTP must contain exactly 6 digits.",
        )

    # --------------------------------------------------------
    # VERIFY
    # --------------------------------------------------------

    if not verify_otp_hash(
        otp,
        otp_record.otp_hash,
    ):

        otp_record.attempts += 1

        attempts_left = max(
            otp_record.max_attempts
            - otp_record.attempts,
            0,
        )

        if attempts_left == 0:
            otp_record.is_used = True

        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid OTP. "
                f"{attempts_left} attempt(s) remaining."
            ),
        )

    # --------------------------------------------------------
    # SUCCESS
    # --------------------------------------------------------

    now = utc_now()

    otp_record.is_used = True
    otp_record.verified_at = now

    withdrawal.otp_verified = True
    withdrawal.otp_verified_at = now
    withdrawal.updated_at = now

    # --------------------------------------------------------
    # ROUTING
    # --------------------------------------------------------

    if withdrawal.processing_type == "auto":

        # IMPORTANT:
        #
        # Do NOT fake blockchain payment here.
        #
        # OTP verified means this withdrawal is ready
        # for automatic payment processor.
        #
        # Until payment gateway/blockchain transfer succeeds,
        # keep it pending.

        withdrawal.status = "pending"

        next_action = "auto_payment"

    else:

        # > $20 requires admin approval.

        withdrawal.status = "pending"

        next_action = "admin_approval"

    return {
        "withdrawal": withdrawal,
        "next_action": next_action,
    }


# ============================================================
# MARK WITHDRAWAL PAID
# ============================================================

def mark_withdrawal_paid(
    db: Session,
    withdrawal: Withdrawal,
    payment_reference: str,
):
    """
    Finalizes an already-reserved withdrawal.

    IMPORTANT:

    Wallet balance was already reduced when the
    withdrawal request was created.

    Therefore this function does NOT deduct
    wallet.balance again.

    It only:
    - marks withdrawal paid
    - stores payment reference
    - increases total_withdrawn
    """

    withdrawal = (
        db.query(Withdrawal)
        .filter(
            Withdrawal.id
            == withdrawal.id
        )
        .with_for_update()
        .first()
    )

    if not withdrawal:
        raise HTTPException(
            status_code=404,
            detail="Withdrawal not found.",
        )


    # ========================================================
    # TERMINAL STATUS PROTECTION
    # ========================================================

    if withdrawal.status == "paid":
        raise HTTPException(
            status_code=400,
            detail=(
                "Withdrawal is already paid."
            ),
        )


    if withdrawal.status in (
        "rejected",
        "cancelled",
        "otp_pending",
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                f"Withdrawal cannot be paid "
                f"from status '{withdrawal.status}'."
            ),
        )


    # ========================================================
    # OTP
    # ========================================================

    if not withdrawal.otp_verified:
        raise HTTPException(
            status_code=400,
            detail=(
                "OTP verification is required."
            ),
        )


    # ========================================================
    # STATUS RULE
    # ========================================================

    if withdrawal.processing_type == "admin":

        if withdrawal.status != "approved":
            raise HTTPException(
                status_code=400,
                detail=(
                    "Admin withdrawal must be "
                    "approved before payment."
                ),
            )

    elif withdrawal.processing_type == "auto":

        if withdrawal.status != "pending":
            raise HTTPException(
                status_code=400,
                detail=(
                    "Auto withdrawal must be "
                    "pending before payment."
                ),
            )

    else:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unknown withdrawal processing type."
            ),
        )


    # ========================================================
    # PAYMENT REFERENCE
    # ========================================================

    payment_reference = str(
        payment_reference or ""
    ).strip()


    if not payment_reference:
        raise HTTPException(
            status_code=400,
            detail=(
                "Payment reference is required."
            ),
        )


    # ========================================================
    # WALLET
    # ========================================================

    wallet = get_locked_wallet(
        db,
        withdrawal.user_id,
    )


    amount = decimal_money(
        withdrawal.amount
    )


    # ========================================================
    # IMPORTANT
    #
    # DO NOT CHANGE wallet.balance here.
    #
    # Amount was reserved at request creation.
    # ========================================================

    total_withdrawn_before = (
        decimal_money(
            wallet.total_withdrawn
        )
    )


    wallet.total_withdrawn = (
        total_withdrawn_before
        + amount
    )


    # total_earned stays unchanged.


    # ========================================================
    # WITHDRAWAL
    # ========================================================

    now = utc_now()


    withdrawal.status = "paid"

    withdrawal.payment_reference = (
        payment_reference
    )

    withdrawal.paid_at = now

    withdrawal.updated_at = now


    return withdrawal

# ============================================================
# REJECT WITHDRAWAL + REFUND
# ============================================================

def reject_withdrawal(
    db: Session,
    withdrawal_id: int,
    admin_user: User,
    admin_note: str | None = None,
):
    """
    Reject withdrawal and return FULL reserved amount.

    Fee is not charged on rejected withdrawals.
    """

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

    if withdrawal.status in (
        "paid",
        "rejected",
        "cancelled",
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                f"Withdrawal is already "
                f"{withdrawal.status}."
            ),
        )

    wallet = get_locked_wallet(
        db,
        withdrawal.user_id,
    )

    amount = decimal_money(
        withdrawal.amount
    )

    balance_before = decimal_money(
        wallet.balance
    )

    balance_after = decimal_money(
        balance_before + amount
    )

    # --------------------------------------------------------
    # REFUND FULL RESERVED AMOUNT
    # --------------------------------------------------------

    wallet.balance = balance_after

    # total_earned unchanged
    # total_withdrawn unchanged

    now = utc_now()

    withdrawal.status = "rejected"

    withdrawal.rejected_by = (
        admin_user.id
    )

    withdrawal.admin_note = (
        admin_note
    )

    withdrawal.rejected_at = now
    withdrawal.updated_at = now

    # --------------------------------------------------------
    # REFUND LEDGER
    # --------------------------------------------------------

    ledger = IncomeWalletTransaction(
        user_id=withdrawal.user_id,

        income_type="withdrawal_refund",

        amount=amount,

        balance_before=balance_before,

        balance_after=balance_after,

        reference_type="withdrawal",

        reference_id=withdrawal.id,

        description=(
            f"Withdrawal #{withdrawal.id} "
            f"rejected - reserved amount refunded"
        ),

        status="credited",

        created_at=now,
    )

    db.add(ledger)

    return withdrawal


# ============================================================
# APPROVE WITHDRAWAL
# ============================================================

def approve_withdrawal(
    db: Session,
    withdrawal_id: int,
    admin_user: User,
    admin_note: str | None = None,
):
    """
    Admin approval for manual withdrawals (> $20).
    """

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

    if withdrawal.processing_type != "admin":
        raise HTTPException(
            status_code=400,
            detail=(
                "This withdrawal does not "
                "require manual admin approval."
            ),
        )

    if not withdrawal.otp_verified:
        raise HTTPException(
            status_code=400,
            detail=(
                "User has not completed "
                "OTP verification."
            ),
        )

    if withdrawal.status != "pending":
        raise HTTPException(
            status_code=400,
            detail=(
                f"Withdrawal cannot be approved "
                f"from status '{withdrawal.status}'."
            ),
        )

    now = utc_now()

    withdrawal.status = "approved"

    withdrawal.approved_by = (
        admin_user.id
    )

    withdrawal.admin_note = (
        admin_note
    )

    withdrawal.approved_at = now
    withdrawal.updated_at = now

    return withdrawal