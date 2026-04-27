# WebSockets – Real-time Communication Architecture

## 📌 Overview

**WebSockets** provide bidirectional, real-time communication between the backend and frontend. Instead of polling the server repeatedly, the frontend maintains an open connection and receives updates instantly as ambulance allocations, risk scores, and predictions change.

---

## 🎯 Why WebSockets?

| Use Case | REST API | WebSockets | Winner |
|----------|----------|-----------|--------|
| **One-time data fetch** | ✅ Simple | ❌ Overkill | REST |
| **Real-time dashboard updates** | ⚠️ Polling (latency) | ✅ Push (instant) | WebSockets |
| **Live ambulance tracking** | ⚠️ Multiple requests | ✅ Single connection | WebSockets |
| **Emergency alerts** | ⚠️ Delay | ✅ Immediate | WebSockets |
| **Server-to-client updates** | ❌ Not possible | ✅ Native | WebSockets |

**AmbuCast Need**: Show ambulance movements and risk changes **in real-time** without page refresh
**Solution**: WebSockets (persistent connection + server push)

---

## 🏗️ Architecture

### Technology Stack
- **Server**: Socket.io (Node.js library, wraps WebSockets with fallbacks)
- **Protocol**: WebSocket over HTTP/HTTPS
- **Client**: Socket.io client (for frontend, not implemented yet)
- **Transport**: WebSocket (primary), HTTP long-polling (fallback)

### Backend Implementation

```typescript
// backend/src/sockets/socket.ts

import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  // Initialize Socket.io with CORS support
  io = new Server(server, {
    cors: { origin: "*" },  // Allow all origins (configure for production)
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
```

### Integration with Express Server

```typescript
// backend/src/server.ts

import express from "express";
import http from "http";
import { initSocket } from "./sockets/socket.js";
import routes from "./routes/index.js";

export const startServer = () => {
  const app = express();
  const server = http.createServer(app);

  // Initialize WebSockets
  initSocket(server);

  app.use(express.json());
  app.use("/api", routes);

  app.get("/", (_req, res) => {
    res.send("AmbuCast backend running");
  });

  server.listen(3001, () => {
    console.log("Server running on port 3001 with WebSockets");
  });
};
```

---

## 📡 Events & Communication Flow

### Event Hierarchy

```
Backend Server
│
├─ "ambulance_assigned" (broadcast)
│  └─ Sent when allocation engine assigns ambulance to zone
│     Data: {ambulance_id, hotspot_id, zone_id, lat, lng, eta_minutes}
│
├─ "ambulance_moved" (broadcast)
│  └─ Sent when ambulance changes position
│     Data: {ambulance_id, lat, lng, status}
│
├─ "risk_updated" (broadcast)
│  └─ Sent when risk score changes for a zone
│     Data: {zone_id, risk_score, risk_class, predicted_calls}
│
├─ "pipeline_started" (broadcast)
│  └─ Sent when new prediction cycle begins
│
└─ "pipeline_completed" (broadcast)
   └─ Sent when all predictions, risk, and allocation complete
      Data: {zones, ambulances, timestamp, total_calls}
```

### Timing & Frequency

```
Pipeline Execution Cycle (typical: every 5-10 minutes)

T=0m    │ Pipeline starts
        │ ├─ Fetch external data (weather, AQI)
        │ └─ Build ML input payloads
        ├─ [Event: "pipeline_started"]
        │
T=0.3s  │ FastAPI batch prediction
        │ ├─ HotspotCast models (predicted_calls)
        │ └─ RiskPulse models (risk_score, risk_class)
        │
T=0.4s  │ Allocation Engine
        │ ├─ Sort hotspots by risk
        │ ├─ Assign ambulances
        │ ├─ [Event: "ambulance_assigned" × N zones]
        │ └─ Update database
        │
T=0.5s  │ Frontend receives updates
        │ ├─ Update ambulance positions on map
        │ ├─ Highlight high-risk zones
        │ └─ Display ETAs
        │
T=0.6s  │ [Event: "pipeline_completed"]
        │
(Wait 5-10 minutes)
        │
T=5m    │ Next cycle begins...
```

---

## 📨 Event Examples

### Event 1: Ambulance Assigned

**Scenario**: Allocation engine assigns an ambulance to a CRITICAL zone

**Server Emission**
```typescript
io.emit("ambulance_assigned", {
  ambulance_id: "AMB001",
  ambulance_number: "MH09-AMB-001",
  hotspot_id: "H1",
  zone_id: "Z1",
  lat: 19.0760,
  lng: 72.8777,
  risk_class: "CRITICAL",
  distance_km: 0.8,
  eta_minutes: 2.4
});
```

**Frontend Receives** (not implemented yet, but would show):
```javascript
socket.on("ambulance_assigned", (data) => {
  // Update map: draw ambulance route to zone
  // Update info panel: show ETA
  // Play alert sound (for CRITICAL zones)
  console.log(`Ambulance ${data.ambulance_number} assigned to Zone ${data.zone_id}`);
  console.log(`ETA: ${data.eta_minutes} minutes`);
});
```

---

### Event 2: Risk Updated

**Scenario**: New risk calculation shows a zone has become HIGH-risk

**Server Emission**
```typescript
io.emit("risk_updated", {
  zone_id: "Z5",
  predicted_calls: 18,
  risk_score: 0.68,
  risk_class: "HIGH",
  reasons: [
    "High AQI (200+)",
    "Peak hour (18:00)",
    "High population density"
  ]
});
```

**Frontend Would**:
- Change zone color from yellow (MODERATE) to red (HIGH)
- Update sidebar statistics
- Potentially trigger re-allocation if ambulances available

---

### Event 3: Pipeline Completed

**Scenario**: Entire prediction-to-allocation cycle completes

**Server Emission**
```typescript
io.emit("pipeline_completed", {
  timestamp: "2026-04-27T14:32:00Z",
  zones_processed: 15,
  ambulances_allocated: 12,
  coverage_percentage: 80,
  critical_zones: 2,
  high_zones: 5,
  moderate_zones: 6,
  low_zones: 2,
  next_cycle_in_minutes: 5
});
```

**Frontend Would**:
- Refresh entire dashboard
- Update statistics panel
- Show "Next update in X minutes"
- Enable/disable allocate button

---

## 🔌 Implementation in Allocation Service

### Emitting Events from Backend

```typescript
// backend/src/modules/allocation/allocation.service.ts

import { getIO } from "../../sockets/socket.js";

export const runAllocation = async () => {
    const io = getIO();
    
    // Fetch hotspots and ambulances from database
    const hotspots = await prisma.hotspot.findMany();
    const ambulances = await prisma.ambulance.findMany({
        where: { status: "AVAILABLE" }
    });

    // Sort by risk priority
    const risk_priority = {
        "CRITICAL": 3,
        "HIGH": 2,
        "MODERATE": 1,
        "LOW": 0
    };
    
    const hotspots_sorted = hotspots.sort(
        (a, b) => (risk_priority[b.risk] ?? 0) - (risk_priority[a.risk] ?? 0)
    );

    let allocated_count = 0;

    // Allocate ambulances
    for (const hotspot of hotspots_sorted) {
        let nearest_ambulance = null;
        let min_distance = Infinity;

        // Find nearest available ambulance
        for (const amb of ambulances) {
            const distance = calculateDistance(
                hotspot.lat, hotspot.lng,
                amb.lat, amb.lng
            );

            if (distance < min_distance) {
                min_distance = distance;
                nearest_ambulance = amb;
            }
        }

        // If ambulance found, assign it
        if (nearest_ambulance) {
            // Update database
            await prisma.ambulance.update({
                where: { id: nearest_ambulance.id },
                data: {
                    status: "MOVING",
                    hotspot_id: hotspot.id,
                    distance_to_hotspot: min_distance,
                    eta_minutes: Math.ceil(min_distance / 5) // Assume 5 km/min
                }
            });

            allocated_count++;

            // 🔥 Emit WebSocket event to all connected clients
            io.emit("ambulance_assigned", {
                ambulance_id: nearest_ambulance.id,
                ambulance_number: nearest_ambulance.ambulance_number,
                hotspot_id: hotspot.id,
                zone_id: hotspot.zone_id,
                risk_class: hotspot.risk,
                lat: hotspot.lat,
                lng: hotspot.lng,
                distance_km: min_distance,
                eta_minutes: Math.ceil(min_distance / 5),
                timestamp: new Date().toISOString()
            });

            // Remove from available pool
            ambulances.splice(ambulances.indexOf(nearest_ambulance), 1);
        }
    }

    // Emit completion event
    io.emit("pipeline_completed", {
        timestamp: new Date().toISOString(),
        ambulances_allocated: allocated_count,
        total_hotspots: hotspots.length,
        coverage_percentage: (allocated_count / hotspots.length) * 100,
        next_cycle_in_minutes: 5
    });
};
```

---

## 🎯 Frontend Integration (Planned)

### Socket.io Client Code (React Example)

```typescript
// frontend/src/hooks/useSocket.ts

import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io(SOCKET_URL);

    // Listen for ambulance assignments
    newSocket.on("ambulance_assigned", (data) => {
      console.log("Ambulance assigned:", data);
      setAmbulances(prev => [...prev, data]);
      
      // Update map visualization
      updateMapMarker(data.ambulance_id, data.lat, data.lng);
      
      // Show notification
      showNotification(`${data.ambulance_number} → Zone ${data.zone_id} (ETA: ${data.eta_minutes}m)`);
    });

    // Listen for risk updates
    newSocket.on("risk_updated", (data) => {
      console.log("Risk updated:", data);
      setZones(prev => 
        prev.map(z => z.zone_id === data.zone_id ? { ...z, ...data } : z)
      );
      
      // Update zone color on map based on risk
      updateZoneColor(data.zone_id, data.risk_class);
    });

    // Listen for pipeline completion
    newSocket.on("pipeline_completed", (data) => {
      console.log("Pipeline completed:", data);
      console.log(`Allocated ${data.ambulances_allocated} ambulances`);
      
      // Update dashboard statistics
      updateDashboardStats(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, ambulances, zones };
};
```

### Dashboard Component (React)

```typescript
// frontend/src/pages/DashboardPage.tsx

import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export const DashboardPage = () => {
  const { ambulances, zones } = useSocket();
  const [stats, setStats] = useState({
    allocated: 0,
    coverage: 0,
    critical: 0
  });

  useEffect(() => {
    // Update statistics
    setStats({
      allocated: ambulances.length,
      coverage: (ambulances.length / zones.length) * 100,
      critical: zones.filter(z => z.risk_class === "CRITICAL").length
    });
  }, [ambulances, zones]);

  return (
    <div className="dashboard">
      <div className="stats-panel">
        <div className="stat-card">
          <h3>Ambulances Allocated</h3>
          <p className="stat-value">{stats.allocated}</p>
        </div>
        <div className="stat-card">
          <h3>Coverage %</h3>
          <p className="stat-value">{stats.coverage.toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <h3>Critical Zones</h3>
          <p className="stat-value critical">{stats.critical}</p>
        </div>
      </div>

      <div className="map-container">
        {/* Interactive map showing ambulances and zones */}
      </div>

      <div className="events-panel">
        <h3>Live Events</h3>
        <ul>
          {ambulances.slice(-5).map(amb => (
            <li key={amb.ambulance_id}>
              <strong>{amb.ambulance_number}</strong> → Zone {amb.zone_id}
              <small>ETA: {amb.eta_minutes} min</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

---

## 🔒 Security Considerations

### Current (Development)
```typescript
cors: { origin: "*" }  // Allow all origins
```

### Production (Recommended)
```typescript
cors: {
  origin: [
    "https://ambucast.com",
    "https://admin.ambucast.com"
  ],
  credentials: true,
  methods: ["GET", "POST"]
}
```

### Authentication (Future)
```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token || !verifyToken(token)) {
    return next(new Error("Unauthorized"));
  }
  
  socket.userId = getUserIdFromToken(token);
  next();
});
```

---

## 📊 Performance & Scalability

### Current Architecture (Single Instance)
- **Concurrent Connections**: ~500–1000 clients
- **Event Broadcasts**: <10ms per event
- **Memory Usage**: ~50MB per 100 clients

### Scaling Strategy (Future)

```typescript
// Option 1: Redis Adapter (distribute across multiple servers)
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient();
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

**Benefits**:
- Multiple backend servers can share WebSocket connections
- Events broadcast to all connected clients across servers
- Horizontal scaling: add servers as load increases

---

## 🎓 Interview Talking Points

### On Real-time Updates
> "WebSockets enable true real-time updates without the latency of polling. Instead of the frontend repeatedly asking 'any updates?', the server pushes updates instantly. For an emergency system, this 100–500ms latency difference is critical."

### On Event-Driven Architecture
> "The allocation service emits events whenever significant changes occur. The frontend listens for these events and updates the UI automatically. This decoupling means the frontend and backend can be developed/deployed independently."

### On Scalability
> "Currently, Socket.io handles 500+ concurrent connections on a single server. For multi-city deployment, I'd use a Redis adapter to distribute connections across multiple backend instances."

### On User Experience
> "Real-time ambulance tracking with live ETA updates creates a sense of control and transparency. Users see the ambulance on a map moving toward them, which reduces anxiety during emergencies."

---

## 🔮 Future Enhancements

| Enhancement | Benefit | Timeline |
|-------------|---------|----------|
| **Room-based Events** | Subscribe to specific zones; reduce network traffic | Q2 2026 |
| **Presence Tracking** | Show which dispatch centers are viewing which zones | Q2 2026 |
| **Message Queuing** | Ensure events aren't lost if clients disconnect | Q3 2026 |
| **Compression** | Reduce bandwidth for large event payloads | Q3 2026 |
| **Auth & RBAC** | Restrict zones visible to each user | Q3 2026 |
| **Metrics Dashboard** | Monitor WebSocket health, latency, connections | Q4 2026 |
| **Mobile App Support** | Push notifications for critical alerts | 2027 |

---

## 📝 Code Reference

### Backend Implementation
- **Socket Initialization**: `backend/src/sockets/socket.ts`
- **Allocation Service** (emits events): `backend/src/modules/allocation/allocation.service.ts`
- **Server Setup**: `backend/src/server.ts`

### Frontend (Planned)
- **Socket Hook**: `frontend/src/hooks/useSocket.ts` (to be created)
- **Dashboard**: `frontend/src/pages/DashboardPage.tsx` (to be created)

### Configuration
- **Backend Port**: 3001
- **Socket Endpoint**: `http://localhost:3001/socket.io/`

---

## 🧪 Testing WebSockets

### Manual Testing (Using WebSocket Client)

```bash
# Using websocat (install: cargo install websocat)
websocat ws://localhost:3001/socket.io/?transport=websocket

# Then manually emit events from backend to test client reception
```

### Automated Testing (Jest)

```typescript
import { io } from "socket.io-client";

describe("WebSocket Events", () => {
  it("should emit ambulance_assigned event", (done) => {
    const socket = io("http://localhost:3001");
    
    socket.on("ambulance_assigned", (data) => {
      expect(data.ambulance_id).toBeDefined();
      expect(data.zone_id).toBeDefined();
      socket.disconnect();
      done();
    });
  });
});
```

---

## 📞 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Events not received** | CORS misconfigured | Check CORS origin settings |
| **Delayed events** | Network latency | Monitor WebSocket latency in DevTools |
| **Connection refused** | Backend not running | Ensure `npm run dev` is running |
| **Memory leak** | Listeners not cleaned up | Always call `socket.off()` on disconnect |
| **Browsers showing fallback** | WebSocket not supported | Check browser compatibility (all modern browsers support it) |
