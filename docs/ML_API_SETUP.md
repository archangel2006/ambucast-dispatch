# 🚑 AmbuCast ML API

This service implements the **HotspotCast (ML inference)** and **RiskPulse (rule-based scoring)** pipeline for ambulance demand prediction.

---

## 📌 Overview

This ML API enables:

- 🔮 **Hotspot Prediction** — Estimates emergency call demand per zone  
- ⚠️ **Risk Classification** — Categorizes zones into LOW, MODERATE, HIGH, or CRITICAL  
- 📦 **Batch Processing** — Supports prediction across multiple zones in a single request  
---

## ⚙️ Architecture

```bash
Client (Swagger / Frontend)
        │
        ▼
FastAPI (main.py)
        │
        ▼
process_single_prediction()
        │
        ├───────────────┬────────────────
        ▼               ▼
HotspotPredictor     RiskPulse
(ML Model)           (Rule Engine)
        │               │
        ▼               ▼
Predicted Calls     Risk Score + Class
        │               │
        └───────┬───────┘
                ▼
        Final Response (JSON)

```
---

## 🚀 Running the API

### 1️⃣ Activate Virtual Environment

```bash
.venv\Scripts\activate
```

### 2️⃣ Start Server

```bash
uvicorn main:app --reload
```

### 3️⃣ Open Swagger UI

👉 http://127.0.0.1:8000/docs

### 4️⃣ Explore Endpoints

1. Root

Response:

```bash
{
  "message": "AmbuCast ML API running"
}
```

2. Health Check

```bash
GET /health
```

Response: 

```bash
{
  "status": "healthy",
  "model_loaded": true
}
```

3. Single Prediction

```bash
POST /predict
```

Sample Input:

```bash
{
  "zone_id": "Z03",
  "aqi": 180,
  "pm25": 120,
  "pm10": 150,
  "temperature": 38,
  "humidity": 85,
  "hour": 19,
  "day_of_week": 6,
  "population_density": 25000,
  "elderly_pct": 0.3
}
```

Response:

```bash
{
  "zone_id": "Z03",
  "predicted_calls": 4,
  "risk_score": 75,
  "risk_class": "HIGH",
  "reasons": [
    "Air quality is unhealthy (AQI 180.0), increasing respiratory emergencies.",
    "Higher elderly population increases vulnerability to emergencies.",
    "Evening peak hours typically see increased movement and incident rates."
  ]
}
```

4. Batch Prediction

```bash
POST /predict-batch
```

Sample Input:

```bash
[
  {
    "zone_id": "Z01",
    "aqi": 60,
    "pm25": 30,
    "pm10": 50,
    "temperature": 28,
    "humidity": 60,
    "hour": 10,
    "day_of_week": 2,
    "population_density": 8000,
    "elderly_pct": 0.1
  },
  {
    "zone_id": "Z05",
    "aqi": 180,
    "pm25": 120,
    "pm10": 150,
    "temperature": 38,
    "humidity": 85,
    "hour": 19,
    "day_of_week": 6,
    "population_density": 25000,
    "elderly_pct": 0.3
  }
]
```

Response:

```bash
[
  {
    "zone_id": "Z01",
    "predicted_calls": 7,
    "risk_score": 30,
    "risk_class": "MODERATE",
    "reasons": [
      "Predicted emergency demand is above normal for this time window."
    ]
  },
  {
    "zone_id": "Z05",
    "predicted_calls": 4,
    "risk_score": 75,
    "risk_class": "HIGH",
    "reasons": [
      "Air quality is unhealthy (AQI 180.0), increasing respiratory emergencies.",
      "Higher elderly population increases vulnerability to emergencies.",
      "Evening peak hours typically see increased movement and incident rates."
    ]
  }
]
```

---


## ⚠️ Notes

- Temporal features (`rolling_calls_7`, `lag_24h`) are currently mocked with static placeholders.
- These will be replaced with real-time values once backend data pipelines are integrated.