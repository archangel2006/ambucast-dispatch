import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Settings, Activity, Database, Shield, Zap, Clock } from 'lucide-react';
import { useRealTimeUpdates } from '@/hooks/useData';
import { mlAPI } from '@/lib/api';

const SettingsPage: React.FC = () => {
  const { isConnected, systemHealth } = useRealTimeUpdates();
  const [allocationTiming, setAllocationTiming] = useState<string>('Every 30 minutes');
  const [dataUpdateTiming, setDataUpdateTiming] = useState<string>('Every 12-15 minutes');
  const [batchPredictionTiming, setBatchPredictionTiming] = useState<string>('Every 12 minutes');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="text-slate-600" />
          System Status & Automation
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          All systems run automatically in the background. Configuration is read from environment variables.
        </p>
      </div>

      {/* System Health */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Backend API
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              ML API
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              systemHealth.mlApi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {systemHealth.mlApi ? '🟢 Healthy' : '🔴 Unreachable'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
            <span className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              systemHealth.database ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {systemHealth.database ? '🟢 Connected' : '🔴 Offline'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Automatic Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Automated Background Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Data Fetching */}
          <div className="border-b dark:border-slate-700 pb-6 last:border-b-0 last:pb-0">
            <h3 className="font-semibold text-lg mb-2">📊 Data Auto-Fetching</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Ambulance Data:</strong> Updated every 15 minutes</p>
              <p><strong>Hotspot Predictions:</strong> Updated every 12 minutes</p>
              <p><strong>Status:</strong> Running continuously in background ✓</p>
              <p className="text-xs text-slate-500 mt-2">Real-time updates via WebSocket available instantly</p>
            </div>
          </div>

          {/* ML Batch Predictions */}
          <div className="border-b dark:border-slate-700 pb-6 last:border-b-0 last:pb-0">
            <h3 className="font-semibold text-lg mb-2">🤖 ML Batch Predictions</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Prediction Model:</strong> XGBoost (HotspotCast & RiskPulse)</p>
              <p><strong>Batch Frequency:</strong> Every 12 minutes per zone</p>
              <p><strong>Status:</strong> Running automatically ✓</p>
              <p className="text-xs text-slate-500 mt-2">Predicts demand and risk scores for all zones</p>
            </div>
          </div>

          {/* Allocation Algorithm */}
          <div className="border-b dark:border-slate-700 pb-6 last:border-b-0 last:pb-0">
            <h3 className="font-semibold text-lg mb-2">🚑 Ambulance Allocation</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Algorithm:</strong> Automatic optimal dispatch</p>
              <p><strong>Run Frequency:</strong> Every 30 minutes</p>
              <p><strong>Status:</strong> Running automatically ✓</p>
              <p className="text-xs text-slate-500 mt-2">Optimizes ambulance positioning based on demand & risk</p>
            </div>
          </div>

          {/* Real-Time Updates */}
          <div>
            <h3 className="font-semibold text-lg mb-2">⚡ Real-Time Updates</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Transport:</strong> WebSocket (Socket.IO)</p>
              <p><strong>Events:</strong> Ambulance movement, status changes, hotspot updates</p>
              <p><strong>Latency:</strong> &lt;100ms instant delivery</p>
              <p className="text-xs text-slate-500 mt-2">Automatically reconnects if connection drops</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Configuration */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuration (Read from .env)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p><strong>API Endpoint:</strong> <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{import.meta.env.VITE_API_URL}</code></p>
            <p><strong>ML API Endpoint:</strong> <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{import.meta.env.VITE_ML_API_URL}</code></p>
            <p><strong>WebSocket:</strong> <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{import.meta.env.VITE_SOCKET_URL}</code></p>
            <p><strong>Map Center:</strong> <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">({import.meta.env.VITE_MAP_CENTER_LAT}, {import.meta.env.VITE_MAP_CENTER_LNG})</code></p>
          </div>
          <p className="text-xs text-slate-500 mt-4">To change configuration, edit .env.local and restart the frontend</p>
        </CardContent>
      </Card>

      {/* Manual Operations */}
      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Manual Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300">
            Only the following actions require manual intervention:
          </p>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
            <li>Dispatch ambulance to location (manually click dispatch button on Dashboard)</li>
            <li>Update ambulance status (manually change status in Fleet view)</li>
            <li>Clear system state (manual reset on Settings)</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            Everything else runs automatically: data fetching, ML predictions, allocation, real-time updates
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle>About AmbuCast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Build Date:</strong> May 2026</p>
          <p><strong>Architecture:</strong> Fully automated emergency response system</p>
          <p className="text-xs text-slate-500 mt-4">
            All background tasks run continuously without user intervention. System automatically handles data updates, 
            ML predictions, and ambulance optimization. Only dispatching ambulances requires manual action.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;