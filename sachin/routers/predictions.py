# ─────────────────────────────────────────────────────────────
#  SACHIN — Predictions Router (reads from rupesh/tarun outputs)
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import RiskPrediction

router = APIRouter()


@router.get("/{ward_id}")
async def get_predictions(ward_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.ward_id == ward_id)
        .order_by(RiskPrediction.predicted_at.desc())
        .limit(10)
    )
    return result.scalars().all()
