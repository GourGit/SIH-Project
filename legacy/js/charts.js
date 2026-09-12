/* ==========================================================================
   National Weather Big Data Analytics Platform - Charts Module
   Chart.js powered visualizations for Big Data Analytics, Trends & Forecasts
   ========================================================================== */

let forecast24hChartInstance = null;
let histTempChartInstance = null;
let rainfallDistChartInstance = null;
let tempAnomalyChartInstance = null;
let extremeEventsChartInstance = null;
let districtRiskChartInstance = null;

function initCharts() {
  renderSparklines();
  init24hForecastChart();
  initHistoricalCharts();
}

// 1. Sparklines for National Overview Cards
function renderSparklines() {
  const sparkConfigs = [
    { id: 'spark1', data: [30.2, 30.8, 31.0, 31.5, 31.8, 32.0], color: '#EF4444' },
    { id: 'spark2', data: [65, 72, 70, 78, 80, 84.6], color: '#1B365D' },
    { id: 'spark3', data: [15, 18, 19, 21, 22, 23], color: '#F59E0B' },
    { id: 'spark4', data: [98.1, 98.2, 98.4, 98.5, 98.6, 98.7], color: '#10B981' }
  ];

  sparkConfigs.forEach(cfg => {
    const ctx = document.getElementById(cfg.id);
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [{
          data: cfg.data,
          borderColor: cfg.color,
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  });
}

// 2. 24-Hour Forecast Combo Chart
function init24hForecastChart() {
  const ctx = document.getElementById('forecast24hChart');
  if (!ctx) return;

  const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  const temps = [27.0, 26.2, 25.8, 29.5, 32.4, 33.1, 30.5, 28.2];
  const rainProb = [10, 15, 40, 65, 80, 75, 45, 20];

  if (forecast24hChartInstance) forecast24hChartInstance.destroy();

  forecast24hChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hours,
      datasets: [
        {
          type: 'line',
          label: 'Temperature (°C)',
          data: temps,
          borderColor: '#FF9933',
          backgroundColor: 'rgba(255, 153, 51, 0.1)',
          borderWidth: 3,
          yAxisID: 'yTemp',
          tension: 0.4,
          fill: true
        },
        {
          type: 'bar',
          label: 'Rain Probability (%)',
          data: rainProb,
          backgroundColor: 'rgba(27, 54, 93, 0.75)',
          borderRadius: 4,
          yAxisID: 'yRain'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          backgroundColor: '#0F2942',
          titleFont: { family: 'Inter', size: 13 },
          bodyFont: { family: 'Inter', size: 12 }
        }
      },
      scales: {
        x: { grid: { display: false } },
        yTemp: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Temperature (°C)' },
          min: 20, max: 40
        },
        yRain: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Rainfall Probability (%)' },
          min: 0, max: 100,
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// 3. Historical Analytics & Climate Charts
function initHistoricalCharts() {
  // A. Historical Temp Trend (2010-2026)
  const ctxHist = document.getElementById('histTempChart');
  if (ctxHist) {
    if (histTempChartInstance) histTempChartInstance.destroy();
    histTempChartInstance = new Chart(ctxHist, {
      type: 'line',
      data: {
        labels: IndianWeatherStore.historicalTrends.years,
        datasets: [
          {
            label: 'Recorded Avg Temp (°C)',
            data: IndianWeatherStore.historicalTrends.avgTemp,
            borderColor: '#D93025',
            backgroundColor: 'rgba(217, 48, 37, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Historical Baseline Normal (°C)',
            data: IndianWeatherStore.historicalTrends.normalTemp,
            borderColor: '#64748B',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { min: 23, max: 27 } }
      }
    });
  }

  // B. Monthly Rainfall Distribution
  const ctxRain = document.getElementById('rainfallDistChart');
  if (ctxRain) {
    if (rainfallDistChartInstance) rainfallDistChartInstance.destroy();
    rainfallDistChartInstance = new Chart(ctxRain, {
      type: 'bar',
      data: {
        labels: IndianWeatherStore.monthlyRainfall.months,
        datasets: [
          {
            label: '2026 Actual Rainfall (mm)',
            data: IndianWeatherStore.monthlyRainfall.actual,
            backgroundColor: '#1B365D',
            borderRadius: 4
          },
          {
            label: 'Normal Baseline (mm)',
            data: IndianWeatherStore.monthlyRainfall.normal,
            backgroundColor: '#CBD5E1',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });
  }

  // C. Extreme Weather Events Trend
  const ctxExt = document.getElementById('extremeEventsChart');
  if (ctxExt) {
    if (extremeEventsChartInstance) extremeEventsChartInstance.destroy();
    extremeEventsChartInstance = new Chart(ctxExt, {
      type: 'line',
      data: {
        labels: IndianWeatherStore.historicalTrends.years,
        datasets: [{
          label: 'National Severe Weather Events Frequency',
          data: IndianWeatherStore.historicalTrends.extremeEvents,
          borderColor: '#E67E22',
          backgroundColor: 'rgba(230, 126, 34, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });
  }
}

// Render District Risk Breakdown Bar Chart
function renderDistrictRiskChart(scoreData) {
  const ctx = document.getElementById('districtRiskChart');
  if (!ctx) return;

  if (districtRiskChartInstance) districtRiskChartInstance.destroy();

  districtRiskChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Flood Risk', 'Cyclone Threat', 'Heatwave Anomaly', 'Drought Risk', 'Lightning Activity'],
      datasets: [{
        label: 'Risk Index (0-100)',
        data: scoreData,
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
        borderColor: '#EF4444',
        borderWidth: 2,
        pointBackgroundColor: '#EF4444'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: '#E2E8F0' },
          grid: { color: '#E2E8F0' },
          pointLabels: { font: { family: 'Inter', size: 11, weight: '600' } },
          min: 0, max: 100
        }
      }
    }
  });
}
