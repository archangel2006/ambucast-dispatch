import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ambulanceAPI, predictionAPI, allocationAPI, mlAPI, socket } from '@/lib/api';
import { useAppStore } from '@/lib/store';

// Auto-fetch ambulances with 15 min intervals, real-time updates via Socket.IO
export const useAmbulances = () => {
  const setAmbulances = useAppStore((state) => state.setAmbulances);
  const autoFetchEnabled = useAppStore((state) => state.autoFetchEnabled);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ambulances'],
    queryFn: async () => {
      const response = await ambulanceAPI.fetchAll();
      setAmbulances(response.data);
      return response.data;
    },
    refetchInterval: autoFetchEnabled ? 15 * 60 * 1000 : false, // 15 minutes if enabled
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Real-time updates via WebSocket
  useEffect(() => {
    const onAmbulanceUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    };

    socket.on('ambulance_moved', onAmbulanceUpdate);
    socket.on('ambulance_status_changed', onAmbulanceUpdate);

    return () => {
      socket.off('ambulance_moved', onAmbulanceUpdate);
      socket.off('ambulance_status_changed', onAmbulanceUpdate);
    };
  }, [queryClient]);

  return query;
};

// Auto-fetch hotspots with 12 min intervals + automatic batch ML predictions
export const useHotspots = () => {
  const setHotspots = useAppStore((state) => state.setHotspots);
  const autoFetchEnabled = useAppStore((state) => state.autoFetchEnabled);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['hotspots'],
    queryFn: async () => {
      try {
        const response = await predictionAPI.getHotspots();
        setHotspots(response.data);
        
        // Automatically trigger batch predictions every time we fetch
        // This happens in the background without user interaction
        triggerAutoMLPredictions();
        
        return response.data;
      } catch (error) {
        console.error('Failed to fetch hotspots:', error);
        return [];
      }
    },
    refetchInterval: autoFetchEnabled ? 12 * 60 * 1000 : false, // 12 minutes if enabled
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Real-time updates via WebSocket
  useEffect(() => {
    const onHotspotUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['hotspots'] });
    };

    socket.on('hotspot_updated', onHotspotUpdate);
    socket.on('prediction_completed', onHotspotUpdate);

    return () => {
      socket.off('hotspot_updated', onHotspotUpdate);
      socket.off('prediction_completed', onHotspotUpdate);
    };
  }, [queryClient]);

  return query;
};

// Automatic ML batch predictions - runs in background
const triggerAutoMLPredictions = async () => {
  try {
    // Get all ambulances to determine zones to predict
    const ambulancesResponse = await ambulanceAPI.fetchAll();
    const zones = new Set(ambulancesResponse.data?.map((a: any) => a.zone) || []);

    if (zones.size === 0) return;

    // Prepare batch prediction data for all zones
    const batchData = Array.from(zones).map((zone: any) => ({
      zone_id: zone,
      aqi: Math.random() * 300, // Would come from actual sensor data
      pm25: Math.random() * 200,
      pm10: Math.random() * 300,
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      hour: new Date().getHours(),
      day_of_week: new Date().getDay(),
      population_density: 5000 + Math.random() * 20000,
      elderly_pct: 0.1 + Math.random() * 0.3,
    }));

    // Run batch predictions automatically (fire and forget)
    if (batchData.length > 0) {
      mlAPI.predictBatch(batchData).catch((err) => {
        console.warn('Batch prediction error (non-critical):', err.message);
      });
    }
  } catch (error) {
    console.warn('Auto-prediction setup failed:', error);
  }
};

// Automatic allocation runs - triggered periodically
export const useAutoAllocation = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Run allocation every 30 minutes automatically
    const allocationInterval = setInterval(async () => {
      try {
        setStatus('running');
        await allocationAPI.runAllocation();
        setStatus('success');
        // Reset status after 2 seconds
        setTimeout(() => setStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-allocation failed:', error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Run once on component mount
    (async () => {
      try {
        setStatus('running');
        await allocationAPI.runAllocation();
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } catch (error) {
        console.error('Initial allocation failed:', error);
        setStatus('error');
      }
    })();

    return () => clearInterval(allocationInterval);
  }, []);

  return { status };
};

// System health monitoring
export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [systemHealth, setSystemHealth] = useState<{
    backend: boolean;
    mlApi: boolean;
    database: boolean;
  }>({ backend: false, mlApi: false, database: false });

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Immediate health check on component mount
    const performHealthCheck = async () => {
      try {
        // Check backend
        await ambulanceAPI.fetchAll();
        setSystemHealth((prev) => ({ ...prev, backend: true }));
      } catch {
        setSystemHealth((prev) => ({ ...prev, backend: false }));
      }

      try {
        // Check ML API
        await mlAPI.health();
        setSystemHealth((prev) => ({ ...prev, mlApi: true }));
      } catch {
        setSystemHealth((prev) => ({ ...prev, mlApi: false }));
      }

      try {
        // Check database (via ambulances endpoint which tests DB connection)
        await ambulanceAPI.fetchAll();
        setSystemHealth((prev) => ({ ...prev, database: true }));
      } catch {
        setSystemHealth((prev) => ({ ...prev, database: false }));
      }
    };

    performHealthCheck();

    // Health check every 30 seconds (more frequent)
    const healthInterval = setInterval(performHealthCheck, 30000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      clearInterval(healthInterval);
    };
  }, []);

  return { isConnected, systemHealth };
};
