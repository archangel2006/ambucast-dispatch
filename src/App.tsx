import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import HotspotPage from "@/pages/HotspotPage";
import RiskPage from "@/pages/RiskPage";
import FleetPage from "@/pages/FleetPage";
import LiveMapPage from "@/pages/LiveMapPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/hotspot" element={<HotspotPage />} />
              <Route path="/risk" element={<RiskPage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/map" element={<LiveMapPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
