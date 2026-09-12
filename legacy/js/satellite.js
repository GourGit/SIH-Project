/* ==========================================================================
   National Weather Big Data Analytics Platform - Satellite & Radar Module
   Canvas-based Doppler Radar Simulation with timeline scrubber & animation
   ========================================================================== */

let satCanvas = null;
let satCtx = null;
let isPlayingSat = false;
let satAnimationTimer = null;
let currentTimelineStep = 4; // 12:00 PM default
const timelineFrames = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

function initSatelliteStudio() {
  satCanvas = document.getElementById('satCanvas');
  if (!satCanvas) return;

  satCtx = satCanvas.getContext('2d');
  resizeSatCanvas();

  window.addEventListener('resize', resizeSatCanvas);

  // Draw initial frame
  drawRadarFrame(currentTimelineStep);
}

function resizeSatCanvas() {
  if (!satCanvas) return;
  const rect = satCanvas.parentElement.getBoundingClientRect();
  satCanvas.width = rect.width;
  satCanvas.height = rect.height;
  drawRadarFrame(currentTimelineStep);
}

let radarAngle = 0;

function drawRadarFrame(frameIdx) {
  if (!satCtx || !satCanvas) return;
  const w = satCanvas.width;
  const h = satCanvas.height;
  const centerX = w / 2;
  const centerY = h / 2;
  const maxRadius = Math.min(w, h) * 0.42;

  // Background map simulator
  satCtx.fillStyle = '#050D1A';
  satCtx.fillRect(0, 0, w, h);

  // Draw concentric radar range rings
  satCtx.strokeStyle = 'rgba(27, 54, 93, 0.6)';
  satCtx.lineWidth = 1;

  for (let r = 1; r <= 4; r++) {
    satCtx.beginPath();
    satCtx.arc(centerX, centerY, (maxRadius / 4) * r, 0, Math.PI * 2);
    satCtx.stroke();

    // Range Label
    satCtx.fillStyle = '#64748B';
    satCtx.font = '10px Inter';
    satCtx.fillText(`${r * 150} km`, centerX + 6, centerY - (maxRadius / 4) * r + 12);
  }

  // Crosshairs
  satCtx.beginPath();
  satCtx.moveTo(centerX - maxRadius, centerY);
  satCtx.lineTo(centerX + maxRadius, centerY);
  satCtx.moveTo(centerX, centerY - maxRadius);
  satCtx.lineTo(centerX, centerY + maxRadius);
  satCtx.stroke();

  // Simulated Weather Cloud/Radar Echo Clusters (Shifts with frameIdx)
  const offset = frameIdx * 12;

  // 1. Bay of Bengal Cyclone Spiral Cluster
  drawStormCluster(satCtx, centerX + 120 - offset, centerY + 40 - (offset * 0.5), 90, '#EF4444');
  drawStormCluster(satCtx, centerX + 90 - offset, centerY + 30 - (offset * 0.5), 130, 'rgba(245, 158, 11, 0.6)');

  // 2. North East Rain Cluster
  drawStormCluster(satCtx, centerX + 180, centerY - 100 + (offset * 0.2), 70, 'rgba(59, 130, 246, 0.7)');

  // 3. Western Ghats Monsoon Cluster
  drawStormCluster(satCtx, centerX - 140, centerY + 80 - offset, 80, 'rgba(16, 185, 129, 0.7)');

  // Draw Rotating Radar Sweep Line
  radarAngle += 0.03;
  satCtx.beginPath();
  satCtx.moveTo(centerX, centerY);
  satCtx.lineTo(centerX + Math.cos(radarAngle) * maxRadius, centerY + Math.sin(radarAngle) * maxRadius);
  satCtx.strokeStyle = 'rgba(255, 153, 51, 0.8)';
  satCtx.lineWidth = 2;
  satCtx.stroke();

  // Sweeping Sector Glow
  satCtx.beginPath();
  satCtx.moveTo(centerX, centerY);
  satCtx.arc(centerX, centerY, maxRadius, radarAngle - 0.4, radarAngle);
  satCtx.fillStyle = 'rgba(255, 153, 51, 0.08)';
  satCtx.fill();

  // Center Beacon
  satCtx.beginPath();
  satCtx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  satCtx.fillStyle = '#FF9933';
  satCtx.fill();

  // Live Timestamp Overlay
  satCtx.fillStyle = '#FFFFFF';
  satCtx.font = '700 13px Outfit';
  satCtx.fillText(`INSAT-3DR RADAR FEED | TIMEFRAME: ${timelineFrames[frameIdx]} IST`, 20, 30);
}

// Helper to draw realistic organic storm echo shapes
function drawStormCluster(ctx, x, y, size, color) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 5, x, y, size);
  grad.addColorStop(0, color);
  grad.addColorStop(0.6, color);
  grad.addColorStop(1, 'transparent');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Scrubber Timeline Change
function setSatTimeline(val) {
  currentTimelineStep = parseInt(val, 10);
  const timeLabel = document.getElementById('satTimeLabel');
  if (timeLabel) timeLabel.innerText = timelineFrames[currentTimelineStep] + ' IST';
  drawRadarFrame(currentTimelineStep);
}

// Play / Pause Animation Loop
function toggleSatPlay() {
  const btn = document.getElementById('satPlayBtn');

  if (isPlayingSat) {
    isPlayingSat = false;
    clearInterval(satAnimationTimer);
    if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Play Animation';
  } else {
    isPlayingSat = true;
    if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Animation';

    satAnimationTimer = setInterval(() => {
      currentTimelineStep = (currentTimelineStep + 1) % timelineFrames.length;
      const slider = document.getElementById('satTimelineSlider');
      if (slider) slider.value = currentTimelineStep;
      setSatTimeline(currentTimelineStep);
    }, 1200);
  }
}
