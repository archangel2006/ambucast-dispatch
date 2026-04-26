

```bash

Client / API Call (/api/pipeline)
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
Construct ML Input Payload
        ↓
Call FastAPI (/predict-batch)
        ↓
ML Processing
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

### 1. Start FastAPI
```
uvicorn main:app --reload
```

2. Start Backend
```
npm run dev
```

3. Call pipeline
```
curl http://localhost:3001/api/pipeline
```