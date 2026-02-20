# Module 4 — GenAI & Prediction Engine
**Owner: Tarun**  
**Stack: Python · FastAPI · OpenAI GPT-4o-mini · LangChain · SHAP**

---

## What This Module Does
This module is the **intelligence layer** of Neervazh Kavalan. It:
- Loads trained ML models from `rupesh/trained_models/` and serves real-time risk scores
- Uses SHAP to explain *why* a ward has high/low risk
- Calls GPT-4o-mini to turn SHAP values into plain-language explanations for health officers
- Generates specific preventive action recommendations via GPT
- Powers the **Kavalan AI chatbot** — a health officer Q&A assistant built with LangChain

---

## Folder Structure
```
tarun/
├── routers/
│   ├── predict.py     ← POST /predict/{ward_id}   — ML risk score
│   ├── explain.py     ← POST /explain/{ward_id}   — SHAP + GPT explanation
│   ├── recommend.py   ← POST /recommend/{ward_id} — Action recommendations
│   └── chat.py        ← POST /chat                — AI chatbot (LangChain)
├── main.py            ← FastAPI app entry point
└── requirements.txt
```

---

## Getting Started

```bash
cd kavalan/tarun
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Add your OpenAI key
cp .env.example .env
# Edit .env and set OPENAI_API_KEY

# Make sure rupesh has trained models first:
#   cd ../rupesh && python -m rupesh.train_model

uvicorn main:app --reload --port 8001
```

API docs available at `http://localhost:8001/docs`

---

## Key Tasks (from todo.txt)
- [ ] Wire predict router to load real model after rupesh trains one
- [ ] Add caching layer (Redis) for repeated ward predictions
- [ ] Add SHAP TreeExplainer integration in explain router
- [ ] Add WhatsApp alert message generation endpoint
- [ ] Add Retrieval-Augmented Generation (RAG) to chatbot — embed ward history
- [ ] Add scheduled inference job (POST /predict for all wards every 6h)
- [ ] Add model version tracking (which .pkl version was used per prediction)
- [ ] Persist predictions → sachin's DB via `/api/predictions` endpoint

---

## API Contract with Other Modules
| Consumer        | Endpoint                       | Description                  |
|----------------|--------------------------------|------------------------------|
| seran dashboard | `POST /predict/{ward_id}`     | Risk score for heatmap colour |
| seran dashboard | `POST /explain/{ward_id}`     | Natural language explanation  |
| seran dashboard | `POST /recommend/{ward_id}`   | 3 action recommendations      |
| seran dashboard | `POST /chat`                  | AI chatbot Q&A                |
| sachin DB       | (tarun writes back predictions via sachin's API) | |

---

## Environment Variables
```bash
# .env
OPENAI_API_KEY=sk-...your-key-here...
```
