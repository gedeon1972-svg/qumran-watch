# Changelog

## [Unreleased]

## [13.1.18] — 2026-06-12 — PWA Install Banner + Print Toolbar

### Added
- PWA install educational banner with cross-platform support (Android eforeinstallprompt + iOS manual instructions)
- Dedicated calendar print toolbar outside input group (always visible)
- pwa-install.js module for clean separation of install prompt logic

## [13.1.17] â€” 2026-06-12 â€” Feature: Calendar Print Support

### Added
- @media print styles for clean, ink-saving calendar printing
- Print action button in calendar view

## [13.1.6] â€” 2026-06-12 â€” Fix PWA 404
### AÃ±adido
- .nojekyll bypass para GitHub Pages
- Rutas absolutas /qumran-watch/ en HTML y SW

### Correcciones
- Correcciones de seguridad: CSP, noopener, sanitizaciÃ³n innerHTML
- Correcciones de accesibilidad: focus trap, ARIA, contraste
- ActualizaciÃ³n de documentaciÃ³n: versiones, AGENTS.md, ADR


## [13.0.0] â€” 2026-06-05 â€” RefactorizaciÃ³n de Arquitectura Base

### AÃ±adido
- MigraciÃ³n completa a **ES Modules** con `import`/`export`.
- Sistema multi-agente para orquestaciÃ³n de tareas (AGENTS.md, opencode.json).
- Suite de tests con **Vitest** (4 archivos, 41 tests).
- Cobertura de cÃ³digo >70% (100% en data.js, ics.js, sun.js; 98.2% en calendar.js).
- ConfiguraciÃ³n de **ESLint** (flat config) con reglas ES2020+.
- **Prettier** como formateador unificado.
- **Husky** + **lint-staged** como pre-commit hook (lint + tests obligatorios antes de commit).
- **@vitest/coverage-v8** para reportes de cobertura.
- **CI/CD** con GitHub Actions (test + build + deploy automÃ¡tico a GitHub Pages).
- **Content-Security-Policy (CSP)** estricta en index.html.
- **Open Graph** y **Twitter Cards** para redes sociales.
- **JSON-LD** con estructura WebApplication.
- Roles ARIA (`role="dialog"`, `aria-modal`, `aria-label`) para accesibilidad WCAG.
- **JSDoc** en todas las funciones pÃºblicas de calendar.js.

### Corregido
- CÃ¡lculo del turno sacerdotal: `Math.floor((totalDays + 3) / 7)` alinea semanas al lÃ­mite dominical.
- Mutaciones de Date en app.js reemplazadas por aritmÃ©tica de new Date inmutable.
- Rutas en sw.js cambiadas a relativas (`./`) para compatibilidad localhost/producciÃ³n.
- AÃ±o dinÃ¡mico en ics.js: `findLiturgicalStart(year)` escanea desde el 1 de marzo (antes 15 de marzo), ventana de 50 dÃ­as (antes 30).
- Reemplazo de `alert()` en ics.js por `throw new Error()`.
- Error de ics.js capturado con `try/catch` en app.js y mostrado en el DOM (watcher-alert).
- Contraste de `--faint` corregido a `#b8952e` (cumple WCAG AA 4.5:1).
- AnimaciÃ³n `pulse` del botÃ³n de instalaciÃ³n limitada a 3 iteraciones.
- Despliegue movido de `deploy.yml` raÃ­z a `.github/workflows/deploy.yml`.

### Seguridad
- CSP que bloquea scripts externos, iframes, y formularios externos.
- `rel="noopener noreferrer"` en enlaces externos.
- Sin dependencias runtime (solo devDependencies).

### Mejoras
- `--faint` ahora es color sÃ³lido WCAG AA en lugar de opacidad.
- BotÃ³n de instalaciÃ³n PWA con animaciÃ³n no intrusiva.
- DocumentaciÃ³n profesional (README, CONTRIBUTING, LICENSE, CHANGELOG).

---

## [0.0.0] â€” Proyecto Inicial

- Primera versiÃ³n funcional del calendario de 364 dÃ­as.
- Interfaz bÃ¡sica con navegaciÃ³n y datos litÃºrgicos.
- Sin tests, sin tooling, sin CI/CD.
