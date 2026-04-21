# AmbuCast ML API

This module provides the Machine Learning inference layer for the AmbuCast system. It exposes a FastAPI service that combines demand prediction and risk analysis into a single API.

---

## Overview

The ML API integrates two core engines:

### 🗺️ HotspotCast

* Predicts expected emergency call volume per zone
* Model: XGBoost Regressor
* Uses temporal + environmental + demographic features

### 🌡️ RiskPulse

* Assigns risk level and generates human-readable explanations
* Rule-based logic (fast, interpretable, hackathon-friendly)

---

## ⚙️ API Endpoint

### `POST /predict`

Returns predicted demand and risk insights for a given zone.

---

## 📥 Request Format

```json
{
  "aqi": 180,
  "pm25": 90,
  "pm10": 140,
  "temperature": 32,
  "humidity": 60,
  "hour": 14,
  "day_of_week": 2,
  "population_density": 12000,
  "elderly_pct": 0.18
}
```

---

## 📤 Response Format

```json
{
  "predicted_calls": 7,
  "risk_score": 78,
  "risk_class": "HIGH",
  "reasons": [
    "Air quality is unhealthy (AQI 180), increasing respiratory emergencies.",
    "Predicted emergency demand is above normal for this time window.",
    "Afternoon hours typically see increased movement and incident rates."
  ]
}
```

---

## Feature Engineering

The API automatically performs:

* Time encoding:

  * `hour → sin/cos`
  * `day_of_week → sin/cos`
* Data normalization (handled by model)
* Feature alignment with trained model

---

## 📦 Project Structure

```
ml_api/
├── main.py                # FastAPI app
├── requirements.txt
├── models/
│   └── hotspotcast.pkl   # trained model
├── inference/
│   ├── hotspot.py        # prediction logic
│   └── riskpulse.py      # risk scoring logic
└── schemas/
    └── input_schema.py   # request validation
```

---

## ▶️ Running the API

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📍 Access

* API: http://127.0.0.1:8000
* Docs: http://127.0.0.1:8000/docs

---

## 🔌 Integration (Node Backend)

The backend sends a POST request:

```ts
fetch("http://localhost:8000/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
```

---

## ⚠️ Notes

* Model must match feature set used during training
* CSV data is NOT used in production (only for training)
* All communication is via JSON

---

## Future Improvements

* Add real-time AQI + weather APIs
* Add model retraining endpoint
* Add caching for faster inference
* Extend RiskPulse with event-based signals

---

##  Architecture Role

FastAPI acts as the **ML intelligence layer**, while the Node backend handles orchestration, real-time updates, and fleet optimization.

