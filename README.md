# Qumran Watch — El Reloj de los Hijos de Sadoc

[![Build](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/deploy.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/deploy.yml)
[![CI](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/ci.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/lighthouse.yml)
[![License](https://img.shields.io/github/license/gedeon1972-svg/qumran-watch)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline-blue)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![JavaScript](https://img.shields.io/badge/ES6-Modules-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![Version](https://img.shields.io/badge/version-13.1.66-gold)](package.json)

Aplicación Web Progresiva (PWA) que restaura el **Calendario Solar de 364 Días** de los Manuscritos del Mar Muerto, con sincronización GPS, ciclo de 24 turnos sacerdotales (Mishmarot), alertas ICS y biblioteca de estudios bíblicos. Funciona **100% offline**.

---

## Características

- **Motor Astronómico GPS** — Sincronización en tiempo real de salida/puesta del sol basada en la ubicación del usuario; ajusta el inicio del día bíblico. Cálculo NOAA ejecutado en un **Web Worker** con fallback síncrono.
- **Calendario de 364 Días** — Implementación matemática fiel a 1 Enoc, Jubileos y los rollos de Qumrán.
- **Ciclo de Mishmarot** — 24 turnos sacerdotales perpetuos, anclados al 20 de Marzo de 2019 (Turno de Gamul).
- **Alertas ICS** — Exporta las fiestas sagradas al calendario nativo del celular con notificaciones programadas.
- **Notificaciones locales** — Recordatorios de Shabat de preparación y Fiestas de YHWH vía Notification API + cola IndexedDB, 100% sin backend.
- **Biblioteca "Saber"** — Estudios profundos, Salmos diarios y Cánticos de Shabat del Templo Celestial.
- **Instrucción del Mesías** — Halakha diaria con filología, contexto y cita textual.
- **100% Offline** — Service Worker Workbox con estrategia cache-first, precache con hashes verificados; sin dependencia de red.
- **Background Sync** — Cola offline para exportación ICS y sincronización periódica de datos solares.
- **Zero Runtime Dependencies** — Vanilla JS ES6, sin React, Vue ni frameworks externos.
- **Accesibilidad WCAG AA** — Contraste suficiente, roles ARIA, navegación por teclado.
- **CSP Estricta** — Content-Security-Policy que bloquea scripts e iframes externos.

---

## Tecnologías

| Herramienta | Propósito |
|-------------|-----------|
| [Vite](https://vitejs.dev/) | Bundler y dev server (code-splitting core + modulepreload) |
| [Vitest](https://vitest.dev/) + [@vitest/coverage-v8](https://www.npmjs.com/package/@vitest/coverage-v8) | Testing y cobertura (104 tests) |
| [Workbox](https://developer.chrome.com/docs/workbox/) | Service Worker con precache + runtime caching |
| [fake-indexeddb](https://www.npmjs.com/package/fake-indexeddb) | Testing de módulos IndexedDB en Node |
| [ESLint](https://eslint.org/) (flat config) + [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security) | Linter con reglas de seguridad (0 warnings) |
| [Prettier](https://prettier.io/) | Formateador |
| [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Pre-commit hooks |
| [Terser](https://terser.org/) | Minificación en build |

---

## Instalación y Desarrollo Local

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

# Formatear código
npm run format

# Build de producción
npm run build

# Regenerar Service Worker con hashes del build (SIEMPRE tras build)
npm run generate-sw

# Vista previa del build
npm run preview
```

> **Importante:** el orden correcto es `npm run build` y luego `npm run generate-sw` para que el precache del Service Worker incluya los hashes finales.

### Pre-commit Hook

Al hacer `git commit`, Husky ejecuta automáticamente:

1. `lint-staged` → ESLint + Prettier sobre los archivos staged.
2. `vitest run` → todos los tests deben pasar.

Si alguno falla, el commit se rechaza.

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Dev server con HMR |
| `npm run build` | Build producción a `./dist` |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | ESLint sobre `src/`, `public/`, `test/` |
| `npm run format` | Prettier sobre todo el código |
| `npm run format:check` | Verifica formato sin modificar |
| `npm run generate-sw` | Regenera `public/sw.js` desde `./dist` (Workbox injectManifest) |
| `npm run lighthouse` | Auditoría Lighthouse CI local |

---

## CI/CD y Despliegue

| Workflow | Trigger | Función |
|----------|---------|---------|
| `ci.yml` | push/PR a main | lint + tests + build |
| `deploy.yml` | push a main | build y publica `./dist` en GitHub Pages |
| `lighthouse.yml` | push a main | Auditoría PWA (budget >= 90) |

El despliegue en GitHub Pages es automático desde la rama `main` (workflow `deploy.yml`).

---

## Estructura del Proyecto

```
qumran-watch/
├── index.html            # Interfaz HTML5 con CSP, OG, JSON-LD
├── vite.config.js        # Configuración Vite + Vitest (worker, chunks, brotli/gzip)
├── generate-sw.cjs       # Generador de sw.js con Workbox injectManifest
├── eslint.config.mjs     # ESLint flat config + reglas de seguridad
├── .prettierrc           # Configuración Prettier
├── .husky/pre-commit     # Hook pre-commit
├── .lintstagedrc.json    # Configuración lint-staged
├── .github/workflows/    # CI + Deploy + Lighthouse
├── public/
│   ├── sw.js             # Service Worker generado (Workbox precache + sync)
│   ├── manifest.json     # Configuración PWA (iconos, screenshots, shortcuts)
│   └── ...
├── src/
│   ├── css/
│   │   ├── styles.css    # Estilos globales
│   │   └── fonts/        # Fuentes locales (Cinzel, David Libre)
│   └── js/
│       ├── app.js        # Controlador principal
│       ├── ics.js        # Generador de archivos ICS
│       ├── theme.js      # Tema / modo oscuro
│       ├── core/
│       │   ├── data.js           # Datos litúrgicos estáticos
│       │   ├── calendar.js       # Motor del calendario 364 días
│       │   ├── sun.js            # API solar (re-exporta sun-algo)
│       │   ├── sun-algo.js       # Algoritmo NOAA puro (fuente única)
│       │   ├── sun-worker.js     # Web Worker de cálculo solar
│       │   ├── sun-worker-client.js # Cliente worker con fallback síncrono
│       │   ├── idb.js            # Cola IndexedDB (offline ICS)
│       │   ├── notif-store.js    # Agenda IndexedDB de notificaciones
│       │   ├── notifications.js  # Recordatorios locales (Shabat + Fiestas)
│       │   ├── storage.js        # localStorage helper
│       │   ├── calculations.js   # Lógica de cálculo litúrgico
│       │   └── time-translator.js# Traducción de tiempo
│       └── ui/           # Vistas (hoy, calendar, fiesta, estudio, print, pwa-install, ...)
└── test/
    ├── calendar.test.js  # Tests del motor calendario
    ├── data.test.js      # Tests de integridad de datos
    ├── sun.test.js       # Tests del algoritmo solar + worker client
    ├── ics.test.js       # Tests del generador ICS
    ├── app.test.js       # Tests del controlador
    ├── notifications.test.js # Tests de notificaciones
    ├── idb.test.js       # Tests de IndexedDB (idb + notif-store)
    ├── calculations.test.js # Tests de cálculo litúrgico
    └── pwa.test.js       # Auditoría PWA (manifest + SW)
```

---

## Plan de Mejoras

El plan completo de evolución (FASES 1-5, incluyendo industrialización a CMMI Nivel 3) está en [PLAN_MEJORAS.md](PLAN_MEJORAS.md). Todas las fases 1-4 están cerradas; la FASE 5 está en ejecución con micro-entregables (cobertura, E2E Playwright, gate de CI, branch protection, releases).

---

## Changelog

El historial completo está en [CHANGELOG.md](CHANGELOG.md). Resumen reciente:

### 13.1.66 (2026-08-11)
E2E setup + smoke: Playwright con 4 tests (carga, reloj solar, navegacion SPA de 5 vistas, retorno a Hoy). Job e2e en CI (5.7).

### 13.1.65 (2026-08-11)
Gate de cobertura en CI: thresholds statements>=80, branches>=60, functions>=70, lines>=80. El CI falla si la cobertura baja de los umbrales (5.6).

### 13.1.64 (2026-08-10)
Cobertura de branches del core: calculations.js al 81.81% y sun-worker.js al 100% (5.5).

### 13.1.63 (2026-08-10)
Fix de encoding: corregido mojibake en README (doble codificacion heredada) y removido BOM UTF-8 de 29 archivos. Detector `check:encoding` activo en CI y pre-commit.

### 13.1.62 (2026-08-10)
Cobertura de notificaciones (notifications.js) y traduccion de tiempo (time-translator.js) al 100% (5.4).

### 13.1.61 (2026-08-10)
Cobertura de módulos IndexedDB (idb + notif-store) al 100% (5.1), lint 0 warnings (cero deuda), fix de despliegue eliminando devDependency muerta `canvas` que bloqueaba CI.

### 13.1.58 (2026-08-10)
Web Worker para cálculo NOAA con fallback síncrono (4.2).

### 13.1.57 (2026-08-10)
Code-splitting del módulo core + modulepreload, sin polyfill inline por CSP (4.3).

### 13.1.56 (2026-08-10)
Notificaciones locales: Shabat de preparación + Fiestas de YHWH vía Notification API + IndexedDB (3.2 + 3.3).

### 13.1.55 (2026-08-10)
Actualización de Service Worker con UX suave (toast clicable, skipWaiting bajo demanda) (4.4).

### 13.1.54 (2026-08-10)
Periodic Background Sync diario para datos solares (2.3).

### 13.1.53 (2026-08-10)
Background Sync ICS: cola offline con reenvío al recuperar red (2.2).

### 13.1.52 (2026-08-10)
Migración a Workbox SW con precache y runtime caching (2.1).

### 13.1.47 - 13.1.51 (2026-08-07)
Iconos PWA completos, shortcuts, screenshots, compresión Brotli/gzip y workflow Lighthouse CI (FASE 1).

### 13.1.6 (2026-06-12)
Fix definitivo PWA 404: .nojekyll bypass y rutas absolutas.

---

## Licencia

[MIT](LICENSE) &mdash; libre para usar, modificar y distribuir.
