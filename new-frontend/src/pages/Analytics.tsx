import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useAmbulances, useHotspots } from '@/hooks/useData';
import { Ambulance, Hotspot } from '@/lib/types';
import { getZoneDisplayName } from '@/lib/utils';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { data: ambulances = [] } = useAmbulances();
  const { data: hotspots = [] } = useHotspots();

  const analyticsData = (hotspots || []).slice(0, 15).map((h: Hotspot) => ({
    zone: h.area || h.zone_name || getZoneDisplayName(h.zone_id),
    calls: h.predicted_calls,
    risk: h.risk_score,
    ambulances: ambulances?.filter((a: Ambulance) => a.zone === h.zone_id).length || 0,
  }));

  const zoneMetrics = {
    highestDemand: (hotspots || []).reduce((prev: Hotspot, h: Hotspot) => h.predicted_calls > prev.predicted_calls ? h : prev, hotspots?.[0]),
    highestRisk: (hotspots || []).reduce((prev: Hotspot, h: Hotspot) => h.risk_score > prev.risk_score ? h : prev, hotspots?.[0]),
    avgResponseTime: '12.5 min',
    totalIncidents: (hotspots || []).reduce((sum: number, h: Hotspot) => sum + h.predicted_calls, 0),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          Analytics & Insights
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Performance metrics and operational intelligence
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Predicted Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zoneMetrics.totalIncidents}</div>
            <p className="text-xs text-slate-500 mt-1">Across all zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Demand Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zoneMetrics.highestDemand?.area || zoneMetrics.highestDemand?.zone_name || getZoneDisplayName(zoneMetrics.highestDemand?.zone_id)}</div>
            <p className="text-xs text-slate-500 mt-1">{zoneMetrics.highestDemand?.predicted_calls} predicted calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Risk Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zoneMetrics.highestRisk?.area || zoneMetrics.highestRisk?.zone_name || getZoneDisplayName(zoneMetrics.highestRisk?.zone_id)}</div>
            <p className="text-xs text-slate-500 mt-1">Risk: {zoneMetrics.highestRisk?.risk_score.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zoneMetrics.avgResponseTime}</div>
            <p className="text-xs text-slate-500 mt-1">Current average</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Zone Performance Metrics</CardTitle>
          <CardDescription>Calls, risk scores, and ambulance allocation by zone</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="calls" fill="#3366cc" name="Predicted Calls" />
              <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} name="Risk Score" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Current system metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fleet Utilization</span>
              <span className="font-semibold">
                {Math.round(
                  (ambulances?.filter((a: Ambulance) => a.status?.toUpperCase() === 'OCCUPIED').length / (ambulances?.length || 1)) * 100
                )}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Ambulances</span>
              <span className="font-semibold">{ambulances?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Zones Monitored</span>
              <span className="font-semibold">{hotspots?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Critical Zones</span>
              <span className="font-semibold text-red-600">
                {(hotspots || []).filter((h: Hotspot) => h.risk_class === 'critical').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Metrics</CardTitle>
            <CardDescription>Operational efficiency indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Average Zone Risk</span>
              <span className="font-semibold">
                {((hotspots || []).reduce((sum: number, h: Hotspot) => sum + h.risk_score, 0) / (hotspots?.length || 1)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Coverage Ratio</span>
              <span className="font-semibold">
                {((ambulances?.length || 0) / (hotspots?.length || 1)).toFixed(2)} ambulances/zone
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Available Ambulances</span>
              <span className="font-semibold text-green-600">
                {ambulances?.filter((a: Ambulance) => a.status?.toUpperCase() === 'AVAILABLE').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">System Health</span>
              <span className="font-semibold text-blue-600">97%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
