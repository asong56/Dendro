const LIFE_YRS = 90, LIFE_WKS = 90*52;
document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];
document.getElementById('birthdate').addEventListener('keydown', e => { if(e.key==='Enter') visualize(); });

function fmt(n, decimals=0) {
  if(n >= 1e12) return (n/1e12).toFixed(1)+'t';
  if(n >= 1e9)  return (n/1e9).toFixed(1)+'b';
  if(n >= 1e6)  return (n/1e6).toFixed(1)+'m';
  return Math.round(n).toLocaleString();
}

let popChart = null;

function visualize() {
  const val = document.getElementById('birthdate').value;
  if(!val) return;
  const birth = new Date(val), now = new Date();
  if(birth > now) return;

  const ms = now - birth;
  const days  = ms / 86400000;
  const weeks = Math.floor(days/7);
  const years = days / 365.25;
  const pct   = weeks / LIFE_WKS;

  // Header
  document.getElementById('ph-weeks').textContent = weeks.toLocaleString() + ' weeks';

  // Section 1 — Life progress
  document.getElementById('stat-weeks').textContent = weeks.toLocaleString();
  document.getElementById('stat-sub').textContent   = Math.floor(days).toLocaleString() + ' days · ' + years.toFixed(1) + ' years';
  document.getElementById('bar-pct').textContent    = (pct*100).toFixed(1) + '%';
  document.getElementById('c-days').textContent     = Math.floor(days).toLocaleString();
  document.getElementById('c-seasons').textContent  = Math.floor(years*4).toLocaleString();
  document.getElementById('c-moons').textContent    = Math.floor(years*12.37).toLocaleString();
  document.getElementById('c-remain').textContent   = Math.max(0, LIFE_WKS - weeks).toLocaleString();

  setTimeout(() => {
    document.getElementById('life-fill').style.width = (pct*100).toFixed(2)+'%';
    document.getElementById('life-now').style.left   = (pct*100).toFixed(2)+'%';
  }, 100);

  // Section 2 — Body
  const heart  = days*24*60*70;
  const breath = days*24*60*15;
  const sleep  = days*8;
  const steps  = days*7500;
  const meals  = days*3;
  const cells  = Math.floor(years/8);
  const maxBio = heart;
  document.getElementById('b-heart').textContent  = fmt(heart);
  document.getElementById('b-breath').textContent = fmt(breath);
  document.getElementById('b-sleep').textContent  = fmt(sleep) + ' hrs';
  document.getElementById('b-steps').textContent  = fmt(steps);
  document.getElementById('b-cells').textContent  = cells > 0 ? '~'+cells+'×' : '<1×';
  document.getElementById('b-food').textContent   = fmt(meals);
  setTimeout(() => {
    document.getElementById('bf-heart').style.width  = '100%';
    document.getElementById('bf-breath').style.width = (breath/heart*100).toFixed(1)+'%';
    document.getElementById('bf-sleep').style.width  = (sleep*1000/heart*100).toFixed(1)+'%';
    document.getElementById('bf-steps').style.width  = (steps*10/heart*100).toFixed(1)+'%';
    document.getElementById('bf-cells').style.width  = Math.min(100, cells/10*100).toFixed(1)+'%';
  }, 200);

  // Section 3 — Timeline
  buildTimeline(years, birth.getFullYear());

  // Section 4 — Lifespan compare (max 3200 years = sequoia)
  const MAX_SP = 3200;
  const youPct  = Math.min(100, years/MAX_SP*100);
  const avgPct  = 72.6/MAX_SP*100;
  document.getElementById('lc-you').textContent = years.toFixed(1)+' yrs';
  setTimeout(() => {
    document.getElementById('lcf-you').style.width = youPct.toFixed(2)+'%';
    document.getElementById('lcf-avg').style.width = avgPct.toFixed(2)+'%';
  }, 200);

  // Section 5 — World
  const popByYear = {
    1930:2.3,1935:2.4,1940:2.5,1945:2.6,1950:2.56,1955:2.77,1960:3.02,1965:3.34,
    1970:3.7,1975:4.07,1980:4.43,1985:4.83,1990:5.31,1995:5.71,2000:6.08,
    2005:6.45,2010:6.86,2015:7.35,2020:7.79,2025:8.2
  };
  const by = birth.getFullYear();
  const snap = Math.max(1930, Math.min(2025, Math.round(by/5)*5));
  const popB = popByYear[snap] || 2.5;

  document.getElementById('w-born').textContent = fmt(days*385000);
  document.getElementById('w-died').textContent = fmt(days*166000);
  document.getElementById('w-met').textContent  = '~'+Math.min(Math.round(years*2200),80000).toLocaleString();
  document.getElementById('pop-birth-label').textContent = 'Birth ('+by+'): '+popB.toFixed(1)+'b';

  buildPopChart(by, popB, popByYear);

  // Section 6 — Cosmic
  buildCosmic(days, years);

  // Show step 2
  document.getElementById('s1').style.display = 'none';
  document.getElementById('s2').classList.add('vis');
  window.scrollTo({top:0});
}

function goBack() {
  document.getElementById('s2').classList.remove('vis');
  document.getElementById('s1').style.display = 'flex';
  window.scrollTo({top:0});
}

function buildTimeline(years, birthYear) {
  const milestones = [
    { age:0,   label:'You are born', sub: birthYear },
    { age:5,   label:'First memories form', sub:'Hippocampus matures around age 3–5' },
    { age:18,  label:'Legal adulthood in most countries', sub:'' },
    { age:25,  label:'Prefrontal cortex fully developed', sub:'Rational decision-making reaches its peak' },
    { age:30,  label:'Peak physical strength', sub:'Muscle mass and bone density at their highest' },
    { age:35,  label:'Fertility begins to decline', sub:'For most people, biologically' },
    { age:40,  label:'Midlife', sub:'Half of a typical 80-year life' },
    { age:60,  label:'Wisdom years begin', sub:'Experience accumulation accelerates' },
    { age:65,  label:'Retirement age in many countries', sub:'' },
    { age:90,  label:'90 years — baseline life expectancy used here', sub:'' },
  ];
  const wrap = document.getElementById('tl-wrap');
  wrap.innerHTML = '';
  milestones.forEach(m => {
    const lived = years >= m.age;
    const isNow = years >= m.age && years < (m.age + 5);
    const div = document.createElement('div');
    div.className = 'tl-item';
    div.innerHTML = `
      <div class="tl-dot ${lived ? (isNow ? 'now-dot' : 'lived') : ''}"></div>
      <div class="tl-body">
        <div class="tl-age mono" style="font-size:11px;letter-spacing:.1em;color:var(--muted)">Age ${m.age}</div>
        <div class="tl-text" style="${!lived ? 'color:var(--muted)' : ''}">${m.label}</div>
        ${m.sub ? `<div class="tl-sub">${m.sub}</div>` : ''}
      </div>`;
    wrap.appendChild(div);
  });
}

function buildPopChart(birthYear, popAtBirth, popByYear) {
  const allYears = Object.keys(popByYear).map(Number).sort((a,b)=>a-b);
  const filtered = allYears.filter(y => y >= Math.floor(birthYear/5)*5);
  if(filtered[0] > birthYear) filtered.unshift(birthYear);
  const labels = filtered.map(y => String(y));
  const data   = filtered.map(y => {
    const snap = Math.max(1930, Math.min(2025, Math.round(y/5)*5));
    return popByYear[snap] || popAtBirth;
  });
  data[0] = popAtBirth;

  if(popChart) popChart.destroy();
  popChart = new Chart(document.getElementById('pop-chart'), {
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
      plugins: { legend: { display:false }, tooltip: {
        callbacks: { label: ctx => ctx.raw.toFixed(2)+'b people' }
      }},
      scales: {
        x: { grid:{ display:false }, ticks:{ font:{size:11}, color:'#7a7670', maxRotation:0 } },
        y: {
          grid:{ color:'rgba(0,0,0,0.04)' },
          ticks:{ font:{size:11}, color:'#7a7670', callback: v => v.toFixed(1)+'b' },
          min: Math.max(0, popAtBirth - 0.5)
        }
      }
    }
  });
}

function buildCosmic(days, years) {
  const kmSun     = days * 940000;
  const kmGalaxy  = days * 24 * 828000;
  const pctUniv   = years / 13.8e9 * 100;
  const pctEarth  = years / 4.5e9  * 100;
  const seqPct    = years / 3200   * 100;
  const MAX_SP    = 3200;

  const cards = [
    {
      num: fmt(kmSun),
      unit: 'km around the Sun',
      ctx: 'Earth orbits the Sun at ~107,000 km/h. In your lifetime, you\'ve made ' + years.toFixed(1) + ' full laps.',
      fillPct: Math.min(100, years/LIFE_YRS*100),
      fillColor: '#2a2724'
    },
    {
      num: fmt(kmGalaxy),
      unit: 'km through the Milky Way',
      ctx: 'Our solar system moves through the galaxy at ~828,000 km/h — so you\'ve drifted far through space.',
      fillPct: Math.min(100, years/LIFE_YRS*100),
      fillColor: '#3d6b5e'
    },
    {
      num: pctUniv.toExponential(2) + '%',
      unit: 'of the universe\'s age',
      ctx: 'The universe is ~13.8 billion years old. Your life is a breath — yet it is the only moment you occupy.',
      fillPct: 0.00001,
      fillColor: '#2a2724'
    },
    {
      num: seqPct.toFixed(2) + '%',
      unit: 'of a giant sequoia\'s life',
      ctx: 'Sequoias can live over 3,200 years. A tree alive today may have been a sapling when Rome fell.',
      fillPct: Math.min(100, seqPct),
      fillColor: '#3d6b5e'
    }
  ];

  document.getElementById('cosmic-grid').innerHTML = cards.map(c => `
    <div class="cosmic-card">
      <div class="cosmic-num">${c.num}</div>
      <div class="cosmic-unit">${c.unit}</div>
      <div class="cosmic-ctx">${c.ctx}</div>
      <div class="cosmic-scale">
        <div class="label" style="font-size:10px">Your share</div>
        <div class="cosmic-track">
          <div class="cosmic-fill" style="width:${Math.max(0.5,c.fillPct).toFixed(2)}%;background:${c.fillColor}"></div>
        </div>
      </div>
    </div>`).join('');
}
