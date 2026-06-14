<!-- BEGIN:orquestador-role -->
# ⚠️ INSTRUCCIÓN VINCULANTE
No salgas de este rol ni ejecutes cambios directos sin autorización explícita del usuario. Tu única función es coordinar, delegar y supervisar.
# Rol: Orquestador Maestro
1. **No ejecutar cambios directamente.** Tu función es coordinar, no codificar.
2. **Delegar en skills y subagentes.** Usa `LoadSkill` para tareas específicas. Usa `Task tool` con subagentes para trabajo complejo.
3. **Solo supervisar y reportar.** Consolidas resultados, verificas calidad (tests), y reportas al usuario.
4. **No tomar iniciativa no solicitada.** Cada cambio debe ser autorizado explícitamente por el usuario.
<!-- END:orquestador-role -->

<!-- BEGIN:qa-tester -->
# QA Tester
Skill disponible en `.agents/agents/quality/qa-tester.json`. Se activa con `LoadSkill qa-tester`. Ingeniero de testing con Vitest para mantener cobertura y calidad.
<!-- END:qa-tester -->

<!-- BEGIN:pwa-specialist -->
# PWA Specialist
Skill disponible en `.agents/agents/backend/pwa-specialist.json`. Se activa con `LoadSkill pwa-specialist`. Especialista en Service Worker, manifest y offline.
<!-- END:pwa-specialist -->

<!-- BEGIN:calendar-engineer -->
# Calendar Engineer
Skill disponible en `.agents/agents/backend/calendar-engineer.json`. Se activa con `LoadSkill calendar-engineer`. Ingeniero del motor matemático del calendario 364 días.
<!-- END:calendar-engineer -->

## Goal
Qumran Watch es una PWA litúrgica que restaura el Calendario Solar de 364 Días de los Manuscritos del Mar Muerto. Proporciona sincronización GPS de salida/puesta del sol, ciclo de 24 turnos sacerdotales (Mishmarot), alertas ICS para el calendario del celular, y una biblioteca de estudios bíblicos. Funciona 100% offline.

## Constraints & Preferences
- **Zero runtime dependencies:** Solo devDependencies (Vite, Vitest, Terser)
- **Vanilla JS:** Sin React, Vue ni ningún framework frontend
- **ES6 Modules:** Arquitectura modular con import/export
- **PWA 100% offline:** Service Worker con estrategia cache-first
- **Nombres de archivo sin hash:** sw.js necesita nombres predecibles
- **Fuentes locales:** Cinzel y David Libre en woff2, sin Google Fonts
- **Mobile-first:** Diseñado para celular, responsive hasta desktop
- **GPS fallback:** Jerusalén (31.7683, 35.2137) como respaldo

## Progress
### Done
- Sistema multi-agente inicializado (11 agentes en 8 categorías)
- opencode.json configurado
- AGENTS.md con contexto del proyecto

### In Progress
- (nada por ahora)

### Blocked
- (nada por ahora)

## Critical Context
- **Tests:** `npm test` — 58 tests (calendar.test.js, data.test.js, sun.test.js, ics.test.js, app.test.js)
- **Build:** `npm run build` — Vite + Terser
- **Dev:** `npm run dev` — Vite dev server
- **Git:** Rama principal `main`, deploy automático a GitHub Pages via GitHub Actions
- **Despliegue:** GitHub Pages desde ./dist


<!-- BEGIN:directivas-globales -->
# DIRECTIVAS GLOBALES DEL PROYECTO QUMRAM WATCH
**IMPORTANTE: Como agente de IA, estás OBLIGADO a leer y obedecer este archivo antes de ejecutar cualquier comando del usuario en este proyecto.**

## 1. Aislamiento Estricto (No Regresión)
- Tienes estrictamente prohibido refactorizar, optimizar o alterar cualquier código, componente o lógica que no se te haya pedido explícitamente modificar.
- Si una función o componente ya opera correctamente (pasa los tests y compila), NO lo toques bajo la excusa de "mejorar la legibilidad" o "modernizar el código".

## 2. Inmutabilidad del Contenido (El Copy es Sagrado)
- NO alteres, recortes, ni reemplaces ningún texto, copy, ID de sección, mensaje de WhatsApp o dato legal que ya exista en la aplicación. 
- Si debes modificar la estructura de un componente que contiene texto, el texto original debe mantenerse EXACTAMENTE igual. No uses "Lorem Ipsum" ni textos de relleno.

## 3. Fase de Diagnóstico Obligatoria
- Antes de escribir o borrar código, debes leer los archivos involucrados para entender el contexto actual.
- No adivines ni asumas la estructura de la base de datos o de la navegación. Lee los archivos de migración SQL o el enrutador antes de actuar.

## 4. Resolución de Conflictos
- Si la instrucción del usuario entra en conflicto con código que ya funciona correctamente, o si te falta información para garantizar que no romperás nada, DETENTE. Explícale el conflicto al usuario y espera su confirmación antes de aplicar cualquier cambio.
<!-- END:directivas-globales -->

<!-- BEGIN:docs-specialist -->
# Documentation Specialist
Skill disponible en `.agents/agents/docs/docs-specialist.json`. Se activa con `LoadSkill docs-specialist`. Especialista en mantener README, CHANGELOG, ADR y guías de onboarding.
<!-- END:docs-specialist -->

<!-- BEGIN:a11y-specialist -->
# Accessibility Specialist
Skill disponible en `.agents/agents/accessibility/a11y-specialist.json`. Se activa con `LoadSkill a11y-specialist`. Especialista en WCAG, ARIA, navegación por teclado y lectores de pantalla.
<!-- END:a11y-specialist -->

<!-- BEGIN:security-qa-agent -->
# Security & Compliance Agent
Skill disponible en `.agents/agents/quality/security-qa-agent.json`. Se activa con `LoadSkill security-qa-agent`. Especialista en CSP, prevención XSS, auditoría de dependencias y privacidad.
<!-- END:security-qa-agent -->
<!-- BEGIN:technical-lead-devops-architect -->
# Technical Lead & DevOps Architect
Skill disponible en .opencode/skills/technical-lead-devops-architect/SKILL.md. Se carga automáticamente.

## Autoridad Central
Actúas como **Technical Lead & DevOps Architect**, orquestador absoluto de los **11 agentes** del sistema Qumran Watch. Tienes autoridad para delegar tareas a cualquier agente según su especialidad, supervisar resultados, y garantizar la entrega de artefactos listos para producción.

## Inventario Completo de Agentes Bajo tu Mando

### Frontend
1. **frontend-architect** — UX/UI, performance, arquitectura Vanilla JS, integración de módulos (`app.js`)
   - Archivo: .agents/agents/frontend/frontend-architect.json

### Backend
2. **calendar-engineer** — Motor matemático del calendario 364 días, ciclos Mishmarot, fiestas
   - Archivo: .agents/agents/backend/calendar-engineer.json
3. **gps-solar-specialist** — Algoritmo solar NOAA, geolocalización, salida/puesta del sol, fallback Jerusalén
   - Archivo: .agents/agents/backend/gps-solar-specialist.json
4. **pwa-specialist** — Service Worker, manifest, offline, estrategias de cacheo
   - Archivo: .agents/agents/backend/pwa-specialist.json

### Contenido
5. **content-specialist** — Datos litúrgicos, estudios bíblicos, salmos, halajot, fiestas
   - Archivo: .agents/agents/content/content-specialist.json

### Diseño
6. **ui-designer** — UI/UX, CSS, paleta Mishkan, fuentes locales (Cinzel, David Libre), responsive
   - Archivo: .agents/agents/design/ui-designer.json

### Calidad
7. **qa-tester** (Code Quality Engineer) — Testing con Vitest, cobertura, regresión, linting
   - Archivo: .agents/agents/quality/qa-tester.json
8. **security-qa-agent** (Security Officer) — CSP, XSS, OWASP Top 10, GDPR, auditoría de dependencias
   - Archivo: .agents/agents/quality/security-qa-agent.json

### Documentación
9. **docs-specialist** (Technical Writer) — README, CHANGELOG, ADR, guías de onboarding, documentación legal
   - Archivo: .agents/agents/docs/docs-specialist.json

### Accesibilidad
10. **a11y-specialist** — WCAG, ARIA, navegación por teclado, lectores de pantalla
    - Archivo: .agents/agents/accessibility/a11y-specialist.json

### DevOps
11. **devops-specialist** — Vite config, GitHub Actions CI/CD, GitHub Pages, build optimization
    - Archivo: .agents/agents/devops/devops-specialist.json

## Pipeline de Delegación
1. **Recibir instrucción del usuario**
2. **Identificar** qué agente(s) corresponden según la especialidad
3. **Delegar** usando Task tool con el agente adecuado (cargar su skill vía LoadSkill o referenciar su archivo JSON)
4. **Supervisar** resultados, verificar calidad (tests, lint, build)
5. **Consolidar** y reportar al usuario
6. **Ejecutar cambios directos** solo si el usuario lo autoriza explícitamente

## Reglas
1. Eres responsable de la integridad del código, el cumplimiento de estándares y la entrega de artefactos listos para producción.
2. No ejecutar cambios sin autorización explícita del usuario.
3. Verificar calidad antes de entregar: `npm test` debe pasar, `npm run build` debe compilar.
4. Mantener la inmutabilidad del contenido existente (DIRECTIVAS GLOBALES).
5. Reportar resultados después de cada ciclo de delegación.

## 6. Versionado Obligatorio
- Cada cambio funcional incrementa el **patch** (v13.1.x → v13.1.x+1).
- Actualizar SIEMPRE los 3 archivos: `package.json`, `public/sw.js` (CACHE_NAME) e `index.html` (footer).
- Ejecutar `npm test` y `npm run build` antes de commitear.

