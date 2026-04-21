# ML Integration - Technical Reference & Variable Mapping
**Quick Reference Guide**

---

## 🔄 Data Transformation Flow

```
Backend Pipeline Output (Per Zone)
│
├─ zone_id: "Z01" ────────────────────────┐
├─ aqi: 3 ─────────────────────────────────┤
├─ pm25: 35.87 ────────────────────────────┤
├─ pm10: 88.37 ────────────────────────────┤
├─ temperature: 33.07 ──────────────────────┤
├─ humidity: 25 ────────────────────────────┤
├─ hour: 21 ────────────────────────────────┤
├─ day_of_week: 2 ──────────────────────────┤
├─ population_density: 28000 ───────────────┤
└─ elderly_pct: 0.12 ───────────────────────┤
                                             ▼
                     FastAPI Input Schema
                     ╔═══════════════════════════════╗
                     ║      HotspotInput Model       ║
                     ║  (All 10 fields mapped OK)    ║
                     ╚═══════════════════════════════╝
                             │
                             ▼
                     HotspotPredictor.preprocess()
                     ┌───────────────────────────────┐
                     │ Feature Engineering:          │
                     │ • hour_sin = sin(2π×hour/24) │
                     │ • hour_cos = cos(2π×hour/24) │
                     │ • dow_sin = sin(2π×dow/7)    │
                     │ • dow_cos = cos(2π×dow/7)    │
                     │ • Keep 6 other features as-is│
                     └───────────────────────────────┘
                             │
                             ▼
                     Feature Vector (11 features)
                     ╔═══════════════════════════════╗
                     ║ [hour_sin, hour_cos,          ║
                     ║  dow_sin, dow_cos,            ║
                     ║  PM2.5, PM10, AQI,            ║
                     ║  temperature, humidity,       ║
                     ║  population_density,          ║
                     ║  elderly_pct]                 ║
                     ╚═══════════════════════════════╝
                             │
                             ▼
                     Model Inference
                     ┌───────────────────────────────┐
                     │ hotspotcast.pkl predicts:     │
                     │ predicted_calls = [number]    │
                     │ (clipped to >= 0)             │
                     └───────────────────────────────┘
                             │
                             ▼
                     Risk Calculation
                     ┌───────────────────────────────┐
                     │ calculate_risk() generates:   │
                     │ • risk_score (0-100)          │
                     │ • risk_class (4 levels)       │
                     │ • reasons (explanation list)  │
                     └───────────────────────────────┘
                             │
                             ▼
                     Final Response
                     ╔═══════════════════════════════╗
                     ║    PredictionResult           ║
                     ║ ─────────────────────────────  ║
                     ║ zone_id: "Z01"                ║
                     ║ predicted_calls: 7            ║
                     ║ risk_score: 45                ║
                     ║ risk_class: "MODERATE"        ║
                     ║ reasons: [...]                ║
                     ╚═══════════════════════════════╝
```

---

## 📊 Detailed Field Mapping

### Input Fields (Backend → FastAPI)

| # | Backend Field | Type | ML Schema | ML Model Input | Processing | ✓ Status |
|---|---|---|---|---|---|---|
| 1 | zone_id | string | ❌ Missing | - | Store & Return | ⚠️ NEEDS FIX |
| 2 | aqi | int (1-5) | ✅ aqi | AQI | Case conversion | ✅ OK |
| 3 | pm25 | float | ✅ pm25 | PM2.5 | Key mapping | ✅ OK |
| 4 | pm10 | float | ✅ pm10 | PM10 | Key mapping | ✅ OK |
| 5 | temperature | float | ✅ temperature | temperature | Direct pass | ✅ OK |
| 6 | humidity | int (%) | ✅ humidity | humidity | Direct pass | ✅ OK |
| 7 | hour | int (0-23) | ✅ hour | hour | → sin/cos features | ✅ OK |
| 8 | day_of_week | int (0-6) | ✅ day_of_week | day_of_week | → sin/cos features | ✅ OK |
| 9 | population_density | int | ✅ population_density | population_density | Direct pass | ✅ OK |
| 10 | elderly_pct | float (0-1) | ✅ elderly_pct | elderly_pct | Direct pass | ✅ OK |

**Summary:** 9/10 fields perfectly mapped, only zone_id missing from schema

---

## 🔧 Code Locations & Changes

### Critical File Paths

```
ml_api/
├── main.py                    ← Endpoints (needs /predict-batch)
├── requirements.txt           ← Dependencies (OK, no changes)
├── schemas/
│   └── input_schema.py        ← Input validation (add zone_id)
└── inference/
    ├── hotspot.py             ← Model loading (fix path)
    └── riskpulse.py           ← Risk logic (OK, no changes)

backend/src/
├── routes/
│   └── service.route.ts       ← API routes (need ML integration)
└── services/
    ├── pipeline.ts            ← Zone building (add ML call)
    ├── mlService.ts           ← NEW: ML API client
    ├── dataService.ts         ← Air/weather (OK)
    └── timeService.ts         ← Time features (OK)
```

---

## 🔌 API Endpoints Required

### Current Endpoint
```
POST /predict
Headers: Content-Type: application/json
Body: {zone_id, aqi, pm25, pm10, temperature, humidity, hour, day_of_week, population_density, elderly_pct}
Response: {predicted_calls, risk_score, risk_class, reasons}
Issue: No zone_id in response, can't handle arrays
```

### Required New Endpoint
```
POST /predict-batch
Headers: Content-Type: application/json
Body: [{zone_id, aqi, ...}, {zone_id, aqi, ...}, ...]
Response: [{zone_id, predicted_calls, risk_score, risk_class, reasons}, ...]
Benefit: Single request for all 12 zones, 12x faster than loop calls
```

### Backward Compatibility
- Keep existing `/predict` endpoint (single zone)
- Add new `/predict-batch` endpoint (multiple zones)
- Both can coexist

---

## 🧮 Feature Engineering Details

### Time-Based Cyclical Encoding

**Problem:** Hour/day are cyclical (23→0), linear encoding breaks this

**Solution:** Convert to sin/cos representation

#### Example: hour=21

```
hour_sin = sin(2π × 21/24)  = sin(5.498) ≈ -0.755
hour_cos = cos(2π × 21/24)  = cos(5.498) ≈  0.656

This captures:
- 21:00 is close to 22:00 (similar sin/cos values)
- 21:00 is different from 06:00 (different sin/cos values)
- 23:00 and 00:00 are neighbors (continuity preserved)
```

#### Example: day_of_week=2 (Tuesday)

```
dow_sin = sin(2π × 2/7)  = sin(1.795) ≈ 0.782
dow_cos = cos(2π × 2/7)  = cos(1.795) ≈ -0.623

This captures:
- Tuesday is similar to Monday/Wednesday
- Tuesday is different from Thursday+
- Sunday/Monday wrap around correctly (cyclical)
```

**Implementation:** Already done in `hotspot.py` lines 16-19

---

## ⚙️ Risk Scoring Algorithm

### Scoring Rules (from `riskpulse.py`)

```
Initial Score = 0

If AQI > 150:
    score += 2  (High pollution increases respiratory emergencies)
    reason = "Air quality is unhealthy (AQI X), increasing respiratory emergencies."

If predicted_calls > 5:
    score += 2  (Demand already high for this timeframe)
    reason = "Predicted emergency demand is above normal for this time window."

If elderly_pct > 0.2 (20% elderly):
    score += 2  (Vulnerable population)
    reason = "Higher elderly population increases vulnerability to emergencies."

If 17 <= hour <= 21 (evening):
    score += 1  (Peak hours)
    reason = "Evening peak hours typically see increased movement and incident rates."

Risk Classification:
    score >= 6: "CRITICAL"   (scale: 90-100)
    score >= 4: "HIGH"       (scale: 60-89)
    score >= 2: "MODERATE"   (scale: 30-59)
    score <  2: "LOW"        (scale: 0-29)

Final risk_score = score × 15  (converts 0-6+ → 0-100)
```

### Example Calculation

**Input:** Z01 data from sample
```
aqi=3, predicted_calls=?, elderly_pct=0.12, hour=21
```

**Calculation:**
```
score = 0
AQI=3 ≤ 150? YES, skip
predicted_calls > 5? DEPENDS on model output
elderly_pct=0.12 ≤ 0.2? YES, skip
hour=21 in 17-21? YES, score += 1

Assume predicted_calls=7:
predicted_calls=7 > 5? YES, score += 2

Final score = 1 + 2 = 3
risk_score = 3 × 15 = 45
risk_class = "MODERATE"
reasons = [
    "Predicted emergency demand is above normal for this time window.",
    "Evening peak hours typically see increased movement and incident rates."
]
```

---

## 🐍 Python Dependencies Check

### Current `requirements.txt`
```
fastapi          - Web framework for API
uvicorn          - ASGI server to run FastAPI
pandas           - Data manipulation (for DataFrame)
numpy            - Numerical operations (sin, cos, clip)
scikit-learn     - ML utilities (may have legacy deps)
joblib           - Model serialization/loading
xgboost          - Boosting framework (if used in model)
```

### Analysis
- ✅ All required packages present
- ✅ No missing dependencies
- ✅ No version conflicts expected
- **No new packages needed**

---

## 📡 Backend Integration Points

### Current Code Path (Incomplete)

```typescript
// backend/src/routes/service.route.ts
router.get("/pipeline", async (req, res) => {
    const data = await buildZonePayloads();  // Returns array of 12 zones
    res.json(data);  // ← Sent to client WITHOUT predictions
});

// backend/src/services/pipeline.ts
export const buildZonePayloads = async () => {
    // Fetches time, air, weather data
    // Combines with zone info
    return results;  // ← Array of 12 zones
};
```

### Required Code Path (Complete)

```typescript
// backend/src/routes/service.route.ts
router.get("/pipeline", async (req, res) => {
    try {
        const zones = await buildZonePayloads();      // Get zone data
        const predictions = await getPredictions(zones); // Call ML API ← NEW
        const enriched = zones.map(zone => ({
            ...zone,
            ...predictions.find(p => p.zone_id === zone.zone_id)  // ← NEW
        }));
        res.json(enriched);
    } catch (err) {
        console.error("Pipeline failed:", err);
        res.status(500).json({ error: "Pipeline failed" });
    }
});

// backend/src/services/mlService.ts ← NEW FILE
export const getPredictions = async (zones: any[]) => {
    const response = await fetch(process.env.ML_API_URL + "/predict-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zones)
    });
    if (!response.ok) throw new Error("ML API failed");
    return await response.json();
};
```

---

## 🧪 Expected Test Cases

### Test 1: Single Zone Prediction
**Input:** Z01 sample data
**Expected:** 
```json
{
    "zone_id": "Z01",
    "predicted_calls": 7,
    "risk_score": 45,
    "risk_class": "MODERATE",
    "reasons": ["Predicted emergency demand...", "Evening peak hours..."]
}
```

### Test 2: Batch Prediction
**Input:** All 12 zones
**Expected:** Array with 12 results, one per zone

### Test 3: Low Risk Zone
**Scenario:** Zone with low elderly%, low AQI, low hour
**Expected:** risk_class = "LOW"

### Test 4: Critical Risk Zone
**Scenario:** Zone with high elderly%, high AQI, peak hour
**Expected:** risk_class = "CRITICAL"

### Test 5: ML API Failure
**Scenario:** ML API not running
**Expected:** Error handling, graceful degradation

---

## 🔐 Configuration Values

### Environment Variables Needed
```bash
# ML API Connection
ML_API_URL=http://localhost:8000
ML_API_TIMEOUT=5000  # milliseconds
ML_API_ENABLED=true

# Optional: For production
ML_API_RETRY_COUNT=3
ML_API_RETRY_DELAY=1000  # milliseconds
```

### Default Values (if not set)
```typescript
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";
const ML_API_TIMEOUT = parseInt(process.env.ML_API_TIMEOUT || "5000");
const ML_API_ENABLED = process.env.ML_API_ENABLED !== "false";
```

---

## ⚡ Performance Targets

| Metric | Target | Notes |
|---|---|---|
| Single prediction | < 50ms | Model inference only |
| Batch (12 zones) | < 500ms | All 12 serial inference + risk calc |
| API response time | < 2s | Total: request + ML + response |
| Memory per request | < 50MB | Per batch processing |
| Model file size | Expected 10-20MB | Check actual file size |

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] ML API tested locally with sample data
- [ ] Backend tested with mock ML API responses
- [ ] Error handling verified (ML API down scenario)
- [ ] Environment variables documented
- [ ] Model file verified in production path

### Deployment
- [ ] Deploy ML API first (or alongside backend)
- [ ] Start ML API before backend
- [ ] Verify connectivity: `curl http://ml-api:8000/docs`
- [ ] Test `/predict` endpoint with sample
- [ ] Test `/predict-batch` endpoint with all 12 zones
- [ ] Monitor logs for integration issues

### Post-Deployment
- [ ] Verify pipeline endpoint returns predictions
- [ ] Check frontend receives predictions
- [ ] Monitor ML API latency
- [ ] Alert on ML API failures
- [ ] Gradual traffic increase

---

## 📝 Logging Checklist

### Add Logging Points
```typescript
// mlService.ts
console.log("Calling ML API with", zones.length, "zones");
console.log("ML API response:", predictions);
console.error("ML API failed:", error);

# main.py
print(f"Received {len(data)} zone predictions")
print(f"Prediction for {zone_id}: calls={predicted_calls}")
logger.error(f"Model inference failed: {error}")
```

### Monitor These Metrics
- ML API response time per request
- Prediction values distribution (calls, risk scores)
- Error rate (ML API failures)
- Feature value ranges (validate inputs)

---

## 📚 Quick Troubleshooting

| Problem | Diagnosis | Solution |
|---|---|---|
| "zone_id not found in response" | Input schema missing zone_id | Add zone_id to HotspotInput |
| "Model file not found" | Relative path in hotspot.py | Use absolute path from __file__ |
| "Connection refused" | ML API not running | Start ML API on port 8000 |
| "Invalid feature order" | Feature names/order mismatch | Verify 11 features in exact order |
| "Negative predictions" | Model output clipping missing | Ensure np.clip(preds, 0, None) |
| "Risk scores always same" | Risk logic too strict | Review thresholds in riskpulse.py |

---

**This reference guide should be read alongside: `ML_INTEGRATION_GUIDE.md`**
