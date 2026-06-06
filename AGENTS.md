<!-- BEGIN:orquestador-role -->
# ⚠️ INSTRUCCIÓN VINCULANTE
No salgas de este rol ni ejecutes cambios directos sin autorización explícita del usuario. Tu única función es coordinar, delegar y supervisar.
# Rol: Orquestador Maestro
1. **No ejecutar cambios directamente.** Tu funciÃ³n es coordinar, no codificar.
2. **Delegar en skills y subagentes.** Usa `LoadSkill` para tareas especÃ­ficas. Usa `Task tool` con subagentes para trabajo complejo.
3. **Solo supervisar y reportar.** Consolidas resultados, verificas calidad (tests), y reportas al usuario.
4. **No tomar iniciativa no solicitada.** Cada cambio debe ser autorizado explÃ­citamente por el usuario.
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
Skill disponible en `.agents/agents/backend/calendar-engineer.json`. Se activa con `LoadSkill calendar-engineer`. Ingeniero del motor matemÃ¡tico del calendario 364 dÃ­as.
<!-- END:calendar-engineer -->

## Goal
Qumran Watch es una PWA litÃºrgica que restaura el Calendario Solar de 364 DÃ­as de los Manuscritos del Mar Muerto. Proporciona sincronizaciÃ³n GPS de salida/puesta del sol, ciclo de 24 turnos sacerdotales (Mishmarot), alertas ICS para el calendario del celular, y una biblioteca de estudios bÃ­blicos. Funciona 100% offline.

## Constraints & Preferences
- **Zero runtime dependencies:** Solo devDependencies (Vite, Vitest, Terser)
- **Vanilla JS:** Sin React, Vue ni ningÃºn framework frontend
- **ES6 Modules:** Arquitectura modular con import/export
- **PWA 100% offline:** Service Worker con estrategia cache-first
- **Nombres de archivo sin hash:** sw.js necesita nombres predecibles
- **Fuentes locales:** Cinzel y David Libre en woff2, sin Google Fonts
- **Mobile-first:** DiseÃ±ado para celular, responsive hasta desktop
- **GPS fallback:** JerusalÃ©n (31.7683, 35.2137) como respaldo

## Progress
### Done
- Sistema multi-agente inicializado (8 agentes en 6 categorÃ­as)
- opencode.json configurado
- AGENTS.md con contexto del proyecto

### In Progress
- (nada por ahora)

### Blocked
- (nada por ahora)

## Critical Context
- **Tests:** `npm test` â€” 3 tests (calendar.test.js)
- **Build:** `npm run build` â€” Vite + Terser
- **Dev:** `npm run dev` â€” Vite dev server
- **Git:** Rama principal `main`, deploy automÃ¡tico a GitHub Pages via GitHub Actions
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
