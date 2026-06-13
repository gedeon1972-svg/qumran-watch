# AGENTS-BOOTSTRAP — Sistema Multi-Agente Autoconfigurable

> **Instrucciones para la IA:** Lee este documento COMPLETO. Luego analiza el proyecto donde estás, diseña los agentes que necesita y construye todo el sistema. Eres responsable de crearlo desde cero.

## 1. Filosofía del Sistema

Este proyecto usa **agentes IA especializados** que se auto-organizan para cubrir todas las áreas del desarrollo: diseño, backend, frontend, QA, SEO, seguridad, despliegue. Cada agente tiene un perfil, reglas y entregables definidos.

**Principios:**
- Cada problema del proyecto debe tener un agente responsable
- Los agentes no se tocan entre sí — se pasan trabajo mediante handoffs
- La IA principal (Orquestador) solo coordina, revisa calidad y reporta
- Todo se define en archivos markdown/JSON que la IA lee al inicio

---

## 2. Diagnóstico Inicial del Proyecto

Antes de construir nada, analiza el proyecto respondiendo:

### 2.1 Stack Tecnológico
```markdown
- Framework: ¿Next.js, Astro, Vue, React, vanilla?
- Lenguaje: ¿TypeScript, JavaScript, Python, PHP?
- Base de datos: ¿PostgreSQL/Supabase, MySQL, MongoDB, SQLite?
- CSS: ¿Tailwind, CSS Modules, styled-components, Bootstrap?
- Backend: ¿Next.js API routes, Express, Django, Laravel?
- Auth: ¿Supabase Auth, NextAuth, Firebase, custom?
- Pago: ¿Mercado Pago, Stripe, PayPal, ninguna?
- Infra: ¿Vercel, AWS, Railway, Netlify, Docker?
- Testing: ¿Vitest, Jest, Playwright, Cypress, pytest?
```

### 2.2 Estructura del Proyecto
```markdown
- ¿Tiene panel admin? (src/app/admin, /admin, /dashboard)
- ¿Tiene API routes? (src/app/api, /api, routes/)
- ¿Tiene migraciones SQL? (supabase/migrations, prisma/migrations)
- ¿Tiene tests? (tests/, __tests__/, *.spec.*, *.test.*)
- ¿Tiene CI/CD? (.github/workflows, .gitlab-ci.yml)
- ¿Tiene documentación de componentes? (Storybook, Ladle)
- ¿Tiene variables de entorno? (.env.example, .env.local)
```

### 2.3 Puntos Débiles Potenciales
```markdown
- ¿Dead code? Busca componentes/funciones no importados
- ¿Sin tests críticos? (flujos de pago, auth, formularios)
- ¿Variables fantasma? (process.env.X que no está en .env.example)
- ¿Cables sueltos? (href="#", onClick sin handler, botones sin estado loading)
- ¿Fuentes duales? (footer en 2 lugares, config duplicada)
- ¿Seguridad? (RLS ausente, CSP no configurado, secrets en código)
```

---

## 3. Diseño de Agentes

Identifica las áreas que tu proyecto necesita y crea SOLO los agentes relevantes. No copies los 28 de la agencia web si tu proyecto es otro.

### 3.1 Categorías Comunes

| Categoría | Agentes típicos | Cuándo incluir |
|---|---|---|
| **Gestión** | project-manager, product-strategist | Proyectos con múltiples fases o stakeholders |
| **Diseño** | ux-strategist, ui-designer, brand-designer | Proyectos con interfaz visual |
| **Frontend** | frontend-architect, react-specialist, tailwind-specialist | SPAs o apps con UI compleja |
| **Backend** | backend-architect, supabase-specialist, database-engineer, api-engineer | Proyectos con API propia o DB |
| **Seguridad** | auth-security-specialist, security-auditor | Proyectos con auth, pagos o datos sensibles |
| **Contenido** | content-strategist, copywriter, seo-specialist | Sitios públicos, blogs, landing pages |
| **Calidad** | performance-engineer, accessibility-specialist, qa-tester | Cualquier proyecto que pase a producción |
| **DevOps** | devops-engineer, deployment-specialist | Proyectos con CI/CD, staging, producción |
| **IA** | prompt-engineer, automation-specialist | Proyectos con features de IA o automatización |

### 3.2 Formato de Perfil de Agente

Cada agente se define en un archivo JSON dentro de `.agents/agents/<categoria>/<id>.json`:

```json
{
  "name": "Supabase Specialist",
  "id": "supabase-specialist",
  "category": "backend",
  "role": "Supabase Platform Expert",
  "mission": "Implementar y optimizar la plataforma Supabase como backend completo.",
  "expertise": ["Supabase Database", "Row Level Security", "Supabase Auth", "Storage Buckets", "Real-time Subscriptions", "Edge Functions", "Database Migrations"],
  "responsibilities": ["Configurar proyecto Supabase", "Implementar RLS policies", "Configurar autenticación", "Gestionar storage buckets", "Implementar real-time subscriptions", "Crear Edge Functions", "Escribir migrations", "Optimizar queries"],
  "workflow": ["1. Configurar proyecto Supabase", "2. Diseñar schema con Database Engineer", "3. Implementar RLS policies", "4. Configurar auth providers"],
  "inputs": ["data-model", "auth-requirements", "storage-requirements"],
  "outputs": ["supabase-config", "rls-policies", "auth-config", "storage-setup", "edge-functions", "migrations"],
  "rules": ["RLS en todas las tablas", "Nunca deshabilitar RLS en producción", "Storage policies granulares", "Auth session management seguro", "Migrations versionadas y reversibles"],
  "communication_style": {
    "tone": "Técnico y preciso",
    "format": "SQL + config + documentación",
    "focus": "Seguridad y funcionalidad",
    "avoids": "RLS bypass o shortcuts inseguros"
  },
  "tools_allowed": ["Supabase Dashboard", "Supabase CLI"],
  "quality_standards": {
    "rls": "100% coverage, granular, testada",
    "auth": "Session seguro, MFA cuando requerido",
    "migrations": "Reversibles, versionadas, testadas"
  }
}
```

**Reglas para diseñar perfiles:**
- `expertise`: tecnologías específicas que domina (máx 10)
- `responsibilities`: verbos de acción concretos
- `workflow`: pasos secuenciales numerados
- `inputs/outputs`: artefactos que recibe y produce
- `rules`: restricciones NO negociables
- `quality_standards`: métricas de éxito por área

---

## 4. Construcción del Sistema

### 4.1 Estructura de Carpetas

```
.agents/
├── agents/
│   ├── INDEX.json                    ← catálogo de todos los agentes
│   ├── HANDOFF-PROTOCOL.md           ← reglas de handoff entre agents
│   ├── orchestration.json            ← pipeline de fases y agentes
│   └── <categoria>/
│       └── <agent-id>.json           ← perfil del agente
├── skills/                           ← (opcional) skills adicionales
│   └── <skill-name>/SKILL.md
└── state/
    └── pipeline.json                 ← estado persistente (se crea al usar)

.opencode/skills/                     ← skills del ecosistema opencode
└── <skill-name>/SKILL.md

AGENTS.md                             ← archivo raíz de contexto
opencode.json                         ← configuración del proyecto
```

### 4.2 Archivos a Crear

#### Paso 1: `opencode.json`
```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": [".opencode/skills"]
  }
}
```

#### Paso 2: `AGENTS.md`

Este es el archivo que la IA lee al inicio de cada sesión para tomar contexto. Debe contener:

**a) Bloques de rol** (definen cómo debe comportarse la IA):
```
<!-- BEGIN:orquestador-role -->
# Rol: Orquestador Maestro
1. **No ejecutar cambios directamente.** Tu función es coordinar, no codificar.
2. **Delegar en skills y subagentes.** Usa `LoadSkill` para tareas específicas. Usa `Task tool` con subagentes para trabajo complejo.
3. **Solo supervisar y reportar.** Consolidas resultados, verificas calidad (TSC/lint/tests), y reportas al usuario.
4. **No tomar iniciativa no solicitada.** Cada cambio debe ser autorizado explícitamente por el usuario.
<!-- END:orquestador-role -->
```

**b) Bloques de skill** (describen skills disponibles):
```
<!-- BEGIN:<skill-name> -->
# <Skill Name>
Skill disponible en `.opencode/skills/<skill-name>/`. Se activa con `LoadSkill <skill-name>`. <descripción breve>.
<!-- END:<skill-name> -->
```

**c) Goal** — objetivo general del proyecto:
```markdown
## Goal
<descripción del objetivo global>
```

**d) Constraints & Preferences** — reglas de negocio y decisiones:
```markdown
## Constraints & Preferences
- <regla 1>
- <regla 2>
```

**e) Progress** — estado actual con secciones:
```markdown
## Progress
### Done
- <logro completado>

### In Progress
- <tarea en curso>

### Blocked
- <bloqueo>
```

**f) Critical Context** — información fresca para mantener entre sesiones:
```markdown
## Critical Context
- **TypeScript check:** `npx tsc --noEmit --pretty` — <resultado>
- **Tests:** <comando> — <resultado>
- **Git:** <rama>, último commit <hash>
- **Pendiente:** <lo que falta>
```

#### Paso 3: `INDEX.json`

Catálogo de todos los agentes del sistema:
```json
{
  "version": "1.0.0",
  "name": "<Project Name> Multi-Agent System",
  "description": "<descripción>",
  "total_agents": <número>,
  "categories": {
    "<categoria>": {
      "path": "<categoria>/",
      "agents": [
        {"id": "<agent-id>", "file": "<agent-id>.json"}
      ]
    }
  }
}
```

#### Paso 4: `orchestration.json`

Define el pipeline de desarrollo con fases, agentes asignados, duración y entregables:
```json
{
  "version": "1.0.0",
  "name": "<Project Name>",
  "description": "<descripción>",
  "stack": ["<tech1>", "<tech2>"],
  "hierarchy": {
    "tier_1_<area>": ["<agent-id>", "<agent-id>"]
  },
  "development_pipeline": {
    "phase_1_<nombre>": {
      "agents": ["<agent-id>"],
      "duration": "<tiempo>",
      "deliverables": ["<entregable>"],
      "approval_gate": "<quién-aprueba>"
    }
  }
}
```

#### Paso 5: `HANDOFF-PROTOCOL.md`

Define cómo los agentes se pasan trabajo. Incluye:
- Formato JSON del handoff (from_agent, to_agent, deliverable, status, artifacts)
- Reglas de validación y aprobación
- Matriz de handoffs entre agentes
- Proceso de rechazo y reasignación

#### Paso 6: Skills (`.opencode/skills/<nombre>/SKILL.md`)

Skills para cargar expertise específico bajo demanda con `LoadSkill`:

```markdown
---
name: <skill-name>
description: "<descripción breve para la IA de cuándo usar este skill>"
---

# <Skill Name> — <subtítulo>

## Perfil de Ejecución
<qué rol asume la IA al cargar este skill, qué debe hacer>

## Instrucciones
<instrucciones detalladas del dominio, paso a paso>

## Archivos de Referencia
<lista de archivos relevantes>
```

---

## 5. Cómo Opera el Sistema

### Flujo de Trabajo

```
Usuario pide algo
       │
       ▼
Orquestador (IA principal)
  │  Lee AGENTS.md → toma contexto
  │  Decide qué skills/agentes aplicar
  │
  ├── ¿Skill simple? → LoadSkill <skill> → ejecuta tarea
  │
  └── ¿Tarea compleja? → Task tool → spawnea subagente
        │  Pasa perfil JSON del agente + instrucciones
        │  Subagente ejecuta y devuelve resultado
        │
        ▼
Orquestador consolida resultados
  │  Verifica calidad: tsc, lint, tests
  │  Reporta al usuario
```

### Handoff entre Agentes

Cuando un agente termina su trabajo, pasa el siguiente con un handoff JSON:
```json
{
  "handoff": {
    "from_agent": "supabase-specialist",
    "to_agent": "api-engineer",
    "phase": "phase_4_development",
    "deliverable": "db-schema-rls",
    "status": "completed",
    "artifacts": {
      "files": ["supabase/migrations/001_init.sql"]
    },
    "quality_check": {
      "self_reviewed": true,
      "criteria_met": ["RLS coverage 100%", "migrations reversibles"]
    },
    "next_steps": ["Implementar API endpoints"]
  }
}
```

### Skills (Carga Bajo Demanda)

La IA invoca `LoadSkill <nombre>` y el contenido del SKILL.md se inyecta en el contexto. Útil para:
- Auditorías de seguridad (`LoadSkill security-hardening`)
- Revisión de pagos (`LoadSkill mercadopago-payments`)
- Tests E2E (`LoadSkill testing-coverage`)

---

## 6. Instrucciones Finales para la IA

**Tu tarea al leer este archivo es:**

1. **Analiza** el proyecto actual usando las secciones 2.1, 2.2 y 2.3.
2. **Diseña** los agentes necesarios según sección 3. No crees agentes irrelevantes.
3. **Construye** toda la estructura de carpetas y archivos descrita en sección 4.
4. **Escribe** `AGENTS.md` con el contexto real del proyecto (Goal, Constraints, Progress inicial vacío, Critical Context).
5. **Crea** los perfiles JSON de cada agente con formato de sección 3.2.
6. **Establece** el pipeline en `orchestration.json` con las fases que aplican a este proyecto.
7. **Crea** el `HANDOFF-PROTOCOL.md` con los handoffs entre los agentes que definiste.

**NO** copies ciegamente los 28 agentes del proyecto original. Evalúa qué necesita este proyecto y crea solo eso.

**NO** dejes archivos vacíos o placeholder. Cada archivo debe tener contenido real y útil.

Al terminar, informa al usuario:
- Cuántos agentes creaste y en qué categorías
- Qué pipeline de fases definiste
- Dónde está cada archivo
