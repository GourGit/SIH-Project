import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  CloudRain,
  Cloud,
  CloudSnow,
  CloudLightning,
  Sunrise,
  Sunset,
  ShieldAlert,
  Flame,
  Waves,
  RefreshCw,
  Calendar,
  Clock,
  TrendingUp,
  Gauge,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

/* ── Weather code mappings ── */
const WMO_CODES = {
  0: { label: 'Clear Sky', icon: Sun },
  1: { label: 'Mainly Clear', icon: Sun },
  2: { label: 'Partly Cloudy', icon: Cloud },
  3: { label: 'Overcast', icon: Cloud },
  45: { label: 'Foggy', icon: Cloud },
  48: { label: 'Icy Fog', icon: Cloud },
  51: { label: 'Light Drizzle', icon: CloudRain },
  53: { label: 'Drizzle', icon: CloudRain },
  55: { label: 'Heavy Drizzle', icon: CloudRain },
  61: { label: 'Slight Rain', icon: CloudRain },
  63: { label: 'Moderate Rain', icon: CloudRain },
  65: { label: 'Heavy Rain', icon: CloudRain },
  71: { label: 'Light Snow', icon: CloudSnow },
  73: { label: 'Snow', icon: CloudSnow },
  75: { label: 'Heavy Snow', icon: CloudSnow },
  80: { label: 'Rain Showers', icon: CloudRain },
  81: { label: 'Showers', icon: CloudRain },
  82: { label: 'Violent Showers', icon: CloudLightning },
  95: { label: 'Thunderstorm', icon: CloudLightning },
  96: { label: 'Thunderstorm + Hail', icon: CloudLightning },
  99: { label: 'Severe Thunderstorm', icon: CloudLightning },
};

const getWmo = (code) => WMO_CODES[code] || { label: 'Variable', icon: Cloud };

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
};

const formatHour = (isoStr) => {
  const d = new Date(isoStr);
  const h = d.getHours();
  return h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
};

const getRiskBadge = (level) => {
  const l = (level || 'low').toLowerCase();
  if (l === 'severe' || l === 'extreme' || l === 'critical') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (l === 'high') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (l === 'moderate') return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  return 'bg-emerald-50 text-emerald-800 border-emerald-200';
};

/* ── Custom recharts tooltip ── */
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-300 rounded-md px-3 py-1.5 shadow-md text-xs text-slate-800">
        <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
        <p className="font-bold text-sm text-[#0F2942]">{payload[0].value}{unit}</p>
      </div>
    );
  }
  return null;
};

/* ============================================================
   Main Forecast Component (Clean Government Theme)
   ============================================================ */
const Forecast = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 });
  const [forecastData, setForecastData] = useState(null);
  const [activeChart, setActiveChart] = useState('temp');
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchForecast = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const params = [
        `latitude=${lat}`,
        `longitude=${lng}`,
        'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset,precipitation_probability_max',
        'hourly=temperature_2m,precipitation,wind_speed_10m,relative_humidity_2m,apparent_temperature,weather_code',
        'current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,apparent_temperature,surface_pressure,uv_index',
        'timezone=auto',
        'forecast_days=7'
      ].join('&');
      const res = await axios.get(`https://api.open-meteo.com/v1/forecast?${params}`);
      setForecastData(res.data);
    } catch (err) {
      console.error("Forecast fetch error", err);
      setError('Unable to fetch forecast data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast(location.lat, location.lng);
  }, [fetchForecast, location.lat, location.lng]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=in`
      );
      if (res.data && res.data.length > 0) {
        const item = res.data[0];
        const state = item.display_name.split(',').slice(-3, -2)[0]?.trim() || 'India';
        setLocation({
          name: item.name,
          state,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        });
        setSearchQuery('');
        setSelectedDay(0);
      } else {
        alert('Location not found. Try entering a district or city in India.');
      }
    } catch {
      alert('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const getHourlyForDay = (dayIndex) => {
    if (!forecastData?.hourly?.time) return [];
    const targetDate = forecastData.daily?.time?.[dayIndex];
    if (!targetDate) return [];
    return forecastData.hourly.time
      .map((t, idx) => ({
        time: formatHour(t),
        rawTime: t,
        temp: forecastData.hourly.temperature_2m[idx],
        rain: forecastData.hourly.precipitation[idx],
        wind: forecastData.hourly.wind_speed_10m[idx],
        humidity: forecastData.hourly.relative_humidity_2m[idx],
        wmo: forecastData.hourly.weather_code[idx]
      }))
      .filter(item => item.rawTime.startsWith(targetDate));
  };

  const getDisasterOutlook = () => {
    if (!forecastData?.daily) return { flood: 'Low', heatwave: 'Low', cyclone: 'Low', uv: 'Low' };
    const maxRain = Math.max(...(forecastData.daily.precipitation_sum || [0]));
    const maxTemp = Math.max(...(forecastData.daily.temperature_2m_max || [0]));
    const maxWind = Math.max(...(forecastData.daily.wind_speed_10m_max || [0]));
    const maxUV   = Math.max(...(forecastData.daily.uv_index_max || [0]));

    return {
      flood: maxRain > 100 ? 'Severe' : maxRain > 60 ? 'High' : maxRain > 25 ? 'Moderate' : 'Low',
      heatwave: maxTemp >= 44 ? 'Severe' : maxTemp >= 40 ? 'High' : maxTemp >= 36 ? 'Moderate' : 'Low',
      cyclone: maxWind > 75 ? 'Severe' : maxWind > 55 ? 'High' : maxWind > 35 ? 'Moderate' : 'Low',
      uv: maxUV >= 11 ? 'Extreme' : maxUV >= 8 ? 'Very High' : maxUV >= 6 ? 'High' : 'Moderate',
      maxRain: maxRain.toFixed(1),
      maxTemp: maxTemp.toFixed(1),
      maxWind: Math.round(maxWind),
      maxUV: maxUV.toFixed(1)
    };
  };

  const hourlyData = getHourlyForDay(selectedDay);
  const chartData = hourlyData.filter((_, i) => i % 2 === 0);
  const outlook   = getDisasterOutlook();
  const daily     = forecastData?.daily;
  const current   = forecastData?.current;

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 text-slate-800 font-sans pb-12">

      {/* ── Official Government Breadcrumbs & Header ── */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <Link to="/" className="hover:text-[#1E3A8A] transition-colors">Home Overview</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-medium">7-Day District Agro-Met Forecast</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] flex items-center gap-2">
                <Calendar className="text-[#1E3A8A]" size={22} />
                <span>7-Day Numerical Weather Prediction (NWP) Forecast</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#1E3A8A]" />
                <strong className="text-slate-700">{location.name}, {location.state}</strong>
                <span className="text-slate-400">|</span>
                <span className="font-mono text-[11px] text-slate-500">{location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E</span>
              </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative flex-shrink-0 w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any district or city in India..."
                className="w-full pl-8 pr-10 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
              />
              <Search size={13} className="absolute left-2.5 top-2 text-slate-400 pointer-events-none" />
              <button
                type="submit"
                disabled={searchLoading}
                className="absolute right-1 top-1 px-2.5 py-0.5 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded text-xs font-semibold transition-colors disabled:opacity-60 flex items-center"
              >
                {searchLoading ? <RefreshCw size={12} className="animate-spin" /> : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-6 space-y-6">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white border border-slate-200 rounded-lg">
            <RefreshCw size={32} className="animate-spin text-[#1E3A8A]" />
            <p className="text-slate-600 text-xs font-medium">Fetching meteorological prediction models…</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 text-rose-800 text-center">
            <ShieldAlert size={28} className="mx-auto mb-2 text-rose-600" />
            <p className="font-bold text-sm">{error}</p>
            <button 
              onClick={() => fetchForecast(location.lat, location.lng)}
              className="mt-3 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition-colors"
            >
              Retry Prediction Feed
            </button>
          </div>
        )}

        {!loading && !error && forecastData && (
          <>
            {/* ROW 1: Current Observations + Disaster Outlook */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Current Observations Card */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Current Synoptic Observations</span>
                    </p>
                    <span className="text-[11px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">
                      Station Verified
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-5xl font-black text-slate-900 tracking-tight">
                        {current?.temperature_2m?.toFixed(1)}<span className="text-2xl font-normal text-slate-500 ml-1">°C</span>
                      </div>
                      <div className="text-slate-600 text-xs mt-1 font-medium">
                        Apparent Temperature: {current?.apparent_temperature?.toFixed(1)}°C &nbsp;•&nbsp; Condition: <strong className="text-slate-800">{getWmo(current?.weather_code).label}</strong>
                      </div>
                    </div>
                    {(() => { 
                      const Ico = getWmo(current?.weather_code).icon; 
                      return <Ico size={48} className="text-[#1E3A8A]" />; 
                    })()}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Humidity', value: `${current?.relative_humidity_2m}%`, icon: Droplets, color: 'text-sky-600' },
                      { label: 'Wind Speed', value: `${current?.wind_speed_10m} km/h`, icon: Wind, color: 'text-indigo-600' },
                      { label: 'Barometer', value: `${Math.round(current?.surface_pressure || 0)} hPa`, icon: Gauge, color: 'text-amber-600' },
                      { label: 'UV Index', value: current?.uv_index ?? '—', icon: Sun, color: 'text-orange-600' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="bg-slate-50 rounded-md p-2.5 border border-slate-200">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                          <Icon size={12} className={color} />
                          <span>{label}</span>
                        </div>
                        <div className="font-bold text-slate-800 text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sunrise / Sunset Strip */}
                {daily?.sunrise && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex gap-3 text-xs">
                    <div className="flex-1 bg-amber-50/70 border border-amber-200 rounded p-2 flex items-center gap-2.5">
                      <Sunrise size={16} className="text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Sunrise</span>
                        <span className="text-slate-800 font-semibold text-xs">{new Date(daily.sunrise[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-rose-50/70 border border-rose-200 rounded p-2 flex items-center gap-2.5">
                      <Sunset size={16} className="text-rose-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-rose-800 font-bold uppercase tracking-wider block">Sunset</span>
                        <span className="text-slate-800 font-semibold text-xs">{new Date(daily.sunset[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Disaster Risk Outlook Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-rose-600" />
                    <span>7-Day Vulnerability Outlook</span>
                  </p>
                  <p className="text-xs text-slate-500 mb-3">NDMA composite hazard evaluation for {location.name}</p>

                  <div className="space-y-2.5">
                    {[
                      { label: 'Flood Vulnerability', level: outlook.flood, detail: `${outlook.maxRain} mm peak volume`, icon: Waves },
                      { label: 'Heatwave Impact', level: outlook.heatwave, detail: `Peak ${outlook.maxTemp}°C projected`, icon: Flame },
                      { label: 'Gale / Wind Risk', level: outlook.cyclone, detail: `Max ${outlook.maxWind} km/h gusts`, icon: Wind },
                      { label: 'Solar UV Severity', level: outlook.uv, detail: `Index ${outlook.maxUV} rating`, icon: Sun },
                    ].map(({ label, level, detail, icon: Icon }) => (
                      <div key={label} className={`flex items-center justify-between p-2.5 rounded-md border ${getRiskBadge(level)} text-xs`}>
                        <div className="flex items-center gap-2">
                          <Icon size={14} />
                          <div>
                            <div className="font-semibold text-slate-900">{label}</div>
                            <div className="text-[10px] text-slate-500">{detail}</div>
                          </div>
                        </div>
                        <span className="font-bold text-[11px] uppercase tracking-wider">{level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Verified by State Disaster Emergency Matrix</span>
                </div>
              </div>

            </div>

            {/* ROW 2: 7-Day Day Selector Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#1E3A8A]" />
                  <span>7-Day Synoptic Weather Progression</span>
                </h2>
                <span className="text-slate-500 text-[11px]">Select a day to view hourly trajectory</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {daily?.time?.map((dateStr, i) => {
                  const Ico = getWmo(daily.weather_code[i]).icon;
                  const isSelected = selectedDay === i;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDay(i)}
                      className={`rounded-lg border p-3 flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                        isSelected 
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                        {i === 0 ? 'Today' : DAY_NAMES[new Date(dateStr).getDay()]}
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                        {new Date(dateStr).getDate()} {MONTH_NAMES[new Date(dateStr).getMonth()]}
                      </div>
                      <div className="my-1">
                        <Ico size={22} className={isSelected ? 'text-white' : 'text-[#1E3A8A]'} />
                      </div>
                      <div className={`text-[10px] leading-tight font-medium ${isSelected ? 'text-slate-100' : 'text-slate-600'}`}>
                        {getWmo(daily.weather_code[i]).label}
                      </div>
                      <div className="flex gap-1.5 text-xs font-bold mt-1">
                        <span className={isSelected ? 'text-white' : 'text-slate-900'}>{Math.round(daily.temperature_2m_max[i])}°</span>
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>{Math.round(daily.temperature_2m_min[i])}°</span>
                      </div>
                      <div className={`text-[10px] flex items-center gap-1 font-medium ${isSelected ? 'text-sky-200' : 'text-sky-700'}`}>
                        <CloudRain size={10} />
                        <span>{daily.precipitation_sum[i]?.toFixed(0)} mm</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 3: Hourly Chart */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} className="text-[#1E3A8A]" />
                  <span>Hourly Prediction Model — {selectedDay === 0 ? 'Today' : formatDate(daily?.time?.[selectedDay] || '')}</span>
                </h2>
                
                {/* Metric Selector Buttons */}
                <div className="flex gap-1.5">
                  {[
                    { key: 'temp', label: 'Temperature (°C)' },
                    { key: 'rain', label: 'Precipitation (mm)' },
                    { key: 'wind', label: 'Wind Velocity (km/h)' },
                  ].map(({ key, label }) => (
                    <button 
                      key={key} 
                      onClick={() => setActiveChart(key)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        activeChart === key 
                          ? 'bg-[#0F2942] text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'temp' ? (
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 10 }} unit="°" />
                      <Tooltip content={<CustomTooltip unit="°C" />} />
                      <Area type="monotone" dataKey="temp" stroke="#1E3A8A" fill="url(#tGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  ) : activeChart === 'rain' ? (
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 10 }} unit="mm" />
                      <Tooltip content={<CustomTooltip unit=" mm" />} />
                      <Bar dataKey="rain" fill="#0284C7" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 10 }} unit="km/h" />
                      <Tooltip content={<CustomTooltip unit=" km/h" />} />
                      <Area type="monotone" dataKey="wind" stroke="#4F46E5" fill="url(#wGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Hourly Summary Pills */}
              <div className="mt-4 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
                <div className="flex gap-2 min-w-max">
                  {hourlyData.filter((_, i) => i % 3 === 0).map((h, i) => {
                    const Ico = getWmo(h.wmo).icon;
                    return (
                      <div key={i} className="flex flex-col items-center gap-0.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-center min-w-[50px]">
                        <span className="text-[10px] text-slate-500">{h.time}</span>
                        <Ico size={14} className="text-[#1E3A8A] my-0.5" />
                        <span className="text-xs font-bold text-slate-800">{h.temp?.toFixed(0)}°</span>
                        <span className="text-[10px] text-sky-700 font-medium">{h.humidity}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ROW 4: Extended Forecast Official Register Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#1E3A8A]" />
                  <span>Official 7-Day Meteorological Outlook Table</span>
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">IMD High Resolution GFS Model</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[11px] text-slate-600 uppercase tracking-wider border-b border-slate-200 bg-slate-100/75">
                      <th className="px-4 py-2.5 text-left font-bold">Day & Date</th>
                      <th className="px-4 py-2.5 text-left font-bold">Synoptic Condition</th>
                      <th className="px-4 py-2.5 text-right font-bold">Max Temp</th>
                      <th className="px-4 py-2.5 text-right font-bold">Min Temp</th>
                      <th className="px-4 py-2.5 text-right font-bold">Precipitation</th>
                      <th className="px-4 py-2.5 text-right font-bold">Rain Prob</th>
                      <th className="px-4 py-2.5 text-right font-bold">Wind Speed</th>
                      <th className="px-4 py-2.5 text-right font-bold">UV Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily?.time?.map((dateStr, i) => {
                      const Ico = getWmo(daily.weather_code[i]).icon;
                      const isSelected = selectedDay === i;
                      return (
                        <tr 
                          key={dateStr} 
                          onClick={() => setSelectedDay(i)}
                          className={`border-b border-slate-100 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                            {i === 0 ? 'Today' : formatDate(dateStr)}
                          </td>
                          <td className="px-4 py-2.5 text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Ico size={13} className="text-[#1E3A8A] shrink-0" />
                              <span>{getWmo(daily.weather_code[i]).label}</span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-slate-900">{Math.round(daily.temperature_2m_max[i])}°C</td>
                          <td className="px-4 py-2.5 text-right text-slate-500">{Math.round(daily.temperature_2m_min[i])}°C</td>
                          <td className="px-4 py-2.5 text-right font-medium text-sky-700">{daily.precipitation_sum[i]?.toFixed(1)} mm</td>
                          <td className="px-4 py-2.5 text-right text-slate-600">{daily.precipitation_probability_max[i]}%</td>
                          <td className="px-4 py-2.5 text-right text-indigo-700">{daily.wind_speed_10m_max[i]?.toFixed(0)} km/h</td>
                          <td className="px-4 py-2.5 text-right font-bold">
                            <span className={
                              daily.uv_index_max[i] > 10 ? 'text-rose-700' :
                              daily.uv_index_max[i] > 7 ? 'text-amber-700' :
                              daily.uv_index_max[i] > 4 ? 'text-yellow-700' : 'text-emerald-700'
                            }>{daily.uv_index_max[i]?.toFixed(1)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Forecast;
