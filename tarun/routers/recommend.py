# ─────────────────────────────────────────────────────────────
#  TARUN — Action Recommendation Router
#  Uses GPT to suggest preventive actions based on risk score
# ─────────────────────────────────────────────────────────────

from fastapi import APIRouter
from pydantic import BaseModel
from openai import AsyncOpenAI
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    class Config:
        env_file = ".env"


settings = Settings()
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
router = APIRouter()


class RecommendRequest(BaseModel):
    risk_score: float
    risk_band: str
    ward_name: str
    top_risk_factor: str
    horizon_days: int = 7


@router.post("/{ward_id}")
async def get_recommendations(ward_id: int, req: RecommendRequest):
    prompt = f"""
You are a preventive public health expert for Coimbatore district.

Ward: {req.ward_name} (ID: {ward_id})
Risk Band: {req.risk_band} ({req.risk_score:.1f}/100)
Top Risk Factor: {req.top_risk_factor}
Prediction Horizon: Next {req.horizon_days} days

Provide exactly 3 specific, actionable recommendations that the local health officer and water sanitation team should take immediately. Be concise, practical, and specific to water-borne disease prevention in an Indian semi-urban context.

Format as a numbered list.
"""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
    )
    recommendations = response.choices[0].message.content.strip()
    return {"ward_id": ward_id, "recommendations": recommendations}
