/* ==========================================================================
   National Weather Big Data Analytics Platform - Application Controller
   View Router, Dynamic State/District Filter, Language Switcher & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAppRouter();
  initGisMaps();
  initCharts();
  initSatelliteStudio();
  initAlertFilters();
  initDistrictDropdowns();
  renderStationTable(IndianWeatherStore.stations);
});

// 1. Single Page View Router
function initAppRouter() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  // Handle click on navigation items
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });

  // Check URL Hash on load
  const initialHash = window.location.hash.replace('#', '') || 'home';
  switchView(initialHash);
}

function switchView(viewId) {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  let activeFound = false;

  viewSections.forEach(section => {
    if (section.id === `view-${viewId}`) {
      section.classList.add('active');
      activeFound = true;
    } else {
      section.classList.remove('active');
    }
  });

  if (!activeFound) {
    document.getElementById('view-home')?.classList.add('active');
    viewId = 'home';
  }

  // Update Nav items UI
  navItems.forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  window.location.hash = viewId;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger leaflet resize when switching to live map view
  if (viewId === 'live-weather' || viewId === 'gismap') {
    setTimeout(() => {
      if (mainGisMap) mainGisMap.invalidateSize();
    }, 200);
  }

  // Trigger satellite canvas resize
  if (viewId === 'satellite') {
    setTimeout(() => {
      resizeSatCanvas();
    }, 200);
  }
}

// 2. Early Warning Severity Alert Filters
function initAlertFilters() {
  const alertTabs = document.querySelectorAll('.severity-tab');
  alertTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      alertTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterSeverity = tab.getAttribute('data-severity');
      filterAlertCards(filterSeverity);
    });
  });
}

function filterAlertCards(severity) {
  const alertCards = document.querySelectorAll('.alert-card');
  alertCards.forEach(card => {
    if (severity === 'all' || card.getAttribute('data-severity') === severity) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// 3. State & District Dynamic Dropdowns
const stateDistrictMap = {
  "West Bengal": ["Kolkata", "East Midnapore", "South 24 Parganas", "Darjeeling", "Howrah", "Hooghly"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  "Maharashtra": ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Kanchipuram"],
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Dakshina Kannada", "Belagavi"],
  "Assam": ["Kamrup Metropolitan", "Cachar", "Dibrugarh", "Jorhat"],
  "Rajasthan": ["Jaipur", "Jaisalmer", "Bikaner", "Jodhpur", "Udaipur"],
  "Odisha": ["Khurda", "Puri", "Cuttack", "Balasore", "Ganjam"],
  "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Wayanad"]
};

function initDistrictDropdowns() {
  const stateSelect = document.getElementById('selectState');
  const districtSelect = document.getElementById('selectDistrict');

  if (!stateSelect || !districtSelect) return;

  // Populate States
  stateSelect.innerHTML = Object.keys(stateDistrictMap).map(st => `<option value="${st}">${st}</option>`).join('');

  stateSelect.addEventListener('change', () => {
    updateDistrictOptions(stateSelect.value);
    triggerDistrictAnalyticsUpdate();
  });

  districtSelect.addEventListener('change', () => {
    triggerDistrictAnalyticsUpdate();
  });

  updateDistrictOptions(stateSelect.value);
  triggerDistrictAnalyticsUpdate();
}

function updateDistrictOptions(stateName) {
  const districtSelect = document.getElementById('selectDistrict');
  if (!districtSelect) return;

  const districts = stateDistrictMap[stateName] || ["Central"];
  districtSelect.innerHTML = districts.map(dt => `<option value="${dt}">${dt}</option>`).join('');
}

function triggerDistrictAnalyticsUpdate() {
  const state = document.getElementById('selectState')?.value || "West Bengal";
  const district = document.getElementById('selectDistrict')?.value || "Kolkata";

  const nameElem = document.getElementById('districtAnalyticsName');
  if (nameElem) nameElem.innerText = `${district}, ${state}`;

  // Find matching station or generate mock values
  const matchedStn = IndianWeatherStore.stations.find(s => s.state === state) || IndianWeatherStore.stations[0];

  const scoreVal = document.getElementById('districtRiskScoreVal');
  if (scoreVal) scoreVal.innerText = `${matchedStn.riskScore} / 100`;

  // Render Risk Radar Chart
  renderDistrictRiskChart([matchedStn.riskScore, matchedStn.riskScore - 10, matchedStn.riskScore + 5, 30, 45]);
}

function viewDistrictAnalytics(state, city) {
  switchView('state-district');
  const stateSelect = document.getElementById('selectState');
  if (stateSelect) {
    stateSelect.value = state;
    updateDistrictOptions(state);
    const districtSelect = document.getElementById('selectDistrict');
    if (districtSelect) districtSelect.value = city;
    triggerDistrictAnalyticsUpdate();
  }
}

// 4. Station Table Rendering & Search
function renderStationTable(stations) {
  const tableBody = document.getElementById('stationTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = stations.map(stn => `
    <tr>
      <td><b>${stn.id}</b></td>
      <td><b>${stn.city}</b> (${stn.state})</td>
      <td>${stn.temp}°C</td>
      <td>${stn.rainfallToday} mm</td>
      <td>${stn.humidity}%</td>
      <td><span class="status-pill ${stn.status}"><i class="fa-solid fa-circle" style="font-size:8px;"></i> ${stn.status.toUpperCase()}</span></td>
      <td>12:30 PM IST</td>
    </tr>
  `).join('');
}

function filterStationTable() {
  const query = document.getElementById('stationSearchInput')?.value.toLowerCase() || '';
  const filtered = IndianWeatherStore.stations.filter(s => 
    s.city.toLowerCase().includes(query) || 
    s.state.toLowerCase().includes(query) || 
    s.id.toLowerCase().includes(query)
  );
  renderStationTable(filtered);
}

// 5. Open API Utilities
function copyApiSnippet(index) {
  const snippet = IndianWeatherStore.apiEndpoints[index]?.responseSnippet || '';
  navigator.clipboard.writeText(snippet).then(() => {
    alert('API Response Sample copied to clipboard!');
  }).catch(() => {
    alert('Copied sample response!');
  });
}

function generateApiKey() {
  const key = 'gov_sih_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const disp = document.getElementById('generatedKeyDisplay');
  if (disp) {
    disp.value = key;
    disp.parentElement.style.display = 'block';
  }
}

// 6. Report Downloads
function downloadReport(title, format) {
  alert(`Initiating secure official government download for:\n\n"${title}"\nFormat: ${format.toUpperCase()}\n\nDownload starting automatically...`);
}

// 7. Login & Modal Controls
function openModal(modalId) {
  document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

// 8. Accessibility Controls
function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
}

function changeFontSize(action) {
  document.body.classList.remove('font-lg', 'font-sm');
  if (action === 'up') document.body.classList.add('font-lg');
  if (action === 'down') document.body.classList.add('font-sm');
}

// 9. Language Switcher Simulation
const langStrings = {
  hi: {
    title: "राष्ट्रीय मौसम बिग डेटा एनालिटिक्स प्लेटफॉर्म",
    subtitle: "भारत सरकार | पृथ्वी विज्ञान मंत्रालय"
  },
  bn: {
    title: "জাতীয় আবহাওয়া বিগ ডাটা অ্যানালিটিক্স প্ল্যাটফর্ম",
    subtitle: "ভারত সরকার | ভূ-বিজ্ঞান মন্ত্রক"
  },
  en: {
    title: "National Weather Big Data Analytics Platform",
    subtitle: "Government of India | Ministry of Earth Sciences"
  }
};

function changeLanguage(lang) {
  const strings = langStrings[lang] || langStrings['en'];
  const titleElem = document.getElementById('headerTitleText');
  if (titleElem) titleElem.innerText = strings.title;
}

// 10. Role-based Admin Switcher
function switchAdminRole(roleName) {
  const badge = document.getElementById('adminRoleBadge');
  if (badge) badge.innerText = `Active View: ${roleName.toUpperCase()}`;
  alert(`Dashboard view switched to ${roleName} access permissions.`);
}
