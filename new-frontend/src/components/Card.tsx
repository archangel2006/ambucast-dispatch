import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`border-b border-slate-200 px-6 py-4 dark:border-slate-800 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>
    {children}
  </p>
);
