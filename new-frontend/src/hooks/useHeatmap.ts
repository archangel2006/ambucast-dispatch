import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapPoint {
  lat: number;
  lng: number;
  value: number;
}

export const useHeatmap = (containerId: string, points: HeatmapPoint[]) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatmapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerId || !document.getElementById(containerId)) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerId).setView(
        [
          parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '28.6139'),
          parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '77.2090'),
        ],
        parseInt(import.meta.env.VITE_MAP_ZOOM || '12')
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    if (heatmapRef.current) {
      mapRef.current?.removeLayer(heatmapRef.current);
    }

    if (points.length > 0) {
      const heatmapData = points.map((p) => [p.lat, p.lng, p.value]);
      heatmapRef.current = (L as any).heatLayer(heatmapData, {
        radius: 50,
        blur: 25,
        maxZoom: 17,
        gradient: {
          0.0: '#3366cc',
          0.25: '#00cc96',
          0.5: '#ffd700',
          0.75: '#ff6b6b',
          1.0: '#c71585',
        },
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
  }, [containerId, points]);

  return mapRef;
};
