# Frontend – Interactive Dashboard (In Development)

## 📌 Overview

The **AmbuCast Frontend** is an interactive React-based dashboard that visualizes real-time ambulance deployments, emergency hotspots, risk assessments, and system statistics. While the ML and backend are production-ready, the frontend is still in active development to enhance user interactivity and navigation.

---

## 🎯 Current Status

### ✅ Completed
- Project scaffolding (React + Vite + TypeScript)
- Build configuration (Vite, ESLint, Tailwind CSS)
- Component library setup (shadcn/ui)
- Testing framework (Vitest + Playwright)
- Page routing structure

### 🚧 In Development
- Interactive map component (showing ambulance positions + hotspots)
- Real-time dashboard with WebSocket integration
- Risk visualization heatmap
- Ambulance fleet management panel
- Analytics & historical trends
- Navigation refinements

### 📋 Planned Features
- Mobile-responsive design
- Dark mode toggle
- User authentication & role-based access control
- Export reports (PDF, CSV)
- Mobile app (React Native)

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 18+ | Component-based UI |
| **Build Tool** | Vite | Fast development & production builds |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Component Library** | shadcn/ui | Pre-built accessible components |
| **Type Safety** | TypeScript | Compile-time type checking |
| **Real-time** | Socket.io Client | WebSocket communication |
| **State Management** | React Context (or Zustand) | Global state for ambulances, zones, etc. |
| **Map Visualization** | (TBD) Leaflet or Mapbox | Interactive maps |
| **Testing** | Vitest + Playwright | Unit & E2E tests |

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AppSidebar.tsx          # Navigation sidebar
│   │   ├── DashboardLayout.tsx     # Main layout wrapper
│   │   ├── KPICard.tsx             # Statistics cards (allocated, coverage, etc.)
│   │   ├── NavLink.tsx             # Navigation link component
│   │   ├── RiskBadge.tsx           # Risk level badge (LOW/MODERATE/HIGH/CRITICAL)
│   │   └── ui/                     # shadcn/ui components
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       └── ... (other UI components)
│   ├── pages/
│   │   ├── Index.tsx               # Home/dashboard page
│   │   ├── DashboardPage.tsx       # Main dashboard with live updates
│   │   ├── LiveMapPage.tsx         # Interactive map (in dev)
│   │   ├── FleetPage.tsx           # Ambulance fleet status
│   │   ├── HotspotPage.tsx         # Hotspot analysis
│   │   ├── RiskPage.tsx            # Risk assessment view
│   │   ├── AnalyticsPage.tsx       # Historical analytics
│   │   ├── SettingsPage.tsx        # Settings & configuration
│   │   └── NotFound.tsx            # 404 page
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Detect mobile device
│   │   ├── use-theme.tsx           # Dark mode toggle
│   │   ├── use-toast.ts            # Toast notifications
│   │   └── useSocket.ts            # (Planned) WebSocket connection
│   ├── lib/
│   │   ├── mockData.ts             # Temporary mock data
│   │   └── utils.ts                # Utility functions
│   ├── App.tsx                     # Root component & routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
│   └── robots.txt
├── test/
│   ├── example.test.ts             # Sample test
│   └── setup.ts                    # Vitest setup
├── vite.config.ts                  # Vite configuration
├── vitest.config.ts                # Vitest configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── components.json                 # shadcn/ui components registry
├── playwright.config.ts            # E2E testing configuration
└── package.json                    # Dependencies & scripts
```

---

## 🎨 UI Design Vision

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header: AmbuCast | Real-time Ambulance Deployment System│
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │         Main Content Area                    │
│          │                                              │
│ • Home   │ ┌────────────────────────────────────────┐  │
│ • Live   │ │ KPI Cards (Top)                        │  │
│   Map    │ ├────────────────────────────────────────┤  │
│ • Fleet  │ │ • Ambulances Allocated: 12 / 15       │  │
│ • Risk   │ │ • Coverage: 85%                        │  │
│ • Hotspot│ │ • Critical Zones: 2                    │  │
│ • Analytics                                         │  │
│ • Settings                                          │  │
│          │ ├────────────────────────────────────────┤  │
│          │ │ Interactive Map (center)               │  │
│          │ │ ┌──────────────────────────────────┐  │  │
│          │ │ │ 🗺️ [Map with markers]           │  │  │
│          │ │ │ • 🚑 Ambulance positions        │  │  │
│          │ │ │ • 📍 Hotspot zones              │  │  │
│          │ │ │ • 🔴 Risk heatmap               │  │  │
│          │ │ └──────────────────────────────────┘  │  │
│          │                                          │  │
│          │ ├────────────────────────────────────────┤  │
│          │ │ Live Events (Bottom)                   │  │
│          │ │ [Recent ambulance assignments]        │  │
│          └────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

### Page Structure (Planned)

**Home Page** (`/`)
- Quick overview of system status
- Link to all features

**Live Map** (`/map`)
- 🗺️ Interactive map with real-time ambulance positions
- 📍 Clickable zones showing hotspot details
- 🎨 Color-coded risk heatmap
- ETA display for assigned ambulances

**Fleet Management** (`/fleet`)
- Table of all ambulances
- Status filters (AVAILABLE, MOVING, ASSIGNED, UNAVAILABLE)
- Individual ambulance details & history

**Risk Assessment** (`/risk`)
- List of all zones with risk scores
- Sortable by risk level, demand, or demographics
- Drill-down into zone details

**Hotspot Analysis** (`/hotspots`)
- Predicted emergency volume by zone
- Time-based forecast
- Trend visualization

**Analytics** (`/analytics`)
- Historical performance metrics
- Response time trends
- Resource utilization charts

**Settings** (`/settings`)
- API configuration
- Refresh intervals
- Map preferences
- Notification settings

---

## 📊 Real-time Integration (WebSocket)

### Connection Flow

```typescript
// frontend/src/hooks/useSocket.ts (To be created)

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ambulances, setAmbulances] = useState([]);
  const [zones, setZones] = useState([]);
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    // Connect to backend WebSocket
    const newSocket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection events
    newSocket.on("connect", () => {
      setStatus("connected");
      console.log("✓ Connected to WebSocket");
    });

    newSocket.on("disconnect", () => {
      setStatus("disconnected");
      console.log("✗ Disconnected from WebSocket");
    });

    // Business events
    newSocket.on("ambulance_assigned", (data) => {
      setAmbulances(prev => [...prev, data]);
      // Show notification, update map, etc.
    });

    newSocket.on("risk_updated", (data) => {
      setZones(prev =>
        prev.map(z => z.zone_id === data.zone_id ? { ...z, ...data } : z)
      );
    });

    newSocket.on("pipeline_completed", (data) => {
      console.log(`Pipeline completed: ${data.ambulances_allocated} allocated`);
      // Refresh entire dashboard
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, ambulances, zones, status };
};
```

---

## 🎨 Component Examples (Planned)

### KPI Cards

```typescript
// frontend/src/components/KPICard.tsx

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "success" | "warning" | "danger";
}

export const KPICard = ({ title, value, unit, trend, color }: KPICardProps) => {
  return (
    <div className={`kpi-card border-l-4 border-${color}`}>
      <h3>{title}</h3>
      <div className="stat-value">
        {value} {unit}
      </div>
      {trend && <Trend direction={trend} />}
    </div>
  );
};

// Usage:
// <KPICard title="Ambulances Allocated" value={12} unit="/ 15" color="success" />
// <KPICard title="Coverage" value={85} unit="%" trend="up" color="default" />
// <KPICard title="Critical Zones" value={2} color="danger" />
```

### Risk Badge

```typescript
// frontend/src/components/RiskBadge.tsx

interface RiskBadgeProps {
  risk_class: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  risk_score?: number;
}

export const RiskBadge = ({ risk_class, risk_score }: RiskBadgeProps) => {
  const colors = {
    LOW: "bg-green-100 text-green-800",
    MODERATE: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800"
  };

  return (
    <div className={`badge ${colors[risk_class]}`}>
      {risk_class}
      {risk_score && ` (${risk_score.toFixed(2)})`}
    </div>
  );
};
```

---

## 🗺️ Map Integration (Planned)

### Technology Decision: Leaflet vs Mapbox

| Criteria | Leaflet | Mapbox | Recommended |
|----------|---------|--------|-------------|
| **Cost** | Open-source | Paid (free tier: 50k views/month) | Leaflet (for MVP) |
| **Features** | Core mapping | Advanced styling, analytics | Mapbox (for production) |
| **Learning Curve** | Easy | Moderate | Leaflet |
| **Community** | Large | Growing | Leaflet |

**Decision for MVP**: Start with Leaflet (open-source), migrate to Mapbox later if needed

### Map Features

```typescript
// frontend/src/components/InteractiveMap.tsx (Planned)

import L from "leaflet";
import { useEffect, useRef } from "react";

export const InteractiveMap = ({ ambulances, zones }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // Initialize map
    map.current = L.map(mapContainer.current).setView([19.0760, 72.8777], 12);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.current);

    // Add zone markers
    zones.forEach(zone => {
      const color = getRiskColor(zone.risk_class);
      L.circleMarker([zone.lat, zone.lng], {
        radius: 8,
        fillColor: color,
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      })
        .bindPopup(`Zone: ${zone.zone_id} | Risk: ${zone.risk_class}`)
        .addTo(map.current);
    });

    // Add ambulance markers
    ambulances.forEach(amb => {
      L.marker([amb.lat, amb.lng], {
        icon: createAmbulanceIcon()
      })
        .bindPopup(`Ambulance: ${amb.ambulance_number} | ETA: ${amb.eta_minutes}m`)
        .addTo(map.current);
    });
  }, [ambulances, zones]);

  return <div ref={mapContainer} className="map-container" />;
};

const getRiskColor = (risk_class: string) => {
  const colors: Record<string, string> = {
    LOW: "#22c55e",       // green
    MODERATE: "#eab308",  // yellow
    HIGH: "#f97316",      // orange
    CRITICAL: "#ef4444"   // red
  };
  return colors[risk_class] || "#888";
};

const createAmbulanceIcon = () => {
  return L.icon({
    iconUrl: "/ambulance-icon.png",
    iconSize: [32, 32],
    popupAnchor: [0, -32]
  });
};
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)

```
- sm: 640px    - Mobile
- md: 768px    - Tablet
- lg: 1024px   - Desktop
- xl: 1280px   - Large desktop
- 2xl: 1536px  - Extra large
```

### Mobile Considerations

- **Sidebar**: Collapsible on mobile (hamburger menu)
- **Map**: Full-screen on mobile; sidebar hidden
- **Dashboard**: Stacked vertically on small screens
- **KPI Cards**: Single column on mobile

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```typescript
// test/components/RiskBadge.test.ts

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RiskBadge } from "../src/components/RiskBadge";

describe("RiskBadge Component", () => {
  it("should display CRITICAL with red color", () => {
    const { getByText } = render(<RiskBadge risk_class="CRITICAL" />);
    expect(getByText("CRITICAL")).toHaveClass("bg-red-100");
  });

  it("should show risk score when provided", () => {
    const { getByText } = render(
      <RiskBadge risk_class="HIGH" risk_score={0.72} />
    );
    expect(getByText(/0.72/)).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
// test/e2e/dashboard.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test("should display ambulance allocation statistics", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Check KPI cards are visible
    await expect(page.locator("text=Ambulances Allocated")).toBeVisible();
    await expect(page.locator("text=Coverage")).toBeVisible();

    // Check map is rendered
    await expect(page.locator(".map-container")).toBeVisible();
  });

  test("should update in real-time on WebSocket event", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Simulate WebSocket event
    await page.evaluate(() => {
      // Mock socket event
      window.socket?.emit("ambulance_assigned", {
        ambulance_id: "AMB001",
        zone_id: "Z1",
        eta_minutes: 5
      });
    });

    // Check UI updated
    await expect(page.locator("text=AMB001")).toBeVisible();
  });
});
```

---

## 🚀 Development Workflow

### Running the Frontend

```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev
# Runs on http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint
```

---

## 📋 Current Development Tasks

### Phase 1: Core Dashboard (Current)
- [ ] Connect WebSocket (useSocket hook)
- [ ] Implement real-time KPI cards update
- [ ] Add ambulance list with status filtering
- [ ] Display latest events feed

### Phase 2: Map Integration
- [ ] Integrate Leaflet or Mapbox
- [ ] Plot ambulance positions
- [ ] Plot zone hotspots with heatmap
- [ ] Draw ambulance routes to zones
- [ ] Add info panels on click

### Phase 3: Analytics & Refinement
- [ ] Add historical charts (response time, allocation efficiency)
- [ ] Implement filters & search
- [ ] Improve navigation
- [ ] Add dark mode toggle
- [ ] Mobile responsiveness

### Phase 4: Advanced Features
- [ ] User authentication
- [ ] Role-based access control
- [ ] Export reports (PDF, CSV)
- [ ] Mobile app (React Native)
- [ ] Push notifications

---

## 🎯 Next Steps to Share on Resume

### Current Status (What You Can Say)
> "The AmbuCast project has a fully functional ML and backend system delivering real-time predictions and ambulance allocation. While the frontend is currently in development, **the critical infrastructure is complete and tested**. We're actively building an interactive dashboard with real-time map visualization and live WebSocket integration to make the system user-facing."

### What's Working
✅ ML models (HotspotCast + RiskPulse)
✅ FastAPI microservice
✅ Node.js backend with REST APIs
✅ WebSocket infrastructure
✅ Database (Prisma ORM)
✅ Ambulance allocation engine

### What's In Progress
🚧 Interactive map visualization
🚧 Real-time dashboard
🚧 WebSocket client integration
🚧 UI/UX refinements

### Focus Areas (For Interviews)
1. **Backend Completeness**: All core services are production-ready
2. **Scalability**: Architecture supports 100+ zones, 50+ ambulances
3. **Real-time Capability**: WebSocket infrastructure enables live updates
4. **Fault Tolerance**: Graceful degradation if services fail
5. **Frontend Momentum**: Active development with clear roadmap

---

## 💡 Interview Talking Points

### On Frontend Development
> "While the frontend is in development, the entire backend and ML infrastructure is production-ready. We've architected the system with a clear API contract, so the frontend development is straightforward – it's essentially a consumer of those APIs."

### On User Experience
> "We're prioritizing an interactive map-based dashboard where dispatch centers can see ambulances, hotspots, and risk zones in real-time. Our WebSocket infrastructure enables live updates without polling – critical for an emergency system."

### On Development Velocity
> "By separating concerns (ML, backend, frontend), multiple developers can work in parallel. The ML work is complete, the backend is stable, and the frontend team is focused on UI/UX – each team isn't blocked by the others."

### On Why It Matters
> "A beautiful UI means nothing if the backend predictions are wrong or slow. Our approach prioritizes getting the ML and backend right first – the frontend is the final piece that lets users interact with a proven system."

---

## 📞 Getting Frontend Running (For Testing)

```bash
# Terminal 1: Start ML API
cd ml_api
uvicorn main:app --reload

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to see the frontend

---

## 🔗 Related Documentation
- [Backend Setup](./00_PROJECT_OVERVIEW.md#setup-instructions)
- [WebSocket Architecture](./05_WEBSOCKETS_DOCS.md)
- [API Endpoints](./04_FASTAPI_DOCS.md)
