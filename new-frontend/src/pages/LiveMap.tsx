import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { MapPin, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAmbulances } from '@/hooks/useData';
import dynamic from 'react';

// Dynamic import for Leaflet map (client-side only)
const MapComponent = React.lazy(() =>
  import('@/components/LiveMap').then((mod) => ({ default: mod.LiveMap }))
);

export const LiveMapPage: React.FC = () => {
  const { data: ambulances = [] } = useAmbulances();
  const [selectedAmbulance, setSelectedAmbulance] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="text-blue-600" />
          Live Ambulance Map
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Real-time tracking of all ambulances and emergency response coverage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <Card className="lg:col-span-2 h-[600px]">
          <CardHeader>
            <CardTitle>Real-Time Coverage Map</CardTitle>
            <CardDescription>Green markers show ambulance locations</CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
            <React.Suspense fallback={<div className="h-full bg-slate-100 rounded-lg animate-pulse" />}>
              <MapComponent ambulances={ambulances} />
            </React.Suspense>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fleet Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ambulances?.slice(0, 10).map((amb: any) => (
                <div
                  key={amb.id}
                  onClick={() => setSelectedAmbulance(amb)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAmbulance?.id === amb.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm">{amb.name || `AMB-${amb.id?.slice(0, 6)}`}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {amb.status} • {amb.zoneId || amb.zone || 'No zone assigned'}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedAmbulance && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-base">{selectedAmbulance.name} Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="font-semibold capitalize">{selectedAmbulance.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Zone</span>
                  <span className="font-semibold">{selectedAmbulance.zoneId || selectedAmbulance.zone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Latitude</span>
                  <span className="text-mono text-xs">{(selectedAmbulance.lat || 0).toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Longitude</span>
                  <span className="text-mono text-xs">{(selectedAmbulance.lng || 0).toFixed(6)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMapPage;
