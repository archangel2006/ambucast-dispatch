import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useHotspots } from '@/hooks/useData';
import { Hotspot } from '@/lib/types';
import { getZoneDisplayName } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const RiskPage: React.FC = () => {
  const { data: hotspots = [] } = useHotspots();

  const criticalZones = (hotspots || []).filter((h: Hotspot) => h.risk_class === 'critical');
  const avgRisk = (hotspots || []).reduce((sum: number, h: Hotspot) => sum + h.risk_score, 0) / (hotspots?.length || 1);
  const totalPredictedCalls = (hotspots || []).reduce((sum: number, h: Hotspot) => sum + h.predicted_calls, 0);

  const timeSeriesData = (hotspots || []).slice(0, 10).map((h: Hotspot, idx: number) => ({
    time: h.area || h.zone_name || getZoneDisplayName(h.zone_id),
    risk: parseFloat(h.risk_score.toFixed(2)),
    calls: h.predicted_calls,
  }));

  const riskMatrix = [
    { risk: 'Critical', zones: criticalZones.length, avgCalls: criticalZones.reduce((sum: number, h: Hotspot) => sum + h.predicted_calls, 0) / (criticalZones.length || 1) },
    { risk: 'High', zones: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'high').length },
    { risk: 'Medium', zones: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'medium').length },
    { risk: 'Low', zones: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'low').length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-red-600" />
          Risk Analysis
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Comprehensive risk assessment and threat evaluation
        </p>
      </div>

      {/* Critical Alert */}
      {criticalZones.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            ⚠️ {criticalZones.length} Critical Zone(s) Detected
          </h3>
          <p className="mt-1 text-sm text-red-800 dark:text-red-200">
            Immediate action required for: {criticalZones.map((z: Hotspot) => z.area || z.zone_name || getZoneDisplayName(z.zone_id)).join(', ')}
          </p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Average Risk Score</p>
              <p className="mt-2 text-3xl font-bold">{avgRisk.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-slate-200 dark:text-slate-800" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Predicted Calls</p>
              <p className="mt-2 text-3xl font-bold">{totalPredictedCalls}</p>
            </div>
            <Activity className="h-12 w-12 text-slate-200 dark:text-slate-800" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Critical Zones</p>
              <p className="mt-2 text-3xl font-bold">{criticalZones.length}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-200 dark:text-red-800" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Over Time</CardTitle>
            <CardDescription>Risk score trends across zones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Matrix</CardTitle>
            <CardDescription>Zones by risk classification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskMatrix.map((row) => (
                <div key={row.risk}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{row.risk}</span>
                    <span className="text-sm font-bold">{row.zones} zones</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(row.zones / (hotspots?.length || 1)) * 100}%`,
                        backgroundColor:
                          row.risk === 'Critical'
                            ? '#ef4444'
                            : row.risk === 'High'
                            ? '#f97316'
                            : row.risk === 'Medium'
                            ? '#eab308'
                            : '#22c55e',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Risk Assessment</CardTitle>
          <CardDescription>Zone-by-zone risk factors and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Zone</th>
                  <th className="text-left px-4 py-2 font-semibold">Risk Level</th>
                  <th className="text-left px-4 py-2 font-semibold">Score</th>
                  <th className="text-left px-4 py-2 font-semibold">Predicted Calls</th>
                  <th className="text-left px-4 py-2 font-semibold">Factors</th>
                </tr>
              </thead>
              <tbody>
                {(hotspots || []).slice(0, 10).map((hotspot: Hotspot) => (
                  <tr key={hotspot.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3">{hotspot.area || hotspot.zone_name || getZoneDisplayName(hotspot.zone_id)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          hotspot.risk_class === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : hotspot.risk_class === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : hotspot.risk_class === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {hotspot.risk_class}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">{hotspot.risk_score.toFixed(2)}</td>
                    <td className="px-4 py-3">{hotspot.predicted_calls}</td>
                    <td className="px-4 py-3 text-xs">
                      {hotspot.reasons?.slice(0, 2).join(', ') || 'Standard risk'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskPage;
