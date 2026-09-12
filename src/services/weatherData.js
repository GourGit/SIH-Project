/* ==========================================================================
   National Weather Big Data Analytics Platform - Weather Data Service
   Indian National Meteorological Stations & Telemetry Configuration
   ========================================================================== */

export const STATIONS = [
  {
    id: "STN-WB-01",
    city: "Kolkata",
    state: "West Bengal",
    district: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    temp: 31.4,
    feelsLike: 35.2,
    humidity: 78,
    windSpeed: 14,
    windDir: "ESE",
    rainfallToday: 24.5,
    pressure: 1005.2,
    visibility: 6.0,
    condition: "Passing Showers",
    status: "online",
    riskScore: 68,
    floodRisk: "High",
    cycloneRisk: "Moderate",
    heatRisk: "Low"
  },
  {
    id: "STN-DL-01",
    city: "New Delhi",
    state: "Delhi",
    district: "New Delhi",
    lat: 28.6139,
    lng: 77.2090,
    temp: 36.8,
    feelsLike: 39.5,
    humidity: 52,
    windSpeed: 18,
    windDir: "WNW",
    rainfallToday: 0.0,
    pressure: 1002.1,
    visibility: 4.5,
    condition: "Hazy Sun",
    status: "online",
    riskScore: 54,
    floodRisk: "Low",
    cycloneRisk: "None",
    heatRisk: "High"
  },
  {
    id: "STN-MH-01",
    city: "Mumbai",
    state: "Maharashtra",
    district: "Mumbai City",
    lat: 19.0760,
    lng: 72.8777,
    temp: 29.8,
    feelsLike: 34.0,
    humidity: 84,
    windSpeed: 22,
    windDir: "SW",
    rainfallToday: 58.2,
    pressure: 1007.5,
    visibility: 5.0,
    condition: "Heavy Rain",
    status: "online",
    riskScore: 76,
    floodRisk: "High",
    cycloneRisk: "High",
    heatRisk: "Low"
  },
  {
    id: "STN-TN-01",
    city: "Chennai",
    state: "Tamil Nadu",
    district: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    temp: 33.2,
    feelsLike: 38.1,
    humidity: 74,
    windSpeed: 16,
    windDir: "NE",
    rainfallToday: 4.4,
    pressure: 1008.0,
    visibility: 7.0,
    condition: "Passing Showers",
    status: "online",
    riskScore: 62,
    floodRisk: "Moderate",
    cycloneRisk: "High",
    heatRisk: "Moderate"
  },
  {
    id: "STN-KA-01",
    city: "Bengaluru",
    state: "Karnataka",
    district: "Bengaluru Urban",
    lat: 12.9716,
    lng: 77.5946,
    temp: 26.5,
    feelsLike: 27.2,
    humidity: 68,
    windSpeed: 15,
    windDir: "WSW",
    rainfallToday: 8.2,
    pressure: 1012.4,
    visibility: 8.0,
    condition: "Overcast",
    status: "online",
    riskScore: 32,
    floodRisk: "Low",
    cycloneRisk: "None",
    heatRisk: "Low"
  },
  {
    id: "STN-AS-01",
    city: "Guwahati",
    state: "Assam",
    district: "Kamrup Metropolitan",
    lat: 26.1445,
    lng: 91.7362,
    temp: 28.4,
    feelsLike: 32.8,
    humidity: 88,
    windSpeed: 10,
    windDir: "S",
    rainfallToday: 72.0,
    pressure: 1004.8,
    visibility: 4.0,
    condition: "Thunderstorm",
    status: "online",
    riskScore: 82,
    floodRisk: "Critical",
    cycloneRisk: "Low",
    heatRisk: "Low"
  },
  {
    id: "STN-RJ-01",
    city: "Jaipur",
    state: "Rajasthan",
    district: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    temp: 41.2,
    feelsLike: 44.0,
    humidity: 28,
    windSpeed: 20,
    windDir: "NW",
    rainfallToday: 0.0,
    pressure: 998.6,
    visibility: 6.0,
    condition: "Extreme Heat",
    status: "online",
    riskScore: 71,
    floodRisk: "None",
    cycloneRisk: "None",
    heatRisk: "Critical"
  },
  {
    id: "STN-OR-01",
    city: "Bhubaneswar",
    state: "Odisha",
    district: "Khurda",
    lat: 20.2961,
    lng: 85.8245,
    temp: 32.0,
    feelsLike: 37.5,
    humidity: 82,
    windSpeed: 25,
    windDir: "E",
    rainfallToday: 34.6,
    pressure: 1003.5,
    visibility: 5.5,
    condition: "Heavy Rain / Wind",
    status: "warning",
    riskScore: 79,
    floodRisk: "High",
    cycloneRisk: "Critical",
    heatRisk: "Low"
  },
  {
    id: "STN-HP-01",
    city: "Shimla",
    state: "Himachal Pradesh",
    district: "Shimla",
    lat: 31.1048,
    lng: 77.1734,
    temp: 18.2,
    feelsLike: 18.2,
    humidity: 70,
    windSpeed: 12,
    windDir: "NNE",
    rainfallToday: 15.0,
    pressure: 1018.2,
    visibility: 9.0,
    condition: "Light Rain",
    status: "online",
    riskScore: 45,
    floodRisk: "Moderate",
    cycloneRisk: "None",
    heatRisk: "Low"
  },
  {
    id: "STN-KL-01",
    city: "Thiruvananthapuram",
    state: "Kerala",
    district: "Thiruvananthapuram",
    lat: 8.5241,
    lng: 76.9366,
    temp: 29.1,
    feelsLike: 33.5,
    humidity: 85,
    windSpeed: 19,
    windDir: "SSW",
    rainfallToday: 41.2,
    pressure: 1009.1,
    visibility: 6.5,
    condition: "Scattered Rain",
    status: "online",
    riskScore: 58,
    floodRisk: "Moderate",
    cycloneRisk: "Moderate",
    heatRisk: "Low"
  }
];

export const MAP_LAYERS = {
  rain: {
    id: 'rain',
    label: 'Rainfall Intensity',
    icon: 'CloudRain',
    unit: 'mm',
    legendTitle: '24-Hour Rainfall Intensity (mm)',
    description: 'Precipitation telemetry across weather radar & ground stations',
    scaleGradient: 'linear-gradient(90deg, #E0F2FE 0%, #38BDF8 30%, #2563EB 65%, #1E3A8A 100%)',
    legendSteps: [
      { label: '0 mm (Dry)', color: '#E2E8F0', text: 'No Rain' },
      { label: '1-10 mm', color: '#7DD3FC', text: 'Light Showers' },
      { label: '10-30 mm', color: '#38BDF8', text: 'Moderate' },
      { label: '30-60 mm', color: '#2563EB', text: 'Heavy Rain' },
      { label: '> 60 mm', color: '#1E3A8A', text: 'Flash Flood / Downpour' }
    ],
    getColor: (val) => {
      if (val > 60) return '#1E3A8A';
      if (val > 30) return '#2563EB';
      if (val > 10) return '#38BDF8';
      if (val > 0) return '#7DD3FC';
      return '#CBD5E1';
    },
    getRadius: (val) => Math.max(35000, val * 1800)
  },
  temp: {
    id: 'temp',
    label: 'Temperature',
    icon: 'Thermometer',
    unit: '°C',
    legendTitle: 'Temperature Spectrum (°C)',
    description: 'Ambient surface thermal telemetry from national grid',
    scaleGradient: 'linear-gradient(90deg, #38BDF8 0%, #10B981 30%, #F59E0B 65%, #DC2626 100%)',
    legendSteps: [
      { label: '< 20°C', color: '#38BDF8', text: 'Cool / Mild' },
      { label: '20 - 28°C', color: '#10B981', text: 'Pleasant' },
      { label: '28 - 36°C', color: '#F59E0B', text: 'Warm / High' },
      { label: '> 36°C', color: '#DC2626', text: 'Severe Heatwave' }
    ],
    getColor: (val) => {
      if (val > 36) return '#DC2626';
      if (val > 28) return '#F59E0B';
      if (val > 20) return '#10B981';
      return '#38BDF8';
    },
    getRadius: (val) => Math.max(35000, val * 2200)
  },
  wind: {
    id: 'wind',
    label: 'Wind Speed',
    icon: 'Wind',
    unit: 'km/h',
    legendTitle: 'Surface Wind Velocity (km/h)',
    description: 'Ground anemometer readings & gust telemetry',
    scaleGradient: 'linear-gradient(90deg, #DDD6FE 0%, #A78BFA 40%, #7C3AED 75%, #4C1D95 100%)',
    legendSteps: [
      { label: '< 15 km/h', color: '#DDD6FE', text: 'Light Breeze' },
      { label: '15 - 22 km/h', color: '#A78BFA', text: 'Moderate Wind' },
      { label: '> 22 km/h', color: '#7C3AED', text: 'High Gust / Gale' }
    ],
    getColor: (val) => {
      if (val > 22) return '#7C3AED';
      if (val > 15) return '#A78BFA';
      return '#DDD6FE';
    },
    getRadius: (val) => Math.max(35000, val * 3500)
  },
  risk: {
    id: 'risk',
    label: 'Hazard Risk',
    icon: 'ShieldAlert',
    unit: '/100',
    legendTitle: 'Composite Disaster Risk Index (0-100)',
    description: 'Integrated multi-hazard early warning index (NDMA)',
    scaleGradient: 'linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #DC2626 100%)',
    legendSteps: [
      { label: '< 50', color: '#10B981', text: 'Low / Normal' },
      { label: '50 - 75', color: '#F59E0B', text: 'Moderate Advisory' },
      { label: '> 75', color: '#DC2626', text: 'Critical Emergency' }
    ],
    getColor: (val) => {
      if (val > 75) return '#DC2626';
      if (val > 50) return '#F59E0B';
      return '#10B981';
    },
    getRadius: (val) => Math.max(35000, val * 1200)
  },
  heatwave: {
    id: 'heatwave',
    label: 'Heatwave Risk',
    icon: 'Flame',
    unit: '°C',
    legendTitle: 'Severe Heatwave Warning Zones',
    description: 'High-risk zones exceeding normal temperature thresholds',
    scaleGradient: 'linear-gradient(90deg, #FDBA74 0%, #EA580C 50%, #7F1D1D 100%)',
    legendSteps: [
      { label: '< 38°C', color: '#FDBA74', text: 'Watch' },
      { label: '38 - 42°C', color: '#EA580C', text: 'Warning' },
      { label: '> 42°C', color: '#7F1D1D', text: 'Severe Heatwave' }
    ],
    getColor: (val) => {
      if (val > 42) return '#7F1D1D';
      if (val > 38) return '#EA580C';
      return '#FDBA74';
    },
    getRadius: (val) => Math.max(40000, val * 2000)
  },
  flood: {
    id: 'flood',
    label: 'Flood Prone',
    icon: 'Waves',
    unit: 'Risk Level',
    legendTitle: 'River & Coastal Flood Prone Zones',
    description: 'Simulated inundation risk levels based on topography',
    scaleGradient: 'linear-gradient(90deg, #93C5FD 0%, #2563EB 50%, #1E3A8A 100%)',
    legendSteps: [
      { label: 'Low', color: '#93C5FD', text: 'Safe' },
      { label: 'Moderate', color: '#2563EB', text: 'Alert' },
      { label: 'High', color: '#1E3A8A', text: 'Inundation Risk' }
    ],
    getColor: (val) => {
      if (val === 'High') return '#1E3A8A';
      if (val === 'Moderate') return '#2563EB';
      return '#93C5FD';
    },
    getRadius: (val) => val === 'High' ? 100000 : val === 'Moderate' ? 70000 : 40000
  },
  waterlogging: {
    id: 'waterlogging',
    label: 'Water Logging',
    icon: 'CloudLightning',
    unit: 'Risk Level',
    legendTitle: 'Urban Water Logging Risk',
    description: 'Simulated drainage & depression pooling zones',
    scaleGradient: 'linear-gradient(90deg, #A78BFA 0%, #6D28D9 50%, #4C1D95 100%)',
    legendSteps: [
      { label: 'Low', color: '#A78BFA', text: 'Clear' },
      { label: 'Moderate', color: '#6D28D9', text: 'Pooling' },
      { label: 'High', color: '#4C1D95', text: 'Severe Logging' }
    ],
    getColor: (val) => {
      if (val === 'High') return '#4C1D95';
      if (val === 'Moderate') return '#6D28D9';
      return '#A78BFA';
    },
    getRadius: (val) => val === 'High' ? 80000 : val === 'Moderate' ? 50000 : 30000
  }
};

