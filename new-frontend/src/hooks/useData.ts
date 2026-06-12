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

    socket.on('ambulance:moved', onAmbulanceUpdate);
    socket.on('ambulance:status', onAmbulanceUpdate);

    return () => {
      socket.off('ambulance:moved', onAmbulanceUpdate);
      socket.off('ambulance:status', onAmbulanceUpdate);
    };
  }, [queryClient]);

  return query;
};

// Auto-fetch hotspots with 12 min intervals using the backend pipeline
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

    socket.on('pipeline:updated', onHotspotUpdate);
    socket.on('predictions:new', onHotspotUpdate);

    return () => {
      socket.off('pipeline:updated', onHotspotUpdate);
      socket.off('predictions:new', onHotspotUpdate);
    };
  }, [queryClient]);

  return query;
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
