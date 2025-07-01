import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Layers, LogIn } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  { label: 'Employee Performance', icon: <BarChart size={20} />, path: '/employee-performance' },
  { label: 'Reports', icon: <BarChart size={20} />, path: '/reports' },
  { label: 'Segments', icon: <Layers size={20} />, path: '/segments' },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-16 md:w-56 bg-white shadow h-screen flex flex-col">
      <div className="flex items-center justify-center h-16 font-bold text-primary text-xl border-b gap-2">
        {/* Logo icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="4" rx="2" fill="#2563eb"/>
          <rect x="3" y="10" width="18" height="4" rx="2" fill="#2563eb" fillOpacity="0.7"/>
          <rect x="3" y="15" width="18" height="4" rx="2" fill="#2563eb" fillOpacity="0.4"/>
        </svg>
        <span className="hidden md:inline">Insight-eBay</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-accent transition-colors ${location.pathname.startsWith(item.path) ? 'bg-accent font-semibold' : ''}`}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        {/* No logout on sidebar, handled elsewhere if needed */}
      </div>
    </aside>
  );
}

export default Sidebar;
