import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
    <Sidebar />
    <main className="flex-1 overflow-auto md:ml-64">
      <div className="p-4 md:p-8">
        {children}
      </div>
    </main>
  </div>
);
