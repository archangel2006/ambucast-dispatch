# ML Integration - Testing & Validation Guide
**Complete step-by-step testing procedures**

---

## ✅ Phase 1: Pre-Implementation Verification

### Test 1.1: Verify Current ML API Works

**Goal:** Ensure existing model is functioning before any changes

```bash
# Step 1: Navigate to ml_api directory
cd backend/..  # or wherever ml_api is located
cd ml_api

# Step 2: Check if ML API is already running (if not, start it)
# In a NEW terminal/PowerShell window:
uvicorn main:app --reload --port 8000

# Step 3: Test single prediction (in another terminal)
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
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
  "predicted_calls": [some_integer >= 0],
  "risk_score": [some_number],
  "risk_class": "CRITICAL|HIGH|MODERATE|LOW",
  "reasons": [array of strings]
}
```

**✓ Status:** If you get the above → ML API is working

---

### Test 1.2: Verify Backend Pipeline Currently Works

**Goal:** Ensure backend data collection works before ML integration

```bash
# Step 1: In backend directory, start backend server (NEW terminal)
cd backend
npm install  # if needed
npm run dev

# Step 2: Test pipeline endpoint
curl "http://localhost:3000/pipeline"
```

**Expected Output:**
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
    "elderly_pct": 0.12
  },
  // ... 11 more zones ...
]
```

**✓ Status:** If you get array of 12 zones → backend working

---

## 🛠️ Phase 2: Implementation Tests

### Test 2.1: Test Updated Schema (After File 1 Change)

**What You Changed:** `ml_api/schemas/input_schema.py`

```bash
# Test: Send request WITH zone_id (should be accepted now)
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
  "predicted_calls": [integer],
  "risk_score": [number],
  "risk_class": "CRITICAL|HIGH|MODERATE|LOW",
  "reasons": [array]
}
```

**Note:** zone_id accepted in input but NOT yet in output (will be in next test)

**✓ Status:** If request accepted → schema updated correctly

---

### Test 2.2: Test Updated Endpoints (After File 3 Change)

**What You Changed:** `ml_api/main.py`

#### Test 2.2a: Single Prediction with zone_id in Response

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

**Expected Output:** zone_id NOW included
```json
{
  "zone_id": "Z01",
  "predicted_calls": 7,
  "risk_score": 45,
  "risk_class": "MODERATE",
  "reasons": ["Predicted emergency demand...", "Evening peak hours..."]
}
```

**✓ Status:** If zone_id in response → endpoint updated correctly

#### Test 2.2b: Batch Prediction Endpoint

```bash
# Create test file: test_batch.json
cat > test_batch.json << 'EOF'
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
    "elderly_pct": 0.12
  },
  {
    "zone_id": "Z02",
    "aqi": 3,
    "pm25": 34.16,
    "pm10": 88.16,
    "temperature": 32.97,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 32000,
    "elderly_pct": 0.14
  }
]
EOF

# Test batch endpoint
curl -X POST "http://localhost:8000/predict-batch" \
  -H "Content-Type: application/json" \
  -d @test_batch.json
```

**Expected Output:** Array of 2 results
```json
[
  {
    "zone_id": "Z01",
    "predicted_calls": 7,
    "risk_score": 45,
    "risk_class": "MODERATE",
    "reasons": [...]
  },
  {
    "zone_id": "Z02",
    "predicted_calls": 6,
    "risk_score": 40,
    "risk_class": "MODERATE",
    "reasons": [...]
  }
]
```

**✓ Status:** If array returned with correct zone_ids → batch endpoint working

#### Test 2.2c: Health Check Endpoint

```bash
curl "http://localhost:8000/health"
```

**Expected Output:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

**✓ Status:** If true → health check working

---

### Test 2.3: Test ML Service Client (After File 4 Creation)

**What You Created:** `backend/src/services/mlService.ts`

```bash
# Step 1: Create test file in backend/src/services/
cat > mlService.test.ts << 'EOF'
import { getPredictions } from './mlService.js';

// Test data (1 zone)
const testZone = {
  zone_id: "Z01",
  aqi: 3,
  pm25: 35.87,
  pm10: 88.37,
  temperature: 33.07,
  humidity: 25,
  hour: 21,
  day_of_week: 2,
  population_density: 28000,
  elderly_pct: 0.12
};

// Test function
(async () => {
  try {
    const result = await getPredictions([testZone]);
    console.log("ML Service Test Result:", JSON.stringify(result, null, 2));
    
    if (result[0].zone_id === "Z01") {
      console.log("✓ zone_id preserved");
    }
    if (typeof result[0].predicted_calls === 'number') {
      console.log("✓ predicted_calls is number");
    }
    if (['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].includes(result[0].risk_class)) {
      console.log("✓ risk_class valid");
    }
  } catch (error) {
    console.error("ML Service Test Failed:", error);
  }
})();
EOF

# Step 2: Compile and run
npx ts-node mlService.test.ts
```

**Expected Output:**
```
ML Service Test Result: [
  {
    zone_id: "Z01",
    predicted_calls: 7,
    risk_score: 45,
    risk_class: "MODERATE",
    reasons: [...]
  }
]
✓ zone_id preserved
✓ predicted_calls is number
✓ risk_class valid
```

**✓ Status:** If all checks pass → ML service client working

---

### Test 2.4: Test Updated Pipeline (After File 5 Change)

**What You Changed:** `backend/src/services/pipeline.ts`

```bash
# Test: Call pipeline endpoint which now calls ML API
curl "http://localhost:3000/pipeline"
```

**Expected Output:** 12 zones WITH predictions
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
    "reasons": ["Predicted emergency demand...", "Evening peak hours..."]
  },
  // ... 11 more zones with predictions ...
]
```

**Key Checks:**
- All 12 zones present? ✓
- Each zone has predicted_calls? ✓
- Each zone has risk_score? ✓
- Each zone has risk_class? ✓
- Each zone has reasons array? ✓

**✓ Status:** If all zones have predictions → full integration working

---

## 🔍 Phase 3: Integration Tests

### Test 3.1: Test All 12 Zones in Batch

**Goal:** Verify all 12 zones process correctly through ML API

```bash
# Create test with all 12 zones
cat > test_all_zones.json << 'EOF'
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
    "elderly_pct": 0.12
  },
  {
    "zone_id": "Z02",
    "aqi": 3,
    "pm25": 34.16,
    "pm10": 88.16,
    "temperature": 32.97,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 32000,
    "elderly_pct": 0.14
  },
  {
    "zone_id": "Z03",
    "aqi": 3,
    "pm25": 35.87,
    "pm10": 88.37,
    "temperature": 33.01,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 35000,
    "elderly_pct": 0.13
  },
  {
    "zone_id": "Z04",
    "aqi": 3,
    "pm25": 35.16,
    "pm10": 87.07,
    "temperature": 33.1,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 15000,
    "elderly_pct": 0.18
  },
  {
    "zone_id": "Z05",
    "aqi": 3,
    "pm25": 36.19,
    "pm10": 85.96,
    "temperature": 32.98,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 18000,
    "elderly_pct": 0.16
  },
  {
    "zone_id": "Z06",
    "aqi": 3,
    "pm25": 34.16,
    "pm10": 88.16,
    "temperature": 33.07,
    "humidity": 15,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 20000,
    "elderly_pct": 0.17
  },
  {
    "zone_id": "Z07",
    "aqi": 3,
    "pm25": 36.19,
    "pm10": 85.96,
    "temperature": 33.08,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 26000,
    "elderly_pct": 0.15
  },
  {
    "zone_id": "Z08",
    "aqi": 3,
    "pm25": 34.16,
    "pm10": 88.16,
    "temperature": 33.06,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 22000,
    "elderly_pct": 0.19
  },
  {
    "zone_id": "Z09",
    "aqi": 3,
    "pm25": 34.16,
    "pm10": 88.16,
    "temperature": 33.07,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 24000,
    "elderly_pct": 0.18
  },
  {
    "zone_id": "Z10",
    "aqi": 3,
    "pm25": 36.19,
    "pm10": 85.96,
    "temperature": 32.94,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 27000,
    "elderly_pct": 0.13
  },
  {
    "zone_id": "Z11",
    "aqi": 3,
    "pm25": 35.87,
    "pm10": 88.37,
    "temperature": 33.15,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 23000,
    "elderly_pct": 0.16
  },
  {
    "zone_id": "Z12",
    "aqi": 3,
    "pm25": 35.16,
    "pm10": 87.07,
    "temperature": 32.71,
    "humidity": 25,
    "hour": 21,
    "day_of_week": 2,
    "population_density": 14000,
    "elderly_pct": 0.2
  }
]
EOF

# Test batch with all 12
curl -X POST "http://localhost:8000/predict-batch" \
  -H "Content-Type: application/json" \
  -d @test_all_zones.json > batch_response.json

# Verify response
cat batch_response.json | jq 'length'  # Should be 12
cat batch_response.json | jq '.[].zone_id'  # Should list all 12 zone IDs
```

**✓ Checks:**
- Response is array? ✓
- Array length = 12? ✓
- All zone_ids present (Z01-Z12)? ✓
- Each has predicted_calls? ✓
- Each has risk_score? ✓

---

### Test 3.2: Error Handling Test

**Goal:** Verify graceful failure when ML API is down

```bash
# Step 1: Stop ML API (Ctrl+C in ML API terminal)

# Step 2: Try calling backend pipeline
curl "http://localhost:3000/pipeline"

# Expected: Should still return zones but with fallback predictions
# predicted_calls: 0, risk_score: 0, risk_class: "LOW", reasons: ["ML API unavailable"]
```

**✓ Status:** If backend returns gracefully → error handling working

---

### Test 3.3: Performance Test

**Goal:** Measure response times

```bash
# Test single prediction time
time curl -X POST "http://localhost:8000/predict" \
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
  }' > /dev/null

# Test batch (12 zones) time
time curl -X POST "http://localhost:8000/predict-batch" \
  -H "Content-Type: application/json" \
  -d @test_all_zones.json > /dev/null

# Test full pipeline time
time curl "http://localhost:3000/pipeline" > /dev/null
```

**Expected Performance:**
- Single prediction: < 100ms
- Batch (12 zones): < 500ms
- Full pipeline: < 2s

**✓ Acceptable if:**
- Single < 200ms ✓
- Batch < 1000ms ✓
- Pipeline < 5s ✓

---

## 🧪 Phase 4: Data Validation Tests

### Test 4.1: Verify Variable Mapping

**Goal:** Ensure all fields are correctly mapped

```bash
# Test with specific values to verify mapping
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": "Z01",
    "aqi": 5,
    "pm25": 100.0,
    "pm10": 200.0,
    "temperature": 25.0,
    "humidity": 80,
    "hour": 18,
    "day_of_week": 5,
    "population_density": 50000,
    "elderly_pct": 0.25
  }'
```

**Expectations:**
- aqi=5 (high) → should affect prediction ✓
- elderly_pct=0.25 (high) → should increase risk ✓
- hour=18 (evening) → should increase risk ✓
- All values accepted without error ✓

---

### Test 4.2: Verify Risk Scoring

**Goal:** Check risk calculation is working

```bash
# Test case 1: Low risk (night, low AQI, young population)
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": "Z01",
    "aqi": 1,
    "pm25": 10.0,
    "pm10": 20.0,
    "temperature": 20.0,
    "humidity": 50,
    "hour": 2,
    "day_of_week": 1,
    "population_density": 5000,
    "elderly_pct": 0.05
  }' | jq '.risk_class'
# Expected: "LOW"

# Test case 2: High risk (evening, high AQI, elderly population)
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": "Z02",
    "aqi": 200,
    "pm25": 150.0,
    "pm10": 250.0,
    "temperature": 30.0,
    "humidity": 80,
    "hour": 20,
    "day_of_week": 5,
    "population_density": 100000,
    "elderly_pct": 0.35
  }' | jq '.risk_class'
# Expected: "HIGH" or "CRITICAL"
```

**✓ Validation:**
- Low risk case returns LOW? ✓
- High risk case returns HIGH or CRITICAL? ✓
- Reasons array populated? ✓

---

## 📋 Testing Checklist

### Pre-Implementation
- [ ] ML API running successfully with test data
- [ ] Backend pipeline returns 12 zones
- [ ] Current system working before changes

### Implementation Phase
- [ ] Schema updated (zone_id added)
- [ ] `/predict` endpoint returns zone_id
- [ ] `/predict-batch` endpoint works with arrays
- [ ] `/health` endpoint accessible
- [ ] Model path fixed and loading correctly

### Integration Phase
- [ ] ML Service client created
- [ ] Pipeline updated to call ML API
- [ ] Backend returns predictions for all 12 zones
- [ ] Error handling works (API down scenario)

### Validation Phase
- [ ] All 12 zones process without error
- [ ] zone_id preserved throughout
- [ ] Risk scores vary by zone data
- [ ] Performance acceptable
- [ ] Data types correct

---

## 🚨 Common Test Failures & Fixes

| Error | Cause | Fix |
|---|---|---|
| `curl: Connection refused` | ML API not running | Start ML API: `uvicorn main:app --reload` |
| `400 Bad Request` | Invalid field names | Check field names match schema (zone_id, pm25, etc.) |
| `500 Internal Server Error` | Model loading failed | Check model path in hotspot.py is absolute path |
| `zone_id not in response` | Response schema not updated | Verify PredictionResult has zone_id field |
| `Batch endpoint not found` | main.py not updated | Check /predict-batch endpoint exists |
| `TypeError: Object of type X is not JSON serializable` | NumPy type | Check int() conversion of predictions |
| `timeout` | API too slow | Check performance, increase timeout |

---

## 📝 Test Summary Report Template

**After completing all tests, fill out:**

```markdown
# ML Integration Test Report
Date: [today]

## Phase 1: Pre-Implementation ✓
- [ ] ML API works
- [ ] Backend pipeline works

## Phase 2: Implementation ✓
- [ ] Schema updated
- [ ] Endpoints working
- [ ] Health check OK
- [ ] ML client created
- [ ] Pipeline updated

## Phase 3: Integration ✓
- [ ] Batch predictions work
- [ ] All 12 zones process
- [ ] Error handling tested
- [ ] Performance acceptable

## Phase 4: Validation ✓
- [ ] Variable mapping correct
- [ ] Risk scoring working
- [ ] Data types valid
- [ ] No data loss

## Issues Found
[List any issues]

## Status
✅ ALL TESTS PASSED - Ready for production
OR
⚠️ ISSUES FOUND - See above

## Performance Metrics
- Single prediction: XXms
- Batch (12 zones): XXms
- Full pipeline: XXms
```

---

**Start with Phase 1 to establish baseline, then follow implementation order with tests at each step.**
