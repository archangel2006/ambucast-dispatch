# ML API Integration & Fix Guide
**Date:** April 21, 2026  
**Status:** Documentation for Integration Work

---

## 📋 Table of Contents
1. [Current System Architecture](#current-system-architecture)
2. [Data Flow Overview](#data-flow-overview)
3. [Issues Identified](#issues-identified)
4. [Variable Mapping Analysis](#variable-mapping-analysis)
5. [Step-by-Step Integration Plan](#step-by-step-integration-plan)
6. [Code Changes Required](#code-changes-required)
7. [Testing & Validation](#testing--validation)

---

## 1. Current System Architecture

### Backend (Node.js + TypeScript)
- **Location:** `backend/src/routes/service.route.ts`
- **Pipeline:** `backend/src/services/pipeline.ts`
- **Current Behavior:**
  - Endpoint: `GET /pipeline`
  - Fetches time data (hour, day_of_week)
  - Fetches air quality data (aqi, pm25, pm10)
  - Fetches weather data (temperature, humidity)
  - Combines with zone data (zone_id, population_density, elderly_pct)
  - **Returns:** Array of 12 zone objects (one per zone)

### FastAPI ML API (Python)
- **Location:** `ml_api/main.py`
- **Current Behavior:**
  - Endpoint: `POST /predict`
  - Expects: Single zone object
  - Processes: Through HotspotPredictor model
  - Secondary: Risk calculation via RiskPulse logic
  - **Returns:** Single prediction result

### ML Models
- **Model 1 (HotspotCast):** `ml_api/inference/hotspot.py`
  - File: `ml_api/models/hotspotcast.pkl`
  - Predicts emergency call demand
  - Uses 11 features (including engineered time features)

- **Model 2 (RiskPulse):** `ml_api/inference/riskpulse.py`
  - Rule-based risk scoring
  - Generates risk class + explanations

---

## 2. Data Flow Overview

### Current Flow (⚠️ INCOMPLETE)
```
Backend Pipeline (buildZonePayloads)
        ↓
Builds array of 12 zone objects
        ↓
Returns to /pipeline endpoint
        ↓
❌ NOT CONNECTED TO ML API YET
```

### Expected Flow (✅ TO BE IMPLEMENTED)
```
Backend Route (/pipeline)
        ↓
Calls buildZonePayloads()
        ↓
Returns array of 12 zone objects
        ↓
Sends batch request to ML API (/predict-batch)
        ↓
ML API processes each zone separately
        ↓
Returns batch results (12 predictions)
        ↓
Backend aggregates & returns to client
```

---

## 3. Issues Identified

### Issue #1: Mismatch in Request Structure
- **Problem:** Backend sends **ARRAY** of zone objects
- **Current API Expects:** Single object
- **Fix:** Create batch prediction endpoint or modify to handle arrays

### Issue #2: Input Schema Completeness
- **Current Schema:** Matches data sent from backend ✅
  - ✅ aqi → AQI (conversion needed in model)
  - ✅ pm25 → PM2.5 (conversion needed in model)
  - ✅ pm10 → PM10 (conversion needed in model)
  - ✅ temperature → temperature
  - ✅ humidity → humidity
  - ✅ hour → hour
  - ✅ day_of_week → day_of_week
  - ✅ population_density → population_density
  - ✅ elderly_pct → elderly_pct

### Issue #3: Field Name Case Sensitivity
- Backend sends: `aqi`, `pm25`, `pm10` (lowercase with numbers)
- Model expects: `AQI`, `PM2.5`, `PM10` (uppercase with decimals)
- **Current Status:** ✅ Already handled in `main.py` L10-14

### Issue #4: Zone ID Not Processed
- **Problem:** `zone_id` sent from backend but ignored by ML API
- **Impact:** Cannot track which prediction corresponds to which zone
- **Fix:** Include `zone_id` in response object

### Issue #5: Batch vs. Single Predictions
- **Problem:** API designed for single object, receives array
- **Options:**
  - Option A: Loop in backend (12 individual requests)
  - Option B: Create new `/predict-batch` endpoint
  - Option C: Modify `/predict` to accept arrays

### Issue #6: Model File Path
- **Problem:** `joblib.load("models/hotspotcast.pkl")` uses relative path
- **Risk:** May fail if working directory differs
- **Fix:** Use absolute path or construct from __file__

---

## 4. Variable Mapping Analysis

### Input Data Structure (From Backend)

```json
{
  "zone_id": "Z01",          // Unique zone identifier
  "aqi": 3,                   // Air Quality Index (1-5)
  "pm25": 35.87,              // PM2.5 concentration (μg/m³)
  "pm10": 88.37,              // PM10 concentration (μg/m³)
  "temperature": 33.07,       // Temperature (°C)
  "humidity": 25,             // Relative humidity (%)
  "hour": 21,                 // Hour of day (0-23)
  "day_of_week": 2,           // Day of week (0-6, 0=Sunday)
  "population_density": 28000,// People per km²
  "elderly_pct": 0.12         // Elderly population percentage (0-1)
}
```

### Variable Mapping to Model

| Backend Field | ML Schema | Model Input | Transformation | Notes |
|---|---|---|---|---|
| zone_id | - | - | **NOT PROCESSED** | ⚠️ Needs to be included in output |
| aqi | aqi (float) | AQI | Case conversion | Used as-is |
| pm25 | pm25 (float) | PM2.5 | Key name change | Used as-is |
| pm10 | pm10 (float) | PM10 | Key name change | Used as-is |
| temperature | temperature (float) | temperature | No change | Used as-is |
| humidity | humidity (float) | humidity | No change | Used as-is |
| hour | hour (int) | hour | Sinusoidal engineering | Converted to hour_sin, hour_cos |
| day_of_week | day_of_week (int) | day_of_week | Sinusoidal engineering | Converted to dow_sin, dow_cos |
| population_density | population_density (float) | population_density | No change | Used as-is |
| elderly_pct | elderly_pct (float) | elderly_pct | No change | Used as-is |

### Feature Engineering in Model

The `HotspotPredictor.preprocess()` method creates:
- `hour_sin` = sin(2π × hour / 24)
- `hour_cos` = cos(2π × hour / 24)
- `dow_sin` = sin(2π × day_of_week / 7)
- `dow_cos` = cos(2π × day_of_week / 7)

**Final Feature List (11 features):**
```
["hour_sin", "hour_cos", "dow_sin", "dow_cos", "PM2.5", "PM10", "AQI", "temperature", "humidity", "population_density", "elderly_pct"]
```

---

## 5. Step-by-Step Integration Plan

### Phase 1: FastAPI Enhancement (Backend Support)

#### Step 1.1: Add Batch Prediction Endpoint
**File:** `ml_api/main.py`

**Action:** Create new endpoint to accept array of inputs
```
Endpoint: POST /predict-batch
Input: Array[HotspotInput]
Output: Array[PredictionResult] with zone_id preserved
```

**Rationale:** Allows backend to send all 12 zones in single request

#### Step 1.2: Update Input Schema
**File:** `ml_api/schemas/input_schema.py`

**Action:** Add zone_id field to schema
```
class HotspotInput(BaseModel):
    zone_id: str  # ← ADD THIS
    aqi: float
    pm25: float
    ...
```

**Rationale:** Enables response to include zone mapping

#### Step 1.3: Create Response Schema
**File:** `ml_api/schemas/input_schema.py`

**Action:** Create PredictionResult model
```
class PredictionResult(BaseModel):
    zone_id: str
    predicted_calls: int
    risk_score: float
    risk_class: str
    reasons: List[str]
```

**Rationale:** Structured response with zone identification

#### Step 1.4: Fix Model Path Issue
**File:** `ml_api/inference/hotspot.py`

**Action:** Use absolute path for model loading
```python
import os
model_path = os.path.join(os.path.dirname(__file__), "../models/hotspotcast.pkl")
self.model = joblib.load(model_path)
```

**Rationale:** Ensures model loads correctly from any working directory

---

### Phase 2: Backend Integration (Node.js → ML API)

#### Step 2.1: Create ML API Client
**File:** `backend/src/services/mlService.ts` (NEW)

**Action:** Create function to call FastAPI batch endpoint
```typescript
export const getPredictions = async (zones: any[]) => {
    const response = await fetch("http://localhost:8000/predict-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zones)
    });
    
    if (!response.ok) throw new Error("ML API failed");
    return await response.json();
}
```

**Rationale:** Decouples ML API calls from routes

#### Step 2.2: Update Pipeline to Call ML API
**File:** `backend/src/services/pipeline.ts`

**Action:** Add ML API call after buildZonePayloads
```typescript
export const buildZonePayloads = async () => {
    // ... existing code ...
    
    // NEW: Call ML API
    const predictions = await getPredictions(results);
    
    // Merge predictions with zone data
    const enrichedResults = results.map(zone => ({
        ...zone,
        ...predictions.find(p => p.zone_id === zone.zone_id)
    }));
    
    return enrichedResults;
}
```

**Rationale:** Enriches zone data with predictions in single response

#### Step 2.3: Add Error Handling
**File:** `backend/src/services/pipeline.ts`

**Action:** Wrap ML API calls with try-catch
```typescript
try {
    const predictions = await getPredictions(results);
    // ... merge logic ...
} catch (error) {
    console.error("ML API call failed:", error);
    // Return zones without predictions or retry
}
```

**Rationale:** Prevents pipeline failure if ML API is down

---

### Phase 3: Model & Notebook Verification

#### Step 3.1: Verify Notebook Features
**File:** `ml/Model1_HotspotCast.ipynb`

**Action:** Check that training features match inference features
- Expected features: hour_sin, hour_cos, dow_sin, dow_cos, PM2.5, PM10, AQI, temperature, humidity, population_density, elderly_pct
- Verify feature order matches `hotspot.py` Line 27-31

#### Step 3.2: Check Model Output Range
**File:** `ml_api/inference/hotspot.py`

**Action:** Verify prediction clipping (Line 35)
```python
preds = np.clip(preds, 0, None)  # No negative calls
```

**Rationale:** Emergency calls must be non-negative integer

#### Step 3.3: Validate Risk Scoring Logic
**File:** `ml_api/inference/riskpulse.py`

**Action:** Review thresholds and reasons
- AQI > 150 → Add 2 points
- predicted_calls > 5 → Add 2 points
- elderly_pct > 0.2 → Add 2 points
- 17 ≤ hour ≤ 21 → Add 1 point

**Rationale:** Ensure logic aligns with business requirements

---

### Phase 4: Testing & Validation

#### Step 4.1: Test Single Zone Prediction
**Test Method:** Manual curl request
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": "Z01",
    "aqi": 3,
    "pm25": 35.87,
    "pm10": 88.37,
    "temperature": 33.07,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 28000,
    "elderly_pct": 0.12
  }'
```

**Expected Output:**
```json
{
  "zone_id": "Z01",
  "predicted_calls": [integer >= 0],
  "risk_score": [0-100],
  "risk_class": ["CRITICAL"|"HIGH"|"MODERATE"|"LOW"],
  "reasons": [array of strings]
}
```

#### Step 4.2: Test Batch Prediction
**Test Method:** Send all 12 zones
```bash
curl -X POST "http://localhost:8000/predict-batch" \
  -H "Content-Type: application/json" \
  -d '[{zone_id: "Z01", ...}, {...}, ...]'
```

**Expected Output:** Array of 12 results

#### Step 4.3: Test Backend Pipeline Integration
**Test Method:** Call backend pipeline endpoint
```bash
curl "http://localhost:3000/pipeline"
```

**Expected Output:** Array of 12 zone objects with predictions

#### Step 4.4: Performance Testing
**Metrics:**
- Batch request time for 12 zones (target: < 500ms)
- Model inference time per zone (target: < 50ms)
- API response time end-to-end (target: < 2s)

---

## 6. Code Changes Required

### 6.1 FastAPI Changes Summary

**Files to Modify:**
1. `ml_api/main.py` - Add batch endpoint, fix imports
2. `ml_api/schemas/input_schema.py` - Add zone_id, create response model
3. `ml_api/inference/hotspot.py` - Fix model path

**Files to Create:**
1. None (existing structure is sufficient)

### 6.2 Backend (Node.js) Changes Summary

**Files to Modify:**
1. `backend/src/services/pipeline.ts` - Add ML API integration
2. `backend/src/services/dataService.ts` - May need error handling enhancement

**Files to Create:**
1. `backend/src/services/mlService.ts` - New ML API client

### 6.3 Configuration Changes

**Environment Variables Needed:**
```
# .env or backend config
ML_API_URL=http://localhost:8000
ML_API_TIMEOUT=5000 (milliseconds)
ML_API_ENABLED=true
```

**Rationale:** Allows toggling ML API without code changes

---

## 7. Dependency Check

### FastAPI Requirements
**File:** `ml_api/requirements.txt`

Current dependencies are sufficient:
- ✅ fastapi - Web framework
- ✅ uvicorn - ASGI server
- ✅ pandas - Data manipulation
- ✅ numpy - Numerical computing
- ✅ scikit-learn - ML utilities
- ✅ joblib - Model loading

**No new dependencies required.**

### Backend Dependencies
**File:** `backend/package.json`

Verify:
- ✅ Node.js has native fetch (v18+)
- ✅ Express.js for routing
- ✅ TypeScript for type safety

---

## 8. Potential Issues & Mitigation

| Issue | Severity | Mitigation |
|---|---|---|
| ML API down | HIGH | Return zones without predictions, implement retry logic |
| Slow inference | MEDIUM | Implement caching for repeated zones, async processing |
| Invalid model path | HIGH | Use absolute paths, add startup validation |
| Type mismatches | MEDIUM | Use Pydantic validation, add type checking |
| Port conflicts | LOW | Make ML API port configurable |
| CORS issues | MEDIUM | Configure CORS in FastAPI if needed |

---

## 9. Rollout Strategy

### Phase A: Local Testing
1. Start ML API locally on port 8000
2. Start backend on port 3000
3. Test single zone → batch prediction flow
4. Validate all 12 zones process correctly

### Phase B: Integration Testing
1. Connect backend pipeline to ML API
2. Test error handling (API down, invalid data)
3. Performance test batch predictions
4. Load test with concurrent requests

### Phase C: Production Deployment
1. Deploy ML API (Docker container or cloud)
2. Update backend environment variables
3. Enable ML API integration flag
4. Monitor error logs and performance metrics
5. Gradually increase traffic

---

## 10. Checklist for Implementation

- [ ] **FastAPI Enhancement**
  - [ ] Add zone_id to HotspotInput schema
  - [ ] Create PredictionResult response schema
  - [ ] Implement /predict-batch endpoint
  - [ ] Fix model path in hotspot.py
  - [ ] Test both endpoints locally

- [ ] **Backend Integration**
  - [ ] Create mlService.ts with batch call function
  - [ ] Update pipeline.ts to call ML API
  - [ ] Add error handling for ML API failures
  - [ ] Add environment configuration
  - [ ] Test pipeline with actual ML API

- [ ] **Verification**
  - [ ] Verify notebook features match inference features
  - [ ] Check model output ranges and constraints
  - [ ] Validate risk scoring logic
  - [ ] Test with sample data provided

- [ ] **Testing**
  - [ ] Single zone prediction test
  - [ ] Batch prediction test
  - [ ] End-to-end pipeline test
  - [ ] Error scenario testing
  - [ ] Performance benchmarking

- [ ] **Documentation**
  - [ ] Update API documentation
  - [ ] Document expected response format
  - [ ] Add deployment instructions
  - [ ] Create monitoring guidelines

---

## 11. Expected Final Output Format

### Single Zone Request to Backend
**Input:** None (automatic pipeline)

**Output:**
```json
[
  {
    "zone_id": "Z01",
    "aqi": 3,
    "pm25": 35.87,
    "pm10": 88.37,
    "temperature": 33.07,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 28000,
    "elderly_pct": 0.12,
    "predicted_calls": 7,
    "risk_score": 45,
    "risk_class": "MODERATE",
    "reasons": [
      "Predicted emergency demand is above normal for this time window.",
      "Evening peak hours typically see increased movement and incident rates."
    ]
  },
  // ... 11 more zones ...
]
```

---

## 12. Next Steps

1. **Review this document** with team for approval
2. **Implement Phase 1** (FastAPI changes) - ~2 hours
3. **Implement Phase 2** (Backend integration) - ~2 hours
4. **Execute Phase 3** (Verification) - ~1 hour
5. **Run Phase 4** (Testing) - ~2 hours
6. **Deploy to staging** - ~1 hour
7. **Production rollout** - ~1 hour

**Estimated Total:** 9-10 hours of implementation

---

**Document Version:** 1.0  
**Last Updated:** April 21, 2026  
**Status:** Ready for Implementation
