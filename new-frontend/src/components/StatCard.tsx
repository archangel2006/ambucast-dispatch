import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    positive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'orange' | 'gray';
  trend?: 'up' | 'down' | 'stable' | 'neutral';
  className?: string;
}

const colorStyles: Record<NonNullable<StatCardProps['color']>, string> = {
  blue: 'text-blue-500 bg-blue-100',
  green: 'text-green-500 bg-green-100',
  red: 'text-red-500 bg-red-100',
  orange: 'text-orange-500 bg-orange-100',
  gray: 'text-slate-500 bg-slate-100',
};

const trendSymbols: Record<NonNullable<StatCardProps['trend']>, string> = {
  up: '▲',
  down: '▼',
  stable: '●',
  neutral: '–',
};

const trendColors: Record<NonNullable<StatCardProps['trend']>, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  stable: 'text-slate-600',
  neutral: 'text-slate-500',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  color = 'gray',
  trend,
  className = '',
}) => (
  <div className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {trend && (
          <p className={`mt-1 text-sm font-medium ${trendColors[trend]}`}>
            {trendSymbols[trend]} {trend === 'stable' ? 'Stable' : trend === 'neutral' ? 'Neutral' : ''}
          </p>
        )}
        {change && (
          <p className={`mt-1 text-sm font-medium ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
            {change.positive ? '+' : '-'}{Math.abs(change.value)}%
          </p>
        )}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorStyles[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);
