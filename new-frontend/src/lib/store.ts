import { create } from 'zustand';
import { Ambulance, Hotspot, DashboardStats } from './types';

interface AppStore {
  ambulances: Ambulance[];
  setAmbulances: (ambulances: Ambulance[]) => void;
  updateAmbulance: (id: string, data: Partial<Ambulance>) => void;

  hotspots: Hotspot[];
  setHotspots: (hotspots: Hotspot[]) => void;
  addHotspot: (hotspot: Hotspot) => void;

  stats: DashboardStats | null;
  setStats: (stats: DashboardStats) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  selectedZone: string | null;
  setSelectedZone: (zone: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  ambulances: [],
  setAmbulances: (ambulances) => set({ ambulances }),
  updateAmbulance: (id, data) =>
    set((state) => ({
      ambulances: state.ambulances.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),

  hotspots: [],
  setHotspots: (hotspots) => set({ hotspots }),
  addHotspot: (hotspot) =>
    set((state) => ({
      hotspots: [hotspot, ...state.hotspots.slice(0, 9)],
    })),

  stats: null,
  setStats: (stats) => set({ stats }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  selectedZone: null,
  setSelectedZone: (zone) => set({ selectedZone: zone }),
}));
