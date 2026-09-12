/* ==========================================================================
   National Weather Big Data Analytics Platform - GIS Map Module
   Interactive Leaflet Map with weather layers, markers, popups & side panel binding
   ========================================================================== */

let mainGisMap = null;
let heroGisMap = null;
let stationMarkersGroup = null;
let heatLayerGroup = null;
let activeLayerType = 'temp'; // 'temp', 'rain', 'wind', 'risk', 'radar'

function initGisMaps() {
  // 1. Initialize Main Live Weather GIS Map
  const mapElement = document.getElementById('liveGisMap');
  if (!mapElement) return;

  // Center on India [22.5937, 78.9629]
  mainGisMap = L.map('liveGisMap', {
    center: [22.5937, 78.9629],
    zoom: 5,
    zoomControl: false,
    attributionControl: false
  });

  // Position zoom control on bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(mainGisMap);

  // CartoDB Dark Matter / Positron tile layer for high contrast government look
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(mainGisMap);

  // Groups for dynamic toggling
  stationMarkersGroup = L.layerGroup().addTo(mainGisMap);
  heatLayerGroup = L.layerGroup().addTo(mainGisMap);

  // Load weather stations onto map
  renderMapStations(IndianWeatherStore.stations);
  renderMapOverlays(activeLayerType);

  // Select first station (Kolkata) by default in sidebar
  if (IndianWeatherStore.stations.length > 0) {
    updateStationSidebar(IndianWeatherStore.stations[0]);
  }

  // 2. Initialize Hero Map Canvas (Simplified Map)
  const heroMapElem = document.getElementById('heroGisMap');
  if (heroMapElem) {
    heroGisMap = L.map('heroGisMap', {
      center: [22.5937, 78.9629],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(heroGisMap);

    // Add lightweight pulsing markers for major metros on hero map
    IndianWeatherStore.stations.forEach(stn => {
      const color = stn.riskScore > 75 ? '#EF4444' : stn.riskScore > 50 ? '#F59E0B' : '#10B981';
      const marker = L.circleMarker([stn.lat, stn.lng], {
        radius: 7,
        fillColor: color,
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(heroGisMap);

      marker.bindTooltip(`<b>${stn.city}</b>: ${stn.temp}°C | ${stn.condition}`, {
        permanent: false,
        direction: 'top'
      });
    });
  }
}

// Render Weather Station Markers
function renderMapStations(stations) {
  if (!stationMarkersGroup) return;
  stationMarkersGroup.clearLayers();

  stations.forEach(stn => {
    // Custom Icon or Circle Marker
    const isWarning = stn.status === 'warning';
    const markerColor = isWarning ? '#F59E0B' : '#1B365D';

    const customIcon = L.divIcon({
      className: 'custom-station-pin',
      html: `<div style="
        background: ${markerColor};
        color: #fff;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        border: 2px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;">
        <i class="fa-solid fa-location-dot" style="color:#FF9933"></i> ${stn.city} ${stn.temp}°
      </div>`,
      iconSize: [80, 24],
      iconAnchor: [40, 12]
    });

    const marker = L.marker([stn.lat, stn.lng], { icon: customIcon });

    // Popup Content
    const popupContent = `
      <div style="font-family: sans-serif; padding: 4px;">
        <h4 style="margin:0 0 4px 0; color:#0F2942;">${stn.city}, ${stn.state}</h4>
        <p style="margin:0; font-size:12px; color:#475569;">${stn.condition}</p>
        <hr style="margin:6px 0; border:none; border-top:1px solid #E2E8F0;"/>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12px;">
          <div><b>Temp:</b> ${stn.temp}°C</div>
          <div><b>Feels:</b> ${stn.feelsLike}°C</div>
          <div><b>Humidity:</b> ${stn.humidity}%</div>
          <div><b>Wind:</b> ${stn.windSpeed} km/h</div>
          <div><b>Rainfall:</b> ${stn.rainfallToday} mm</div>
          <div><b>Risk Index:</b> <span style="color:${stn.riskScore > 70 ? 'red' : 'green'}; font-weight:700;">${stn.riskScore}/100</span></div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    // On marker click, update sidebar
    marker.on('click', () => {
      updateStationSidebar(stn);
    });

    stationMarkersGroup.addLayer(marker);
  });
}

// Render Heat / Risk Overlays based on active layer
function renderMapOverlays(layerType) {
  if (!heatLayerGroup) return;
  heatLayerGroup.clearLayers();

  IndianWeatherStore.stations.forEach(stn => {
    let radius = 35;
    let color = '#3B82F6';
    let opacity = 0.35;

    if (layerType === 'temp') {
      color = stn.temp > 35 ? '#EF4444' : stn.temp > 30 ? '#F59E0B' : '#3B82F6';
      radius = Math.max(25, stn.temp * 1.5);
    } else if (layerType === 'rain') {
      color = stn.rainfallToday > 30 ? '#1D4ED8' : stn.rainfallToday > 10 ? '#60A5FA' : '#93C5FD';
      radius = Math.max(20, stn.rainfallToday * 1.2);
    } else if (layerType === 'wind') {
      color = '#8B5CF6';
      radius = Math.max(20, stn.windSpeed * 2);
    } else if (layerType === 'risk') {
      color = stn.riskScore > 75 ? '#DC2626' : stn.riskScore > 50 ? '#D97706' : '#16A34A';
      radius = stn.riskScore * 0.6;
      opacity = 0.45;
    }

    const circle = L.circle([stn.lat, stn.lng], {
      radius: radius * 1000,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 0.6,
      fillOpacity: opacity
    });

    heatLayerGroup.addLayer(circle);
  });
}

// Switch Active GIS Layer
function setGisLayer(layerType, btnElement) {
  activeLayerType = layerType;
  
  // Toggle UI active buttons
  document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  renderMapOverlays(layerType);

  // Update Legend text
  const legendLabel = document.getElementById('mapLegendLabel');
  if (legendLabel) {
    const labels = {
      temp: 'Temperature Spectrum (°C)',
      rain: '24h Rainfall Intensity (mm)',
      wind: 'Surface Wind Speed (km/h)',
      risk: 'Composite Extreme Weather Risk Index'
    };
    legendLabel.innerText = labels[layerType] || 'Weather Parameter Layer';
  }
}

// Update Station Side Panel UI
function updateStationSidebar(stn) {
  const panel = document.getElementById('stationDetailPanel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="station-detail-header">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="badge" style="background:#0F2942; color:#fff; padding:2px 8px; font-size:11px; border-radius:4px;">${stn.id}</span>
        <span class="status-pill ${stn.status}"><i class="fa-solid fa-circle" style="font-size:8px;"></i> ${stn.status.toUpperCase()}</span>
      </div>
      <h3 style="margin-top:6px;">${stn.city}</h3>
      <p style="color:var(--text-muted); font-size:0.85rem;">${stn.district}, ${stn.state}</p>
    </div>

    <div style="text-align:center; padding:1rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-color);">
      <div style="font-size:2.5rem; font-family:var(--font-heading); font-weight:700; color:var(--primary-navy);">
        ${stn.temp}°C
      </div>
      <div style="font-size:0.9rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">
        ${stn.condition}
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted);">
        Feels like ${stn.feelsLike}°C
      </div>
    </div>

    <div class="station-metrics-grid">
      <div class="metric-box">
        <div class="lbl">Humidity</div>
        <div class="val">${stn.humidity}%</div>
      </div>
      <div class="metric-box">
        <div class="lbl">Wind Speed</div>
        <div class="val">${stn.windSpeed} <span style="font-size:12px">km/h</span></div>
      </div>
      <div class="metric-box">
        <div class="lbl">Rainfall Today</div>
        <div class="val">${stn.rainfallToday} <span style="font-size:12px">mm</span></div>
      </div>
      <div class="metric-box">
        <div class="lbl">Pressure</div>
        <div class="val">${stn.pressure} <span style="font-size:12px">hPa</span></div>
      </div>
      <div class="metric-box">
        <div class="lbl">Visibility</div>
        <div class="val">${stn.visibility} <span style="font-size:12px">km</span></div>
      </div>
      <div class="metric-box">
        <div class="lbl">Wind Dir</div>
        <div class="val">${stn.windDir}</div>
      </div>
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem;">
      <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">
        Regional Vulnerability Breakdown
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
        <span>Flood Vulnerability:</span>
        <span style="font-weight:700; color:${stn.floodRisk === 'Critical' || stn.floodRisk === 'High' ? 'red' : 'green'}">${stn.floodRisk}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
        <span>Cyclone Vulnerability:</span>
        <span style="font-weight:700; color:${stn.cycloneRisk === 'High' || stn.cycloneRisk === 'Critical' ? 'red' : 'green'}">${stn.cycloneRisk}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
        <span>Heatwave Vulnerability:</span>
        <span style="font-weight:700; color:${stn.heatRisk === 'Critical' || stn.heatRisk === 'High' ? 'orange' : 'green'}">${stn.heatRisk}</span>
      </div>
    </div>

    <button class="btn btn-primary" style="width:100%; justify-content:center;" onclick="viewDistrictAnalytics('${stn.state}', '${stn.city}')">
      <i class="fa-solid fa-chart-line"></i> View District Analytics
    </button>
  `;
}
