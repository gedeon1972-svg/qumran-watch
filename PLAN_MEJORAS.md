# Plan de Mejoras - Qumran Watch
**Versión base:** v13.1.46 | **Fecha:** 2026-08-07
**Objetivo:** Lighthouse PWA >= 90, UX offline completa, zero regression

---

## FASE 1: Quick Wins (<=30 min c/u) — Semana 1

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 1.1 | **Iconos PWA completos** | Generar 192, 144, 96, 72, 48, 32px + maskable desde icon.png (512px) | **DONE** v13.1.47 |
| 1.2 | **Shortcuts en manifest** | Accesos directos: Hoy, Ciclo, Saber, Red | **DONE** v13.1.48 |
| 1.3 | **Screenshots reales** | 2 capturas (mobile narrow + desktop wide) en manifest | **DONE** v13.1.49 |
| 1.4 | **Brotli compression** | vite-plugin-compression con brotli + gzip | **DONE** v13.1.50 |
| 1.5 | **Lighthouse CI workflow** | .github/workflows/lighthouse.yml con budget PWA >= 90 | **DONE** v13.1.51 |

---

## FASE 2: PWA Avanzado (1-2h c/u) — Semana 2

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 2.1 | **Workbox SW** | Migrar sw.js a Workbox: precacheManifest, runtime caching, expiration | **DONE** v13.1.52 |
| 2.2 | **Background Sync ICS** | Cola de generacion .ics offline -> sync al recuperar red | **DONE** v13.1.53 |
| 2.3 | **Periodic Background Sync** | Actualizar datos solares (sunrise/sunset) diariamente en background | **DONE** v13.1.54 |

---

## FASE 3: Push Notifications (2-3h) — Semana 3

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 3.1 | **VAPID keys + Push API** | Generar claves, suscripcion, endpoint en serverless (GitHub Pages compatible) | **NO APLICA** (requiere backend; GH Pages es estatico) |
| 3.2 | **Notificaciones programadas** | Fiestas, Shabat (viernes atardecer), Omer, Tequfot | **DONE** v13.1.56 (local via Notification API + periodic sync, sin backend) |
| 3.3 | **Permission UX** | Prompt contextual + fallback si denegado | **DONE** v13.1.56 (toast clicable contextual + fallback) |

---

## FASE 4: Performance & DX (continuo)

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 4.1 | **IndexedDB cache datos** | Mover FIESTAS/ESTUDIOS/HALAKHA fuera del bundle JS | NO |
| 4.2 | **Web Worker calculos** | Offload NOAA sun calc a worker | NO |
| 4.3 | **Modulepreload polyfill** | Carga paralela modulos ES | **DONE** v13.1.57 (code-split core/ + modulepreload, sin polyfill inline por CSP) |
| 4.4 | **SW Update UX suave** | Toast 'Nueva version' -> skipWaiting + clients.claim() sin parpadeo | **DONE** v13.1.55 |

---

## Reglas de Seguimiento

1. **Un micro-entregable por commit** (patch version bump)
2. **Tests + Build + Lint** antes de cada commit
3. **Actualizar este archivo** marcando DONE
4. **Registro en CHANGELOG.md** por version

---

## Log de Ejecucion

| Fecha | Version | Entregable | Commit | Notas |
|-------|---------|------------|--------|-------|
| 2026-08-07 | v13.1.46 | — | d431198, 0d5f77a | Baseline: fix offline + repo clean |
| 2026-08-07 | v13.1.47 | 1.1 Iconos PWA completos | 2a8ab98 | 7 iconos generados, manifest actualizado, tests+build OK |
| 2026-08-07 | v13.1.48 | 1.2 Shortcuts en manifest | cb7ba2f | 4 shortcuts: Hoy, Ciclo, Saber, Red; tests+build OK |
| 2026-08-07 | v13.1.49 | 1.3 Screenshots reales | 827fad3 | 2 screenshots: mobile 540x720, desktop 1280x720; canvas generados; tests+build OK |
| 2026-08-07 | v13.1.50 | 1.4 Brotli compression | 505ec17 | vite-plugin-compression dual .br/.gz; JS 86KB->31KB .br; tests+build OK |
| 2026-08-07 | v13.1.51 | 1.5 Lighthouse CI workflow | 9cf0b0c | lighthouserc.json budgets + .github/workflows/lighthouse.yml; @lhci/cli; tests+build OK |
| 2026-08-07 | v13.1.52 | 2.1 Workbox SW | 78cb0f9 | injectManifest con 19 assets, CDN workbox-sw.js, runtime caching; tests+build OK |
| 2026-08-10 | v13.1.53 | 2.2 Background Sync ICS | dd59cdf | IndexedDB queue (idb.js), queueICSForSync(), processICSSyncQueue(), SW ics-sync handler, offline-aware btn-export-ics; 79 tests+build OK |
| 2026-08-10 | v13.1.54 | 2.3 Periodic Background Sync | 62630fb | Registro periodicsync 'sun-data' (diario, Chromium), handler REFRESH_SOLAR, fallback si no soportado; 80 tests+build OK |
| 2026-08-10 | v13.1.56 | 3.2+3.3 Notificaciones locales | 86b7be3 | notif-store.js (IndexedDB), notifications.js (computeUpcoming + checkDue + prompt), SW showDueNotifications + CHECK_NOTIFICATIONS; 89 tests+build+lint OK |
| 2026-08-10 | v13.1.57 | 4.3 Modulepreload / code-split | (nuevo) | manualChunks core/ (index 43KB + core 50KB paralelos) + modulePreload.polyfill=false (CSP 'self'); 89 tests+build OK |
