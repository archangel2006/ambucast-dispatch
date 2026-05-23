import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Settings, Moon, Sun, Database, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="text-slate-600" />
          Settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Configure system preferences and integrations
        </p>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Backend API URL</label>
            <input
              type="text"
              value={import.meta.env.VITE_API_URL}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ML API URL</label>
            <input
              type="text"
              value={import.meta.env.VITE_ML_API_URL}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">WebSocket URL</label>
            <input
              type="text"
              value={import.meta.env.VITE_SOCKET_URL}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Map Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Map Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Center Latitude</label>
            <input
              type="number"
              step="0.0001"
              defaultValue={import.meta.env.VITE_MAP_CENTER_LAT}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Default Center Longitude</label>
            <input
              type="number"
              step="0.0001"
              defaultValue={import.meta.env.VITE_MAP_CENTER_LNG}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Default Zoom Level</label>
            <input
              type="number"
              min="1"
              max="20"
              defaultValue={import.meta.env.VITE_MAP_ZOOM}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Enable data analytics</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Enable real-time notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Collect diagnostic data</span>
          </label>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About AmbuCast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Version:</strong> 1.0.0
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Description:</strong> Emergency Response Optimization System - Real-time ambulance dispatch and emergency demand prediction
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500 pt-2 border-t">
            <p>© 2026 AmbuCast. All rights reserved.</p>
            <p className="mt-1">Powered by advanced ML models and real-time optimization algorithms.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
