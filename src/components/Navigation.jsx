import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, ThermometerSun, CalendarDays, PieChart, 
  Map as MapIcon, Users, ChevronRight
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
  return (
    <nav className="bg-[#0F2942] text-slate-200 border-b border-slate-800 shadow-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center overflow-x-auto scrollbar-none py-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all border-b-2 ${
                  isActive 
                    ? 'border-orange-400 text-white bg-slate-800/80' 
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
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
