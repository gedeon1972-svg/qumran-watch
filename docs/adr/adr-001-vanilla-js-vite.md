# ADR-001: Vanilla JS + Vite como stack frontend

**Fecha:** 2026-06-06
**Estado:** Aceptado

## Contexto
Qumran Watch necesita una PWA 100% offline sin dependencias runtime. Se evaluaron React, Vue y Svelte.

## Decisión
Se eligió Vanilla JS (ES6 Modules) + Vite por:
- Zero runtime dependencies
- Bundle mínimo (solo lógica de negocio)
- Service Worker sin framework overhead
- Control total sobre el ciclo de vida PWA

## Consecuencias
- Positivas: rendimiento máximo, bundle ~57KB, sin árbol de dependencias runtime
- Negativas: más código boilerplate, sin virtual DOM