import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const alertStyles = {
  error: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
  success: 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950',
  warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950',
  info: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
};

const iconStyles = {
  error: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const textStyles = {
  error: 'text-red-800 dark:text-red-200',
  success: 'text-green-800 dark:text-green-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  info: 'text-blue-800 dark:text-blue-200',
};

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, className = '' }) => {
  const Icon = iconMap[type];

  return (
    <div className={`rounded-lg border p-4 ${alertStyles[type]} ${className}`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${iconStyles[type]}`} />
        <div className="flex-1">
          {title && <h4 className={`font-medium ${textStyles[type]}`}>{title}</h4>}
          <p className={`text-sm ${textStyles[type]}`}>{children}</p>
        </div>
      </div>
    </div>
  );
};
