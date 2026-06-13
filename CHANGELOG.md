# Changelog

## [Unreleased]







## [13.1.26] - 2026-06-12 - Feature: Implementada tarjeta visual enriquecida para la Estacion (Primavera/Verano/Otonio/Invierno) en la vista principal.

### Added
- Componente src/js/ui/estacion-dashboard.js con renderEstacionCard() (ya existente desde v13.1.22, confirmado y estable)
- Integracion en hoy-view.js con import y reemplazo del texto plano
- SVGs por estacion, subtitulo "Estacion Actual", titulo destacado


## [13.1.25] - 2026-06-12 - Hotfix: Fix CSS Flexbox wrapping issue and render order for Vigia progress bar.

### Fixed
- CSS: added flex-wrap: wrap to .sun-container and flex-shrink: 0 to .vigia-progress-container to prevent 0-width collapse
- JS: reordered updateSunData() to call renderSunView() before calculateVigiaStatus() so the bar is injected into a visible container
- Removed premature calculateVigiaStatus() call from init() ? updateSunData is now the sole trigger


## [13.1.23] - 2026-06-12 - Hotfix: Correccion terminologica (Amanecer/Ocaso) y renderizado forzado de la barra de progreso del Vigia en madrugada.

### Fixed
- index.html: 'SALIDA DEL SOL' -> 'AMANECER', 'PUESTA DEL SOL' -> 'OCASO'
- app.js calculateVigiaStatus(): progress bar now injected into #sun-container (below sun icons) instead of only #alert-msg
- Added CSS .vigia-progress-container, .vigia-progress-label, .vigia-progress-bar-bg, .vigia-progress-bar-fill with dark-mode + print support


## [13.1.22] - 2026-06-12 - Feature: Tarjeta visual para la Estacion actual y Barra de progreso/cuenta regresiva para el inicio del nuevo dia (Amanecer).

### Added
- New component: src/js/ui/estacion-dashboard.js with renderEstacionCard() ? seasonal SVG icons per station
- Imported and integrated in hoy-view.js ? replaces static heb-estacion text with rich card
- Day transition progress bar in calculateVigiaStatus() ? shows countdown hours/min + progress bar
- CSS styles: .estacion-card, .estacion-icon, .estacion-title, .estacion-subtitle, .day-transition-bar, .progress-bar-container, .progress-bar-fill
- Print-friendly styles for estacion-card; day-transition-bar hidden in print


## [13.1.21] - 2026-06-12 - Feature: Tarjeta visual dedicada para el Turno Sacerdotal (Mishmar) en la vista principal.

### Added
- New component: src/js/ui/mishmar-dashboard.js with renderMishmarCard()
- Imported and integrated in hoy-view.js ? replaces static heb-turno text with rich card
- CSS styles: .mishmar-card, .mishmar-icon, .mishmar-title, .mishmar-subtitle
- Print-friendly styles for mishmar-card


## [13.1.20] - 2026-06-12 - Feature: Motor de precision solar astronomica y advertencias dinamicas del Vigia para el inicio del dia.

### Added
- getSunriseTime() in time-translator.js: precise sunrise/first-light calculation using SUNRISE_ANGLE and FIRST_LIGHT_OFFSET
- calculateVigiaStatus() in app.js: injects solar vigia message when before first light
- Solar vigia shows "Aun en [dia anterior]. El nuevo dia comenzara en ~X min."


## [13.1.19] - 2026-06-12 - Print Layout + Solar Research Prep

### Added

- Dedicated A4 print layout with clean table (Qumran date, Gregorian date, events)
- Print opens in new window, not on app UI
- time-translator.js: getQumranEquivalent() for sunrise-aware day boundary
- SOLAR_DATA_CONFIG in data.js for latitude and twilight config

## [13.1.18] ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 2026-06-12 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â PWA Install Banner + Print Toolbar

### Added

- PWA install educational banner with cross-platform support (Android eforeinstallprompt + iOS manual instructions)
- Dedicated calendar print toolbar outside input group (always visible)
- pwa-install.js module for clean separation of install prompt logic

## [13.1.17] ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â 2026-06-12 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Feature: Calendar Print Support

### Added

- @media print styles for clean, ink-saving calendar printing
- Print action button in calendar view

## [13.1.6] ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â 2026-06-12 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Fix PWA 404

### AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±adido

- .nojekyll bypass para GitHub Pages
- Rutas absolutas /qumran-watch/ en HTML y SW

### Correcciones

- Correcciones de seguridad: CSP, noopener, sanitizaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n innerHTML
- Correcciones de accesibilidad: focus trap, ARIA, contraste
- ActualizaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de documentaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n: versiones, AGENTS.md, ADR

## [13.0.0] ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â 2026-06-05 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â RefactorizaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de Arquitectura Base

### AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±adido

- MigraciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n completa a **ES Modules** con `import`/`export`.
- Sistema multi-agente para orquestaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de tareas (AGENTS.md, opencode.json).
- Suite de tests con **Vitest** (4 archivos, 41 tests).
- Cobertura de cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³digo >70% (100% en data.js, ics.js, sun.js; 98.2% en calendar.js).
- ConfiguraciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de **ESLint** (flat config) con reglas ES2020+.
- **Prettier** como formateador unificado.
- **Husky** + **lint-staged** como pre-commit hook (lint + tests obligatorios antes de commit).
- **@vitest/coverage-v8** para reportes de cobertura.
- **CI/CD** con GitHub Actions (test + build + deploy automÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico a GitHub Pages).
- **Content-Security-Policy (CSP)** estricta en index.html.
- **Open Graph** y **Twitter Cards** para redes sociales.
- **JSON-LD** con estructura WebApplication.
- Roles ARIA (`role="dialog"`, `aria-modal`, `aria-label`) para accesibilidad WCAG.
- **JSDoc** en todas las funciones pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºblicas de calendar.js.

### Corregido

- CÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lculo del turno sacerdotal: `Math.floor((totalDays + 3) / 7)` alinea semanas al lÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­mite dominical.
- Mutaciones de Date en app.js reemplazadas por aritmÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tica de new Date inmutable.
- Rutas en sw.js cambiadas a relativas (`./`) para compatibilidad localhost/producciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n.
- AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o dinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡mico en ics.js: `findLiturgicalStart(year)` escanea desde el 1 de marzo (antes 15 de marzo), ventana de 50 dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as (antes 30).
- Reemplazo de `alert()` en ics.js por `throw new Error()`.
- Error de ics.js capturado con `try/catch` en app.js y mostrado en el DOM (watcher-alert).
- Contraste de `--faint` corregido a `#b8952e` (cumple WCAG AA 4.5:1).
- AnimaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n `pulse` del botÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de instalaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n limitada a 3 iteraciones.
- Despliegue movido de `deploy.yml` raÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­z a `.github/workflows/deploy.yml`.

### Seguridad

- CSP que bloquea scripts externos, iframes, y formularios externos.
- `rel="noopener noreferrer"` en enlaces externos.
- Sin dependencias runtime (solo devDependencies).

### Mejoras

- `--faint` ahora es color sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lido WCAG AA en lugar de opacidad.
- BotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de instalaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n PWA con animaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n no intrusiva.
- DocumentaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n profesional (README, CONTRIBUTING, LICENSE, CHANGELOG).

---

## [0.0.0] ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Proyecto Inicial

- Primera versiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n funcional del calendario de 364 dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as.
- Interfaz bÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡sica con navegaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n y datos litÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºrgicos.
- Sin tests, sin tooling, sin CI/CD.
