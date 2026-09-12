import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  Radar, 
  RefreshCw, 
  MapPin, 
  Layers, 
  Eye, 
  Compass, 
  BarChart3,
  Waves,
  Flame,
  CloudLightning,
  Search,
  Plus
} from 'lucide-react';
import axios from 'axios';
import { STATIONS, MAP_LAYERS } from '../services/weatherData';

// Map View Controller component
const SetViewOnClick = ({ coords, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length === 2) {
      map.flyTo(coords, zoom, { duration: 1.2 });
    }
  }, [coords, zoom, map]);
  return null;
};

const MapViewer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const initialLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : 22.5726;
  const initialLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : 88.3639;
  const initialZoom = searchParams.get('zoom') ? parseInt(searchParams.get('zoom')) : 5;
  const initialCity = searchParams.get('city') || 'Custom Location';

  const [activeLayer, setActiveLayer] = useState('rain'); // Default to rainfall so rain layers & legend are immediate
  
  const [stations, setStations] = useState(STATIONS);
  
  const foundStation = stations.find(s => Math.abs(s.lat - initialLat) < 0.1 && Math.abs(s.lng - initialLng) < 0.1);
  const [selectedStation, setSelectedStation] = useState(
    foundStation || {
      id: 'STN-CUSTOM',
      city: initialCity,
      state: 'Search Result',
      district: initialCity,
      lat: initialLat,
      lng: initialLng,
      temp: 0,
      rainfallToday: 0,
      windSpeed: 0,
      riskScore: 0,
      floodRisk: 'Low'
    }
  );
  
  const [mapCenter, setMapCenter] = useState([initialLat, initialLng]);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  
  const [liveWeather, setLiveWeather] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [showLiveRadar, setShowLiveRadar] = useState(true);
  const [radarTilePath, setRadarTilePath] = useState('');
  const [baseMap, setBaseMap] = useState('voyager'); // 'voyager', 'osm', 'dark'
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const currentLayerConfig = MAP_LAYERS[activeLayer];

  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=in`);
      if (geoRes.data && geoRes.data.length > 0) {
        const result = geoRes.data[0];
        const newId = `STN-${result.name.toUpperCase().replace(/\s/g, '')}-${Math.floor(Math.random()*1000)}`;
        
        const resLat = parseFloat(result.lat);
        const resLng = parseFloat(result.lon);
        
        // Fetch current live data for this new location to populate the marker properly
        let liveTemp = 0, liveRain = 0, liveWind = 0;
        try {
          const liveRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${resLat}&longitude=${resLng}&current=temperature_2m,precipitation,wind_speed_10m&timezone=auto`
          );
          if (liveRes.data && liveRes.data.current) {
            liveTemp = liveRes.data.current.temperature_2m;
            liveRain = liveRes.data.current.precipitation;
            liveWind = liveRes.data.current.wind_speed_10m;
          }
        } catch(e) { console.warn("Live fetch failed for searched location"); }

        const newStation = {
          id: newId,
          city: result.name,
          state: result.display_name.split(',').slice(-3, -2)[0]?.trim() || "India",
          district: result.name,
          lat: resLat,
          lng: resLng,
          temp: liveTemp,
          rainfallToday: liveRain,
          windSpeed: liveWind,
          riskScore: liveRain > 50 ? 80 : liveTemp > 40 ? 75 : 20,
          floodRisk: liveRain > 50 ? 'High' : 'Low',
          condition: "Live Data"
        };
        
        setStations([newStation, ...stations]);
        setSelectedStation(newStation);
        setSearchQuery('');
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Geocoding failed", error);
      alert("Search failed. Check your connection.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch real-time RainViewer radar tile path (free, no API key required)
  useEffect(() => {
    const fetchRadar = async () => {
      try {
        const res = await axios.get('https://api.rainviewer.com/public/weather-maps.json');
        if (res.data && res.data.radar && res.data.radar.past && res.data.radar.past.length > 0) {
          const latest = res.data.radar.past[res.data.radar.past.length - 1];
          setRadarTilePath(latest.path);
        }
      } catch (err) {
        console.warn('RainViewer radar fallback:', err);
        setRadarTilePath('/v2/radar/275af71ac72e');
      }
    };
    fetchRadar();
  }, []);

  // Fetch live telemetry for selected station from Open-Meteo
  const fetchLiveTelemetry = async (lat, lng) => {
    setLoadingLive(true);
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&timezone=auto`
      );
      if (res.data && res.data.current) {
        setLiveWeather(res.data.current);
      }
    } catch (err) {
      console.error('Error fetching live Open-Meteo data:', err);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    if (selectedStation) {
      fetchLiveTelemetry(selectedStation.lat, selectedStation.lng);
    }
  }, [selectedStation]);

  // Create custom marker pins for each station based on the active layer
  const createStationIcon = (station) => {
    let valueText = '';
    let badgeBg = '#1E3A8A';

    if (activeLayer === 'rain') {
      valueText = `${station.rainfallToday} mm`;
      badgeBg = station.rainfallToday > 40 ? '#1E3A8A' : station.rainfallToday > 20 ? '#2563EB' : station.rainfallToday > 5 ? '#0284C7' : '#64748B';
    } else if (activeLayer === 'temp') {
      valueText = `${station.temp}°C`;
      badgeBg = station.temp > 38 ? '#DC2626' : station.temp > 30 ? '#EA580C' : station.temp > 22 ? '#16A34A' : '#0284C7';
    } else if (activeLayer === 'wind') {
      valueText = `${station.windSpeed} km/h`;
      badgeBg = station.windSpeed > 20 ? '#7C3AED' : '#8B5CF6';
    } else if (activeLayer === 'risk') {
      valueText = `Risk ${station.riskScore}`;
      badgeBg = station.riskScore > 75 ? '#DC2626' : station.riskScore > 50 ? '#D97706' : '#16A34A';
    }

    const isSelected = selectedStation.id === station.id;

    return L.divIcon({
      className: 'station-pin-container',
      html: `
        <div style="
          background: ${isSelected ? '#FF9933' : badgeBg};
          color: #FFFFFF;
          padding: 3px 8px;
          border-radius: 9999px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid ${isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.85)'};
          transform: ${isSelected ? 'scale(1.12)' : 'scale(1)'};
          transition: all 0.2s ease;
          white-space: nowrap;
          cursor: pointer;
        ">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${isSelected ? '#0F2942' : '#FFFFFF'};"></span>
          <span>${station.city}</span>
          <span style="opacity: 0.9; font-weight: 800; background: rgba(0,0,0,0.25); padding: 1px 4px; border-radius: 4px;">${valueText}</span>
        </div>
      `,
      iconSize: [120, 28],
      iconAnchor: [60, 14]
    });
  };

  // Base map tile options
  const baseTiles = {
    voyager: {
      label: 'Google Map',
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
    },
    standard: {
      label: 'Satellite',
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
    },
    dark: {
      label: 'Dark Mode',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    }
  };

  return (
    <div className="relative h-[calc(100vh-135px)] w-full flex overflow-hidden bg-slate-950 font-sans">
      
      {/* Left Sidebar: Telemetry & Station Switcher */}
      <div className="w-[360px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live IMD Telemetry Feed
            </span>
            <button 
              onClick={() => fetchLiveTelemetry(selectedStation.lat, selectedStation.lng)}
              disabled={loadingLive}
              className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
              title="Refresh Live API Telemetry"
            >
              <RefreshCw size={14} className={loadingLive ? "animate-spin text-secondary" : ""} />
            </button>
          </div>
          <h2 className="text-xl font-bold m-0 text-white flex items-center gap-2">
            <MapPin size={20} className="text-secondary" /> {selectedStation.city}
          </h2>
          <p className="text-xs text-slate-300 m-0 mt-0.5">{selectedStation.district}, {selectedStation.state}</p>
        </div>

        {/* Station Weather Summary Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {liveWeather ? `${liveWeather.temperature_2m}°C` : `${selectedStation.temp}°C`}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                {selectedStation.condition}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Feels like {liveWeather ? `${liveWeather.apparent_temperature}°C` : `${selectedStation.feelsLike}°C`}
              </div>
            </div>

            {/* Weather Icon badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex flex-col items-center justify-center shadow-md">
              {activeLayer === 'rain' ? (
                <CloudRain size={28} className="animate-bounce" />
              ) : activeLayer === 'wind' ? (
                <Wind size={28} />
              ) : activeLayer === 'risk' ? (
                <ShieldAlert size={28} />
              ) : activeLayer === 'heatwave' ? (
                <Flame size={28} className="text-red-300" />
              ) : activeLayer === 'flood' ? (
                <Waves size={28} className="text-blue-200" />
              ) : activeLayer === 'waterlogging' ? (
                <CloudLightning size={28} className="text-purple-200" />
              ) : (
                <Thermometer size={28} />
              )}
              <span className="text-[9px] font-bold mt-1 uppercase tracking-wider truncate w-full text-center px-1">
                {activeLayer === 'waterlogging' ? 'WTR LOG' : activeLayer}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <BarChart3 size={13} /> Live Weather Measurements
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Rainfall Metric */}
            <div className={`p-2.5 rounded-xl border transition-all ${activeLayer === 'rain' ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Rainfall Today</span>
                <CloudRain size={13} className="text-sky-600" />
              </div>
              <div className="text-lg font-bold text-sky-900 mt-0.5">
                {selectedStation.rainfallToday} <span className="text-xs font-normal text-slate-500">mm</span>
              </div>
              <div className="text-[10px] text-sky-700 font-medium">
                {selectedStation.rainfallToday > 40 ? 'Heavy Rainfall Alert' : selectedStation.rainfallToday > 10 ? 'Moderate Rain' : 'Normal / Low'}
              </div>
            </div>

            {/* Temperature Metric */}
            <div className={`p-2.5 rounded-xl border transition-all ${activeLayer === 'temp' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Temperature</span>
                <Thermometer size={13} className="text-amber-600" />
              </div>
              <div className="text-lg font-bold text-amber-900 mt-0.5">
                {liveWeather ? `${liveWeather.temperature_2m}` : selectedStation.temp} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
              <div className="text-[10px] text-amber-700 font-medium">
                {selectedStation.temp > 38 ? 'Extreme Heat Warning' : 'Normal Range'}
              </div>
            </div>

            {/* Wind Speed Metric */}
            <div className={`p-2.5 rounded-xl border transition-all ${activeLayer === 'wind' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Wind Speed</span>
                <Wind size={13} className="text-purple-600" />
              </div>
              <div className="text-lg font-bold text-purple-900 mt-0.5">
                {liveWeather ? `${liveWeather.wind_speed_10m}` : selectedStation.windSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
              </div>
              <div className="text-[10px] text-purple-700 font-medium">Dir: {selectedStation.windDir}</div>
            </div>

            {/* Humidity Metric */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Humidity</span>
                <Waves size={13} className="text-blue-500" />
              </div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">
                {liveWeather ? `${liveWeather.relative_humidity_2m}` : selectedStation.humidity}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium">RH Saturation</div>
            </div>

            {/* Pressure Metric */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Pressure</span>
                <Compass size={13} className="text-slate-500" />
              </div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">
                {liveWeather ? Math.round(liveWeather.pressure_msl) : selectedStation.pressure} <span className="text-xs font-normal text-slate-500">hPa</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Mean Sea Level</div>
            </div>

            {/* Visibility Metric */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Visibility</span>
                <Eye size={13} className="text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">
                {selectedStation.visibility} <span className="text-xs font-normal text-slate-500">km</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">Atmospheric Sight</div>
            </div>
          </div>
        </div>

        {/* Regional Hazard Vulnerability Breakdown */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldAlert size={13} className="text-rose-600" /> Disaster Risk Assessment
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Waves size={13} className="text-blue-500" /> Flood Risk:
              </span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                selectedStation.floodRisk === 'Critical' ? 'bg-red-100 text-red-700' :
                selectedStation.floodRisk === 'High' ? 'bg-amber-100 text-amber-700' :
                selectedStation.floodRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedStation.floodRisk}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <CloudLightning size={13} className="text-amber-500" /> Cyclone Threat:
              </span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                selectedStation.cycloneRisk === 'Critical' ? 'bg-red-100 text-red-700' :
                selectedStation.cycloneRisk === 'High' ? 'bg-amber-100 text-amber-700' :
                selectedStation.cycloneRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedStation.cycloneRisk}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Flame size={13} className="text-red-500" /> Heatwave Alert:
              </span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                selectedStation.heatRisk === 'Critical' ? 'bg-red-100 text-red-700' :
                selectedStation.heatRisk === 'High' ? 'bg-amber-100 text-amber-700' :
                selectedStation.heatRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedStation.heatRisk}
              </span>
            </div>
          </div>
        </div>

        {/* National Weather Station Selector */}
        <div className="p-4 flex-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Select Weather Station ({STATIONS.length})
          </h3>
          <div className="space-y-1.5">
            {STATIONS.map((station) => {
              const isSelected = selectedStation.id === station.id;
              return (
                <button
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm ring-2 ring-secondary/50' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-secondary' : 'bg-slate-400'}`}></span>
                    <div>
                      <div className="font-semibold text-xs leading-tight">{station.city}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{station.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs">
                      {activeLayer === 'rain' ? `${station.rainfallToday} mm` :
                       activeLayer === 'temp' ? `${station.temp}°C` :
                       activeLayer === 'wind' ? `${station.windSpeed} km/h` :
                       activeLayer === 'heatwave' ? `${station.temp}°C` :
                       activeLayer === 'flood' ? station.floodRisk :
                       activeLayer === 'waterlogging' ? (station.rainfallToday > 40 ? 'High' : station.rainfallToday > 15 ? 'Moderate' : 'Low') :
                       `Risk ${station.riskScore}`}
                    </div>
                    <div className={`text-[9px] uppercase font-semibold ${
                      station.riskScore > 75 ? 'text-rose-400' :
                      station.riskScore > 50 ? 'text-amber-400' :
                      isSelected ? 'text-emerald-300' : 'text-emerald-600'
                    }`}>
                      {station.condition}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="flex-1 relative h-full">

        {/* Floating Layer Switch Toolbar (Top Left) */}
        <div className="absolute top-4 left-4 z-[1000] max-w-[calc(100%-320px)] xl:max-w-[800px] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
            <Layers size={14} className="text-secondary" /> Weather Layers:
          </span>

          {/* Rainfall Button */}
          <button
            id="btn-layer-rain"
            onClick={() => setActiveLayer('rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'rain'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 ring-2 ring-sky-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CloudRain size={15} />
            <span>Rainfall</span>
          </button>

          {/* Temperature Button */}
          <button
            id="btn-layer-temp"
            onClick={() => setActiveLayer('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'temp'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Thermometer size={15} />
            <span>Temperature</span>
          </button>

          {/* Wind Speed Button */}
          <button
            id="btn-layer-wind"
            onClick={() => setActiveLayer('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'wind'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Wind size={15} />
            <span>Wind Speed</span>
          </button>

          {/* Disaster Risk Button */}
          <button
            id="btn-layer-risk"
            onClick={() => setActiveLayer('risk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'risk'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldAlert size={15} />
            <span>Hazard Risk</span>
          </button>

          {/* Heatwave Button */}
          <button
            id="btn-layer-heatwave"
            onClick={() => setActiveLayer('heatwave')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'heatwave'
                ? 'bg-red-700 text-white shadow-lg shadow-red-700/30 ring-2 ring-red-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Flame size={15} />
            <span>Heatwave</span>
          </button>

          {/* Flood Button */}
          <button
            id="btn-layer-flood"
            onClick={() => setActiveLayer('flood')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'flood'
                ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30 ring-2 ring-blue-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Waves size={15} />
            <span>Flood Risk</span>
          </button>

          {/* Water Logging Button */}
          <button
            id="btn-layer-waterlogging"
            onClick={() => setActiveLayer('waterlogging')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'waterlogging'
                ? 'bg-purple-800 text-white shadow-lg shadow-purple-800/30 ring-2 ring-purple-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CloudLightning size={15} />
            <span>Water Logging</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-700 mx-1 hidden sm:block"></div>

          {/* Real-Time Doppler Radar Toggle */}
          <button
            id="btn-layer-radar"
            onClick={() => setShowLiveRadar(!showLiveRadar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showLiveRadar
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle Live RainViewer Radar Doppler overlay across India"
          >
            <Radar size={14} className={showLiveRadar ? "animate-spin" : ""} />
            <span>Live Radar {showLiveRadar ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Base Map Selector (Top Right) */}
        <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl flex items-center gap-1 text-xs">
          <span className="text-[10px] text-slate-400 font-bold px-2 uppercase">Base Map:</span>
          {Object.entries(baseTiles).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setBaseMap(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                baseMap === key
                  ? 'bg-secondary text-slate-900 font-bold shadow'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Global Map Search Bar */}
        <div className="absolute top-16 right-4 z-[1000]">
          <form onSubmit={handleMapSearch} className="relative w-64 shadow-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search any village/city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-secondary bg-slate-900/90 text-white backdrop-blur-md placeholder-slate-400"
            />
            <button 
              type="submit"
              disabled={searchLoading}
              className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600/90 text-white rounded-r-xl hover:bg-blue-500 transition-colors disabled:opacity-70"
            >
              {searchLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            </button>
          </form>
        </div>

        {/* Leaflet Map Canvas */}
        <MapContainer 
          center={[22.5937, 78.9629]} 
          zoom={5} 
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <SetViewOnClick coords={[selectedStation.lat, selectedStation.lng]} zoom={7} />

          {/* Base Map Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | IMD India Meteorological Department'
            url={baseTiles[baseMap].url}
            className="transition-all duration-1000"
          />

          {/* Live Doppler / Precipitation Radar Tiles (RainViewer - Free API) */}
          {showLiveRadar && radarTilePath && (
            <TileLayer
              url={`https://tilecache.rainviewer.com${radarTilePath}/512/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.6}
              zIndex={500}
              maxNativeZoom={12}
            />
          )}

          {/* Station Geographic Heatmap & Parameter Circles */}
          {stations.map((station) => {
            let val = station.rainfallToday;
            if (activeLayer === 'temp') val = station.temp;
            if (activeLayer === 'wind') val = station.windSpeed;
            if (activeLayer === 'risk') val = station.riskScore;
            if (activeLayer === 'heatwave') val = station.temp; // Heatwave uses temperature
            if (activeLayer === 'flood') val = station.floodRisk; // e.g., 'High', 'Moderate'
            if (activeLayer === 'waterlogging') {
              // Simulated water logging risk based on rain
              val = station.rainfallToday > 40 ? 'High' : station.rainfallToday > 15 ? 'Moderate' : 'Low';
            }

            const circleColor = currentLayerConfig.getColor(val);
            const radius = currentLayerConfig.getRadius(val);
            const isSelected = selectedStation.id === station.id;

            return (
              <Circle
                key={`circle-${activeLayer}-${station.id}`}
                center={[station.lat, station.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: circleColor,
                  fillOpacity: isSelected ? 0.48 : 0.32,
                  color: circleColor,
                  weight: isSelected ? 3 : 1.5,
                  opacity: 0.8
                }}
              />
            );
          })}

          {/* Station DivIcon Markers with Dynamic Badges */}
          {stations.map((station) => {
            return (
              <Marker
                key={`marker-${activeLayer}-${station.id}`}
                position={[station.lat, station.lng]}
                icon={createStationIcon(station)}
                eventHandlers={{
                  click: () => {
                    setSelectedStation(station);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px] font-sans text-slate-800">
                    <div className="flex items-center justify-between border-b pb-1 mb-1.5">
                      <h4 className="font-bold text-sm text-slate-900 m-0">{station.city}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{station.id}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">{station.district}, {station.state}</div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block font-bold">Rainfall</span>
                        <span className="font-extrabold text-sky-600">{station.rainfallToday} mm</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block font-bold">Temperature</span>
                        <span className="font-extrabold text-amber-600">{station.temp}°C</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block font-bold">Wind Speed</span>
                        <span className="font-extrabold text-purple-600">{station.windSpeed} km/h</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block font-bold">Hazard Risk</span>
                        <span className={`font-extrabold ${station.riskScore > 70 ? 'text-red-600' : 'text-emerald-600'}`}>{station.riskScore}/100</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Dynamic Parameter Legend (Bottom Right Floating) */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl max-w-sm text-white transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              {currentLayerConfig.label} Legend
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Unit: {currentLayerConfig.unit}</span>
          </div>

          <h4 className="font-bold text-sm text-white m-0 leading-snug">
            {currentLayerConfig.legendTitle}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-2.5 leading-normal">
            {currentLayerConfig.description}
          </p>

          {/* Continuous Gradient Bar */}
          <div className="space-y-1 mb-3">
            <div 
              className="h-2.5 w-full rounded-full shadow-inner border border-white/10"
              style={{ background: currentLayerConfig.scaleGradient }}
            ></div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Low Intensity</span>
              <span>Moderate</span>
              <span>Extreme Alert</span>
            </div>
          </div>

          {/* Discrete Range Keys */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800">
            {currentLayerConfig.legendSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm border border-white/20"
                  style={{ backgroundColor: step.color }}
                ></span>
                <div className="truncate">
                  <span className="font-semibold text-slate-200 text-[11px]">{step.label}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{step.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Radar Indicator status when active */}
          {showLiveRadar && (
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-emerald-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                RainViewer Live Doppler Radar: Active
              </span>
              <span className="text-slate-400">10-min scan</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MapViewer;
