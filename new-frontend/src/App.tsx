import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import LiveMapPage from '@/pages/LiveMap';
import HotspotsPage from '@/pages/Hotspots';
import FleetPage from '@/pages/Fleet';
import RiskPage from '@/pages/Risk';
import AnalyticsPage from '@/pages/Analytics';
import SettingsPage from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<LiveMapPage />} />
            <Route path="/hotspots" element={<HotspotsPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
