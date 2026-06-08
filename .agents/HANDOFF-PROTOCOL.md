# HANDOFF-PROTOCOL — Qumran Watch

## Formato de Handoff

Cada handoff entre agentes usa el siguiente formato JSON:

```json
{
  "handoff": {
    "from_agent": "<agent-id>",
    "to_agent": "<agent-id>",
    "phase": "<phase-id>",
    "deliverable": "<nombre-del-entregable>",
    "status": "completed|rejected|in_progress",
    "artifacts": {
      "files": ["<ruta-del-archivo>"]
    },
    "quality_check": {
      "self_reviewed": true,
      "criteria_met": ["<criterio-1>", "<criterio-2>"]
    },
    "next_steps": ["<siguiente-paso>"]
  }
}
```

## Reglas de Validación

1. **Autorevisión obligatoria**: Cada agente debe verificar su propio trabajo antes del handoff.
2. **Criterios explícitos**: Todo handoff debe listar los criterios de calidad cumplidos.
3. **No hay handoff sin artefactos**: Todo entregable debe incluir archivos concretos.
4. **Aprobación del orquestador**: Cambios críticos (schema, RLS, despliegue) requieren revisión explícita.

## Matriz de Handoffs

| Desde | Hacia | Cuándo |
|---|---|---|
| calendar-engineer | frontend-architect | Motor calendario listo para integrar en UI |
| gps-solar-specialist | frontend-architect | Algoritmo solar listo para renderizar |
| content-specialist | frontend-architect | Datos litúrgicos completos para binding |
| frontend-architect | ui-designer | Requiere ajustes de estilo o layout |
| ui-designer | frontend-architect | Estilos definidos para implementar |
| frontend-architect | pwa-specialist | App estable lista para cachear |
| pwa-specialist | qa-tester | PWA lista para test offline |
| qa-tester | frontend-architect | Bugs encontrados que requieren fix |
| qa-tester | calendar-engineer | Bugs en motor calendario |
| qa-tester | devops-specialist | Tests pasando, listo para deploy |
| devops-specialist | orquestador | Build exitoso, listo para producción |

## Proceso de Rechazo

Si un agente receptor encuentra problemas en el entregable:

1. Registrar el handoff con `status: "rejected"`
2. Incluir `rejection_reason` con los criterios fallidos
3. Devolver al agente emisor con `next_steps` claros
4. El agente emisor corrige y reenvía con `status: "completed"` y versionado incrementado

## Handoffs Iniciales

| Fase | Handoff |
|---|---|
| phase_1_fundacion | calendar-engineer → frontend-architect: `motor-calendario` |
| phase_1_fundacion | gps-solar-specialist → frontend-architect: `algoritmo-solar` |
| phase_2_arquitectura | frontend-architect → ui-designer: `solicitud-estilos` |
| phase_2_arquitectura | ui-designer → frontend-architect: `definicion-estilos` |
| phase_3_contenido | content-specialist → frontend-architect: `datos-liturgicos` |
| phase_4_pwa | frontend-architect → pwa-specialist: `app-compilada` |
| phase_5_calidad | pwa-specialist → qa-tester: `pwa-lista` |
| phase_5_calidad | qa-tester → devops-specialist: `tests-verdes` |
