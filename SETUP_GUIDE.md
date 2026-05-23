# AmbuCast - Complete Setup & Deployment Guide

## Project Overview

AmbuCast is an **Emergency Response Optimization System** that combines:
- **Backend**: Express.js + TypeScript + Prisma ORM + PostgreSQL
- **ML Engine**: FastAPI Python with XGBoost predictions
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Leaflet Maps

The system predicts emergency ambulance demand (HotspotCast) and analyzes risk levels (RiskPulse) across zones.

---

## 📋 Prerequisites

### Required Software
- **Node.js**: v18+ (for backend & frontend)
- **Python**: v3.9+ (for ML API)
- **PostgreSQL**: v14+ (database)
- **npm or pnpm**: Package managers

### System Requirements
- RAM: 4GB minimum (8GB recommended)
- Disk Space: 2GB minimum
- OS: Windows, macOS, or Linux

---

## 🗂️ Project Structure

```
ambucast-dispatch/
├── backend/              # Express.js API server
│   ├── src/
│   ├── prisma/          # Database schema & migrations
│   ├── package.json
│   └── tsconfig.json
├── new-frontend/        # React Dashboard (NEW)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── ml_api/              # FastAPI ML Engine
│   ├── main.py
│   ├── inference/
│   ├── requirements.txt
│   └── models/
└── docs/               # Documentation
```

---

## 🚀 Installation & Setup

### Step 1: Backend Setup

#### 1.1 Navigate to Backend Directory
```bash
cd backend
```

#### 1.2 Install Dependencies
```bash
npm install
```

#### 1.3 Configure Environment Variables
Create `.env` file in `backend/` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/ambucast_db"

# Server Configuration
PORT=3001
NODE_ENV=development

# ML API Configuration
ML_API_URL=http://localhost:8000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important Database Setup:**
```bash
# Create database
createdb ambucast_db

# Run migrations
npm run prisma migrate dev
```

#### 1.4 Start Backend Server
```bash
npm run dev
# Server runs on http://localhost:3001
```

---

### Step 2: ML API Setup

#### 2.1 Navigate to ML API Directory
```bash
cd ml_api
```

#### 2.2 Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install ML Dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Download & Place Models (if needed)
The ML API expects trained models in `ml_api/models/` directory:
- `hotspot_model.pkl` - XGBoost model for demand prediction
- Any other required model files

#### 2.5 Start ML API Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# API runs on http://localhost:8000
```

---

### Step 3: New Frontend Setup

#### 3.1 Navigate to New Frontend Directory
```bash
cd new-frontend
```

#### 3.2 Install Dependencies
```bash
npm install
# or
pnpm install
```

#### 3.3 Configure Environment Variables
Create `.env.local` in `new-frontend/` directory:

```env
# API Endpoints
VITE_API_URL=http://localhost:3001/api
VITE_ML_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:3001

# Map Configuration (Default: Delhi, India)
VITE_MAP_CENTER_LAT=28.6139
VITE_MAP_CENTER_LNG=77.2090
VITE_MAP_ZOOM=12
```

**For Different Locations:**
- **New York**: Lat: 40.7128, Lng: -74.0060
- **Los Angeles**: Lat: 34.0522, Lng: -118.2437
- **London**: Lat: 51.5074, Lng: -0.1278
- **Tokyo**: Lat: 35.6762, Lng: 139.6503

#### 3.4 Start Frontend Development Server
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔌 API Endpoints Reference

### Backend API (http://localhost:3001/api)

#### Ambulances
```
GET  /ambulances           # Fetch all ambulances
POST /ambulances/move      # Move ambulance to location
POST /ambulances/status    # Update ambulance status
GET  /ambulances/seed      # Seed sample data
```

#### Predictions & Hotspots
```
POST /predictions          # Create prediction
GET  /hotspots            # Get all hotspots
```

#### Allocation
```
POST /allocation/run      # Run allocation algorithm
```

### ML API (http://localhost:8000)

```
POST /predict             # Single zone prediction
POST /predict-batch       # Batch prediction for multiple zones
GET  /health             # Health check
GET  /                   # Root endpoint
```

#### ML API Request Example:
```json
{
  "zone_id": "zone_1",
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

## 🎯 Running Everything Together

### Quick Start (All Services)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - ML API:**
```bash
cd ml_api
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --port 8000 --reload
```

**Terminal 3 - Frontend:**
```bash
cd new-frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## 📊 Frontend Features

### Dashboard (/)
- Real-time KPI cards (ambulances, incidents, zones)
- Risk distribution chart
- Top hotspots analysis
- Run allocation algorithm

### Live Map (/map)
- Real-time ambulance positions
- OpenStreetMap integration (FREE - no API keys needed!)
- Fleet status panel
- Location details on click

### Hotspots (/hotspots)
- Emergency demand prediction by zone
- Risk filtering (Critical, High, Medium, Low)
- Scatter plot analysis
- Detailed zone information

### Fleet Management (/fleet)
- All ambulances inventory
- Status breakdown (Available, Occupied, Maintenance)
- Distribution charts
- Individual ambulance details

### Risk Analysis (/risk)
- Risk score trends
- Critical zone alerts
- Risk matrix visualization
- Detailed risk breakdown table

### Analytics (/analytics)
- Performance metrics
- Zone performance comparison
- System efficiency indicators
- Coverage ratio analysis

### Settings (/settings)
- API configuration display
- Map settings
- Data & privacy preferences
- System information

---

## 🗺️ Map Library: Leaflet (Free, No API Key Required!)

The frontend uses **Leaflet.js** with **OpenStreetMap** tiles - completely free!

### Why Leaflet?
✅ Free (MIT License)
✅ No API keys required
✅ Lightweight and fast
✅ Full heatmap support
✅ Real-time updates
✅ Mobile responsive

### Map Customization
Edit `new-frontend/.env.local`:
```env
VITE_MAP_CENTER_LAT=28.6139
VITE_MAP_CENTER_LNG=77.2090
VITE_MAP_ZOOM=12
```

---

## 🔐 Database Setup

### PostgreSQL Local Setup

#### Windows (using psql):
```bash
psql -U postgres
CREATE DATABASE ambucast_db;
```

#### macOS/Linux:
```bash
createdb ambucast_db
```

### Prisma Migrations
```bash
cd backend

# Create new migration
npx prisma migrate dev --name migration_name

# View database
npx prisma studio

# Reset database (⚠️ CAUTION - deletes all data)
npx prisma migrate reset
```

---

## 🛠️ Troubleshooting

### Frontend Won't Connect to Backend
```
Error: CORS issue
Solution:
1. Ensure backend is running on port 3001
2. Check VITE_API_URL in .env.local
3. Verify backend CORS_ORIGIN setting
```

### ML API Connection Failed
```
Error: Cannot reach ML API
Solution:
1. Ensure FastAPI server is running: http://localhost:8000/health
2. Check VITE_ML_API_URL in frontend .env.local
3. Verify firewall settings
```

### Database Connection Error
```
Error: Cannot connect to PostgreSQL
Solution:
1. Start PostgreSQL service
2. Verify DATABASE_URL in backend .env
3. Ensure database exists: createdb ambucast_db
4. Check credentials (username/password)
```

### Port Already in Use
```
Errors like "EADDRINUSE: address already in use :::3001"
Solution:
# Find and kill process using port
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

---

## 📦 Building for Production

### Frontend Build
```bash
cd new-frontend
npm run build
# Output: dist/ directory
```

### Backend Build
```bash
cd backend
npm run build
npm start  # Runs compiled JavaScript
```

---

## 🔄 Real-Time Features

The system uses **Socket.IO** for real-time updates:

- Ambulance position updates
- Hotspot changes
- Risk score updates
- Allocation results

All connected automatically when services are running!

---

## 📝 API Integration Examples

### Fetch Ambulances (JavaScript)
```typescript
const ambulances = await fetch('http://localhost:3001/api/ambulances')
  .then(res => res.json());
```

### Get Hotspots (JavaScript)
```typescript
const hotspots = await fetch('http://localhost:3001/api/hotspots')
  .then(res => res.json());
```

### ML Prediction (Python)
```python
import requests

response = requests.post('http://localhost:8000/predict', json={
    'zone_id': 'zone_1',
    'aqi': 180,
    'pm25': 90,
    'pm10': 140,
    'temperature': 32,
    'humidity': 60,
    'hour': 14,
    'day_of_week': 2,
    'population_density': 12000,
    'elderly_pct': 0.18
})
print(response.json())
```

---

## 🎨 UI/UX Features

### Components Used
- **Shadcn UI** inspired components (Card, Alert, etc.)
- **Recharts** for data visualization
- **Leaflet** for mapping
- **Lucide React** for icons
- **Tailwind CSS** for styling

### Dark Mode Support
Components automatically support dark mode. Users can customize in Settings.

---

## 📊 Data Flow

```
Frontend (React)
    ↓
    ├→ Fetches ambulances/hotspots from Backend
    ├→ Updates in real-time via Socket.IO
    └→ Sends requests to ML API for predictions
    
Backend (Express)
    ↓
    ├→ Manages ambulance/zone data
    ├→ Stores predictions in PostgreSQL
    └→ Broadcasts updates via Socket.IO

ML API (FastAPI)
    ↓
    ├→ HotspotCast: Predicts ambulance demand
    └→ RiskPulse: Calculates risk scores

Database (PostgreSQL)
    ↓
    └→ Stores all predictions, ambulances, hotspots
```

---

## 🚀 Deployment Options

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables Checklist
- [ ] Backend DATABASE_URL
- [ ] Backend PORT
- [ ] Backend ML_API_URL
- [ ] Backend CORS_ORIGIN
- [ ] Frontend VITE_API_URL
- [ ] Frontend VITE_ML_API_URL
- [ ] Frontend VITE_SOCKET_URL
- [ ] Frontend VITE_MAP_CENTER_LAT/LNG
- [ ] Frontend VITE_MAP_ZOOM

---

## 📞 Support & Documentation

### Backend Docs
See `backend/README.MD`

### ML API Docs
See `docs/ML_API_SETUP.md`

### Frontend API Integration
Refer to `new-frontend/src/lib/api.ts`

---

## ✅ Verification Checklist

- [ ] PostgreSQL running
- [ ] Backend running on :3001
- [ ] ML API running on :8000
- [ ] Frontend running on :5173
- [ ] All environment variables set
- [ ] No port conflicts
- [ ] Database migrations applied
- [ ] Models loaded in ML API
- [ ] Real-time updates working
- [ ] Map rendering correctly

---

## 🎯 Next Steps

1. **Load Sample Data**: `GET /ambulances/seed`
2. **Create Predictions**: `POST /predictions`
3. **Run Allocation**: `POST /allocation/run`
4. **Monitor Dashboard**: Open http://localhost:5173
5. **Check Live Map**: Navigate to /map
6. **Analyze Hotspots**: Go to /hotspots

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Maintainers**: AmbuCast Team
