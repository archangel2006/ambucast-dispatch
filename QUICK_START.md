# AmbuCast - Quick Reference Guide

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
# ✅ Running on http://localhost:3001
```

### Terminal 2: ML API
```bash
cd ml_api
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
# ✅ Running on http://localhost:8000
```

### Terminal 3: Frontend
```bash
cd new-frontend
npm install
npm run dev
# ✅ Running on http://localhost:5173
```

### Browser
Open: **http://localhost:5173** 🎉

---

## 🗺️ Map Configuration

For different cities, update `new-frontend/.env.local`:

| City | LAT | LNG |
|------|-----|-----|
| Delhi, India | 28.6139 | 77.2090 |
| New York, USA | 40.7128 | -74.0060 |
| Los Angeles, USA | 34.0522 | -118.2437 |
| London, UK | 51.5074 | -0.1278 |
| Tokyo, Japan | 35.6762 | 139.6503 |
| Sydney, Australia | -33.8688 | 151.2093 |
| Singapore | 1.3521 | 103.8198 |

Example:
```env
VITE_MAP_CENTER_LAT=40.7128
VITE_MAP_CENTER_LNG=-74.0060
VITE_MAP_ZOOM=12
```

---

## 🔌 API Quick Reference

### Create Prediction
```bash
curl -X POST http://localhost:3001/api/predictions \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Get Hotspots
```bash
curl http://localhost:3001/api/hotspots
```

### Fetch Ambulances
```bash
curl http://localhost:3001/api/ambulances
```

### Run Allocation
```bash
curl -X POST http://localhost:3001/api/allocation/run
```

### ML Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### ML Health Check
```bash
curl http://localhost:8000/health
```

---

## 📱 Frontend Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard - Overview & stats |
| `/map` | Live ambulance tracking |
| `/hotspots` | Zone risk predictions |
| `/fleet` | Ambulance management |
| `/risk` | Risk analysis & alerts |
| `/analytics` | Performance metrics |
| `/settings` | Configuration |

---

## 🔐 Environment Files

### Backend `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ambucast_db"
PORT=3001
NODE_ENV=development
ML_API_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:3001/api
VITE_ML_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:3001
VITE_MAP_CENTER_LAT=28.6139
VITE_MAP_CENTER_LNG=77.2090
VITE_MAP_ZOOM=12
```

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `CORS error` | Check backend CORS_ORIGIN and frontend VITE_API_URL |
| `Cannot connect to ML API` | Ensure ML API is running on :8000, check VITE_ML_API_URL |
| `Database connection failed` | Ensure PostgreSQL is running, check DATABASE_URL |
| `Port already in use` | Kill process: `lsof -ti:PORT \| xargs kill -9` |
| `Module not found` | Run `npm install` in respective folder |
| `Missing models` | Place model files in `ml_api/models/` directory |

---

## 📦 Dependencies

### Backend
- express, typescript, prisma, pg, socket.io, axios

### ML API
- fastapi, uvicorn, pandas, numpy, scikit-learn, xgboost

### Frontend
- react, react-router, react-query, tailwind, recharts, leaflet, zustand

---

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update DATABASE_URL for production
- [ ] Update API URLs in frontend .env
- [ ] Run `npm run build` for frontend
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Test all API endpoints
- [ ] Verify map displays correctly

---

## 📊 Data Flow

```
User Browser (http://localhost:5173)
         ↓
    React Frontend
         ↓
    API Calls (axios)
    WebSocket (Socket.IO)
         ↓
Express Backend (:3001)
         ↓
  PostgreSQL Database
  FastAPI ML (:8000)
         ↓
Real-time Updates via Socket.IO
         ↓
Dashboard Refresh
```

---

## 💡 Tips & Tricks

**Disable Console Logs**: Edit `src/lib/api.ts` to remove debug logs

**Enable Dark Mode**: Components support dark mode by default

**Change Refresh Rate**: Edit `useData.ts` refetchInterval

**Customize Map Style**: Edit Leaflet config in components/LiveMap.tsx

**Add New Charts**: Use Recharts in pages (see Dashboard.tsx examples)

---

## 📚 File Locations

```
.env locations:
  - backend/.env
  - new-frontend/.env.local
  
Config files:
  - backend/tsconfig.json
  - new-frontend/vite.config.ts
  - new-frontend/tailwind.config.ts
  
Database:
  - backend/prisma/schema.prisma
  
Models:
  - ml_api/models/ (add your .pkl files here)
```

---

## 🎨 Customization

**Logo**: Update in Sidebar.tsx
**Colors**: Edit tailwind.config.ts
**Font**: Update in index.css
**Icons**: Replace lucide-react icons
**Charts**: Modify recharts configurations

---

## 🆘 Getting Help

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review [backend/README.MD](backend/README.MD)
3. See [docs/ML_API_SETUP.md](docs/ML_API_SETUP.md)
4. Check logs in each terminal
5. Verify all services are running

---

## ✨ Feature Highlights

✨ **No Google Maps API Key Needed** - Uses free Leaflet + OpenStreetMap  
✨ **Real-time Updates** - WebSocket integration  
✨ **Beautiful UI** - Professional dashboard design  
✨ **Type-Safe** - Full TypeScript support  
✨ **Mobile Responsive** - Works on all devices  
✨ **Dark Mode** - Automatic dark theme support  
✨ **Fast** - Vite + React 18 optimization  

---

**Last Updated**: May 2026  
**Version**: 1.0.0
