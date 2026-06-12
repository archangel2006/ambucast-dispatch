import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Ambulance } from '@/lib/types';

const ambulanceIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0iIzMzNjZjYyIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTYgOHY4TTEyIDE0aDhtLTIgOGgyIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -8],
});

interface LiveMapProps {
  ambulances: Ambulance[];
  center?: [number, number];
  zoom?: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  ambulances,
  center = [parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '28.6139'), parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '77.2090')],
  zoom = parseInt(import.meta.env.VITE_MAP_ZOOM || '12'),
}) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {ambulances.map((ambulance) => (
        <Marker
          key={ambulance.id}
          position={[ambulance.lat, ambulance.lng]}
          icon={ambulanceIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{ambulance.name || `AMB-${ambulance.id?.slice(0, 6)}`}</p>
              <p className="text-xs text-gray-600">Status: {ambulance.status}</p>
              <p className="text-xs text-gray-600">Zone: {ambulance.zoneId || ambulance.zone || 'N/A'}</p>
              <p className="text-xs text-gray-600">
                {(ambulance.lat || 0).toFixed(4)}, {(ambulance.lng || 0).toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
