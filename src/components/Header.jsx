import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { 
  Clock, Search, Shield, Lock, 
  Volume2, AlertTriangle, ChevronRight, Bell
} from 'lucide-react';

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'small'
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/live?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFontSize = (size) => {
    setFontSize(size);
    if (size === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else if (size === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  };

  const formattedDate = time.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* 1. TOP OFFICIAL GOVERNMENT UTILITY BAR */}
      <div className="bg-[#0F2942] text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Left: Ministry Identification */}
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="font-semibold tracking-wide text-slate-100">
              Government of India
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              Ministry of Earth Sciences (MoES)
            </span>
          </div>

          {/* Right: Date, Time, Accessibility Tools */}
          <div className="flex items-center space-x-3 text-slate-300">
            {/* Live IST Time */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700 font-mono text-[11px]">
              <Clock size={11} className="text-orange-400" />
              <span>{formattedDate} | {formattedTime} IST</span>
            </div>

            {/* Screen Reader Access */}
            <button 
              className="hover:text-white transition-colors hidden md:flex items-center gap-1 text-[11px]" 
              title="Screen Reader Access"
            >
              <Volume2 size={12} />
              <span>Screen Reader</span>
            </button>

            {/* Font Sizing Controls */}
            <div className="flex items-center space-x-1 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700 text-[11px] font-bold">
              <button 
                onClick={() => handleFontSize('small')} 
                className={`px-1 hover:text-white ${fontSize === 'small' ? 'text-orange-400' : ''}`}
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-slate-600">|</span>
              <button 
                onClick={() => handleFontSize('normal')} 
                className={`px-1 hover:text-white ${fontSize === 'normal' ? 'text-orange-400' : ''}`}
                title="Normal font size"
              >
                A
              </button>
              <span className="text-slate-600">|</span>
              <button 
                onClick={() => handleFontSize('large')} 
                className={`px-1 hover:text-white ${fontSize === 'large' ? 'text-orange-400' : ''}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Hidden Google Translate Widget (Must remain in DOM and not be display:none) */}
            <div id="google_translate_element" style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, zIndex: -1 }}></div>
            
            {/* Custom Language Selector */}
            <select 
              defaultValue={() => {
                // Try to extract language from googtrans cookie
                const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
                return match ? match[1] : 'en';
              }}
              onChange={(e) => {
                const lang = e.target.value;
                
                // 1. First, try the seamless DOM approach (works if Google Translate fully initialized)
                const gtSelect = document.querySelector('.goog-te-combo');
                if (gtSelect) {
                  gtSelect.value = lang;
                  gtSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                }

                // 2. Set the official Google Translate cookie as a highly reliable fallback
                // This ensures that even on a fresh load or navigation, the language is preserved.
                document.cookie = `googtrans=/en/${lang}; path=/`;
                if (window.location.hostname !== 'localhost') {
                  document.cookie = `googtrans=/en/${lang}; domain=.${window.location.hostname}; path=/`;
                }

                // 3. Force a reload to guarantee the translation applies if the DOM method failed
                // Give the DOM method a tiny fraction of a second to work first.
                setTimeout(() => {
                   window.location.reload();
                }, 300);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-slate-600 min-w-[90px]"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="ur">اردو</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="or">ଓଡ଼ିଆ</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. MAIN NATIONAL BRANDING HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Portal Title */}
        <div className="flex items-center space-x-4 text-center md:text-left">
          <Link to="/" className="shrink-0 flex items-center">
            <img 
              src={logo} 
              alt="National Weather Big Data Analytics Platform Emblem" 
              className="h-14 sm:h-16 w-14 sm:w-16 object-contain rounded-lg border border-slate-200 shadow-sm p-0.5 bg-white" 
            />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] m-0 leading-tight tracking-tight">
              National Weather Big Data Analytics Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium m-0 mt-0.5 flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
              <span>National Weather Intelligence & Early Warning Portal</span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                Smart India Hackathon (SIH 2026)
              </span>
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
          {/* Quick Station/District Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search station or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </form>

          {/* Citizen Portal Quick Link */}
          <Link 
            to="/citizen" 
            className="flex items-center space-x-1.5 bg-[#138808] hover:bg-green-800 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all"
          >
            <Shield size={14} />
            <span>Citizen Portal</span>
          </Link>

          {/* Gov Admin Badge */}
          <div className="flex items-center space-x-1.5 border border-slate-300 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md text-xs font-semibold">
            <Lock size={13} className="text-slate-500" />
            <span>Gov Access</span>
          </div>
        </div>
      </div>

      {/* 3. AUTHENTIC INDIAN TRICOLOR RIBBON */}
      <div className="tricolor-ribbon"></div>

      {/* 4. ACTIVE WEATHER BULLETINS TICKER */}
      <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 flex items-stretch overflow-hidden">
        {/* Ticker Label */}
        <div className="bg-red-700 text-white font-bold px-3 py-1.5 flex items-center gap-1.5 shrink-0 uppercase tracking-wider text-[11px] shadow-sm z-10">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>Active Warnings</span>
        </div>

        {/* Ticker Content */}
        <div className="relative flex-1 overflow-hidden py-1.5 flex items-center">
          <div className="animate-ticker text-xs flex items-center space-x-8 text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 text-[10px] rounded">RED</span>
              <strong className="text-white">Severe Cyclone Tracking:</strong> Active monitoring in Bay of Bengal. Coastal alerts active for Odisha & Andhra Pradesh.
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 text-[10px] rounded">ORANGE</span>
              <strong className="text-white">Heavy Precipitation:</strong> Flash flood risk in Assam, Meghalaya, and Sub-Himalayan West Bengal.
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-yellow-400 text-slate-950 font-bold px-1.5 py-0.2 text-[10px] rounded">YELLOW</span>
              <strong className="text-white">Heatwave Advisory:</strong> High temperature anomaly recorded across Western Rajasthan (Bikaner, Jaisalmer).
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.2 text-[10px] rounded">GREEN</span>
              <strong className="text-white">Monsoon Telemetry:</strong> Normal synoptic conditions reported across Central & Peninsular India.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
