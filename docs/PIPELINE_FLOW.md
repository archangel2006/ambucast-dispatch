## 🔁 Pipeline Flow

```bash

Client / API Call (GET /api/pipeline)
        ↓
Node Backend (pipeline.ts)
        ↓
Load zones.json (lat, lng, demographics)
        ↓
Fetch External APIs
   ├── Air Pollution API
   └── Weather API
        ↓
Add Time Features (hour, day_of_week)
        ↓
Construct ML Input Payload (per zone)
        ↓
Call FastAPI (/predict-batch)
        ↓
FastAPI ML Processing
   ├── Hotspot Model (XGBoost)
   └── Risk Model (Rule Engine)
        ↓
Receive Predictions
        ↓
Merge with Zone Data
        ↓
Final Enriched Zones
        ↓
Used by:
   ├── Allocation Engine
   ├── Database
   └── Frontend (via API / Socket)

```

---

## 🔁 End-to-End Test

### 1️⃣ Start FastAPI
```
cd ml_api
uvicorn main:app --reload
```
Runs on: http://localhost:8000


### 2️⃣ Start Backend
```
cd backend
npm install
npm run dev
```
Runs on: http://localhost:3001


### 3️⃣ Call pipeline
```
curl http://localhost:3001/api/pipeline
```

### 4️⃣ Expected Behavior
- Fetches live air + weather data
- Builds zone-wise ML input
- Calls FastAPI /predict-batch
- Returns enriched zones with:
    - predicted_calls
    - risk_score
    - risk_class
    - reasons