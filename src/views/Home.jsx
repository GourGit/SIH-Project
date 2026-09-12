import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Thermometer, CloudRain, TriangleAlert, RadioTower, 
  Map, Activity, CalendarDays, PieChart, Shield, 
  ChevronRight, ExternalLink, ArrowUpRight, AlertCircle,
  FileText, CheckCircle2, Clock
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-140px)] pb-12 font-sans">
      
      {/* 1. TOP OFFICIAL GOVERNMENT PORTAL BANNER */}
      <div className="bg-[#0F2942] text-white border-b border-slate-700 py-8 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left Info */}
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-orange-400 text-xs font-semibold uppercase tracking-wider">
                <Activity size={13} className="text-orange-400" />
                <span>Official SIH 2026 Weather Intelligence Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                National Weather Big Data & Multi-Source Observation Network
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                An integrated meteorological decision support system synthesizing real-time Automated Weather Stations (AWS), 
                Doppler Weather Radars, and INSAT-3DR satellite telemetry for high-resolution forecasting and disaster resilience across India.
              </p>
            </div>

            {/* Right Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
              <button 
                onClick={() => navigate('/map')}
                className="flex items-center justify-center gap-2 bg-[#138808] hover:bg-green-800 text-white px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold shadow transition-all"
              >
                <Map size={16} />
                <span>Explore GIS Map</span>
              </button>
              <button 
                onClick={() => navigate('/forecast')}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all"
              >
                <CalendarDays size={16} />
                <span>7-Day Forecast</span>
              </button>
            </div>

          </div>

          {/* Telemetry Status Strip */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Telemetry Ingestion: <strong className="text-white font-medium">Real-Time Continuous Stream</strong></span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">Sensor Quality Assurance: Level-3 Passed</span>
            </div>
            <div className="text-slate-400">
              Sync: <strong className="text-slate-200">12:30 PM IST</strong> | All State Synoptic Networks Connected
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN PORTAL BODY CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* SECTION A: KEY NATIONAL METEOROLOGICAL INDICATORS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>National Meteorological Overview</span>
              </h3>
              <p className="text-xs text-slate-500">Official composite telemetry across 12,450+ IMD observation nodes</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
              Updated Hourly
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Temperature */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">National Mean Temp</span>
                <div className="p-2 bg-orange-50 text-orange-600 rounded">
                  <Thermometer size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  32.0<span className="text-base font-normal text-slate-500 ml-1">°C</span>
                </div>
                <div className="mt-1 flex items-center text-xs font-semibold text-emerald-700">
                  <span>+1.4°C departure from normal</span>
                </div>
              </div>
            </div>

            {/* Card 2: Rainfall */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">24h Cumulative Rainfall</span>
                <div className="p-2 bg-sky-50 text-sky-600 rounded">
                  <CloudRain size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  84.6<span className="text-base font-normal text-slate-500 ml-1">mm</span>
                </div>
                <div className="mt-1 flex items-center text-xs font-semibold text-sky-700">
                  <span>12% above seasonal average</span>
                </div>
              </div>
            </div>

            {/* Card 3: Active Weather Alerts */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active District Alerts</span>
                <div className="p-2 bg-rose-50 text-rose-600 rounded">
                  <TriangleAlert size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  23<span className="text-xs font-normal text-slate-500 ml-2">Districts</span>
                </div>
                <div className="mt-1 flex items-center text-xs font-semibold text-rose-700">
                  <span>4 Red Alerts • 9 Orange Alerts</span>
                </div>
              </div>
            </div>

            {/* Card 4: Weather Stations */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AWS Telemetry Stations</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                  <RadioTower size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  12,450
                </div>
                <div className="mt-1 flex items-center text-xs font-semibold text-emerald-700">
                  <span>98.7% operational online</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION B: ACTIVE WARNING SUMMARY & EARLY WARNING BULLETIN */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-100 text-red-700 rounded">
                <AlertCircle size={16} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Official Meteorological Warning Matrix (Today & Tomorrow)</h4>
                <p className="text-xs text-slate-500">Disseminated under National Disaster Management Authority (NDMA) guidelines</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/map')} 
              className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Warning Map</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Red Alert Box */}
            <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[11px] rounded uppercase tracking-wider">
                  Red Alert (Take Action)
                </span>
                <span className="text-xs text-red-700 font-semibold">4 Districts</span>
              </div>
              <h5 className="text-xs font-bold text-red-950">Severe Cyclonic Storm 'Varun'</h5>
              <p className="text-xs text-slate-700 leading-relaxed">
                Coastal districts of Odisha (Puri, Jagatsinghpur) and North Andhra Pradesh (Srikakulam). Gale wind speed 90-110 kmph with heavy to very heavy storm surge.
              </p>
            </div>

            {/* Orange Alert Box */}
            <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[11px] rounded uppercase tracking-wider">
                  Orange Alert (Be Prepared)
                </span>
                <span className="text-xs text-amber-800 font-semibold">9 Districts</span>
              </div>
              <h5 className="text-xs font-bold text-amber-950">Heavy Precipitation & Inundation</h5>
              <p className="text-xs text-slate-700 leading-relaxed">
                Assam (Barpeta, Dhemaji), Meghalaya, and Sub-Himalayan West Bengal (Jalpaiguri). Intense localized rain likely to trigger flash floods and landslides.
              </p>
            </div>

            {/* Yellow Alert Box */}
            <div className="border border-yellow-200 bg-yellow-50/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-yellow-400 text-slate-950 font-bold text-[11px] rounded uppercase tracking-wider">
                  Yellow Alert (Be Updated)
                </span>
                <span className="text-xs text-yellow-800 font-semibold">10 Districts</span>
              </div>
              <h5 className="text-xs font-bold text-yellow-950">Severe Heatwave Anomaly</h5>
              <p className="text-xs text-slate-700 leading-relaxed">
                Western Rajasthan (Jaisalmer, Bikaner, Barmer). Maximum temperatures persisting 4.5°C above seasonal benchmark with gusty dry desert winds.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION C: CORE PUBLIC SERVICES & WEATHER MODULES */}
        <div>
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              National Meteorological Services & Portals
            </h3>
            <p className="text-xs text-slate-500">
              Direct access to weather monitoring, GIS observation mapping, and analytical decision tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Service 1: Live Weather */}
            <div 
              onClick={() => navigate('/live')}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#1E3A8A] hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-blue-50 text-[#1E3A8A] flex items-center justify-center mb-3">
                  <Thermometer size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  Live Ground Telemetry (AWS)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Real-time observation data from automated weather stations across all 28 states & 8 UTs. Live tracking of temperature, relative humidity, wind velocity, and barometric trends.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>View Ground Stations</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 2: GIS Map */}
            <div 
              onClick={() => navigate('/map')}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#1E3A8A] hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-50 text-[#138808] flex items-center justify-center mb-3">
                  <Map size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  GIS Spatial Radar & Map Viewer
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Interactive multi-layer geospatial portal with Doppler radar reflectivity overlays, storm track vectors, cyclone trajectory cones, and critical infrastructure risk zones.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>Open Spatial Viewer</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 3: Forecast */}
            <div 
              onClick={() => navigate('/forecast')}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#1E3A8A] hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                  <CalendarDays size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  7-Day District Agro-Met Forecast
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  High-resolution numerical weather prediction (NWP) model forecasts. Hourly precipitation breakdown, maximum/minimum temperature projections, and agricultural advisory.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>Check Forecast</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 4: Analytics */}
            <div 
              onClick={() => navigate('/analytics')}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#1E3A8A] hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <PieChart size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  Climate Big Data Analytics Hub
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Interactive Power BI analytics portal analyzing multi-decadal Indian climate records, regional precipitation anomalies, drought vulnerability indices, and temperature trends.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>Access Analytics Dashboard</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 5: Citizen Portal */}
            <div 
              onClick={() => navigate('/citizen')}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#1E3A8A] hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                  <Shield size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  Citizen Reporting & Incident Desk
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Crowdsourced meteorological incident reporting. Citizens can submit localized severe weather observations (waterlogging, hailstorms, fallen trees) directly to disaster cells.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>Submit Citizen Report</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 6: Open Standards & Documentation */}
            <div 
              onClick={() => navigate('/live')}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#1E3A8A] hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                  <FileText size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                  Station Quality & Ingestion Protocol
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  WMO-standard automated meteorological calibration and QC validation framework. Sensor redundancy checks and high-reliability data pipelines for disaster readiness.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>View Specifications</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION D: INSTITUTIONAL INITIATIVE & SIH 2026 AFFILIATION */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">
                National Hackathon Initiative
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Smart India Hackathon (SIH 2026) — Problem Statement SIH-1432
              </h4>
              <p className="text-xs text-slate-500">
                Developed for the Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD) to enhance multi-source meteorological big data intelligence and public safety.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded">
                IMD Synoptic Data
              </span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded">
                INSAT-3DR Geostationary
              </span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded">
                NDMA Alert Protocol
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
