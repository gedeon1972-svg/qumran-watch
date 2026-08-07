# Plan de Mejoras - Qumran Watch
**Versión base:** v13.1.46 | **Fecha:** 2026-08-07
**Objetivo:** Lighthouse PWA >= 90, UX offline completa, zero regression

---

## FASE 1: Quick Wins (<=30 min c/u) — Semana 1

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 1.1 | **Iconos PWA completos** | Generar 192, 144, 96, 72, 48, 32px + maskable desde icon.png (512px) | **DONE** v13.1.47 |
| 1.2 | **Shortcuts en manifest** | Accesos directos: Hoy, Ciclo, Saber, Red | **DONE** v13.1.48 |
| 1.3 | **Screenshots reales** | 2 capturas (mobile narrow + desktop wide) en manifest | NO |
| 1.4 | **Brotli compression** | vite-plugin-compression con brotli + gzip | NO |
| 1.5 | **Lighthouse CI workflow** | .github/workflows/lighthouse.yml con budget PWA >= 90 | NO |

---

## FASE 2: PWA Avanzado (1-2h c/u) — Semana 2

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 2.1 | **Workbox SW** | Migrar sw.js a Workbox: precacheManifest, runtime caching, expiration | NO |
| 2.2 | **Background Sync ICS** | Cola de generacion .ics offline -> sync al recuperar red | NO |
| 2.3 | **Periodic Background Sync** | Actualizar datos solares (sunrise/sunset) diariamente en background | NO |

---

## FASE 3: Push Notifications (2-3h) — Semana 3

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 3.1 | **VAPID keys + Push API** | Generar claves, suscripcion, endpoint en serverless (GitHub Pages compatible) | NO |
| 3.2 | **Notificaciones programadas** | Fiestas, Shabat (viernes atardecer), Omer, Tequfot | NO |
| 3.3 | **Permission UX** | Prompt contextual + fallback si denegado | NO |

---

## FASE 4: Performance & DX (continuo)

| ID | Entregable | Descripción | Done |
|----|------------|-------------|------|
| 4.1 | **IndexedDB cache datos** | Mover FIESTAS/ESTUDIOS/HALAKHA fuera del bundle JS | NO |
| 4.2 | **Web Worker calculos** | Offload NOAA sun calc a worker | NO |
| 4.3 | **Modulepreload polyfill** | Carga paralela modulos ES | NO |
| 4.4 | **SW Update UX suave** | Toast "Nueva version" -> skipWaiting + clients.claim() sin parpadeo | NO |

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
| 2026-08-07 | v13.1.48 | 1.2 Shortcuts en manifest | (pendiente) | 4 shortcuts: Hoy, Ciclo, Saber, Red; tests+build OK |