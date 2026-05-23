import React from 'react';
import { Ambulance } from '@/lib/types';
import { getStatusColor } from '@/lib/utils';
import { Activity, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface AmbulanceCardProps {
  ambulance: Ambulance;
  onClick?: () => void;
}

export const AmbulanceCard: React.FC<AmbulanceCardProps> = ({ ambulance, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <CardTitle className="text-base">{ambulance.name}</CardTitle>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ambulance.status)}`}>
          {ambulance.status}
        </span>
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <MapPin className="h-4 w-4" />
        <span>{ambulance.zone || 'No zone assigned'}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Activity className="h-4 w-4" />
        <span>Lat: {ambulance.location.lat.toFixed(4)}, Lng: {ambulance.location.lng.toFixed(4)}</span>
      </div>
    </CardContent>
  </Card>
);
