import sys
from pathlib import Path


# =========================================================
# BACKEND ROOT
# =========================================================

BACKEND_ROOT = Path(__file__).resolve().parent.parent

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


# =========================================================
# APP IMPORTS
# =========================================================

from app.core.database import SessionLocal
from app.services.royalty_pool_service import (
    process_all_royalties,
)


# =========================================================
# DAILY ROYALTY PROCESSOR
# =========================================================

def main():

    db = SessionLocal()

    try:

        result = process_all_royalties(db)

        print("=" * 60)
        print("APH DAILY ROYALTY PROCESSOR")
        print("=" * 60)

        print(
            f"Business Date : "
            f"{result.get('business_date')}"
        )

        print(
            f"Users Checked : "
            f"{result.get('users_checked')}"
        )

        print(
            f"Users Credited: "
            f"{result.get('users_credited')}"
        )

        print(
            f"Total Credited: $"
            f"{result.get('total_credited')}"
        )

        print("=" * 60)

        return result

    except Exception as exc:

        print("=" * 60)
        print("APH DAILY ROYALTY PROCESSOR FAILED")
        print("=" * 60)
        print(str(exc))
        print("=" * 60)

        raise

    finally:

        db.close()


# =========================================================
# ENTRY POINT
# =========================================================

if __name__ == "__main__":
    main()