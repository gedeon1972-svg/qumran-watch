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
| 4.1 | **IndexedDB cache datos** | Mover FIESTAS/ESTUDIOS/HALAKHA fuera del bundle JS | **CUBIERTO** por 4.3 (code-split) + SW precache: data.js en core.js 21KB gzip, carga paralela, 100% offline |
| 4.2 | **Web Worker calculos** | Offload NOAA sun calc a worker | **DONE** v13.1.58 (sun-algo.js puro + worker sin hash + fallback sincrono) |
| 4.3 | **Modulepreload polyfill** | Carga paralela modulos ES | **DONE** v13.1.57 (code-split core/ + modulepreload, sin polyfill inline por CSP) |
| 4.4 | **SW Update UX suave** | Toast 'Nueva version' -> skipWaiting + clients.claim() sin parpadeo | **DONE** v13.1.55 |

---


## FASE 5: Industrializacion (CMMI Nivel 3) — Semanas 4-6

**Diagnostico base (2026-08-10):** cobertura 66% statements / 41% branches; sin E2E; flujos criticos (GPS, notificaciones, descarga ICS, instalacion PWA) solo con tests unitarios.

**Regla de micro-entregas:** un commit por fila (patch version bump), tests+build+lint en cada commit, registro en CHANGELOG y en el Log de Ejecucion.

| ID | Micro-entregable | Descripcion | Done |
|----|------------------|-------------|------|
| 5.1 | **Cobertura idb + notif-store** | Subir idb.js y notif-store.js de ~26-31% a >=80% statements (tests de CRUD, index date, markShown, cleanup) | NO |
| 5.2 | **Cobertura storage + worker-client** | Subir storage.js (47%) y sun-worker-client.js (31%) a >=80% (fallback sincrono, timeout, error de worker) | NO |
| 5.3 | **Cobertura print-view + pwa-install** | Subir print-view.js (4.6%) y pwa-install.js (3.3%) a >=80% (render, beforeinstallprompt, appinstalled) | NO |
| 5.4 | **Cobertura notifications + time-translator** | Subir notifications.js (63%) y time-translator.js (72%) a >=80% (checkDue, scheduleUpcoming, permiso denegado) | NO |
| 5.5 | **Cobertura branches core** | Subir branches de 41% a >=60% (edge cases: polar, sin datos, anio fuera de rango, GPS fallo) | NO |
| 5.6 | **Gate de cobertura en CI** | Thresholds en vite.config (statements>=80, branches>=60) + ci.yml falla el build si no se cumple | NO |
| 5.7 | **E2E setup + smoke** | Playwright + @playwright/test: setup, webServer (vite preview), smoke de carga de la app y navegacion SPA | NO |
| 5.8 | **E2E GPS fallback** | Flujo: denegar geolocalizacion -> se muestra fallback Jerusalen y sunrise/sunset visibles | NO |
| 5.9 | **E2E descarga ICS** | Flujo: navegar a Ciclo, generar, click export -> se descarga .ics valido (BEGIN/END:VCALENDAR) | NO |
| 5.10 | **E2E permiso notificaciones** | Flujo: aceptar permiso -> toast de activacion; denegar -> mensaje de fallback | NO |
| 5.11 | **E2E instalacion PWA** | Flujo: beforeinstallprompt -> se muestra boton INSTALAR; appinstalled -> boton se oculta | NO |
| 5.12 | **Branch protection + PR** | Ruleset en GitHub: PR obligatorio, 1 review, status checks (ci + coverage), sin push directo a main | NO |
| 5.13 | **Release tagging** | Workflow: tag vX.Y.Z + GitHub Release automatico por merge a main, lectura de version desde package.json | NO |

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
| 2026-08-10 | v13.1.55 | 4.4 SW Update UX suave | 98ecc74 | setupSWUpdate con toast clicable + SKIP_WAITING bajo demanda, sin skipWaiting automatico; 83 tests+build OK |
| 2026-08-10 | v13.1.56 | 3.2+3.3 Notificaciones locales | 86b7be3 | notif-store.js (IndexedDB), notifications.js (computeUpcoming + checkDue + prompt), SW showDueNotifications + CHECK_NOTIFICATIONS; 89 tests+build+lint OK |
| 2026-08-10 | v13.1.57 | 4.3 Modulepreload / code-split | 302db29 | manualChunks core/ (index 43KB + core 50KB paralelos) + modulePreload.polyfill=false (CSP 'self'); 89 tests+build OK |
| 2026-08-10 | v13.1.58 | 4.2 Web Worker NOAA | b9c0c26 | sun-algo.js (fuente unica), sun-worker.js + sun-worker-client.js con fallback, vite worker config sin hash; 91 tests+build+lint OK |
| 2026-08-10 | v13.1.58 | 4.1 IndexedDB cache datos | CUBIERTO | Evaluado: objetivo (reducir JS inicial) ya resuelto por 4.3 code-split + SW precache; refactor a IDB romperia 8 importadores y 30+ tests sin beneficio |
