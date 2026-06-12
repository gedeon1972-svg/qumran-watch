# Qumran Watch — El Reloj de los Hijos de Sadoc

[![Build](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/deploy.yml/badge.svg)](https://github.com/gedeon1972-svg/qumran-watch/actions/workflows/deploy.yml)
[![Coverage](https://img.shields.io/badge/coverage-%3E70%25-brightgreen)](https://github.com/gedeon1972-svg/qumran-watch)
[![License](https://img.shields.io/github/license/gedeon1972-svg/qumran-watch)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline-blue)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![JavaScript](https://img.shields.io/badge/ES6-Modules-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![Version](https://img.shields.io/badge/version-13.0.0-gold)](package.json)

Aplicación Web Progresiva (PWA) que restaura el **Calendario Solar de 364 Días** de los Manuscritos del Mar Muerto, con sincronización GPS, ciclo de 24 turnos sacerdotales (Mishmarot), alertas ICS y biblioteca de estudios bíblicos. Funciona **100% offline**.

---

## Características

- **Motor Astronómico GPS** — Sincronización en tiempo real de salida/puesta del sol basada en la ubicación del usuario; ajusta el inicio del día bíblico.
- **Calendario de 364 Días** — Implementación matemática fiel a 1 Enoc, Jubileos y los rollos de Qumrán.
- **Ciclo de Mishmarot** — 24 turnos sacerdotales perpetuos, anclados al 20 de Marzo de 2019 (Turno de Gamul).
- **Alertas ICS** — Exporta las fiestas sagradas al calendario nativo del celular con notificaciones programadas.
- **Biblioteca "Saber"** — Estudios profundos, Salmos diarios y Cánticos de Shabat del Templo Celestial.
- **Instrucción del Mesías** — Halakha diaria con filología, contexto y cita textual.
- **100% Offline** — Service Worker con estrategia cache-first; sin dependencia de red.
- **Zero Runtime Dependencies** — Vanilla JS ES6, sin React, Vue ni frameworks externos.
- **Accesibilidad WCAG AA** — Contraste suficiente, roles ARIA, navegación por teclado.
- **CSP Estricta** — Content-Security-Policy que bloquea scripts e iframes externos.

---

## Tecnologías

| Herramienta | Propósito |
|-------------|-----------|
| [Vite](https://vitejs.dev/) | Bundler y dev server |
| [Vitest](https://vitest.dev/) + [@vitest/coverage-v8](https://www.npmjs.com/package/@vitest/coverage-v8) | Testing y cobertura |
| [ESLint](https://eslint.org/) (flat config) | Linter |
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

# Vista previa del build
npm run preview
```

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

---

## Estructura del Proyecto

```
qumran-watch/
├── index.html            # Interfaz HTML5 con CSP, OG, JSON-LD
├── manifest.json         # Configuración PWA
├── eslint.config.js      # ESLint flat config
├── .prettierrc           # Configuración Prettier
├── .husky/pre-commit     # Hook pre-commit
├── .lintstagedrc.json    # Configuración lint-staged
├── vite.config.js        # Configuración Vite + Vitest
├── public/
│   └── sw.js             # Service Worker (cache-first)
├── src/
│   ├── css/
│   │   ├── styles.css    # Estilos globales
│   │   └── fonts/        # Fuentes locales (Cinzel, David Libre)
│   └── js/
│       ├── app.js        # Controlador principal
│       ├── data.js       # Datos litúrgicos estáticos
│       ├── calendar.js   # Motor del calendario 364 días
│       ├── sun.js        # Algoritmo de posición solar
│       └── ics.js        # Generador de archivos ICS
└── test/
    ├── calendar.test.js  # Tests del motor calendario
    ├── data.test.js      # Tests de integridad de datos
    ├── sun.test.js       # Tests del algoritmo solar
    └── ics.test.js       # Tests del generador ICS
```

---

---

## Changelog

### 13.1.6 (2026-06-12)
Fix definitivo PWA 404: .nojekyll bypass y rutas absolutas.

### 13.1.5 (2026-06-09)
Limpieza de mojibake UTF-8 heredado en manifests, package.json y app.js. Bump de versión a 13.1.5.

### 13.1.4 (2026-06-09)
Finalización de configuración de despliegue, corrección de rutas 404, implementación de navegación selectiva mediante clase .no-arrow y actualización de versión PWA.


## Licencia

[MIT](LICENSE) &mdash; libre para usar, modificar y distribuir.
