# ─────────────────────────────────────────────────────────────
#  SACHIN — Alerts Router  (mirrors old /app/api/alerts/ack)
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from pydantic import BaseModel
from ..database import get_db
from ..models import Alert

router = APIRouter()


class AckPayload(BaseModel):
    acknowledged_by: str


@router.get("/")
async def list_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert).order_by(Alert.created_at.desc()).limit(100))
    return result.scalars().all()


@router.patch("/{alert_id}/ack")
async def acknowledge_alert(
    alert_id: str,
    payload: AckPayload,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.acknowledged = True
    alert.acknowledged_by = payload.acknowledged_by
    alert.acknowledged_at = datetime.now(timezone.utc)
    await db.commit()
    return {"status": "acknowledged"}
