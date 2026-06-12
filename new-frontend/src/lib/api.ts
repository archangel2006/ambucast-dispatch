import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ambulance APIs
export const ambulanceAPI = {
  fetchAll: () => apiClient.get('/ambulances'),
  move: (id: string, location: { lat: number; lng: number }) =>
    apiClient.post('/ambulances/move', { id, location }),
  updateStatus: (id: string, status: string) =>
    apiClient.post('/ambulances/status', { id, status }),
  seed: () => apiClient.get('/ambulances/seed'),
};

// Prediction & Hotspot APIs
export const predictionAPI = {
  createPrediction: (data: any) => apiClient.post('/predictions', data),
  getHotspots: () => apiClient.get('/pipeline'),
};

// Allocation APIs
export const allocationAPI = {
  runAllocation: () => apiClient.post('/allocation/run'),
};

// ML API
export const mlAPI = {
  predict: (data: any) =>
    axios.post(`${ML_API_URL}/predict`, data),
  predictBatch: (data: any[]) =>
    axios.post(`${ML_API_URL}/predict-batch`, data),
  health: () =>
    axios.get(`${ML_API_URL}/health`),
};

// Socket.IO connection
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

export default apiClient;
