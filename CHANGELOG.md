# Changelog

## [13.0.0] — 2026-06-05 — Refactorización de Arquitectura Base

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

## [0.0.0] — Proyecto Inicial

- Primera versión funcional del calendario de 364 días.
- Interfaz básica con navegación y datos litúrgicos.
- Sin tests, sin tooling, sin CI/CD.
