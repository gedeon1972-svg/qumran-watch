# Changelog

## [Unreleased]


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

## [13.1.18] â€” 2026-06-12 â€” PWA Install Banner + Print Toolbar

### Added

- PWA install educational banner with cross-platform support (Android eforeinstallprompt + iOS manual instructions)
- Dedicated calendar print toolbar outside input group (always visible)
- pwa-install.js module for clean separation of install prompt logic

## [13.1.17] Ã¢â‚¬â€ 2026-06-12 Ã¢â‚¬â€ Feature: Calendar Print Support

### Added

- @media print styles for clean, ink-saving calendar printing
- Print action button in calendar view

## [13.1.6] Ã¢â‚¬â€ 2026-06-12 Ã¢â‚¬â€ Fix PWA 404

### AÃƒÂ±adido

- .nojekyll bypass para GitHub Pages
- Rutas absolutas /qumran-watch/ en HTML y SW

### Correcciones

- Correcciones de seguridad: CSP, noopener, sanitizaciÃƒÂ³n innerHTML
- Correcciones de accesibilidad: focus trap, ARIA, contraste
- ActualizaciÃƒÂ³n de documentaciÃƒÂ³n: versiones, AGENTS.md, ADR

## [13.0.0] Ã¢â‚¬â€ 2026-06-05 Ã¢â‚¬â€ RefactorizaciÃƒÂ³n de Arquitectura Base

### AÃƒÂ±adido

- MigraciÃƒÂ³n completa a **ES Modules** con `import`/`export`.
- Sistema multi-agente para orquestaciÃƒÂ³n de tareas (AGENTS.md, opencode.json).
- Suite de tests con **Vitest** (4 archivos, 41 tests).
- Cobertura de cÃƒÂ³digo >70% (100% en data.js, ics.js, sun.js; 98.2% en calendar.js).
- ConfiguraciÃƒÂ³n de **ESLint** (flat config) con reglas ES2020+.
- **Prettier** como formateador unificado.
- **Husky** + **lint-staged** como pre-commit hook (lint + tests obligatorios antes de commit).
- **@vitest/coverage-v8** para reportes de cobertura.
- **CI/CD** con GitHub Actions (test + build + deploy automÃƒÂ¡tico a GitHub Pages).
- **Content-Security-Policy (CSP)** estricta en index.html.
- **Open Graph** y **Twitter Cards** para redes sociales.
- **JSON-LD** con estructura WebApplication.
- Roles ARIA (`role="dialog"`, `aria-modal`, `aria-label`) para accesibilidad WCAG.
- **JSDoc** en todas las funciones pÃƒÂºblicas de calendar.js.

### Corregido

- CÃƒÂ¡lculo del turno sacerdotal: `Math.floor((totalDays + 3) / 7)` alinea semanas al lÃƒÂ­mite dominical.
- Mutaciones de Date en app.js reemplazadas por aritmÃƒÂ©tica de new Date inmutable.
- Rutas en sw.js cambiadas a relativas (`./`) para compatibilidad localhost/producciÃƒÂ³n.
- AÃƒÂ±o dinÃƒÂ¡mico en ics.js: `findLiturgicalStart(year)` escanea desde el 1 de marzo (antes 15 de marzo), ventana de 50 dÃƒÂ­as (antes 30).
- Reemplazo de `alert()` en ics.js por `throw new Error()`.
- Error de ics.js capturado con `try/catch` en app.js y mostrado en el DOM (watcher-alert).
- Contraste de `--faint` corregido a `#b8952e` (cumple WCAG AA 4.5:1).
- AnimaciÃƒÂ³n `pulse` del botÃƒÂ³n de instalaciÃƒÂ³n limitada a 3 iteraciones.
- Despliegue movido de `deploy.yml` raÃƒÂ­z a `.github/workflows/deploy.yml`.

### Seguridad

- CSP que bloquea scripts externos, iframes, y formularios externos.
- `rel="noopener noreferrer"` en enlaces externos.
- Sin dependencias runtime (solo devDependencies).

### Mejoras

- `--faint` ahora es color sÃƒÂ³lido WCAG AA en lugar de opacidad.
- BotÃƒÂ³n de instalaciÃƒÂ³n PWA con animaciÃƒÂ³n no intrusiva.
- DocumentaciÃƒÂ³n profesional (README, CONTRIBUTING, LICENSE, CHANGELOG).

---

## [0.0.0] Ã¢â‚¬â€ Proyecto Inicial

- Primera versiÃƒÂ³n funcional del calendario de 364 dÃƒÂ­as.
- Interfaz bÃƒÂ¡sica con navegaciÃƒÂ³n y datos litÃƒÂºrgicos.
- Sin tests, sin tooling, sin CI/CD.
