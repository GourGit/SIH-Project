/* ==========================================================================
   National Weather Big Data Analytics Platform - Data Module
   Realistic sample weather intelligence, state/district hierarchy & alert feeds
   ========================================================================== */

const IndianWeatherStore = {
  // Global Meta
  meta: {
    lastUpdated: "12:30 PM IST | 11 Sep 2026",
    totalStations: 12450,
    operationalRate: 98.7,
    dailyRecords: "2.8 Billion",
    ingestionRate: "1.7 TB/hr",
    aiModelAccuracy: "92.4%"
  },

  // Ticker items
  tickerAlerts: [
    { type: "RED", text: "Cyclone Warning: Very Severe Cyclonic Storm 'Varun' approaching East Coast | Landfall expected within 18 hrs" },
    { type: "ORANGE", text: "Heavy Rainfall Alert: West Bengal & Odisha coast to receive 120-180mm rain in next 12 hrs" },
    { type: "YELLOW", text: "Heatwave Advisory: Western Rajasthan recording temperatures above 44°C" },
    { type: "GREEN", text: "Monsoon Update: Normal rainfall recorded across Western Ghats and Central India" }
  ],

  // Weather Stations Array across major Indian cities
  stations: [
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
      rainfallToday: 8.2,
      pressure: 1005.2,
      visibility: 6.0,
      condition: "Partly Cloudy",
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
      rainfallToday: 42.5,
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
      rainfallToday: 1.4,
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
      rainfallToday: 4.2,
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
      rainfallToday: 64.0,
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
      condition: "Sunny / Extreme Heat",
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
      rainfallToday: 28.4,
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
      rainfallToday: 12.0,
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
      rainfallToday: 38.6,
      pressure: 1009.1,
      visibility: 6.5,
      condition: "Scattered Rain",
      status: "online",
      riskScore: 58,
      floodRisk: "Moderate",
      cycloneRisk: "Moderate",
      heatRisk: "Low"
    }
  ],

  // Active Weather Alerts
  alerts: [
    {
      id: "ALT-2026-089",
      severity: "red",
      badge: "RED - CRITICAL",
      title: "Severe Cyclone Track Warning",
      location: "Bay of Bengal (West Bengal & Odisha Coasts)",
      expectedLandfall: "Next 18 Hours (12:00 AM IST)",
      windSpeed: "120 - 135 km/h",
      rainfallExpected: "150 - 250 mm",
      affectedPopulation: "4.2 Million",
      riskLevel: "Extremely High",
      description: "Severe Cyclonic Storm 'Varun' over Northwest Bay of Bengal moved north-northwestwards. Coastal districts of East Midnapore, South 24 Parganas, and Jagatsinghpur are under severe landfall threat.",
      recommendedActions: [
        "Immediate evacuation of coastal villages within 5 km of shoreline",
        "Suspend all fishing and port operations",
        "Disaster Management (NDRF & SDRF) teams on high alert"
      ]
    },
    {
      id: "ALT-2026-090",
      severity: "orange",
      badge: "ORANGE - SEVERE",
      title: "Extremely Heavy Rainfall & Flash Flood Alert",
      location: "Assam & Meghalaya Sub-Himalayan Region",
      expectedTime: "Next 24 Hours",
      rainfallExpected: "120 - 180 mm",
      affectedPopulation: "1.8 Million",
      riskLevel: "High",
      description: "Active monsoon trough causing intense cloud clusters. High risk of river level rise in Brahmaputra and tributary basins with localized flooding in low-lying urban areas.",
      recommendedActions: [
        "Avoid riverbank locations and storm drains",
        "District magistrates instructed to ready shelter homes",
        "Monitor live river gauge levels on the platform"
      ]
    },
    {
      id: "ALT-2026-091",
      severity: "yellow",
      badge: "YELLOW - MODERATE",
      title: "Heatwave & High Thermal Stress Warning",
      location: "Western Rajasthan (Jaisalmer, Bikaner, Barmer)",
      expectedTime: "Next 48 Hours",
      maxTemp: "44.5 °C - 46.0 °C",
      affectedPopulation: "850,000",
      riskLevel: "Moderate",
      description: "Strong dry westerly winds causing heatwave to severe heatwave conditions over desert districts. High UV index recorded.",
      recommendedActions: [
        "Avoid direct sunlight exposure between 11:00 AM and 4:00 PM",
        "Maintain hydration with ORS and water",
        "Deploy cooling shelters in public bus stands and markets"
      ]
    },
    {
      id: "ALT-2026-092",
      severity: "green",
      badge: "GREEN - ADVISORY",
      title: "Monsoon Rainfall Advisory for Farmers",
      location: "Central Maharashtra & Vidarbha",
      expectedTime: "Next 3-5 Days",
      rainfallExpected: "25 - 50 mm",
      riskLevel: "Low / Advisory",
      description: "Favorable rainfall distribution expected for Kharif crops. Soil moisture levels optimum for crop growth.",
      recommendedActions: [
        "Proceed with scheduled fertilizer application",
        "Ensure field drainage arrangements are in place"
      ]
    }
  ],

  // Historical Analytics (2010-2026)
  historicalTrends: {
    years: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026],
    avgTemp: [24.1, 24.3, 24.5, 24.8, 25.0, 25.2, 25.4, 25.6, 25.8],
    normalTemp: [24.0, 24.0, 24.0, 24.0, 24.0, 24.0, 24.0, 24.0, 24.0],
    annualRainfall: [1180, 1090, 1140, 1220, 1160, 1260, 1210, 1290, 1310],
    extremeEvents: [12, 15, 14, 19, 22, 26, 29, 31, 34]
  },

  // Monthly Rainfall Distribution
  monthlyRainfall: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    actual: [18.2, 21.4, 31.0, 45.6, 92.4, 185.0, 310.2, 275.4, 198.6, 82.0, 32.5, 14.8],
    normal: [16.0, 19.5, 28.0, 42.0, 88.0, 175.0, 290.0, 260.0, 180.0, 75.0, 28.0, 12.0]
  },

  // AI Prediction Cards Data
  aiPredictions: [
    {
      title: "Heavy Rainfall Prediction",
      region: "Gangetic West Bengal",
      probability: 87,
      confidence: 93,
      expectedWindow: "12 Hours",
      status: "High Alert",
      model: "DeepRain-ConvLSTM v4.2"
    },
    {
      title: "Cyclone Track Prediction",
      region: "Bay of Bengal (Puri to Sagar Island)",
      probability: 92,
      confidence: 95,
      expectedWindow: "18 Hours",
      status: "Critical Track",
      model: "VortexNet-GNN v3.1"
    },
    {
      title: "Flash Flood Risk Prediction",
      region: "Brahmaputra Valley, Assam",
      probability: 79,
      confidence: 88,
      expectedWindow: "24 Hours",
      status: "Moderate-High",
      model: "HydroAI-Transformer v2.8"
    },
    {
      title: "Heatwave Anomaly Prediction",
      region: "Western Rajasthan & Kutch",
      probability: 85,
      confidence: 91,
      expectedWindow: "48 Hours",
      status: "Severe Heat",
      model: "ThermalX-MLP v5.0"
    }
  ],

  // Official Reports
  reports: [
    {
      title: "National Monsoon Performance Report 2026",
      date: "01 Sep 2026",
      department: "India Meteorological Department (IMD)",
      type: "PDF",
      size: "4.8 MB"
    },
    {
      title: "Annual Big Data Analytics & Climate Extremes Assessment",
      date: "15 Aug 2026",
      department: "Ministry of Earth Sciences (MoES)",
      type: "PDF",
      size: "8.2 MB"
    },
    {
      title: "State-wise Flood Risk Vulnerability Index Q3 2026",
      date: "28 Jul 2026",
      department: "National Disaster Management Authority (NDMA)",
      type: "CSV / JSON",
      size: "1.5 MB"
    },
    {
      title: "AWS & Radar Observation Network Calibration Log",
      date: "10 Jun 2026",
      department: "National Weather Data Center",
      type: "PDF",
      size: "3.1 MB"
    }
  ],

  // Sample API Endpoints & Spec
  apiEndpoints: [
    {
      name: "Live Station Weather API",
      endpoint: "GET /api/v1/weather/live?station_id=STN-WB-01",
      description: "Returns real-time 1-minute ingested telemetry data from Automatic Weather Stations.",
      responseSnippet: `{
  "status": "success",
  "timestamp": "2026-09-11T12:30:00Z",
  "data": {
    "station_id": "STN-WB-01",
    "location": "Kolkata, WB",
    "temperature_c": 31.4,
    "humidity_pct": 78,
    "wind_speed_kmh": 14,
    "rainfall_today_mm": 8.2,
    "quality_flag": "PASSED_99.9%"
  }
}`
    },
    {
      name: "National Early Warning Alerts API",
      endpoint: "GET /api/v1/alerts/active?severity=red,orange",
      description: "Fetch live severe weather warnings and GIS polygon boundaries.",
      responseSnippet: `{
  "status": "success",
  "total_active_alerts": 23,
  "alerts": [
    {
      "alert_id": "ALT-2026-089",
      "severity": "RED",
      "title": "Severe Cyclone Warning",
      "affected_districts": ["East Midnapore", "South 24 Parganas"],
      "confidence": 0.95
    }
  ]
}`
    }
  ]
};
