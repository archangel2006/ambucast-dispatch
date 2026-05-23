export interface Ambulance {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  location: {
    lat: number;
    lng: number;
  };
  zone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotspot {
  id: string;
  zone_id: string;
  location: {
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
  location: {
    lat: number;
    lng: number;
  };
  population_density: number;
  elderly_pct: number;
  predicted_calls?: number;
  risk_score?: number;
  risk_class?: string;
}
