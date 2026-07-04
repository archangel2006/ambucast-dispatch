# AmbuCast System Architecture

## 🏗️ Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🌐 CLIENT LAYER - Web Browser (http://localhost:5173)         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 18 Frontend (TypeScript)                          │  │
│  │  ├── Dashboard (KPIs, Charts)                            │  │
│  │  ├── Live Map (Leaflet, Real-time)                       │  │
│  │  ├── Hotspots (Risk Analysis)                            │  │
│  │  ├── Fleet (Management)                                  │  │
│  │  ├── Risk (Assessment)                                   │  │
│  │  ├── Analytics (Metrics)                                 │  │
│  │  └── Settings (Config)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ▲                    ▲                    ▲             │
│           │ HTTP/REST         │ WebSocket         │ HTTP         │
│           │ (Axios)           │ (Socket.IO)       │ (Axios)      │
│           ▼                    ▼                    ▼             │
└─────────────────────────────────────────────────────────────────┘
             │                    │                    │
             │                    │                    │
┌────────────┴─────────────────────┴────────────────────┴──────────┐
│                                                                 │
│  🔌 API LAYER                                                  │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │  Express.js Backend  │  │  FastAPI ML API              │  │
│  │  (Port 3001)         │  │  (Port 8000)                 │  │
│  │                      │  │                              │  │
│  │  ├── /ambulances     │  │  ├── /predict               │  │
│  │  ├── /hotspots       │  │  ├── /predict-batch         │  │
│  │  ├── /predictions    │  │  └── /health                │  │
│  │  ├── /allocation     │  │                              │  │
│  │  └── WebSocket       │  │  HotspotCast (XGBoost)      │  │
│  │      (Real-time)     │  │  RiskPulse (Rule-based)    │  │
│  └──────────────────────┘  └──────────────────────────────┘  │
│           ▲                         ▲                          │
│           │ SQL Queries             │ Prediction Requests    │
│           │                         │                        │
└───────────┼─────────────────────────┼────────────────────────┘
            │                         │
┌───────────┴─────────────────────────┴────────────────────────────┐
│                                                                 │
│  💾 DATA LAYER                                                 │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │  PostgreSQL Database │  │  ML Models                   │  │
│  │                      │  │                              │  │
│  │  Tables:             │  │  ├── hotspot_model.pkl      │  │
│  │  ├── ambulances      │  │  ├── risk_model.pkl         │  │
│  │  ├── hotspots        │  │  └── training_data/         │  │
│  │  ├── predictions     │  │                              │  │
│  │  └── zones           │  │  Python Models              │  │
│  │                      │  │  ├── XGBoost               │  │
│  │  Prisma ORM          │  │  └── Rule Engine            │  │
│  └──────────────────────┘  └──────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  User Opens     │
│  Dashboard      │
│  (Browser)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ React Hooks Trigger:            │
│ ├── useAmbulances()             │
│ ├── useHotspots()               │
│ └── useRealTimeUpdates()        │
└─────────────────┬───────────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    HTTP GET          HTTP GET          WebSocket
    /ambulances       /hotspots         Listen
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                            ▼
                  ┌──────────────────────┐
                  │ Express Backend      │
                  │                      │
                  │ Receives Request &   │
                  │ Queries Database     │
                  └──────┬───────────────┘
                         │
                         ▼
                  ┌──────────────────────┐
                  │ PostgreSQL           │
                  │                      │
                  │ Returns Data:        │
                  │ - Ambulances List    │
                  │ - Hotspots          │
                  │ - Predictions        │
                  └──────┬───────────────┘
                         │
                         ▼
                  ┌──────────────────────┐
                  │ Express Backend      │
                  │                      │
                  │ Formats JSON         │
                  │ Response             │
                  └──────┬───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
      JSON via      JSON via       WebSocket
      HTTP          HTTP           Events
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ React Frontend       │
              │                      │
              │ useQuery Caching     │
              │ Updates State        │
              │ Re-renders UI        │
              └──────┬───────────────┘
                     │
                     ▼
              ┌──────────────────────┐
              │ User Sees Updated    │
              │ Dashboard with:      │
              │ - New Ambulance Pos. │
              │ - Updated Hotspots   │
              │ - Live Charts        │
              │ - Real-time Map      │
              └──────────────────────┘
```

---

## 🔄 Real-Time Update Flow

```
Backend Database Change
         │
         ▼
┌────────────────────────────┐
│ Socket.IO Event Triggered  │
│ - ambulance_moved          │
│ - hotspot_updated          │
│ - allocation_complete      │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ WebSocket Broadcast        │
│ to All Connected Clients   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ Frontend Socket.IO Listener│
│ Receives Real-time Event   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ React State Updated        │
│ (Zustand Store)            │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ Component Re-renders       │
│ with New Data              │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ User Sees Live Updates     │
│ - Ambulances Move          │
│ - Maps Update              │
│ - Hotspots Change          │
│ - Charts Refresh           │
└────────────────────────────┘
```

---

## 🗺️ Frontend Component Architecture

```
App.tsx
│
├── Layout Component
│   ├── Sidebar (Navigation)
│   │   └── Links to all pages
│   │
│   └── Main Content Area
│       │
│       ├── Dashboard.tsx
│       │   ├── StatCard × 4
│       │   ├── BarChart (Risk Distribution)
│       │   ├── LineChart (Top Hotspots)
│       │   └── HotspotCard × 5
│       │
│       ├── LiveMap.tsx
│       │   ├── MapComponent (Leaflet)
│       │   ├── AmbulanceMarkers
│       │   └── FleetStatusPanel
│       │
│       ├── Hotspots.tsx
│       │   ├── RiskSummaryCards × 4
│       │   ├── ScatterChart
│       │   ├── BarChart
│       │   ├── FilterDropdown
│       │   └── HotspotCard × N
│       │
│       ├── Fleet.tsx
│       │   ├── StatusCards × 3
│       │   ├── PieChart
│       │   └── AmbulanceCard × N
│       │
│       ├── Risk.tsx
│       │   ├── CriticalAlert
│       │   ├── MetricCards × 3
│       │   ├── AreaChart
│       │   ├── RiskMatrix
│       │   └── RiskTable
│       │
│       ├── Analytics.tsx
│       │   ├── MetricCards × 4
│       │   ├── ComposedChart
│       │   ├── SystemPerformance
│       │   └── EfficiencyMetrics
│       │
│       └── Settings.tsx
│           ├── APIConfig
│           ├── MapSettings
│           ├── DataPrivacy
│           └── AboutSection

Shared Components:
├── Card (with Header, Content, Title, Description)
├── Alert
├── StatCard
├── LiveMap (Leaflet)
├── AmbulanceCard
└── HotspotCard
```

---

## 🔌 API Connection Flow

```
Frontend (React)
    │
    ├─→ Create axios instance with BASE_URL
    ├─→ Configure Socket.IO connection
    └─→ Setup Query Client (React Query)
         │
         ▼
    Import api.ts
    │
    ├─→ ambulanceAPI.fetchAll()
    │   └─→ GET /api/ambulances → Database
    │
    ├─→ predictionAPI.getHotspots()
    │   └─→ GET /api/hotspots → Database
    │
    ├─→ mlAPI.predict()
    │   └─→ POST /predict → ML Model
    │
    ├─→ allocationAPI.runAllocation()
    │   └─→ POST /allocation/run → Algorithm
    │
    └─→ socket.on()
        └─→ Real-time events from backend

Browser Cache (React Query)
    └─→ Stores responses (staleTime: 30s)
    └─→ Automatic refetch on stale
    └─→ Manual invalidation on socket events
```

---

## 🎯 State Management Flow

```
Zustand Store (useAppStore)
│
├── ambulances: Ambulance[]
│   └── setAmbulances() ← useAmbulances hook
│
├── hotspots: Hotspot[]
│   ├── setHotspots() ← useHotspots hook
│   └── addHotspot() ← Real-time events
│
├── stats: DashboardStats
│   └── setStats() ← Computed from data
│
├── isLoading: boolean
│   └── setIsLoading() ← API calls
│
└── selectedZone: string
    └── setSelectedZone() ← User selection

Component Usage:
    │
    ├─→ useAppStore((state) => state.ambulances)
    ├─→ useAppStore((state) => state.hotspots)
    ├─→ useAppStore((state) => state.stats)
    │
    └─→ Automatic re-render on state change
```

---

## 📍 Map Integration Architecture

```
LiveMap Component
    │
    ├── useEffect Hook
    │   └── Initialize Leaflet Map
    │       ├── Create MapContainer
    │       ├── Add TileLayer (OpenStreetMap)
    │       └── Center on [LAT, LNG]
    │
    ├── Ambulance Props
    │   └── Array of ambulance objects
    │       ├── id
    │       ├── location: {lat, lng}
    │       ├── status
    │       └── name
    │
    ├── Render Loop
    │   └── For each ambulance
    │       ├── Create Marker
    │       ├── Custom Icon
    │       ├── Popup (on click)
    │       └── Show ambulance info
    │
    └── Real-time Updates
        └── useAmbulances hook
            └── Auto-refetch every 5s
                └── Re-render with new positions

Map Data Flow:
    Frontend (GPS coordinates)
         │
         └─→ useAmbulances() from API
             │
             └─→ Ambulance.location {lat, lng}
                 │
                 └─→ [latitude, longitude]
                     │
                     └─→ Leaflet Marker position
                         │
                         └─→ User sees on map
```

---

## 🎨 Component Lifecycle

```
Dashboard Component Lifecycle:

1. Mount
   ├── useAmbulances() query
   ├── useHotspots() query
   └── Set initial state

2. Render
   ├── Fetch data via useQuery
   ├── Return JSX with charts
   └── Display KPI cards

3. Update
   ├── Refetch on stale
   ├── Real-time socket events
   └── Re-render with new data

4. Interaction
   ├── User clicks "Run Allocation"
   ├── Call runAllocation()
   ├── Show loading state
   ├── Display result alert
   └── Optionally refetch data

5. Cleanup
   ├── Cancel pending requests
   ├── Unsubscribe from socket
   └── Clear timers
```

---

## 📈 Data Refresh Strategy

```
Initial Load
    │
    ├─→ React Query fetchQuery
    ├─→ Data cached (staleTime: 30s)
    └─→ Show loading spinner

User Interaction
    │
    ├─→ Manual query.refetch()
    ├─→ API call with loading state
    └─→ Update UI

Time-based Refresh (Polling)
    │
    ├─→ refetchInterval: 5000ms (ambulances)
    ├─→ refetchInterval: 10000ms (hotspots)
    └─→ Background refresh every interval

Real-time Updates (Socket.IO)
    │
    ├─→ Listen for 'ambulance_moved'
    ├─→ Listen for 'hotspot_updated'
    └─→ Immediate invalidateQueries()

User Focus
    │
    └─→ refetchOnWindowFocus: true
        └─→ Refetch when tab regains focus
```

---

## 🚀 Deployment Architecture

```
Local Development
    │
    ├─→ Backend: localhost:3001
    ├─→ ML API: localhost:8000
    ├─→ Frontend: localhost:5173
    └─→ Database: localhost:5432

Production (Example)
    │
    ├─→ Frontend: Vercel / Netlify
    │   ├── Build: npm run build
    │   ├── Output: dist/
    │   └── Serve: Static hosting
    │
    ├─→ Backend: Heroku / Railway / EC2
    │   ├── Build: npm run build
    │   ├── Start: npm start
    │   └── Port: 3001 (exposed)
    │
    ├─→ ML API: Docker / AWS Lambda
    │   ├── Container: Dockerfile
    │   ├── Run: uvicorn main:app
    │   └── Port: 8000 (exposed)
    │
    └─→ Database: AWS RDS / Heroku Postgres
        ├── PostgreSQL
        └── Managed service
```

---

## 🔐 Security Layers

```
Frontend Layer
    │
    ├─→ Environment variables (.env.local)
    │   └── Hide sensitive URLs
    │
    └─→ HTTPS/TLS on production
        └── Secure communication

API Layer
    │
    ├─→ CORS Configuration
    │   └── Whitelist allowed origins
    │
    ├─→ Input Validation (Zod)
    │   └── Schema validation
    │
    ├─→ Error Handling
    │   └── Don't expose stack traces
    │
    └─→ Rate Limiting (optional)
        └── Prevent abuse

Database Layer
    │
    ├─→ Connection Pool
    │   └── Secure connection string
    │
    ├─→ Parameterized Queries (Prisma)
    │   └── SQL injection prevention
    │
    └─→ Access Control
        └── User authentication ready
```

---

## 📊 Performance Optimization

```
Frontend Optimization
    ├─→ Code Splitting (Vite)
    ├─→ Lazy Component Loading
    ├─→ React Query Caching
    ├─→ Recharts Optimization
    ├─→ Image Optimization
    └─→ CSS Minification

Network Optimization
    ├─→ API Response Caching
    ├─→ WebSocket for real-time (vs polling)
    ├─→ Compression (gzip)
    ├─→ CDN for static assets
    └─→ HTTP/2 multiplexing

Database Optimization
    ├─→ Prisma Query Optimization
    ├─→ Database Indexing
    ├─→ Connection Pooling
    ├─→ Pagination (if needed)
    └─→ Denormalization (if needed)
```

---

**Version**: 1.0.0  
**Created**: May 2026  
**System**: AmbuCast - Emergency Response Optimization
