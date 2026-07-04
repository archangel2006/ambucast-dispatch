export const clsx = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const cn = (...classes: any[]): string => {
  return clsx(...classes);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

export const getRiskColor = (risk: string): string => {
  switch (risk?.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-50';
    case 'high':
      return 'text-orange-600 bg-orange-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'occupied':
      return 'bg-red-100 text-red-800';
    case 'moving':
      return 'bg-blue-100 text-blue-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const zoneDisplayNames: Record<string, string> = {
  z01: 'Connaught Place',
  z02: 'Karol Bagh',
  z03: 'Chandni Chowk',
  z04: 'Dwarka',
  z05: 'Saket',
  z06: 'Rohini',
  z07: 'Lajpat Nagar',
  z08: 'Janakpuri',
  z09: 'Pitampura',
  z10: 'Nehru Place',
  z11: 'Mayur Vihar',
  z12: 'Vasant Kunj',
  zone_north: 'North Delhi',
  zone_east: 'East Delhi',
  zone_south: 'South Delhi',
  zone_west: 'West Delhi',
  zone_central: 'Central Delhi',
  zone_noida: 'Noida',
  zone_gurgaon: 'Gurgaon',
  zone_ghaziabad: 'Ghaziabad',
  zone_faridabad: 'Faridabad',
};

export const getZoneDisplayName = (zoneId?: string | null, fallback?: string): string => {
  if (!zoneId) {
    return fallback ?? 'Unknown zone';
  }

  const normalized = zoneId.trim().toLowerCase();
  return zoneDisplayNames[normalized] || fallback || zoneId;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
