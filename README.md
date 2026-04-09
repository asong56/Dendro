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
## License

MIT — see [LICENSE](./LICENSE).
