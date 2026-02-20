# ─────────────────────────────────────────────────────────────
#  TARUN — SHAP Explanation Router
#  Uses GPT to turn SHAP values into plain-language summaries
# ─────────────────────────────────────────────────────────────

import shap
import joblib
import numpy as np
from pathlib import Path
from fastapi import APIRouter, HTTPException
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
MODEL_DIR = Path(__file__).parent.parent.parent / "rupesh" / "trained_models"

FEATURE_NAMES = ["cases_7d_avg", "avg_water_risk", "max_coliform", "avg_ph"]


class ExplainRequest(BaseModel):
    cases_7d_avg: float
    avg_water_risk: float
    max_coliform: float
    avg_ph: float
    horizon: int = 7


@router.post("/{ward_id}")
async def explain_prediction(ward_id: int, req: ExplainRequest):
    model_path = MODEL_DIR / f"xgb_h{req.horizon}.pkl"
    if not model_path.exists():
        raise HTTPException(status_code=503, detail="Model not trained yet.")

    model = joblib.load(model_path)
    X = np.array([[req.cases_7d_avg, req.avg_water_risk, req.max_coliform, req.avg_ph]])

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)[0]
    contributions = dict(zip(FEATURE_NAMES, shap_values.tolist()))

    prompt = f"""
You are a public health analyst AI assistant for Neervazh Kavalan, a disease early warning system for Coimbatore. 
For ward {ward_id}, a {req.horizon}-day outbreak risk prediction was made with these SHAP feature contributions:
{contributions}

Write a 2-3 sentence plain-language explanation for a health officer describing:
- Which factors are driving the risk UP or DOWN
- What they should pay attention to
Keep it concise and actionable.
"""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    explanation = response.choices[0].message.content.strip()
    return {"ward_id": ward_id, "shap_contributions": contributions, "explanation": explanation}
