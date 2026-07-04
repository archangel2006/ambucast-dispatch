export interface Ambulance {
  id: string;
  lat: number;
  lng: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'MOVING' | 'available' | 'occupied' | 'maintenance' | 'moving';
  zoneId?: string | null;
  zone?: string; // alias for zoneId for display
  name?: string; // fallback display name
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotspot {
  id: string;
  zone_id: string;
  area?: string;
  zone_name?: string;
  lat?: number;
  lng?: number;
  location?: {
    lat: number;
    lng: number;
  };
  predicted_calls: number;
  risk_score: number;
  risk_class: 'critical' | 'high' | 'medium' | 'low';
  reasons: string[];
  timestamp: string;
  aqi?: number;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
}

export interface AllocationResult {
  ambulances_allocated: {
    ambulance_id: string;
    zone_id: string;
    confidence: number;
  }[];
  status: 'success' | 'failed';
  message: string;
}

export interface DashboardStats {
  totalAmbulances: number;
  availableAmbulances: number;
  activeIncidents: number;
  avgResponseTime: number;
  occupancyRate: number;
  criticalZones: number;
}

export interface ZoneData {
  zone_id: string;
  name: string;
  lat?: number;
  lng?: number;
  location?: {
    lat: number;
    lng: number;
  };
  population_density: number;
  elderly_pct: number;
  predicted_calls?: number;
  risk_score?: number;
  risk_class?: string;
}
