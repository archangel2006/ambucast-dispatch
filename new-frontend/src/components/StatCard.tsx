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
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, className = '' }) => (
  <div className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {change && (
          <p className={`mt-1 text-sm font-medium ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
            {change.positive ? '+' : '-'}{Math.abs(change.value)}%
          </p>
        )}
      </div>
      <Icon className="h-12 w-12 text-slate-200 dark:text-slate-800" />
    </div>
  </div>
);
