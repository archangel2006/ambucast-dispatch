import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { HotspotCard } from '@/components/HotspotCard';
import { Zap, Filter } from 'lucide-react';
import { useHotspots } from '@/hooks/useData';
import { Hotspot } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export const HotspotsPage: React.FC = () => {
  const { data: hotspots = [] } = useHotspots();
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredHotspots = filterRisk === 'all' 
    ? hotspots 
    : (hotspots || []).filter((h: Hotspot) => h.risk_class === filterRisk);

  const riskStats = {
    critical: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'critical').length,
    high: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'high').length,
    medium: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'medium').length,
    low: (hotspots || []).filter((h: Hotspot) => h.risk_class === 'low').length,
  };

  const scatterData = (hotspots || []).map((h: Hotspot) => ({
    zone: parseInt(h.zone_id),
    calls: h.predicted_calls,
    risk: h.risk_score,
    class: h.risk_class,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="text-yellow-600" />
          Hotspot Analysis
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Emergency demand predictions and risk assessment by zone
        </p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Critical', value: riskStats.critical, color: 'bg-red-100 text-red-800' },
          { label: 'High', value: riskStats.high, color: 'bg-orange-100 text-orange-800' },
          { label: 'Medium', value: riskStats.medium, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Low', value: riskStats.low, color: 'bg-green-100 text-green-800' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg p-4 ${stat.color}`}>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calls vs Risk Score</CardTitle>
            <CardDescription>Scatter plot of predicted calls and risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="calls" name="Predicted Calls" />
                <YAxis dataKey="risk" name="Risk Score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Hotspots"
                  data={scatterData}
                  fill="#8884d8"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Demand Distribution</CardTitle>
            <CardDescription>Average predicted calls per zone</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scatterData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3366cc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Filter & View</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
          </div>
        </CardHeader>
      </Card>

      {/* Hotspots Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {filterRisk === 'all' ? 'All Hotspots' : `${filterRisk.toUpperCase()} Risk Zones`} ({filteredHotspots.length})
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredHotspots.map((hotspot: Hotspot, idx: number) => (
            <HotspotCard key={idx} hotspot={hotspot} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotspotsPage;
