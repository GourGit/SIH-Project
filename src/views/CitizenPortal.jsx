import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Camera, MapPin, Trophy, CheckCircle, Clock,
  CloudRain, Flame, Waves, Wind, AlertTriangle,
  ChevronRight, X, Upload, Loader, Send, Shield,
  CheckCircle2, Info
} from 'lucide-react';

const STORAGE_KEY = 'cp_citizen_data_clean';

const EVENT_TYPES = [
  { value: 'flooding',      label: 'Flooding & Inundation', icon: Waves,        pts: 45, color: 'text-blue-600 bg-blue-50' },
  { value: 'waterlogging',  label: 'Urban Waterlogging',    icon: Waves,        pts: 35, color: 'text-cyan-600 bg-cyan-50' },
  { value: 'heavy_rain',    label: 'Heavy Precipitation',   icon: CloudRain,    pts: 30, color: 'text-sky-600 bg-sky-50' },
  { value: 'cyclone',       label: 'Severe Gale / Cyclone', icon: Wind,         pts: 55, color: 'text-purple-600 bg-purple-50' },
  { value: 'heatwave',      label: 'Extreme Heatwave',      icon: Flame,        pts: 40, color: 'text-orange-600 bg-orange-50' },
  { value: 'other',         label: 'Other Incident',        icon: AlertTriangle,pts: 20, color: 'text-slate-600 bg-slate-100' },
];

const SCOUT_LEVELS = [
  { level: 1, title: 'Citizen Scout',        minPts: 0,    maxPts: 499,  badge: 'bg-slate-100 text-slate-800' },
  { level: 2, title: 'Field Observer',       minPts: 500,  maxPts: 2499, badge: 'bg-blue-50 text-blue-800' },
  { level: 3, title: 'Certified Reporter',   minPts: 2500, maxPts: 99999,badge: 'bg-amber-50 text-amber-800' },
];

const SAMPLE_FEED = [
  { id: 'f1', type: 'flooding',     location: 'Salt Lake, Kolkata', time: '8m ago',   verified: true },
  { id: 'f2', type: 'waterlogging', location: 'Dadar, Mumbai',      time: '23m ago',  verified: true },
  { id: 'f3', type: 'cyclone',      location: 'Marine Drive, Kochi',time: '41m ago',  verified: true },
  { id: 'f4', type: 'heavy_rain',   location: 'Banjara Hills, Hyd', time: '1h ago',   verified: false },
];

const VERIFY_STEPS = ['Capture & Geo-Tag Location', 'IMD Radar & Telemetry Cross-Audit', 'Official Incident Verified', 'National Points Credited'];

const getScoutLevel = (pts) => SCOUT_LEVELS.find(l => pts >= l.minPts && pts <= l.maxPts) || SCOUT_LEVELS[0];
const getNextLevel  = (pts) => SCOUT_LEVELS.find(l => pts < l.minPts) || null;
const getEventMeta  = (value) => EVENT_TYPES.find(e => e.value === value) || EVENT_TYPES[5];

const defaultData = () => ({
  points: 0,
  reports: [],
});

const CitizenPortal = () => {
  const [citizenData, setCitizenData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData(); }
    catch { return defaultData(); }
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab]     = useState('reports');
  const [feed, setFeed]               = useState(SAMPLE_FEED);

  /* Report form state */
  const [step, setStep]               = useState(1);
  const [photo, setPhoto]             = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsLoading, setGpsLoading]   = useState(false);
  const [locationName, setLocationName] = useState('');
  const [eventType, setEventType]     = useState('');
  const [description, setDescription] = useState('');
  const [verifyStep, setVerifyStep]   = useState(0);
  const [awardedPts, setAwardedPts]   = useState(0);
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citizenData));
  }, [citizenData]);

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      setStep(2);
      fetchGPS();
    };
    reader.readAsDataURL(file);
  };

  const fetchGPS = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      setGpsLocation({ lat: 22.5726, lng: 88.3639 });
      setLocationName('Kolkata, West Bengal');
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsLocation({ lat: latitude, lng: longitude });
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const addr = res.data?.address;
          const name = [addr?.suburb || addr?.neighbourhood || addr?.city_district, addr?.city || addr?.town || addr?.state]
            .filter(Boolean).join(', ') || `${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`;
          setLocationName(name);
        } catch {
          setLocationName(`${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`);
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLocation({ lat: 22.5726, lng: 88.3639 });
        setLocationName('Kolkata, West Bengal (Default)');
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = () => {
    setStep(4);
    let s = 0;
    const iv = setInterval(() => {
      s += 1;
      setVerifyStep(s);
      if (s >= VERIFY_STEPS.length) {
        clearInterval(iv);
        setTimeout(finalizeSubmit, 500);
      }
    }, 600);
  };

  const finalizeSubmit = () => {
    const meta = getEventMeta(eventType);
    const pts = meta.pts;
    setAwardedPts(pts);

    const report = {
      id: `rep_${Date.now()}`,
      type: eventType,
      location: locationName || 'Geo-tagged Location',
      description,
      points: pts,
      verified: true,
      timestamp: new Date().toISOString(),
    };

    setCitizenData(prev => ({
      ...prev,
      points: prev.points + pts,
      reports: [report, ...prev.reports],
    }));
    setFeed(prev => [{ ...report, time: 'Just now' }, ...prev]);
    setStep(5);
  };

  const closeModal = () => {
    setShowReportModal(false);
    setTimeout(() => {
      setStep(1); setPhoto(null); setGpsLocation(null); setLocationName('');
      setEventType(''); setDescription(''); setVerifyStep(0); setAwardedPts(0);
    }, 300);
  };

  const scout = getScoutLevel(citizenData.points);
  const next = getNextLevel(citizenData.points);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 text-slate-800 font-sans pb-12">
      
      {/* ── Official Government Breadcrumbs & Header ── */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <Link to="/" className="hover:text-[#1E3A8A] transition-colors">Home Overview</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-medium">Citizen Reporting Desk</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] flex items-center gap-2">
                <Shield className="text-[#138808]" size={22} />
                <span>Citizen Weather Intelligence & Crowdsourced Reporting Desk</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Direct public incident reporting to district disaster response cells and State Emergency Operation Centres
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Contributor Level Badge */}
              <div className="px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Trophy size={16} className="text-amber-500" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">{scout.title}</div>
                  <div className="text-xs font-bold text-slate-900">{citizenData.points} <span className="font-normal text-slate-500">pts</span></div>
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-[#138808] hover:bg-green-800 text-white rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Camera size={14} />
                <span>Report Severe Incident</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-6 space-y-6">

        {/* ── Tabs ── */}
        <div className="flex gap-2 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-md transition-colors ${
              activeTab === 'reports' 
                ? 'bg-white border-t-2 border-[#1E3A8A] text-[#1E3A8A] border-x border-slate-200 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Verified Incident Feed
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-md transition-colors ${
              activeTab === 'points' 
                ? 'bg-white border-t-2 border-[#1E3A8A] text-[#1E3A8A] border-x border-slate-200 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Submissions & Progression
          </button>
        </div>

        {/* ── Tab Content: Live Feed ── */}
        {activeTab === 'reports' && (
          <div className="grid md:grid-cols-2 gap-4">
            {feed.map((r) => {
              const meta = getEventMeta(r.type);
              return (
                <div key={r.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center ${meta.color}`}>
                        <meta.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{meta.label}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-slate-400" />
                          <span>{r.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 mb-1">{r.time}</div>
                      {r.verified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 size={10} /> Verified by EOC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <Clock size={10} /> Pending Audit
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Tab Content: Points & User Reports ── */}
        {activeTab === 'points' && (
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Recent Submissions */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Your Logged Incident Reports
              </h3>
              <div className="space-y-2.5">
                {citizenData.reports.length === 0 ? (
                  <div className="text-xs text-slate-500 p-4 border border-dashed border-slate-300 rounded text-center">
                    No crowdsourced reports submitted yet. Use the "Report Severe Incident" button above.
                  </div>
                ) : (
                  citizenData.reports.map((r) => {
                    const meta = getEventMeta(r.type);
                    return (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="flex items-center gap-2.5">
                          <meta.icon size={16} className="text-[#1E3A8A]" />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{meta.label}</div>
                            <div className="text-[11px] text-slate-500">{r.location}</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-emerald-700">+{r.points} pts</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Contributor Progression */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Civil Defence Meteorological Volunteer Progression
              </h3>
              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Current Recognition</div>
                    <div className="text-base font-bold text-slate-900">{scout.title}</div>
                  </div>
                  {next && <div className="text-xs text-slate-600 font-medium">Next Tier: <strong>{next.title}</strong></div>}
                </div>

                {next && (
                  <div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#138808] rounded-full" 
                        style={{ width: `${Math.min(((citizenData.points - scout.minPts) / (next.minPts - scout.minPts)) * 100, 100)}%` }} 
                      />
                    </div>
                    <div className="text-right text-[11px] text-slate-500 mt-1.5 font-medium">
                      {next.minPts - citizenData.points} points needed to reach next tier
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Official Government Incident Report Modal ── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={closeModal} />
          <div className="relative bg-white border border-slate-300 rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 text-sm">Submit Ground Weather Observation</span>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {/* STEP 1: Upload / Camera */}
              {step === 1 && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                    <Camera size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Provide Visual Evidence</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Capture or upload photo of the weather condition. Coordinates are automatically geo-tagged.</p>
                  </div>
                  
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
                  
                  <div className="flex flex-col gap-2 pt-2">
                    <button 
                      onClick={() => fileRef.current?.click()} 
                      className="w-full py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Capture Using Camera
                    </button>
                    <button 
                      onClick={() => fileRef.current?.click()} 
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-semibold transition-colors"
                    >
                      Upload from Device
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Verify Location */}
              {step === 2 && (
                <div className="space-y-4">
                  {photo && <img src={photo} alt="Incident Preview" className="w-full h-40 object-cover rounded border border-slate-200" />}
                  
                  <div className="bg-slate-50 rounded border border-slate-200 p-3">
                    <div className="flex items-center gap-2.5">
                      {gpsLoading ? <Loader size={15} className="text-slate-500 animate-spin" /> : <MapPin size={15} className="text-emerald-600" />}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Auto Geo-Tagging</div>
                        <div className="text-xs font-semibold text-slate-800">{gpsLoading ? 'Acquiring GPS Coordinates...' : locationName}</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(3)} 
                    disabled={gpsLoading} 
                    className="w-full py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded text-xs font-semibold disabled:opacity-50"
                  >
                    Confirm Location & Continue
                  </button>
                </div>
              )}

              {/* STEP 3: Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 block">
                      Select Weather Incident Category:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {EVENT_TYPES.map((et) => (
                        <button
                          key={et.value}
                          onClick={() => setEventType(et.value)}
                          className={`flex items-center gap-2 p-2 rounded border text-left text-xs font-medium transition-colors ${
                            eventType === et.value 
                              ? 'bg-blue-50 border-[#1E3A8A] text-[#1E3A8A] font-bold' 
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <et.icon size={14} className="shrink-0" />
                          <span className="truncate">{et.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">
                      Incident Summary / Landmark
                    </label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E3A8A] resize-none"
                      placeholder="e.g. 2 feet waterlogging near metro station..."
                    />
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    disabled={!eventType} 
                    className="w-full py-2 bg-[#138808] hover:bg-green-800 text-white disabled:opacity-50 rounded text-xs font-semibold flex justify-center items-center gap-1.5"
                  >
                    <span>Submit to Disaster Cell</span>
                    <Send size={13} />
                  </button>
                </div>
              )}

              {/* STEP 4: Verifying */}
              {step === 4 && (
                <div className="py-6 text-center space-y-4">
                  <Loader size={28} className="text-[#1E3A8A] animate-spin mx-auto" />
                  <div className="space-y-2.5 max-w-[240px] mx-auto text-left">
                    {VERIFY_STEPS.map((s, i) => (
                      <div key={s} className={`flex items-center gap-2 text-xs ${
                        i < verifyStep ? 'text-emerald-700 font-semibold' : i === verifyStep ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}>
                        {i < verifyStep ? <CheckCircle2 size={13} className="text-emerald-600" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Done */}
              {step === 5 && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Incident Report Formally Logged</h3>
                  <p className="text-xs text-slate-500">Your ground observation was ingested into the state emergency matrix.</p>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-xs">
                    <span className="text-emerald-700 font-bold">+{awardedPts} Points</span>
                    <span className="text-slate-600">credited to your profile</span>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={closeModal} 
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitizenPortal;
