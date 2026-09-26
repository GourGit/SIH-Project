import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, ThermometerSun, CalendarDays, PieChart,
  Map as MapIcon, Users, Menu, X
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home Overview' },
  { path: '/live', icon: ThermometerSun, label: 'Live Weather (AWS)' },
  { path: '/map', icon: MapIcon, label: 'GIS Weather Map' },
  { path: '/forecast', icon: CalendarDays, label: '7-Day Forecast' },
  { path: '/analytics', icon: PieChart, label: 'Big Data Analytics' },
  { path: '/citizen', icon: Users, label: 'Citizen Services' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0F2942] text-slate-200 border-b border-slate-800 shadow-md relative z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center justify-between py-3">
          <span className="font-semibold text-sm">Navigation Menu</span>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop & Mobile Links */}
        <div className={`${isOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row md:items-center py-0`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all md:border-b-2 ${isActive
                  ? 'md:border-orange-400 border-l-4 md:border-l-0 border-l-orange-400 text-white bg-slate-800/80'
                  : 'md:border-transparent border-l-4 md:border-l-0 border-l-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              <item.icon size={16} className="shrink-0 text-orange-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;