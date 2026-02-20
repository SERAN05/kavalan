# ─────────────────────────────────────────────────────────────
#  SACHIN — Health Cases Router
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import HealthCase

router = APIRouter()


@router.get("/{ward_id}")
async def get_health_cases(ward_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(HealthCase).where(HealthCase.ward_id == ward_id).order_by(HealthCase.report_date.desc())
    )
    return result.scalars().all()
