// ── Constants ────────────────────────────────────────────────────────────────
const LIFE_YRS = 90;
const LIFE_WKS = LIFE_YRS * 52;

// ── DOM helpers ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ──────────────────────────────────────────────────────────────────────
$('birthdate').max = new Date().toISOString().split('T')[0];

// Event listeners — safe to use because this file is type="module"
$('life-form').addEventListener('submit', e => { e.preventDefault(); visualize(); });
$('btn-back').addEventListener('click', goBack);

// ── Formatter ────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 't';
  if (n >= 1e9)  return (n / 1e9).toFixed(1) + 'b';
  if (n >= 1e6)  return (n / 1e6).toFixed(1) + 'm';
  return Math.round(n).toLocaleString();
}

// ── Chart instance (module-scoped, not global) ────────────────────────────────
let popChart = null;

// ── Population data ───────────────────────────────────────────────────────────
const POP_BY_YEAR = {
  1930:2.3, 1935:2.4, 1940:2.5, 1945:2.6, 1950:2.56, 1955:2.77,
  1960:3.02, 1965:3.34, 1970:3.7, 1975:4.07, 1980:4.43, 1985:4.83,
  1990:5.31, 1995:5.71, 2000:6.08, 2005:6.45, 2010:6.86,
  2015:7.35, 2020:7.79, 2025:8.2
};

// ── Main visualize ────────────────────────────────────────────────────────────
function visualize() {
  const val = $('birthdate').value;
  if (!val) return;

  const birth = new Date(val);
  const now   = new Date();
  if (birth > now) return;

  const ms    = now - birth;
  const days  = ms / 86400000;
  const weeks = Math.floor(days / 7);
  const years = days / 365.25;
  const pct   = weeks / LIFE_WKS;

  // Header
  $('ph-weeks').textContent = weeks.toLocaleString() + ' weeks';

  // Section 1 — Life progress
  $('stat-weeks').textContent = weeks.toLocaleString();
  $('stat-sub').textContent   = Math.floor(days).toLocaleString() + ' days · ' + years.toFixed(1) + ' years';
  $('bar-pct').textContent    = (pct * 100).toFixed(1) + '%';
  $('c-days').textContent     = Math.floor(days).toLocaleString();
  $('c-seasons').textContent  = Math.floor(years * 4).toLocaleString();
  $('c-moons').textContent    = Math.floor(years * 12.37).toLocaleString();
  $('c-remain').textContent   = Math.max(0, LIFE_WKS - weeks).toLocaleString();

  // Animate bars via rAF — avoids the fragile setTimeout approach
  requestAnimationFrame(() => {
    $('life-fill').style.width = (pct * 100).toFixed(2) + '%';
    $('life-now').style.left   = (pct * 100).toFixed(2) + '%';
  });

  // Section 2 — Body
  const heart  = days * 24 * 60 * 70;
  const breath = days * 24 * 60 * 15;
  const sleep  = days * 8;
  const steps  = days * 7500;
  const meals  = days * 3;
  const cells  = Math.floor(years / 8);

  $('b-heart').textContent  = fmt(heart);
  $('b-breath').textContent = fmt(breath);
  $('b-sleep').textContent  = fmt(sleep) + ' hrs';
  $('b-steps').textContent  = fmt(steps);
  $('b-cells').textContent  = cells > 0 ? '~' + cells + '×' : '<1×';
  $('b-food').textContent   = fmt(meals);

  requestAnimationFrame(() => {
    $('bf-heart').style.width  = '100%';
    $('bf-breath').style.width = (breath / heart * 100).toFixed(1) + '%';
    $('bf-sleep').style.width  = (sleep * 1000 / heart * 100).toFixed(1) + '%';
    $('bf-steps').style.width  = (steps * 10 / heart * 100).toFixed(1) + '%';
    $('bf-cells').style.width  = Math.min(100, cells / 10 * 100).toFixed(1) + '%';
  });

  // Section 3 — Timeline
  buildTimeline(years, birth.getFullYear());

  // Section 4 — Lifespan compare (max = sequoia, 3200 yrs)
  const MAX_SP = 3200;
  $('lc-you').textContent = years.toFixed(1) + ' yrs';
  requestAnimationFrame(() => {
    $('lcf-you').style.width = Math.min(100, years / MAX_SP * 100).toFixed(2) + '%';
    $('lcf-avg').style.width = (72.6 / MAX_SP * 100).toFixed(2) + '%';
  });

  // Section 5 — World
  const by   = birth.getFullYear();
  const snap = Math.max(1930, Math.min(2025, Math.round(by / 5) * 5));
  const popB = POP_BY_YEAR[snap] || 2.5;

  $('w-born').textContent          = fmt(days * 385000);
  $('w-died').textContent          = fmt(days * 166000);
  $('w-met').textContent           = '~' + Math.min(Math.round(years * 2200), 80000).toLocaleString();
  $('pop-birth-label').textContent = 'Birth (' + by + '): ' + popB.toFixed(1) + 'b';

  buildPopChart(by, popB);

  // Section 6 — Cosmic
  buildCosmic(days, years);

  // Show step 2
  $('s1').style.display = 'none';
  $('s2').classList.add('vis');
  window.scrollTo({ top: 0 });
}

function goBack() {
  $('s2').classList.remove('vis');
  $('s1').style.display = 'flex';
  window.scrollTo({ top: 0 });
}

// ── Timeline (generates <li> elements — no divs) ──────────────────────────────
function buildTimeline(years, birthYear) {
  const milestones = [
    { age: 0,  label: 'You are born',                            sub: birthYear },
    { age: 5,  label: 'First memories form',                     sub: 'Hippocampus matures around age 3–5' },
    { age: 18, label: 'Legal adulthood in most countries',       sub: '' },
    { age: 25, label: 'Prefrontal cortex fully developed',       sub: 'Rational decision-making reaches its peak' },
    { age: 30, label: 'Peak physical strength',                  sub: 'Muscle mass and bone density at their highest' },
    { age: 35, label: 'Fertility begins to decline',             sub: 'For most people, biologically' },
    { age: 40, label: 'Midlife',                                 sub: 'Half of a typical 80-year life' },
    { age: 60, label: 'Wisdom years begin',                      sub: 'Experience accumulation accelerates' },
    { age: 65, label: 'Retirement age in many countries',        sub: '' },
    { age: 90, label: '90 years — baseline life expectancy used here', sub: '' },
  ];

  const wrap = $('tl-wrap');
  wrap.innerHTML = '';

  for (const m of milestones) {
    const lived = years >= m.age;
    const isNow = lived && years < m.age + 5;
    const dotClass = lived ? (isNow ? ' now-dot' : ' lived') : '';

    const li = document.createElement('li');
    li.className = 'tl-item';
    li.innerHTML = `
      <span class="tl-dot${dotClass}"></span>
      <p class="tl-body">
        <span class="tl-age mono">Age ${m.age}</span>
        <span class="tl-text${!lived ? ' tl-future' : ''}">${m.label}</span>
        ${m.sub ? `<span class="tl-sub">${m.sub}</span>` : ''}
      </p>`;
    wrap.appendChild(li);
  }
}

// ── Population chart ──────────────────────────────────────────────────────────
function buildPopChart(birthYear, popAtBirth) {
  const allYears = Object.keys(POP_BY_YEAR).map(Number).sort((a, b) => a - b);
  const filtered = allYears.filter(y => y >= Math.floor(birthYear / 5) * 5);
  if (filtered[0] > birthYear) filtered.unshift(birthYear);

  const labels = filtered.map(String);
  const data   = filtered.map(y => {
    const snap = Math.max(1930, Math.min(2025, Math.round(y / 5) * 5));
    return POP_BY_YEAR[snap] || popAtBirth;
  });
  data[0] = popAtBirth;

  if (popChart) popChart.destroy();
  popChart = new Chart($('pop-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#2a2724',
        borderWidth: 1.5,
        pointRadius: 3,
        pointBackgroundColor: '#2a2724',
        fill: true,
        backgroundColor: 'rgba(42,39,36,0.06)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.raw.toFixed(2) + 'b people' } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7a7670', maxRotation: 0 } },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 11 }, color: '#7a7670', callback: v => v.toFixed(1) + 'b' },
          min: Math.max(0, popAtBirth - 0.5)
        }
      }
    }
  });
}

// ── Cosmic grid (generates <li> elements — no divs) ───────────────────────────
function buildCosmic(days, years) {
  const cards = [
    {
      num:       fmt(days * 940000),
      unit:      'km around the Sun',
      ctx:       `Earth orbits the Sun at ~107,000 km/h. In your lifetime, you've made ${years.toFixed(1)} full laps.`,
      fillPct:   Math.min(100, years / LIFE_YRS * 100),
      fillColor: '#2a2724'
    },
    {
      num:       fmt(days * 24 * 828000),
      unit:      'km through the Milky Way',
      ctx:       'Our solar system moves through the galaxy at ~828,000 km/h — so you\'ve drifted far through space.',
      fillPct:   Math.min(100, years / LIFE_YRS * 100),
      fillColor: '#3d6b5e'
    },
    {
      num:       (years / 13.8e9 * 100).toExponential(2) + '%',
      unit:      'of the universe\'s age',
      ctx:       'The universe is ~13.8 billion years old. Your life is a breath — yet it is the only moment you occupy.',
      fillPct:   0.00001,
      fillColor: '#2a2724'
    },
    {
      num:       (years / 3200 * 100).toFixed(2) + '%',
      unit:      'of a giant sequoia\'s life',
      ctx:       'Sequoias can live over 3,200 years. A tree alive today may have been a sapling when Rome fell.',
      fillPct:   Math.min(100, years / 3200 * 100),
      fillColor: '#3d6b5e'
    }
  ];

  $('cosmic-grid').innerHTML = cards.map(c => `
    <li class="cosmic-card">
      <output class="cosmic-num">${c.num}</output>
      <p class="cosmic-unit">${c.unit}</p>
      <p class="cosmic-ctx">${c.ctx}</p>
      <figure class="cosmic-scale">
        <p class="label">Your share</p>
        <span class="cosmic-track">
          <span class="cosmic-fill" style="width:${Math.max(0.5, c.fillPct).toFixed(2)}%;background:${c.fillColor}"></span>
        </span>
      </figure>
    </li>`).join('');
}
