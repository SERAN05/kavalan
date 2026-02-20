# ─────────────────────────────────────────────────────────────
#  SACHIN — Wards Router
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import Ward

router = APIRouter()


@router.get("/")
async def list_wards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ward))
    return result.scalars().all()


@router.get("/{ward_id}")
async def get_ward(ward_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ward).where(Ward.id == ward_id))
    return result.scalar_one_or_none()
