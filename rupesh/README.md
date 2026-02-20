# Module 2 — Model Training & Dataset
**Owner: Rupesh**  
**Stack: Python · scikit-learn · XGBoost · MLflow · pandas**

---

## What This Module Does
This module owns the **ML training pipeline** for predicting water-borne disease outbreak risk 7–14 days in advance. It takes raw health, water quality, weather, and sanitation data, builds features, trains models, and exports serialised models to `trained_models/` so that **tarun's prediction engine** can load and serve them.

---

## Folder Structure
```
rupesh/
├── datasets/
│   ├── health_sample.csv          ← Ward-level health case data (from old project)
│   ├── water_quality_sample.csv   ← Water quality readings
│   └── wards.json                 ← Ward metadata
├── trained_models/                ← .pkl files written here after training
│   └── (xgb_h7.pkl, rf_h7.pkl …)
├── feature_engineering.py         ← Feature computation pipeline
├── train_model.py                 ← Training script (XGBoost + RF + MLflow logging)
└── requirements.txt
```

---

## Getting Started

```bash
cd kavalan/rupesh
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Optional: start MLflow tracking UI
mlflow ui --port 5000

# Run training
python -m rupesh.train_model
```
Trained models will appear in `trained_models/xgb_h7.pkl` and `trained_models/xgb_h14.pkl`.

---

## Key Tasks (from todo.txt)
- [ ] Add real ward + date index to feature engineering
- [ ] Add weather / rainfall features when data is available
- [ ] Add population density and sanitation signals
- [ ] Evaluate Logistic Regression baseline
- [ ] Add SHAP explanations per feature (consumed by tarun)
- [ ] Add model versioning (save version tag alongside .pkl)
- [ ] Add scheduled retraining script (cron/Airflow)
- [ ] Evaluate Temporal Fusion Transformer for multi-horizon improvement

---

## Model Output Contract
The model artifacts in `trained_models/` follow this contract used by tarun:
- Input: `[cases_7d_avg, avg_water_risk, max_coliform, avg_ph]`
- Output: probability of outbreak in next N days (0.0–1.0)
- Filename: `xgb_h{N}.pkl` where N ∈ {7, 14}
