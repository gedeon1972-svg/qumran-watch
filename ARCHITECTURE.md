# Qumran Watch — Architecture Guide

## Overview
Qumran Watch is a **100% offline PWA** that restores the **364-day Solar Calendar** from the Dead Sea Scrolls. It provides GPS-based sunrise/sunset syncing, a 24-course priestly cycle (Mishmarot), ICS calendar export, and a library of biblical studies.

## Module Hierarchy

\\\
index.html
  ├── src/css/index.css          (imports: styles.css, animations.css, etc.)
  ├── src/js/theme-init.js       (synchronous, pre-Vite)
  └── src/js/index.js (entry point)
        ├── QumranData           (data.js)       — liturgical data, feasts, psalms
        ├── QumranCalendar       (calendar.js)   — 364-day calendar engine
        ├── QumranSun            (sun.js)        — NOAA solar algorithm
        ├── QumranICS            (ics.js)        — ICS file generation
        ├── initTheme            (theme.js)      — theme management (sand+gold)
        ├── storage              (storage.js)    — localStorage wrapper with memory fallback
        └── utils/calculations.js                — pure utility functions
              ├── findFestivalDate
              ├── calcOmerDay
              ├── getFestivalsForYear
              └── getWatcherAlerts
\\\

## Data Flow
1. **index.js** imports all modules and bootstraps the PWA.
2. **QumranCalendar.calculate(date)** converts a JS \Date\ into Qumran calendar data (month, day, week index, season).
3. **QumranSun** computes sunrise/sunset via NOAA algorithm; falls back to Jerusalem coordinates (31.7683, 35.2137) when GPS is unavailable.
4. **app.js** (the controller) orchestrates rendering via \QumranApp\ object methods — \enderHoy()\, \enderCalendar()\, \checkWatcher()\, \openFiesta()\, etc.
5. **Diff check** in \updateSunData()\ prevents redundant DOM updates by comparing \JSON.stringify(lastRenderedData)\.

## Key Architectural Decisions
- **Zero runtime dependencies**: only devDependencies (Vite, Vitest, Terser).
- **Vanilla JS**: ES6 modules, no frontend framework.
- **PWA offline-first**: Service Worker (sw.js) with cache-first strategy.
- **Mobile-first responsive**: designed for mobile, scales to desktop.
- **WCAG AA compliant**: sand+gold theme, proper contrast ratios.

## Adding a New Module
1. Create the module in \src/js/\ (or \src/js/utils/\).
2. Export pure functions when possible (no side effects, testable).
3. Import in \src/js/index.js\ or directly where needed.
4. Add tests in \	est/\ following the existing patterns.
5. Run \
pm test\ and \
pm run build\ before committing.

## Testing
- **Framework**: Vitest
- **Test files**: \	est/*.test.js\
- **Run**: \
pm test\ (58 tests across 5 suites)
- **Coverage target**: maintain 58/58 passing on every change.

## Build & Deploy
- **Build**: \
pm run build\ (Vite + Terser)
- **Dev**: \
pm run dev\ (Vite dev server)
- **Deploy**: GitHub Actions → GitHub Pages from \./dist\
- **Branch**: \main\ is the deployment branch.
