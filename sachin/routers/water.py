# ─────────────────────────────────────────────────────────────
#  SACHIN — Water Quality Router
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import WaterQuality

router = APIRouter()


@router.get("/{ward_id}")
async def get_water_quality(ward_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(WaterQuality).where(WaterQuality.ward_id == ward_id).order_by(WaterQuality.sample_date.desc())
    )
    return result.scalars().all()
