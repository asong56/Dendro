# Life in Weeks

A minimal, single-page web app that visualises your entire life at a glance.
Enter your birth date and explore how much time you have lived — and what it means at every scale, from heartbeats to cosmic distance.

---

## Features

- **Life progress bar** — see your age as a fraction of a 90-year baseline
- **Body & biology** — estimated heartbeats, breaths, sleep hours, steps, and more
- **Life milestones** — an ordered timeline of developmental and social landmarks
- **Lifespan in perspective** — compare your age against other species
- **World while you lived** — world population growth since your birth (Chart.js line chart)
- **Cosmic & natural scale** — distance travelled around the Sun and through the Milky Way, fraction of the universe's age, and fraction of a giant sequoia's life

---

## Tech stack

| Concern | Tool |
|---------|------|
| Build & dev server | [Vite 5](https://vitejs.dev) |
| Chart | [Chart.js 4](https://www.chartjs.org) (CDN) |
| Fonts | EB Garamond + DM Mono (Google Fonts) |
| Bundling | `vite-plugin-singlefile` — outputs one self-contained HTML file |
| Minification | `vite-plugin-minify` + Terser |
| PWA | `vite-plugin-pwa` |

No front-end framework. No runtime dependencies beyond Chart.js.

---

## Getting started

```bash
# 1. Install dev dependencies
npm install

# 2. Start the dev server (hot reload)
npm run dev

# 3. Build for production (single HTML file in dist/)
npm run build

# 4. Preview the production build locally
npm run preview
```

Node 18+ is required.

---

## Project structure

```
.
├── index.html          # Main HTML — semantic, zero divs
├── src/
│   ├── main.js         # All application logic (ES module)
│   └── styles.css      # All styles
├── public/
│   └── assets/         # Icons and PWA images
├── vite.config.js      # Vite + plugins configuration
└── package.json
```

---

## Bug fixes applied (v1 → current)

The original source had several issues that prevented the app from working at all:

### Critical

| # | Bug | Fix |
|---|-----|-----|
| 1 | `onclick="visualize()"` in HTML with `type="module"` JS — module-scoped functions are **not** global, so both buttons threw `ReferenceError` | Replaced with `addEventListener` on the `<form>` submit event and the back button |
| 2 | **Chart.js was never loaded** — `new Chart()` in `buildPopChart` threw `ReferenceError`, the population chart was always blank | Added Chart.js 4 via CDN `<script>` tag |
| 3 | `lz-string` was loaded from CDN but **never used** — a wasted network request on every page load | Removed entirely |

### HTML / meta

| # | Issue | Fix |
|---|-------|-----|
| 4 | OG `<meta>` title read `"Cicada: Minimalist Whiteboard"` — clearly a copy-paste from another project | Updated to `"Life in Weeks"` |
| 5 | PWA manifest in `vite.config.js` had `name: "Ephemera Reading List"` — another stale copy-paste | Updated to `"Life in Weeks"` |
| 6 | Every structural element was a `<div>` | Replaced with semantic HTML throughout (see below) |
| 7 | Input section had no `<label for="birthdate">` — inaccessible to screen readers | Added `<label for="birthdate">` |
| 8 | Computed output values used plain text nodes inside `<div>` | Changed to `<output>` elements, which are the correct HTML element for computed results |
| 9 | Inline `style` attributes scattered throughout | Moved to named CSS classes |

### JavaScript

| # | Issue | Fix |
|---|-------|-----|
| 10 | `setTimeout(..., 100/200)` used to trigger CSS transitions | Replaced with `requestAnimationFrame`, which is the correct API for this purpose |
| 11 | Separate `keydown` listener on the date input to detect Enter | Removed — the `<form>` submit event handles Enter natively |
| 12 | `buildTimeline` injected `<div>` elements | Now generates `<li>` elements inside `<ol class="timeline">` |
| 13 | `buildCosmic` injected `<div>` elements | Now generates `<li>` elements inside `<ul class="cosmic-grid">` |
| 14 | `popChart` was a top-level global variable | Kept in module scope — not accessible from the outside |

---

## Semantic HTML mapping

| Before | After | Reason |
|--------|-------|--------|
| `<div id="s1">` | `<main id="s1">` | Primary content of the landing screen |
| `<div id="s2">` | `<section id="s2">` | Major section of the page |
| `<div class="hero">` | `<header class="hero">` | Introductory content |
| `<div class="iblock">` | `<form class="iblock">` | It is literally a form |
| `<div class="page-header">` | `<header class="page-header">` | Section header |
| `<div class="content">` | `<article class="content">` | Self-contained main content |
| `<div class="section">` | `<section class="section">` | Thematic grouping |
| `<div class="sec-title">` | `<h3 class="sec-title">` | Section heading |
| `<div class="hero-stat">` | `<p class="hero-stat">` | A paragraph of stats |
| `<div class="life-bar-wrap">` | `<figure class="life-bar-wrap">` | A self-contained visual |
| `<div class="life-bar-labels">` | `<figcaption class="life-bar-labels">` | Caption for the figure |
| `<div class="life-bar-track/fill/now">` | `<span>` with `display:block` | Presentational bar segments |
| `<div class="two-col">` | `<ul class="two-col">` | A list of stats |
| `<div class="cell">` | `<li class="cell">` | List item |
| `<div class="cell-val">` | `<output class="cell-val">` | Computed value |
| `<div class="cmp-row">` | `<article class="cmp-row">` | Self-contained metric + bar |
| `<div class="cmp-head">` | `<p class="cmp-head">` | Label + value pair |
| `<div class="timeline">` | `<ol class="timeline">` | Ordered list of milestones |
| `<div class="tl-item">` | `<li class="tl-item">` | Timeline entry |
| `<div class="cosmic-grid">` | `<ul class="cosmic-grid">` | Grid of cards |
| `<div class="cosmic-card">` | `<li class="cosmic-card">` | Card item |
| `<div class="cosmic-num">` | `<output class="cosmic-num">` | Computed value |
| Footer footnote `<div>` | `<footer class="data-note">` | Footer content |

---

## License

MIT — see [LICENSE](./LICENSE).
