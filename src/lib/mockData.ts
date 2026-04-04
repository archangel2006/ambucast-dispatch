export const zones = [
  { id: "Z01", name: "Connaught Place", risk: "HIGH" as const, calls: 14, aqi: 312, temp: 38, elderly: 18, humidity: 72 },
  { id: "Z02", name: "Karol Bagh", risk: "MODERATE" as const, calls: 8, aqi: 198, temp: 36, elderly: 22, humidity: 65 },
  { id: "Z03", name: "Chandni Chowk", risk: "CRITICAL" as const, calls: 22, aqi: 420, temp: 41, elderly: 28, humidity: 80 },
  { id: "Z04", name: "Dwarka", risk: "LOW" as const, calls: 3, aqi: 120, temp: 34, elderly: 12, humidity: 55 },
  { id: "Z05", name: "Saket", risk: "LOW" as const, calls: 5, aqi: 145, temp: 35, elderly: 15, humidity: 58 },
  { id: "Z06", name: "Rohini", risk: "MODERATE" as const, calls: 10, aqi: 230, temp: 37, elderly: 20, humidity: 68 },
  { id: "Z07", name: "Lajpat Nagar", risk: "HIGH" as const, calls: 16, aqi: 340, temp: 39, elderly: 25, humidity: 75 },
  { id: "Z08", name: "Janakpuri", risk: "LOW" as const, calls: 4, aqi: 110, temp: 33, elderly: 10, humidity: 52 },
  { id: "Z09", name: "Pitampura", risk: "MODERATE" as const, calls: 9, aqi: 210, temp: 36, elderly: 19, humidity: 63 },
  { id: "Z10", name: "Nehru Place", risk: "HIGH" as const, calls: 13, aqi: 290, temp: 38, elderly: 21, humidity: 70 },
  { id: "Z11", name: "Mayur Vihar", risk: "CRITICAL" as const, calls: 19, aqi: 380, temp: 40, elderly: 26, humidity: 78 },
  { id: "Z12", name: "Vasant Kunj", risk: "LOW" as const, calls: 2, aqi: 95, temp: 32, elderly: 8, humidity: 50 },
];

export const ambulances = [
  { id: "A-01", zone: "Z01", status: "Busy" as const, lat: 28.6315, lng: 77.2167 },
  { id: "A-02", zone: "Z03", status: "Busy" as const, lat: 28.6505, lng: 77.2303 },
  { id: "A-03", zone: "Z04", status: "Idle" as const, lat: 28.5921, lng: 77.0460 },
  { id: "A-04", zone: "Z05", status: "Moving" as const, lat: 28.5244, lng: 77.2090 },
  { id: "A-05", zone: "Z07", status: "Busy" as const, lat: 28.5700, lng: 77.2430 },
  { id: "A-06", zone: "Z08", status: "Idle" as const, lat: 28.6219, lng: 77.0846 },
  { id: "A-07", zone: "Z02", status: "Idle" as const, lat: 28.6519, lng: 77.1905 },
  { id: "A-08", zone: "Z06", status: "Moving" as const, lat: 28.7320, lng: 77.1190 },
  { id: "A-09", zone: "Z10", status: "Busy" as const, lat: 28.5491, lng: 77.2533 },
  { id: "A-10", zone: "Z12", status: "Idle" as const, lat: 28.5209, lng: 77.1563 },
];

export const hourlyDemand = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  calls: Math.floor(Math.random() * 20 + 5 + (i >= 8 && i <= 20 ? 10 : 0)),
  predicted: Math.floor(Math.random() * 18 + 6 + (i >= 8 && i <= 20 ? 12 : 0)),
}));

export const alerts = [
  { id: 1, type: "critical" as const, message: "Zone Z03 (Chandni Chowk) → CRITICAL risk detected", time: "2 min ago" },
  { id: 2, type: "warning" as const, message: "Zone Z11 (Mayur Vihar) → AQI exceeds 380", time: "5 min ago" },
  { id: 3, type: "info" as const, message: "Ambulance A-03 needs relocation to Z07", time: "8 min ago" },
  { id: 4, type: "critical" as const, message: "Zone Z07 → HIGH risk, 16 predicted calls", time: "12 min ago" },
  { id: 5, type: "info" as const, message: "Fleet optimization completed. 2 units relocated.", time: "15 min ago" },
];

export const fleetSuggestions = [
  { ambulance: "A-03", from: "Z04", to: "Z11", reason: "Z11 CRITICAL, currently uncovered", eta: "12 min" },
  { ambulance: "A-07", from: "Z02", to: "Z07", reason: "Z07 HIGH risk, needs backup", eta: "8 min" },
  { ambulance: "A-06", from: "Z08", to: "Z03", reason: "Z03 CRITICAL, heavy demand", eta: "15 min" },
  { ambulance: "A-10", from: "Z12", to: "Z10", reason: "Z10 HIGH risk, no nearby unit", eta: "10 min" },
];

export const riskDistribution = [
  { name: "CRITICAL", value: 2, fill: "hsl(0 84% 60%)" },
  { name: "HIGH", value: 3, fill: "hsl(0 72% 51%)" },
  { name: "MODERATE", value: 3, fill: "hsl(38 92% 50%)" },
  { name: "LOW", value: 4, fill: "hsl(142 71% 45%)" },
];

export const featureImportance = [
  { feature: "AQI", importance: 0.32 },
  { feature: "Temperature", importance: 0.24 },
  { feature: "Elderly %", importance: 0.18 },
  { feature: "Humidity", importance: 0.14 },
  { feature: "Traffic", importance: 0.12 },
];
