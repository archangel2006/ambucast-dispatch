import React, { useEffect, useState } from 'react';
import { BarChart3, Truck, AlertTriangle, Activity, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { StatCard } from '@/components/StatCard';
import { AmbulanceCard } from '@/components/AmbulanceCard';
import { HotspotCard } from '@/components/HotspotCard';
import { Alert } from '@/components/Alert';
import { useAmbulances, useHotspots, useAllocation } from '@/hooks/useData';
import { Ambulance, Hotspot } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Dashboard: React.FC = () => {
  const { data: ambulances = [] } = useAmbulances();
  const { data: hotspots = [] } = useHotspots();
  const { runAllocation, loading: allocating, error: allocationError } = useAllocation();
  const [allocationResult, setAllocationResult] = useState<any>(null);

  const stats = {
    totalAmbulances: ambulances?.length || 0,
    available: ambulances?.filter((a: Ambulance) => a.status === 'available').length || 0,
    occupied: ambulances?.filter((a: Ambulance) => a.status === 'occupied').length || 0,
    criticalZones: hotspots?.filter((h: Hotspot) => h.risk_class === 'critical').length || 0,
  };

  const handleRunAllocation = async () => {
    try {
      const result = await runAllocation();
      setAllocationResult(result);
    } catch (error) {
      console.error('Allocation failed:', error);
    }
  };

  // Prepare chart data
  const riskDistribution = [
    { risk: 'Critical', count: hotspots?.filter((h: Hotspot) => h.risk_class === 'critical').length || 0 },
    { risk: 'High', count: hotspots?.filter((h: Hotspot) => h.risk_class === 'high').length || 0 },
    { risk: 'Medium', count: hotspots?.filter((h: Hotspot) => h.risk_class === 'medium').length || 0 },
    { risk: 'Low', count: hotspots?.filter((h: Hotspot) => h.risk_class === 'low').length || 0 },
  ];

  const topHotspots = (hotspots || []).slice(0, 5).map((h: Hotspot) => ({
    zone: `Zone ${h.zone_id}`,
    calls: h.predicted_calls,
    risk: h.risk_score,
  }));

  const statusBreakdown = [
    { status: 'Available', count: stats.available, fill: '#22c55e' },
    { status: 'Occupied', count: stats.occupied, fill: '#ef4444' },
    { status: 'Maintenance', count: stats.totalAmbulances - stats.available - stats.occupied, fill: '#eab308' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Emergency Response Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Real-time ambulance management and prediction system</p>
      </div>

      {/* Alerts */}
      {stats.criticalZones > 0 && (
        <Alert type="error" title="Critical Zones Detected">
          {stats.criticalZones} zone(s) with critical risk levels require immediate attention.
        </Alert>
      )}

      {allocationError && (
        <Alert type="error" title="Allocation Error">
          {allocationError}
        </Alert>
      )}

      {allocationResult?.status === 'success' && (
        <Alert type="success" title="Allocation Successful">
          {allocationResult.message} - {allocationResult.ambulances_allocated?.length || 0} ambulances allocated.
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Ambulances"
          value={stats.totalAmbulances}
          icon={Truck}
          change={{ value: 0, positive: true }}
        />
        <StatCard
          title="Available"
          value={stats.available}
          icon={Activity}
          change={{ value: Math.round((stats.available / stats.totalAmbulances) * 100), positive: true }}
        />
        <StatCard
          title="Critical Zones"
          value={stats.criticalZones}
          icon={AlertTriangle}
          change={{ value: stats.criticalZones > 0 ? 100 : 0, positive: false }}
        />
        <StatCard
          title="Active Incidents"
          value={stats.occupied}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution by Zone</CardTitle>
            <CardDescription>Hotspot zones categorized by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3366cc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ambulance Status</CardTitle>
            <CardDescription>Current fleet status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusBreakdown.map((status) => (
                <div key={status.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{status.status}</span>
                    <span className="text-sm font-bold">{status.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${(status.count / stats.totalAmbulances) * 100}%`,
                        backgroundColor: status.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation & Data */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Top Hotspots</CardTitle>
              <CardDescription>Zones with highest predicted emergency calls</CardDescription>
            </div>
            <button
              onClick={handleRunAllocation}
              disabled={allocating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400"
            >
              {allocating ? 'Running...' : 'Run Allocation'}
            </button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={topHotspots}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#3366cc" strokeWidth={2} name="Predicted Calls" />
                <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} name="Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Fleet Utilization</p>
              <p className="text-2xl font-bold">
                {Math.round((stats.occupied / stats.totalAmbulances) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Average Zone Risk</p>
              <p className="text-2xl font-bold">
                {((hotspots || []).reduce((sum: number, h: Hotspot) => sum + h.risk_score, 0) / (hotspots?.length || 1)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Predicted Calls</p>
              <p className="text-2xl font-bold">
                {(hotspots || []).reduce((sum: number, h: Hotspot) => sum + h.predicted_calls, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Hotspots */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Hotspots</CardTitle>
          <CardDescription>Latest emergency demand predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {(hotspots || []).slice(0, 5).map((hotspot: Hotspot, idx: number) => (
              <HotspotCard key={idx} hotspot={hotspot} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
