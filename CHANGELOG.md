# Changelog

## [Unreleased]

### Notes
- **4.1 IndexedDB cache datos**: marcado como CUBIERTO por 4.3. Evaluacion: el objetivo (reducir el JS inicial bloqueante) ya esta resuelto por el code-split de core/ (data.js en core.js, 21.1KB gzip, precacheados offline por el SW). Refactor a IndexedDB requeriria fetch async en primer render (flash de carga), async en 8 importadores y reescritura de data.test.js (30 tests) sin beneficio real.

## [13.1.58] - 2026-08-10 - Performance: Web Worker para calculo NOAA (4.2)

### Added
- `src/js/core/sun-algo.js`: Algoritmo NOAA puro (sin estado/DOM), fuente unica compartida entre main thread y worker
- `src/js/core/sun-worker.js`: Web Worker ES module que ejecuta el algoritmo NOAA fuera del main thread
- `src/js/core/sun-worker-client.js`: `calcSunTimesAsync(date, lat, lng)` con worker si disponible y fallback sincrono (timeout 1s / worker ausente / error)
- `test/sun.test.js`: Tests del worker client (igualdad con sincrono) y verificacion de fuente unica (91 totales)

### Changed
- `src/js/core/sun.js`: Ahora re-exporta desde `sun-algo.js` (API identica, sin cambios de comportamiento)
- `src/js/app.js`: `updateSunData` usa `calcSunTimesAsync` (render asincrono con fallback inmediato)
- `vite.config.js`: `worker.format=es` con `entryFileNames: assets/[name].js` — el worker se emite como `assets/sun-worker.js` (sin hash, compatible con sw precache)
- `public/sw.js`: Regenerado con injectManifest, v13.1.58 (21 assets, incluye worker)
- `package.json`, `package-lock.json`, `public/manifest.json`, `public/sw-workbox.js`: version 13.1.57 -> 13.1.58

## [13.1.57] - 2026-08-10 - Performance: Code-splitting + modulepreload (4.3)

### Changed
- `vite.config.js`: `build.modulePreload.polyfill=false` (polyfill obsoleto y bloqueado por la CSP `script-src 'self'`; navegadores modernos soportan modulepreload nativamente)
- `vite.config.js`: `manualChunks` agrupa `src/js/core/*` en chunk `core` — carga paralela vía `<link rel=modulepreload>`; bundle monolítico 95KB -> index 43KB + core 50KB
- `public/sw.js`: Regenerado con injectManifest, v13.1.57 (20 assets)
- `package.json`, `package-lock.json`, `public/manifest.json`, `public/sw-workbox.js`: version 13.1.56 -> 13.1.57

## [13.1.56] - 2026-08-10 - Feature: Notificaciones locales (FASE 3)

### Added
- `src/js/core/notif-store.js`: Wrapper IndexedDB (db `qumran-notif-db`, store `schedule`) para la agenda de notificaciones
- `src/js/core/notifications.js`: `Notifications` con `init()`, `computeUpcoming(days)` (Shabat preparacion + Fiestas proximos 10 dias), `checkDue()`, `scheduleUpcoming()`, `requestPermission()` y `notifyServiceWorker()`
- `src/js/app.js`: `QumranApp.setupNotifications()` — si permiso granted programa y avisa al SW; si default muestra toast clicable contextual a los 4s
- `public/sw-workbox.js`: `showDueNotifications()` — SW lee agenda de IndexedDB, muestra Notification y marca como completada; integrado en mensaje `CHECK_NOTIFICATIONS` y `periodicsync`
- `test/notifications.test.js`: Tests de computeUpcoming, init y permission (89 totales)

### Changed
- `public/sw.js`: Regenerado con injectManifest, v13.1.56
- `package.json`, `package-lock.json`, `public/manifest.json`: version 13.1.55 -> 13.1.56

### Notes
- Push real (VAPID) NO APLICA: GitHub Pages no puede alojar un endpoint de push. Se implemento un subset viable 100% offline con Notification API local + Periodic Background Sync (funciona en Chromium con la app abierta/instalada, sin backend).

## [13.1.55] - 2026-08-10 - Feature: SW Update UX suave

### Added
- `src/js/app.js`: `QumranApp.setupSWUpdate()` detecta nueva version (updatefound), muestra toast clicable 'Nueva version disponible', envia SKIP_WAITING y recarga al activarse (controllerchange) sin parpadeo
- `src/js/app.js`: `showToast(msg, onClick)` ahora soporta accion clicable
- `src/css/styles.css`: clase `.toast-clickable`
- `test/app.test.js`: Tests para showToast con/sin onClick y setupSWUpdate

### Changed
- `public/sw-workbox.js`: Se removio skipWaiting/claim automatico; ahora el claim ocurre solo cuando el usuario confirma via toast (mensaje SKIP_WAITING)
- `public/sw.js`: Regenerado con injectManifest, v13.1.55
- `package.json`, `package-lock.json`, `public/manifest.json`: version 13.1.54 -> 13.1.55

## [13.1.54] - 2026-08-10 - Feature: Periodic Background Sync (solar data)

### Added
- `public/sw-workbox.js`: Handler `periodicsync` para tag 'sun-data' que notifica REFRESH_SOLAR a clientes
- `src/js/app.js`: `QumranApp.registerPeriodicSync()` registra 'sun-data' diario (24h) cuando la API esta disponible y con permiso otorgado
- `src/js/app.js`: `QumranApp.refreshSolarData()` recalcula sunrise/sunset al recibir REFRESH_SOLAR del SW
- `test/pwa.test.js`: Auditoria de handler periodicsync en sw.js

### Changed
- `public/sw.js`: Regenerado con injectManifest, v13.1.54
- `package.json`, `package-lock.json`, `public/manifest.json`: version 13.1.53 -> 13.1.54

## [13.1.53] - 2026-08-10 - Feature: Background Sync ICS (offline queue)

### Added
- `src/js/core/idb.js`: IndexedDB wrapper para cola offline (add, getAll, update, delete, clear) con store 'ics-queue'
- `QumranICS.queueICSForSync(year)`: Encola generacion ICS en IndexedDB y registra background sync ('ics-sync')
- `QumranICS.processICSSyncQueue()`: Procesa items pendientes, genera/descarga ICS, limpia completados >24h
- `public/sw-workbox.js`: Handler de Background Sync para 'ics-sync' que envia PROCESS_ICS_SYNC a clientes
- `src/js/app.js`: Listener de mensajes del SW procesa PROCESS_ICS_SYNC; btn-export-ics ahora usa navigator.onLine con fallback offline

### Fixed
- `src/js/ics.js`: Template literals corrompidos restaurados (backticks + ${var} interpolation), BOM eliminado, newline final agregado

### Changed
- `public/sw.js`: Regenerado con injectManifest, v13.1.53, 19 assets precacheados + background sync
- `package.json`, `package-lock.json`, `public/manifest.json`: version 13.1.52 -> 13.1.53


## [13.1.31] - 2026-06-13 - Hotfix: Cache-bust obligatorio para purgar versión corrupta

### Fixed
- `public/sw.js`: `CACHE_NAME` actualizado de `qumran-cache-v13.1.21` a `qumran-cache-v13.1.31` para forzar la descarga del nuevo Service Worker en todos los dispositivos que tenían la versión con Mojibake.
- `package.json`: versión bumpeada de 13.1.30 → 13.1.31.

### Context
El commit anterior (`fix(global): saneamiento profundo de mojibake`) no actualizó el `CACHE_NAME`, lo que habría impedido que el SW se auto-actualizase en usuarios ya instalados. Este hotfix garantiza que la versión limpia se despliegue correctamente en todos los clientes.

## [13.1.30] - 2026-06-13 - Fix: Saneamiento global de Mojibake (encoding UTF-8)

### Fixed
- Purga completa de caracteres corruptos (Mojibake) en `src/js/app.js`, `src/js/core/calculations.js`, `src/js/core/calendar.js`, `public/sw.js`, `src/css/styles.css`, `CHANGELOG.md`, `LICENSE` y archivos de test.
- Reemplazo correcto de `CÁNTICO`, `DÍA`, `⏳`, `—`, `Jáyt` y demás secuencias UTF-8 doble-codificadas.

 - Mantenimiento: Resoluci??n completa de advertencias de ESLint, eliminaci??n de variables no utilizadas, correcci??n de espacios irregulares y actualizaci??n de CI runner a Node 24.

### Changed
- src/js/ui/print-view.js: refactorizado todo var a const/let para cumplir con no-var
- public/sw.js: corregidos espacios irregulares (no-irregular-whitespace) en comentarios de cabecera
- src/js/app.js: eliminadas variables no utilizadas (newWorker, isStandalone, reg en SW callback)
- src/js/core/calculations.js: eliminado par??metro sunData no utilizado de buildHoyViewModel()
- .github/workflows/*.yml: ya usaban node-version: "24" (confirmado, sin cambios necesarios)

### Security
- Suprimidos warnings security/detect-object-injection con comentarios eslint-disable-next-line en calendar.js, calculations.js y app.js (datos internos controlados)
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

## [13.1.18] - 2026-06-12 - PWA Install Banner + Print Toolbar

### Added

- PWA install educational banner with cross-platform support (Android  eforeinstallprompt + iOS manual instructions)
- Dedicated calendar print toolbar outside input group (always visible)
- pwa-install.js module for clean separation of install prompt logic

## [13.1.17] - 2026-06-12 - Feature: Calendar Print Support

### Added

- @media print styles for clean, ink-saving calendar printing
- Print action button in calendar view

## [13.1.6] - 2026-06-12 - Fix PWA 404

### Añadido

- .nojekyll bypass para GitHub Pages
- Rutas absolutas /qumran-watch/ en HTML y SW

### Correcciones

- Correcciones de seguridad: CSP, noopener, sanitización innerHTML
- Correcciones de accesibilidad: focus trap, ARIA, contraste
- Actualización de documentación: versiones, AGENTS.md, ADR

## [13.0.0] - 2026-06-05 - Refactorización de Arquitectura Base

### Añadido

- Migración completa a **ES Modules** con `import`/`export`.
- Sistema multi-agente para orquestación de tareas (AGENTS.md, opencode.json).
- Suite de tests con **Vitest** (4 archivos, 41 tests).
- Cobertura de código >70% (100% en data.js, ics.js, sun.js; 98.2% en calendar.js).
- Configuración de **ESLint** (flat config) con reglas ES2020+.
- **Prettier** como formateador unificado.
- **Husky** + **lint-staged** como pre-commit hook (lint + tests obligatorios antes de commit).
- **@vitest/coverage-v8** para reportes de cobertura.
- **CI/CD** con GitHub Actions (test + build + deploy automático a GitHub Pages).
- **Content-Security-Policy (CSP)** estricta en index.html.
- **Open Graph** y **Twitter Cards** para redes sociales.
- **JSON-LD** con estructura WebApplication.
- Roles ARIA (`role="dialog"`, `aria-modal`, `aria-label`) para accesibilidad WCAG.
- **JSDoc** en todas las funciones públicas de calendar.js.

### Corregido

- Cálculo del turno sacerdotal: `Math.floor((totalDays + 3) / 7)` alinea semanas al límite dominical.
- Mutaciones de Date en app.js reemplazadas por aritmética de new Date inmutable.
- Rutas en sw.js cambiadas a relativas (`./`) para compatibilidad localhost/producción.
- Año dinámico en ics.js: `findLiturgicalStart(year)` escanea desde el 1 de marzo (antes 15 de marzo), ventana de 50 días (antes 30).
- Reemplazo de `alert()` en ics.js por `throw new Error()`.
- Error de ics.js capturado con `try/catch` en app.js y mostrado en el DOM (watcher-alert).
- Contraste de `--faint` corregido a `#b8952e` (cumple WCAG AA 4.5:1).
- Animación `pulse` del botón de instalación limitada a 3 iteraciones.
- Despliegue movido de `deploy.yml` raíz a `.github/workflows/deploy.yml`.

### Seguridad

- CSP que bloquea scripts externos, iframes, y formularios externos.
- `rel="noopener noreferrer"` en enlaces externos.
- Sin dependencias runtime (solo devDependencies).

### Mejoras

- `--faint` ahora es color sólido WCAG AA en lugar de opacidad.
- Botón de instalación PWA con animación no intrusiva.
- Documentación profesional (README, CONTRIBUTING, LICENSE, CHANGELOG).

---

## [0.0.0] - Proyecto Inicial

- Primera versión funcional del calendario de 364 días.
- Interfaz básica con navegación y datos litúrgicos.
- Sin tests, sin tooling, sin CI/CD.
