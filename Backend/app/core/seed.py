from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def seed_admin():
    db: Session = SessionLocal()

    try:
        admin = (
            db.query(User)
            .filter(User.email == settings.ADMIN_EMAIL.lower())
            .first()
        )

        if admin:
            print("Admin account already exists.")
            return

        # Make sure APH5555 is not already owned
        existing_referral = (
            db.query(User)
            .filter(User.referral_id == settings.DEFAULT_REFERRAL_CODE)
            .first()
        )

        if existing_referral:
            print(
                f"{settings.DEFAULT_REFERRAL_CODE} already exists."
            )
            return

        admin = User(
            customer_id=settings.DEFAULT_REFERRAL_CODE,
            referral_id=settings.DEFAULT_REFERRAL_CODE,
            referred_by=settings.DEFAULT_REFERRAL_CODE,
            full_name="AdsPromoHub Admin",
            email=settings.ADMIN_EMAIL.lower(),

            # Admin does not need a signup phone.
            # We'll use a reserved internal value.
            phone_number="ADMIN-INTERNAL",
            country="System",
            country_code="SYSTEM",

            password_hash=hash_password(
                settings.ADMIN_PASSWORD
            ),

            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully.")
        print(
            f"Admin referral ID: "
            f"{settings.DEFAULT_REFERRAL_CODE}"
        )

    except Exception as exc:
        db.rollback()
        print(f"Admin seed failed: {exc}")
        raise

    finally:
        db.close()