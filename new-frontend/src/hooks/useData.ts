import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ambulanceAPI, predictionAPI, allocationAPI, socket } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export const useAmbulances = () => {
  const setAmbulances = useAppStore((state) => state.setAmbulances);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ambulances'],
    queryFn: async () => {
      const response = await ambulanceAPI.fetchAll();
      setAmbulances(response.data);
      return response.data;
    },
    refetchInterval: 5000,
    staleTime: 2000,
  });

  useEffect(() => {
    socket.on('ambulance_moved', (data) => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    });

    return () => {
      socket.off('ambulance_moved');
    };
  }, [queryClient]);

  return query;
};

export const useHotspots = () => {
  const setHotspots = useAppStore((state) => state.setHotspots);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['hotspots'],
    queryFn: async () => {
      const response = await predictionAPI.getHotspots();
      setHotspots(response.data);
      return response.data;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });

  useEffect(() => {
    socket.on('hotspot_updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['hotspots'] });
    });

    return () => {
      socket.off('hotspot_updated');
    };
  }, [queryClient]);

  return query;
};

export const useAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAllocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await allocationAPI.runAllocation();
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Allocation failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { runAllocation, loading, error };
};

export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { isConnected };
};
