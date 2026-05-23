import React from 'react';
import { Hotspot } from '@/lib/types';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface HotspotCardProps {
  hotspot: Hotspot;
  onClick?: () => void;
}

const getRiskBgColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const HotspotCard: React.FC<HotspotCardProps> = ({ hotspot, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <CardTitle className="text-base">Zone {hotspot.zone_id}</CardTitle>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRiskBgColor(hotspot.risk_class)}`}>
          {hotspot.risk_class?.toUpperCase()}
        </span>
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Predicted Calls</span>
        </div>
        <span className="font-semibold text-blue-600">{hotspot.predicted_calls}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Risk Score</span>
        </div>
        <span className="font-semibold text-red-600">{hotspot.risk_score.toFixed(2)}</span>
      </div>
      {hotspot.reasons && hotspot.reasons.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Reasons:</strong> {hotspot.reasons.join(', ')}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);
