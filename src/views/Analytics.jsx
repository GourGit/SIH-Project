import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  BarChart2,
  TrendingUp,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  ShieldAlert,
  ExternalLink,
  Maximize2,
  RefreshCw,
  Info,
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';

const POWERBI_URL =
  'https://app.powerbi.com/view?r=eyJrIjoiZGRkMGZhZjUtZTZhZi00N2NkLWE3NDYtYzE3YTY4NmJmYWQzIiwidCI6ImIxNzAzMTg1LTJkOTktNDBlNS04NmUxLTNhMjIzMTJmYWY3NiJ9';

/* ── Clean Government KPI Metrics ── */
const STAT_CARDS = [
  { label: 'Avg National Temp', value: '31.4°C', sub: 'Across 2024-25 records', icon: Thermometer, iconColor: 'text-orange-600 bg-orange-50' },
  { label: 'Total Ingested Rain', value: '1,842 mm', sub: 'Annual accumulated volume', icon: CloudRain, iconColor: 'text-sky-600 bg-sky-50' },
  { label: 'Max Cyclone Wind', value: '94 km/h', sub: 'Bay of Bengal peak gusts', icon: Wind, iconColor: 'text-indigo-600 bg-indigo-50' },
  { label: 'Flood Monitored Basins', value: '47', sub: 'Critical catchment areas', icon: Droplets, iconColor: 'text-blue-600 bg-blue-50' },
  { label: 'Heatwave Anomaly Days', value: '23', sub: 'North-West zone stations', icon: ShieldAlert, iconColor: 'text-rose-600 bg-rose-50' },
  { label: 'Verified AWS Telemetry', value: '2,847', sub: 'Active IMD sync pipelines', icon: BarChart2, iconColor: 'text-emerald-600 bg-emerald-50' },
];

const Analytics = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 text-slate-800 font-sans pb-12">
      
      {/* ── Official Government Breadcrumbs & Header ── */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <Link to="/" className="hover:text-[#1E3A8A] transition-colors">Home Overview</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-medium">Big Data Climate Analytics</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] flex items-center gap-2">
                <PieChart className="text-[#1E3A8A]" size={22} />
                <span>National Climate Big Data Analytics Portal (2024–2025)</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Multi-decadal synoptic observation datasets, numerical anomaly models & real-time telemetry · Power BI Enterprise Feed
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIframeKey(k => k + 1)}
                title="Reload report data"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold transition-colors"
              >
                <RefreshCw size={13} />
                <span>Sync Data</span>
              </button>
              <a
                href={POWERBI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F2942] hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
              >
                <ExternalLink size={13} />
                <span>External View</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Analytics Container ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-6 space-y-6">

        {/* ── KPI Stat Cards ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#1E3A8A]" />
              <span>National Climate Indices · 2024–2025 Synoptic Summary</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Quality Checked: Level-4 IMD Standard</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {STAT_CARDS.map(({ label, value, sub, icon: Icon, iconColor }) => (
              <div
                key={label}
                className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-md ${iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 leading-none">{value}</div>
                  <div className="text-slate-600 text-[11px] font-semibold mt-1 leading-tight">{label}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5 leading-tight">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Official Government Power BI Embed Frame ── */}
        <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all ${fullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>

          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#138808]" />
                <span className="text-xs font-bold text-[#0F2942]">Indian Climate Dataset 2024–2025</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Official Report
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFullscreen(f => !f)}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs"
                title={fullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
              >
                <Maximize2 size={14} />
                <span className="hidden sm:inline text-[11px] font-medium">{fullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* Embedded Report Frame */}
          <div className={`w-full ${fullscreen ? 'h-[calc(100%-44px)]' : 'h-[640px] sm:h-[750px] lg:h-[820px]'} bg-slate-100`}>
            <iframe
              key={iframeKey}
              title="Indian_Climate_Dataset_2024_2025"
              src={POWERBI_URL}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Fullscreen Backdrop ── */}
        {fullscreen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setFullscreen(false)}
          />
        )}

        {/* ── Data Provenance & Methodological Note ── */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Database size={14} className="text-[#1E3A8A]" />
            <span>Data Lineage & Methodology Note:</span>
          </div>
          <p className="leading-relaxed text-slate-500">
            Telemetry records presented in this dashboard are aggregated through the High-Performance Computing (HPC) cluster at the Indian Institute of Tropical Meteorology (IITM) and the National Centre for Medium Range Weather Forecasting (NCMRWF). Datasets strictly adhere to WMO Guide to Climatological Practices (WMO-No. 100) and are open under the National Data Sharing and Accessibility Policy (NDSAP).
          </p>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
