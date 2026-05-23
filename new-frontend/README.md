# AmbuCast New Frontend - Professional Dashboard

A modern, responsive emergency response optimization dashboard built with React 18, TypeScript, Vite, and Tailwind CSS.

## 🎯 Features

### 📊 Dashboard
- Real-time KPI metrics (ambulances, incidents, critical zones)
- Risk distribution analysis
- Ambulance status breakdown
- Top hotspots visualization
- One-click allocation algorithm

### 🗺️ Live Map
- Real-time ambulance tracking with Leaflet
- OpenStreetMap integration (FREE - no API keys!)
- Interactive location selection
- Fleet status sidebar
- Detailed ambulance information

### 🔥 Hotspot Analysis
- Emergency demand predictions by zone
- Risk level filtering (Critical/High/Medium/Low)
- Scatter plot analysis
- Zone demand distribution charts
- Detailed hotspot cards

### 🚑 Fleet Management
- Complete ambulance inventory
- Status breakdown visualization
- Individual ambulance tracking
- Maintenance scheduling interface

### ⚠️ Risk Analysis
- Risk score trends over time
- Critical zone alerts
- Risk matrix visualization
- Detailed breakdown table

### 📈 Analytics
- Performance metrics
- Zone-wise comparison
- System efficiency indicators
- Coverage analysis

### ⚙️ Settings
- API configuration
- Map customization
- Data privacy controls
- System information

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or pnpm

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment** - Create `.env.local`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_ML_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:3001
VITE_MAP_CENTER_LAT=28.6139
VITE_MAP_CENTER_LNG=77.2090
VITE_MAP_ZOOM=12
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Browser**
```
http://localhost:5173
```

## 📦 Project Structure

```
src/
├── pages/           # Route pages
│   ├── Dashboard.tsx
│   ├── LiveMap.tsx
│   ├── Hotspots.tsx
│   ├── Fleet.tsx
│   ├── Risk.tsx
│   ├── Analytics.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── components/      # Reusable components
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── Card.tsx
│   ├── Alert.tsx
│   ├── StatCard.tsx
│   ├── LiveMap.tsx
│   ├── AmbulanceCard.tsx
│   └── HotspotCard.tsx
├── hooks/          # Custom React hooks
│   ├── useData.ts
│   └── useHeatmap.ts
├── lib/
│   ├── api.ts      # API client & Socket.IO
│   ├── types.ts    # TypeScript types
│   ├── utils.ts    # Utility functions
│   ├── store.ts    # Zustand state management
│   └── styles.ts
├── App.tsx
└── main.tsx
```

## 🔗 API Integration

### Backend Endpoints
- `GET /api/ambulances` - Fetch all ambulances
- `POST /api/ambulances/move` - Move ambulance
- `POST /api/ambulances/status` - Update status
- `GET /api/hotspots` - Get all hotspots
- `POST /api/predictions` - Create prediction
- `POST /api/allocation/run` - Run allocation

### ML API Endpoints
- `POST /predict` - Single prediction
- `POST /predict-batch` - Batch predictions
- `GET /health` - Health check

All endpoints are automatically configured in `src/lib/api.ts`

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **Dark Mode** - Full dark mode support
- **Responsive** - Mobile-first design
- **Custom Components** - Shadcn-inspired UI

## 📊 Data Visualization

- **Recharts** - Line, Bar, Pie, Area, Scatter charts
- **Leaflet** - Interactive mapping (free)
- **Real-time Updates** - Socket.IO integration

## 🛠️ Development

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔐 Environment Variables

```env
VITE_API_URL              # Backend API base URL
VITE_ML_API_URL           # ML API base URL
VITE_SOCKET_URL           # WebSocket server URL
VITE_MAP_CENTER_LAT       # Default map center latitude
VITE_MAP_CENTER_LNG       # Default map center longitude
VITE_MAP_ZOOM             # Default map zoom level
```

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```bash
docker build -t ambucast-frontend .
docker run -p 80:5173 ambucast-frontend
```

### Static Server
```bash
npm run build
npx serve -s dist
```

## 📚 Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Zustand** - State management
- **Recharts** - Data visualization
- **Leaflet** - Mapping
- **Axios** - HTTP client
- **Socket.IO** - Real-time communication
- **Lucide Icons** - Icon library

## 🎯 Key Features

✅ Real-time data updates via WebSocket  
✅ Professional dashboard design  
✅ Responsive mobile layout  
✅ Dark mode support  
✅ Interactive maps (free - no API keys)  
✅ Advanced analytics  
✅ Risk assessment  
✅ Fleet management  
✅ Performance optimization  
✅ Type-safe TypeScript  

## 📖 Documentation

- [Setup Guide](../SETUP_GUIDE.md) - Complete installation instructions
- [Backend Docs](../backend/README.MD) - Backend API documentation
- [ML API Docs](../docs/ML_API_SETUP.md) - ML model documentation

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

ISC License

## 👥 Team

AmbuCast Development Team - 2026

---

**Version**: 1.0.0  
**Last Updated**: May 2026
