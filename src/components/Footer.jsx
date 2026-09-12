import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { 
  PhoneCall, ShieldAlert, Phone, ChevronRight, 
  LifeBuoy, Radio, Building2, Mail, ExternalLink,
  CheckCircle2, Clock
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1E32] text-slate-300 font-sans mt-auto border-t border-slate-800">
      {/* ========================================================================= */}
      {/* 1. EMERGENCY & HELPLINE HIGHLIGHT BANNER */}
      {/* ========================================================================= */}
      <div className="bg-[#1C1917] border-b border-red-900/50 py-3 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 text-center lg:text-left">
            <div className="w-9 h-9 rounded-md bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
                  24x7 Emergency Helplines
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">Disaster Operations & Meteorological Assistance</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Toll-free national emergency lines for rapid meteorological and disaster support</p>
            </div>
          </div>

          {/* Quick Dial Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a 
              href="tel:112" 
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
              title="National Emergency Helpline"
            >
              <PhoneCall size={13} />
              <span>112</span>
              <span className="text-[10px] bg-red-800 px-1 py-0.2 rounded font-normal">All Hazards</span>
            </a>

            <a 
              href="tel:1078" 
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-red-600/50 text-red-200 text-xs font-bold transition-all"
              title="NDMA Disaster Helpline"
            >
              <Phone size={13} className="text-red-400" />
              <span>1078</span>
              <span className="text-[10px] bg-red-950 text-red-300 px-1 py-0.2 rounded font-normal">NDMA Disaster</span>
            </a>

            <a 
              href="tel:18001801717" 
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-amber-600/50 text-amber-200 text-xs font-bold transition-all"
              title="IMD Weather Advisory Toll Free"
            >
              <Radio size={13} className="text-amber-400" />
              <span>1800-180-1717</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1 py-0.2 rounded font-normal">IMD Weather</span>
            </a>

            <a 
              href="tel:1070" 
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
              title="State Relief Commissioner & Flood Helpline"
            >
              <LifeBuoy size={13} className="text-sky-400" />
              <span>1070</span>
              <span className="text-[10px] bg-slate-900 text-slate-400 px-1 py-0.2 rounded">State Relief</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN FOOTER BODY */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Platform Identification (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Government Emblem" 
                className="h-12 w-12 object-contain bg-white rounded p-0.5 border border-slate-700" 
              />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                  National Weather Big Data Analytics Platform
                </h3>
                <p className="text-xs text-orange-400 font-medium">
                  Ministry of Earth Sciences • Government of India
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Synthesis of Automated Weather Stations (AWS), Doppler Weather Radars, and INSAT-3DR geostationary observations into real-time decision support for disaster risk reduction.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>System Status: <strong className="text-emerald-400 font-semibold">All Observation Nodes Active</strong></span>
              </div>
              <div className="text-[11px] text-slate-400">
                Official Smart India Hackathon (SIH 2026) Problem Statement Implementation
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <ChevronRight size={14} className="text-orange-400" /> Portal Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  Live Ground Telemetry (AWS)
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  GIS Spatial Radar Map
                </Link>
              </li>
              <li>
                <Link to="/forecast" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  7-Day District Forecast
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  Big Data Climate Analytics
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  Citizen Services Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Nodal Centers (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Building2 size={14} className="text-emerald-400" /> Nodal Operations Centers
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              
              <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center justify-between">
                  <span>National Disaster Ops Centre (NDMA)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded">24x7 Control Room</span>
                </div>
                <p className="text-[11px] text-slate-400">NDMA Bhawan, A-1, Safdarjung Enclave, New Delhi - 110029</p>
                <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 pt-0.5">
                  <Phone size={11} className="text-slate-500" />
                  <a href="tel:01126701728" className="hover:text-white">011-26701728</a> / <a href="tel:01126701700" className="hover:text-white">26701700</a>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center justify-between">
                  <span>India Meteorological Department (IMD)</span>
                  <span className="text-[10px] bg-sky-950 text-sky-400 px-1.5 py-0.2 rounded">Headquarters</span>
                </div>
                <p className="text-[11px] text-slate-400">Mausam Bhawan, Lodhi Road, New Delhi - 110003</p>
                <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 pt-0.5">
                  <Mail size={11} className="text-slate-500" />
                  <a href="mailto:support.weather@gov.in" className="hover:text-white">support.weather@gov.in</a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM GOVERNMENT COPYRIGHT & COMPLIANCE BAR */}
      {/* ========================================================================= */}
      <div className="border-t border-slate-800/90 bg-[#071320] py-4 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          
          <div className="text-center sm:text-left">
            <span>© 2026 <strong>National Weather Big Data Analytics Platform</strong>. Government of India | Smart India Hackathon (SIH). All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
              <span>National Portal of India</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-slate-700">•</span>
            <span>Ministry of Earth Sciences</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
