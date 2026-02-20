# ─────────────────────────────────────────────────────────────
#  TARUN — GenAI & Prediction Engine
#  Neervazh Kavalan · Module 4: AI Prediction + GenAI Layer
# ─────────────────────────────────────────────────────────────
#
#  Services:
#    • /predict/{ward_id}  → ML risk score (calls rupesh model)
#    • /explain/{ward_id}  → SHAP summary text via GPT
#    • /recommend/{ward_id}→ Action recommendations from GPT
#    • /chat               → Health officer Q&A chatbot (LangChain)
# ─────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import predict, explain, recommend, chat

app = FastAPI(
    title="Neervazh Kavalan — GenAI & Prediction Engine",
    description=(
        "ML inference (7/14-day risk scores), SHAP-driven natural language "
        "explanations, action recommendations, and an AI health officer chatbot."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router,   prefix="/predict",   tags=["Risk Prediction"])
app.include_router(explain.router,   prefix="/explain",   tags=["SHAP Explanations"])
app.include_router(recommend.router, prefix="/recommend", tags=["Action Recommendations"])
app.include_router(chat.router,      prefix="/chat",      tags=["AI Chatbot"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "module": "genai-prediction-engine"}
