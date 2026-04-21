# ML Integration - CORRECTED Scope Clarification
**Important: No Model Changes Allowed**

---

## ⚠️ Scope Constraints

### ❌ DO NOT MODIFY
- `ml/Model1_HotspotCast.ipynb` - Training notebook (READ-ONLY)
- `ml/Model2_RiskPulse_Initial.ipynb` - Training notebook (READ-ONLY)
- `ml_api/models/hotspotcast.pkl` - Trained model file (READ-ONLY)
- `ml_api/inference/riskpulse.py` - Risk logic code (READ-ONLY, as it's part of the model)

### ✅ CAN ONLY MODIFY

#### FastAPI Layer (Interface to Model)
- `ml_api/main.py` - API endpoints only
- `ml_api/schemas/input_schema.py` - Input/output validation schemas
- `ml_api/inference/hotspot.py` - **ONLY** the model loading path fix (lines 8-9)

#### Backend Layer (Node.js)
- `backend/src/services/pipeline.ts` - Pipeline orchestration
- `backend/src/services/mlService.ts` - NEW file: ML API client
- `backend/src/routes/service.route.ts` - Route handling
- `backend/.env` - Configuration

---

## 📋 Files to Modify (Final List)

### File 1: `ml_api/schemas/input_schema.py`
**Allowed Change:** ADD fields only (zone_id, PredictionResult response model)
```python
# BEFORE
class HotspotInput(BaseModel):
    aqi: float
    ...

# AFTER - ADD THESE
class HotspotInput(BaseModel):
    zone_id: str  # ← ADD
    aqi: float
    ...

class PredictionResult(BaseModel):  # ← ADD NEW CLASS
    zone_id: str
    ...
```

---

### File 2: `ml_api/inference/hotspot.py` - Line 8-9 ONLY
**Allowed Change:** Fix relative path to absolute path (DOES NOT CHANGE MODEL LOGIC)
```python
# BEFORE
self.model = joblib.load("models/hotspotcast.pkl")

# AFTER
import os
model_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(model_dir, "../models/hotspotcast.pkl")
self.model = joblib.load(model_path)
```
**Why:** This is a path fix, NOT a model logic change

---

### File 3: `ml_api/main.py`
**Allowed Changes:**
- Add imports (PredictionResult, List)
- Add `/predict-batch` endpoint
- Add `zone_id` to response (from input)
- Refactor to helper function for reusability
- Add `/health` endpoint

**NOT Allowed:**
- Change model prediction logic
- Modify feature engineering
- Change risk scoring thresholds
- Alter input/output data processing

---

### File 4: `backend/src/services/mlService.ts` (NEW)
**Allowed Change:** Create new file that calls ML API
- No model changes
- Just calls existing endpoints
- Error handling & configuration

---

### File 5: `backend/src/services/pipeline.ts`
**Allowed Change:** Add call to ML API and merge results
- No data transformation
- Just orchestrates calls
- Combines zone data with prediction responses

---

## ✅ Implementation Summary (CORRECTED)

| Component | File | Change Type | Allowed? |
|---|---|---|---|
| Input Schema | `ml_api/schemas/input_schema.py` | ADD fields | ✅ YES |
| Model Inference | `ml_api/inference/hotspot.py` | Fix path only (L8-9) | ✅ YES |
| API Endpoints | `ml_api/main.py` | Add batch endpoint | ✅ YES |
| ML Client | `backend/src/services/mlService.ts` | NEW file | ✅ YES |
| Pipeline | `backend/src/services/pipeline.ts` | Integrate ML API | ✅ YES |
| Training Notebooks | `ml/Model*.ipynb` | ANY changes | ❌ NO |
| Trained Model | `ml_api/models/hotspotcast.pkl` | ANY changes | ❌ NO |
| Risk Logic | `ml_api/inference/riskpulse.py` | ANY changes | ❌ NO |

---

## 🔄 Data Flow (Model UNchanged)

```
Backend builds zone data
        ↓
Sends to FastAPI /predict-batch endpoint
        ↓
FastAPI converts field names (aqi→AQI, etc.)
        ↓
Calls UNCHANGED model.predict(data)
        ↓
Model returns UNCHANGED prediction
        ↓
Calls UNCHANGED calculate_risk(data)
        ↓
Returns response with zone_id
        ↓
Backend receives & returns to client
```

**Model behavior:** 100% unchanged

---

## 📝 Documentation Corrections

**My previous documentation mentioned:**
- "Verify Notebook Features" - **DELETE this section** (can't modify notebooks)
- "Check Model Output Range" - **DELETE this section** (can't modify model)
- "Validate Risk Scoring Logic" - **DELETE this section** (can't modify logic)

**Valid sections only:**
- Variable mapping ✅
- FastAPI endpoint changes ✅
- Backend integration ✅
- Testing the data flow ✅
- Configuration ✅

---

## ✅ Clean Implementation Plan

### Phase 1: FastAPI Schema (No Model Impact)
1. Add `zone_id` field to `HotspotInput`
2. Add `PredictionResult` response model

### Phase 2: FastAPI Path Fix (No Model Impact)
3. Fix model loading path in `hotspot.py` (relative → absolute)

### Phase 3: FastAPI Endpoints (No Model Impact)
4. Refactor single prediction to helper function
5. Add `/predict-batch` endpoint
6. Both endpoints use UNCHANGED model

### Phase 4: Backend Integration (No Model Impact)
7. Create `mlService.ts` to call ML API
8. Update `pipeline.ts` to use ML API client
9. Merge predictions with zone data

**Total:** 0 model changes, only interface & orchestration

---

## 🚫 What We're NOT Doing

- ❌ Retraining model
- ❌ Changing feature order
- ❌ Modifying risk thresholds
- ❌ Adjusting predictions
- ❌ Changing model input format expectations
- ❌ Modifying any .ipynb files
- ❌ Touching trained .pkl file
- ❌ Altering riskpulse.py logic

---

## ✅ What We're Only Doing

- ✅ Making model accessible via batch API
- ✅ Preserving zone_id through prediction flow
- ✅ Fixing file path issue
- ✅ Creating interface between Backend ↔ FastAPI ↔ Model
- ✅ No touching model internals

---

**Scope:** FastAPI interface + Backend integration ONLY  
**Model Status:** Read-only, completely unchanged  
**Ready to proceed:** YES

