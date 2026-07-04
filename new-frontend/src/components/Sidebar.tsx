import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'Activity' },
  { path: '/map', label: 'Live Map', icon: 'Map' },
  { path: '/hotspots', label: 'Hotspots', icon: 'Zap' },
  { path: '/fleet', label: 'Fleet', icon: 'Truck' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/risk', label: 'Risk Analysis', icon: 'AlertTriangle' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-40 md:hidden"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-transform md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
          <Activity className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">AmbuCast</span>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 top-16 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};
