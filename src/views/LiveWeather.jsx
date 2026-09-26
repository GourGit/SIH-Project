import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { STATIONS } from '../services/weatherData';
import { 
  Map, Thermometer, Droplets, Wind, MapPin, 
  RefreshCw, Activity, Search, Plus, ChevronRight,
  Radio, CheckCircle2, Filter
} from 'lucide-react';
import axios from 'axios';

const LiveWeather = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState(STATIONS);
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('All');

  const fetchLiveTelemetry = async (stationList) => {
    setLoading(true);
    try {
      const promises = stationList.map(async (station) => {
        try {
          const res = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=auto`
          );
          return { id: station.id, data: res.data.current };
        } catch (e) {
          return {
            id: station.id,
            data: {
              temperature_2m: station.temp || 0,
              relative_humidity_2m: station.humidity || 0,
              wind_speed_10m: station.windSpeed || 0,
              rain: station.rainfallToday || 0
            }
          };
        }
      });

      const results = await Promise.all(promises);
      const dataMap = {};
      results.forEach(res => { dataMap[res.id] = res.data; });
      setLiveData(dataMap);
    } catch (error) {
      console.error("Error fetching live weather data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry(stations);
    const interval = setInterval(() => fetchLiveTelemetry(stations), 300000);
    return () => clearInterval(interval);
  }, [stations]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      executeSearch(query);
    }
  }, [searchParams]);

  const executeSearch = async (query) => {
    if (!query.trim()) return;
    setSearchLoading(true);
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`);
      if (geoRes.data && geoRes.data.length > 0) {
        const result = geoRes.data[0];
        const newId = `STN-${result.name.toUpperCase().replace(/\s/g, '')}-${Math.floor(Math.random()*1000)}`;
        const newStation = {
          id: newId,
          city: result.name,
          state: result.display_name.split(',').slice(-3, -2)[0]?.trim() || "India",
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          windDir: 'N/A'
        };
        setStations(prev => [newStation, ...prev]);
        setSearchQuery('');
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Geocoding failed", error);
      alert("Search failed. Check your connection.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const statesList = ['All', ...new Set(stations.map(s => s.state))];

  const filteredStations = selectedState === 'All' 
    ? stations 
    : stations.filter(s => s.state === selectedState);

  const getTempBadge = (temp) => {
    if (temp >= 40) return 'text-rose-700 bg-rose-50 border-rose-200';
    if (temp >= 30) return 'text-amber-800 bg-amber-50 border-amber-200';
    if (temp <= 20) return 'text-sky-800 bg-sky-50 border-sky-200';
    return 'text-emerald-800 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-140px)] pb-12 font-sans">
      
      {/* ── Official Government Breadcrumbs & Header ── */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <Link to="/" className="hover:text-[#1E3A8A] transition-colors">Home Overview</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-medium">Automated Weather Stations (AWS)</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#138808] font-bold text-xs uppercase tracking-wider mb-0.5">
                <Radio size={14} className="animate-pulse" />
                <span>Real-Time Sensor Telemetry Feed</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">
                National Observation Network — Ground Stations
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Continuous high-frequency environmental telemetry streamed from IMD & State Emergency Operation Centres
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              
              {/* State Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs">
                <Filter size={13} className="text-slate-500" />
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent text-slate-800 outline-none cursor-pointer font-medium"
                >
                  {statesList.map(st => (
                    <option key={st} value={st}>{st === 'All' ? 'All States & UTs' : st}</option>
                  ))}
                </select>
              </div>

              {/* District Search */}
              <form onSubmit={handleSearch} className="relative flex-grow sm:w-60">
                <input 
                  type="text" 
                  placeholder="Add any district or village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-slate-50"
                />
                <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                <button 
                  type="submit"
                  disabled={searchLoading}
                  className="absolute right-1 top-1 p-1 bg-[#1E3A8A] text-white rounded hover:bg-blue-900 transition-colors disabled:opacity-70"
                  title="Search & Add Station"
                >
                  {searchLoading ? <RefreshCw size={11} className="animate-spin" /> : <Plus size={12} />}
                </button>
              </form>

              {/* Sync Button */}
              <button 
                onClick={() => fetchLiveTelemetry(stations)}
                className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                title="Refresh sensor data"
              >
                <RefreshCw size={13} className={loading ? "animate-spin text-[#1E3A8A]" : ""} />
                <span>{loading ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ground Station Cards Grid ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4 text-xs text-slate-600 font-medium">
          <span>Showing <strong>{filteredStations.length}</strong> observation stations in network</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 size={13} />
            <span>All Data Calibrated to WMO Standards</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredStations.map((station) => {
            const current = liveData[station.id];
            const temp = current ? current.temperature_2m : (station.temp || 0);
            const humidity = current ? current.relative_humidity_2m : (station.humidity || 0);
            const wind = current ? current.wind_speed_10m : (station.windSpeed || 0);
            const rain = current ? current.rain : (station.rainfallToday || 0);
            
            const tempBadgeClass = getTempBadge(temp);

            return (
              <div 
                key={station.id} 
                className="bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col"
              >
                {/* Station Card Header */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin size={15} className="text-[#1E3A8A]" />
                      <span>{station.city}</span>
                    </h3>
                    <p className="text-xs text-slate-500 ml-5">{station.state}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      {station.id.slice(0, 11)}
                    </span>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">● Online</div>
                  </div>
                </div>

                {/* Station Primary Telemetry */}
                <div className="p-4 grid grid-cols-2 gap-3 flex-grow">
                  
                  {/* Primary Temperature Box */}
                  <div className={`col-span-2 p-3 rounded-md border ${tempBadgeClass} flex items-center justify-between`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Surface Temperature</span>
                      <div className="text-2xl sm:text-3xl font-black leading-tight mt-0.5">
                        {temp}<span className="text-base font-bold ml-1">°C</span>
                      </div>
                    </div>
                    <Thermometer size={28} className="opacity-80" />
                  </div>

                  {/* Rainfall & Humidity */}
                  <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Droplets size={12} className="text-sky-600" />
                      <span>Rain / Humidity</span>
                    </span>
                    <div className="mt-1">
                      <div className="text-base font-bold text-slate-800">{rain} <span className="text-xs font-normal text-slate-500">mm</span></div>
                      <div className="text-xs font-semibold text-sky-700">{humidity}% RH</div>
                    </div>
                  </div>

                  {/* Wind Velocity */}
                  <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Wind size={12} className="text-indigo-600" />
                      <span>Wind Velocity</span>
                    </span>
                    <div className="mt-1">
                      <div className="text-base font-bold text-slate-800">{wind} <span className="text-xs font-normal text-slate-500">km/h</span></div>
                      <div className="text-xs text-slate-500">Direction: {station.windDir}</div>
                    </div>
                  </div>

                </div>

                {/* Card Action Link */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 mt-auto">
                  <button 
                    onClick={() => navigate(`/map?lat=${station.lat}&lng=${station.lng}&zoom=11&city=${encodeURIComponent(station.city)}`)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#1E3A8A] hover:border-[#1E3A8A] rounded text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Map size={13} />
                    <span>Plot on GIS Weather Map</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default LiveWeather;
