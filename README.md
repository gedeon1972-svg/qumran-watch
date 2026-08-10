# Qumran Watch â€” El Reloj de los Hijos de Sadoc

[![Build](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/deploy.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/deploy.yml)
[![CI](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/ci.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/lighthouse.yml)
[![License](https://img.shields.io/github/license/gedeon1972-svg/qumran-watch)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline-blue)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![JavaScript](https://img.shields.io/badge/ES6-Modules-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![Version](https://img.shields.io/badge/version-13.1.61-gold)](package.json)

AplicaciÃ³n Web Progresiva (PWA) que restaura el **Calendario Solar de 364 DÃ­as** de los Manuscritos del Mar Muerto, con sincronizaciÃ³n GPS, ciclo de 24 turnos sacerdotales (Mishmarot), alertas ICS y biblioteca de estudios bÃ­blicos. Funciona **100% offline**.

---

## CaracterÃ­sticas

- **Motor AstronÃ³mico GPS** â€” SincronizaciÃ³n en tiempo real de salida/puesta del sol basada en la ubicaciÃ³n del usuario; ajusta el inicio del dÃ­a bÃ­blico. CÃ¡lculo NOAA ejecutado en un **Web Worker** con fallback sÃ­ncrono.
- **Calendario de 364 DÃ­as** â€” ImplementaciÃ³n matemÃ¡tica fiel a 1 Enoc, Jubileos y los rollos de QumrÃ¡n.
- **Ciclo de Mishmarot** â€” 24 turnos sacerdotales perpetuos, anclados al 20 de Marzo de 2019 (Turno de Gamul).
- **Alertas ICS** â€” Exporta las fiestas sagradas al calendario nativo del celular con notificaciones programadas.
- **Notificaciones locales** â€” Recordatorios de Shabat de preparaciÃ³n y Fiestas de YHWH vÃ­a Notification API + cola IndexedDB, 100% sin backend.
- **Biblioteca "Saber"** â€” Estudios profundos, Salmos diarios y CÃ¡nticos de Shabat del Templo Celestial.
- **InstrucciÃ³n del MesÃ­as** â€” Halakha diaria con filologÃ­a, contexto y cita textual.
- **100% Offline** â€” Service Worker Workbox con estrategia cache-first, precache con hashes verificados; sin dependencia de red.
- **Background Sync** â€” Cola offline para exportaciÃ³n ICS y sincronizaciÃ³n periÃ³dica de datos solares.
- **Zero Runtime Dependencies** â€” Vanilla JS ES6, sin React, Vue ni frameworks externos.
- **Accesibilidad WCAG AA** â€” Contraste suficiente, roles ARIA, navegaciÃ³n por teclado.
- **CSP Estricta** â€” Content-Security-Policy que bloquea scripts e iframes externos.

---

## TecnologÃ­as

| Herramienta | PropÃ³sito |
|-------------|-----------|
| [Vite](https://vitejs.dev/) | Bundler y dev server (code-splitting core + modulepreload) |
| [Vitest](https://vitest.dev/) + [@vitest/coverage-v8](https://www.npmjs.com/package/@vitest/coverage-v8) | Testing y cobertura (104 tests) |
| [Workbox](https://developer.chrome.com/docs/workbox/) | Service Worker con precache + runtime caching |
| [fake-indexeddb](https://www.npmjs.com/package/fake-indexeddb) | Testing de mÃ³dulos IndexedDB en Node |
| [ESLint](https://eslint.org/) (flat config) + [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security) | Linter con reglas de seguridad (0 warnings) |
| [Prettier](https://prettier.io/) | Formateador |
| [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Pre-commit hooks |
| [Terser](https://terser.org/) | MinificaciÃ³n en build |

---

## InstalaciÃ³n y Desarrollo Local

```bash
# Clonar
git clone https://github.com/gedeon1972-svg/qumran-watch.git
cd qumran-watch

# Instalar dependencias (solo devDependencies)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm test

# Ver cobertura
npm run test:coverage

# Linter
npm run lint

# Formatear cÃ³digo
npm run format

# Build de producciÃ³n
npm run build

# Regenerar Service Worker con hashes del build (SIEMPRE tras build)
npm run generate-sw

# Vista previa del build
npm run preview
```

> **Importante:** el orden correcto es `npm run build` y luego `npm run generate-sw` para que el precache del Service Worker incluya los hashes finales.

### Pre-commit Hook

Al hacer `git commit`, Husky ejecuta automÃ¡ticamente:

1. `lint-staged` â†’ ESLint + Prettier sobre los archivos staged.
2. `vitest run` â†’ todos los tests deben pasar.

Si alguno falla, el commit se rechaza.

---

## Scripts Disponibles

| Comando | DescripciÃ³n |
|---------|-------------|
| `npm run dev` | Dev server con HMR |
| `npm run build` | Build producciÃ³n a `./dist` |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | ESLint sobre `src/`, `public/`, `test/` |
| `npm run format` | Prettier sobre todo el cÃ³digo |
| `npm run format:check` | Verifica formato sin modificar |
| `npm run generate-sw` | Regenera `public/sw.js` desde `./dist` (Workbox injectManifest) |
| `npm run lighthouse` | AuditorÃ­a Lighthouse CI local |

---

## CI/CD y Despliegue

| Workflow | Trigger | FunciÃ³n |
|----------|---------|---------|
| `ci.yml` | push/PR a main | lint + tests + build |
| `deploy.yml` | push a main | build y publica `./dist` en GitHub Pages |
| `lighthouse.yml` | push a main | AuditorÃ­a PWA (budget >= 90) |

El despliegue en GitHub Pages es automÃ¡tico desde la rama `main` (workflow `deploy.yml`).

---

## Estructura del Proyecto

```
qumran-watch/
â”œâ”€â”€ index.html            # Interfaz HTML5 con CSP, OG, JSON-LD
â”œâ”€â”€ vite.config.js        # ConfiguraciÃ³n Vite + Vitest (worker, chunks, brotli/gzip)
â”œâ”€â”€ generate-sw.cjs       # Generador de sw.js con Workbox injectManifest
â”œâ”€â”€ eslint.config.mjs     # ESLint flat config + reglas de seguridad
â”œâ”€â”€ .prettierrc           # ConfiguraciÃ³n Prettier
â”œâ”€â”€ .husky/pre-commit     # Hook pre-commit
â”œâ”€â”€ .lintstagedrc.json    # ConfiguraciÃ³n lint-staged
â”œâ”€â”€ .github/workflows/    # CI + Deploy + Lighthouse
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ sw.js             # Service Worker generado (Workbox precache + sync)
â”‚   â”œâ”€â”€ manifest.json     # ConfiguraciÃ³n PWA (iconos, screenshots, shortcuts)
â”‚   â””â”€â”€ ...
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ css/
â”‚   â”‚   â”œâ”€â”€ styles.css    # Estilos globales
â”‚   â”‚   â””â”€â”€ fonts/        # Fuentes locales (Cinzel, David Libre)
â”‚   â””â”€â”€ js/
â”‚       â”œâ”€â”€ app.js        # Controlador principal
â”‚       â”œâ”€â”€ ics.js        # Generador de archivos ICS
â”‚       â”œâ”€â”€ theme.js      # Tema / modo oscuro
â”‚       â”œâ”€â”€ core/
â”‚       â”‚   â”œâ”€â”€ data.js           # Datos litÃºrgicos estÃ¡ticos
â”‚       â”‚   â”œâ”€â”€ calendar.js       # Motor del calendario 364 dÃ­as
â”‚       â”‚   â”œâ”€â”€ sun.js            # API solar (re-exporta sun-algo)
â”‚       â”‚   â”œâ”€â”€ sun-algo.js       # Algoritmo NOAA puro (fuente Ãºnica)
â”‚       â”‚   â”œâ”€â”€ sun-worker.js     # Web Worker de cÃ¡lculo solar
â”‚       â”‚   â”œâ”€â”€ sun-worker-client.js # Cliente worker con fallback sÃ­ncrono
â”‚       â”‚   â”œâ”€â”€ idb.js            # Cola IndexedDB (offline ICS)
â”‚       â”‚   â”œâ”€â”€ notif-store.js    # Agenda IndexedDB de notificaciones
â”‚       â”‚   â”œâ”€â”€ notifications.js  # Recordatorios locales (Shabat + Fiestas)
â”‚       â”‚   â”œâ”€â”€ storage.js        # localStorage helper
â”‚       â”‚   â”œâ”€â”€ calculations.js   # LÃ³gica de cÃ¡lculo litÃºrgico
â”‚       â”‚   â””â”€â”€ time-translator.js# TraducciÃ³n de tiempo
â”‚       â””â”€â”€ ui/           # Vistas (hoy, calendar, fiesta, estudio, print, pwa-install, ...)
â””â”€â”€ test/
    â”œâ”€â”€ calendar.test.js  # Tests del motor calendario
    â”œâ”€â”€ data.test.js      # Tests de integridad de datos
    â”œâ”€â”€ sun.test.js       # Tests del algoritmo solar + worker client
    â”œâ”€â”€ ics.test.js       # Tests del generador ICS
    â”œâ”€â”€ app.test.js       # Tests del controlador
    â”œâ”€â”€ notifications.test.js # Tests de notificaciones
    â”œâ”€â”€ idb.test.js       # Tests de IndexedDB (idb + notif-store)
    â”œâ”€â”€ calculations.test.js # Tests de cÃ¡lculo litÃºrgico
    â””â”€â”€ pwa.test.js       # AuditorÃ­a PWA (manifest + SW)
```

---

## Plan de Mejoras

El plan completo de evoluciÃ³n (FASES 1-5, incluyendo industrializaciÃ³n a CMMI Nivel 3) estÃ¡ en [PLAN_MEJORAS.md](PLAN_MEJORAS.md). Todas las fases 1-4 estÃ¡n cerradas; la FASE 5 estÃ¡ en ejecuciÃ³n con micro-entregables (cobertura, E2E Playwright, gate de CI, branch protection, releases).

---

## Changelog

El historial completo estÃ¡ en [CHANGELOG.md](CHANGELOG.md). Resumen reciente:

### 13.1.61 (2026-08-10)
Cobertura de mÃ³dulos IndexedDB (idb + notif-store) al 100% (5.1), lint 0 warnings (cero deuda), fix de despliegue eliminando devDependency muerta `canvas` que bloqueaba CI.

### 13.1.58 (2026-08-10)
Web Worker para cÃ¡lculo NOAA con fallback sÃ­ncrono (4.2).

### 13.1.57 (2026-08-10)
Code-splitting del mÃ³dulo core + modulepreload, sin polyfill inline por CSP (4.3).

### 13.1.56 (2026-08-10)
Notificaciones locales: Shabat de preparaciÃ³n + Fiestas de YHWH vÃ­a Notification API + IndexedDB (3.2 + 3.3).

### 13.1.55 (2026-08-10)
ActualizaciÃ³n de Service Worker con UX suave (toast clicable, skipWaiting bajo demanda) (4.4).

### 13.1.54 (2026-08-10)
Periodic Background Sync diario para datos solares (2.3).

### 13.1.53 (2026-08-10)
Background Sync ICS: cola offline con reenvÃ­o al recuperar red (2.2).

### 13.1.52 (2026-08-10)
MigraciÃ³n a Workbox SW con precache y runtime caching (2.1).

### 13.1.47 - 13.1.51 (2026-08-07)
Iconos PWA completos, shortcuts, screenshots, compresiÃ³n Brotli/gzip y workflow Lighthouse CI (FASE 1).

### 13.1.6 (2026-06-12)
Fix definitivo PWA 404: .nojekyll bypass y rutas absolutas.

---

## Licencia

[MIT](LICENSE) &mdash; libre para usar, modificar y distribuir.
