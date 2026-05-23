import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { AmbulanceCard } from '@/components/AmbulanceCard';
import { Truck, AlertTriangle } from 'lucide-react';
import { useAmbulances } from '@/hooks/useData';
import { Ambulance } from '@/lib/types';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export const FleetPage: React.FC = () => {
  const { data: ambulances = [] } = useAmbulances();

  const statusCounts = {
    available: (ambulances || []).filter((a: Ambulance) => a.status === 'available').length,
    occupied: (ambulances || []).filter((a: Ambulance) => a.status === 'occupied').length,
    maintenance: (ambulances || []).filter((a: Ambulance) => a.status === 'maintenance').length,
  };

  const pieData = [
    { name: 'Available', value: statusCounts.available, fill: '#22c55e' },
    { name: 'Occupied', value: statusCounts.occupied, fill: '#ef4444' },
    { name: 'Maintenance', value: statusCounts.maintenance, fill: '#eab308' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Truck className="text-blue-600" />
          Fleet Management
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Monitor and manage ambulance fleet status and deployment
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Available', value: statusCounts.available, color: 'bg-green-100 text-green-800' },
          { label: 'Occupied', value: statusCounts.occupied, color: 'bg-red-100 text-red-800' },
          { label: 'Maintenance', value: statusCounts.maintenance, color: 'bg-yellow-100 text-yellow-800' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg p-4 ${stat.color}`}>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs mt-2">
              {Math.round((stat.value / (ambulances?.length || 1)) * 100)}% of fleet
            </p>
          </div>
        ))}
      </div>

      {/* Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Status Distribution</CardTitle>
          <CardDescription>Percentage breakdown by ambulance status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ambulance List */}
      <Card>
        <CardHeader>
          <CardTitle>All Ambulances ({ambulances?.length || 0})</CardTitle>
          <CardDescription>Complete fleet inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(ambulances || []).map((ambulance: Ambulance) => (
              <AmbulanceCard key={ambulance.id} ambulance={ambulance} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetPage;
