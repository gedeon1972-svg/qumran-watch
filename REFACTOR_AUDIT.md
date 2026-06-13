# Auditoría de Desacoplamiento — Fase 2

## Resumen Ejecutivo

Tres archivos analizados en `src/js/`. Dos están limpios (cálculos/datos puros), uno está fuertemente contaminado. **`app.js` concentra el 100% del acoplamiento DOM** (12 métodos tocan el DOM). Los módulos utilitarios (`calendar.js`, `sun.js`, `calculations.js`, `data.js`) son agnósticos del navegador y podrían ejecutarse en Node.js.

---

## 1. Funciones Contaminadas

### 1.1 `src/js/app.js` — GRAVEMENTE CONTAMINADO

| Función | Líneas | Operaciones DOM | Tipo |
|---|---|---|---|
| `init` | 41–58 | Llama 6 métodos contaminados + `history.replaceState` | ORQUESTADOR |
| `setupListeners` | 60–152 | 20x `getElementById`, 20x `addEventListener` | EVENTOS PUROS |
| `nav` | 154–170 | `querySelectorAll`, `classList`, `pushState`, `scrollTo` | CONTROLADOR VISTA |
| `getLocationAndSun` | 182–209 | `innerText` en geo-btn + `geolocation` | MIXTO |
| `updateSunData` | 211–230 | 5 writes DOM (sun-rise, sun-set, etc.) | MIXTO |
| `checkWatcher` | 232–262 | 8 writes DOM + `innerHTML` en alert-msg | MIXTO |
| `renderHoy` | 264–353 | **22+ writes DOM** en 15 elementos | GRAVEMENTE MIXTO |
| `openFiesta` | 355–379 | 9 writes DOM en modal | MIXTO |
| `renderSaber` | 385–394 | Construcción HTML + `innerHTML` | MIXTO |
| `openEstudio` | 396–403 | 4 writes DOM en modal | MIXTO |
| `renderCalendar` | 405–434 | Generación HTML + `innerHTML` | MIXTO |
| `showToast` | 435–444 | `createElement`, `appendChild`, `className` | UI PURO |

**Total: ~60+ referencias directas al DOM** en 12 métodos contaminados.

### 1.2 `src/js/calendar.js` — LIMPIO

- `QumranCalendar.calculate(dateObj)` — 0 referencias DOM. ✅
- `QumranCalendar.getTurno(totalDays)` — 0 referencias DOM. ✅

### 1.3 `src/js/data.js` — LIMPIO

- Sin funciones. Exporta objeto estático `QumranData`. ✅

### 1.4 Archivos auxiliares

| Archivo | Estado | Notas |
|---|---|---|
| `src/js/sun.js` | ✅ LIMPIO | Algoritmo solar NOAA puro |
| `src/js/utils/calculations.js` | ✅ LIMPIO | Labeled "pure — no side effects" |
| `src/js/storage.js` | ✅ LIMPIO | Wrapper localStorage con fallback |
| `src/js/theme.js` | ⚠️ DOM por diseño | `classList`, `getElementById` |
| `src/js/theme-init.js` | ⚠️ DOM por diseño | Prevención FOUC |
| `src/js/ics.js` | ⚠️ PARCIAL | Cálculo puro + `<a>` download |

---

## 2. Grafo de Dependencias Actual

```
                    ┌──────────────┐
                    │   data.js     │
                    │  (PURE DATA)  │
                    └──┬────────┬───┘
                       │        │
          ┌────────────┘        └──────────────┐
          ↓                                    ↓
    ┌─────────────┐                     ┌─────────────┐
    │ calendar.js  │                     │calculations  │
    │ (PURE CALC)  │                     │  .js (PURE)  │
    └──────┬───────┘                     └──────┬───────┘
           │         ┌──────────┐               │
           │         │  sun.js  │               │
           │         │ (PURE)   │               │
           │         └────┬─────┘               │
           │              │                     │
           ↓              ↓                     │
    ┌───────────────────────────────────────────┘
    │                   app.js
    │   (CONTROLADOR — TODA LA LÓGICA + TODO EL DOM)
    │
    │  ┌─────────────────────┐
    │  │ theme.js  (DOM)      │←── theme-init.js (DOM)
    │  │ storage.js (CLEAN)   │
    │  │ ics.js  (MIXED)      │
    │  └─────────────────────┘
    ↓
BROWSER DOM
```

**Observaciones clave:**
1. `app.js` es un **god-object** — importa todos los módulos y hace todo el render.
2. `calendar.js` y `sun.js` son puros pero su salida se consume inmediatamente en código DOM.
3. No existe capa de vista separada — `app.js` es servicio y vista simultáneamente.

---

## 3. Propuesta de Nueva Estructura

### 3.1 Directorio propuesto

```
src/js/
├── core/                          # Agnóstico del navegador (lógica pura)
│   ├── calendar.js                # Sin cambios
│   ├── sun.js                     # Sin cambios
│   ├── data.js                    # Sin cambios
│   ├── storage.js                 # Sin cambios
│   └── calculations.js            # + buildHoyViewModel(), buildWatcherViewModel()
│
├── ics/
│   └── ics-generator.js           # Constructor ICS puro (sin DOM)
│
├── ui/                            # Controladores de vista (DOM-aware)
│   ├── app-controller.js          # Orquestador: init, nav, ciclo de vida
│   ├── hoy-view.js                # renderHoy() → view model → DOM
│   ├── calendar-view.js           # renderCalendar()
│   ├── estudio-view.js            # renderSaber(), openEstudio()
│   ├── fiesta-view.js             # openFiesta(), openFiestaHoy()
│   ├── sun-view.js                # updateSunData()
│   ├── watcher-view.js            # checkWatcher()
│   ├── theme-controller.js        # Migrado de theme.js
│   ├── theme-init.js              # Sin cambios
│   ├── toast.js                   # showToast()
│   └── ics-download.js            # Trigger download (wrapper thin)
│
└── app.js                         # Solo re-export/wire-up (~20 líneas)
```

### 3.2 Estrategia de refactorización

**Fase 2a:** Extraer `buildHoyViewModel()` de `renderHoy()` — la función más crítica.

```javascript
// core/calculations.js (nueva función)
export function buildHoyViewModel(date, qData, sunData, qumranData) {
    // Retorna objeto plano sin tocar el DOM
    return { gregorianDateStr, hebDateStr, messiah, shabat, liturgy, ... };
}

// ui/hoy-view.js (renderizador thin)
export function renderHoyView(model) {
    assignText("greg-date", model.gregorianDateStr);
    assignText("heb-date", model.hebDateStr);
    // ... flujo unidireccional: modelo → DOM
}
```

**Fase 2b:** Cada método de `app.js` se divide en dos archivos:

| Método actual | `core/` (puro) | `ui/` (vista) |
|---|---|---|
| `renderHoy` | `buildHoyViewModel()` | `renderHoyView()` en `hoy-view.js` |
| `checkWatcher` | `buildWatcherViewModel()` | `renderWatcherView()` en `watcher-view.js` |
| `updateSunData` | Ya existe en `QumranSun` | `renderSunView()` en `sun-view.js` |
| `openFiesta` | `findFestivalDate()` existe | `renderFiestaModal()` en `fiesta-view.js` |
| `renderSaber` | Iteración pura | `renderEstudioGrid()` en `estudio-view.js` |
| `openEstudio` | Búsqueda pura | `renderEstudioModal()` en `estudio-view.js` |
| `renderCalendar` | `getFestivalsForYear()` existe | `renderCalendarList()` en `calendar-view.js` |
| `showToast` | N/A | `ui/toast.js` |

**Fase 2c:** `app.js` se reduce a ~60 líneas como orquestador thin.

### 3.3 Grafo de dependencias propuesto

```
                    ┌──────────────────────┐
                    │     core/data.js      │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ↓                  ↓                  ↓
   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐
   │core/calendar  │   │core/sun       │   │core/          │
   │.js            │   │.js            │   │calculations   │
   └──────┬───────┘   └───────┬───────┘   │.js            │
          │                    │           └──────┬───────┘
          ↓                    ↓                  │
   ┌──────────────────────────────────────────────┘
   │          app.js (ORQUESTADOR THIN)
   │
   ├──→ ui/hoy-view.js         ├──→ ui/fiesta-view.js
   ├──→ ui/sun-view.js         ├──→ ui/calendar-view.js
   ├──→ ui/watcher-view.js     ├──→ ui/estudio-view.js
   ├──→ ui/theme-controller.js ├──→ ui/toast.js
   └──→ ui/ics-download.js
               │
               ↓
          BROWSER DOM
```

Principio clave: `core/` nunca importa de `ui/`. El flujo de datos es unidireccional.

---

## 4. Resumen de afectación

| Archivo | Funciones | Limpias | Contaminadas | Ops DOM |
|---|---|---|---|---|
| `src/js/calendar.js` | 2 | 2 | 0 | 0 |
| `src/js/data.js` | 0 (estático) | ✅ | 0 | 0 |
| `src/js/app.js` | 16 | 2 | **14** | **~60+** |
| `src/js/sun.js` | 1 | 1 | 0 | 0 |
| `src/js/ics.js` | 2 | 1 | 1 | 6 |
| `src/js/storage.js` | 4 | 4 | 0 | 0 |
| `src/js/theme.js` | 6 | 0 | 6 (diseño) | 6 |
| `src/js/theme-init.js` | 1 | 0 | 1 (diseño) | 1 |
| `src/js/utils/calculations.js` | 4 | 4 | 0 | 0 |

**Conclusión:** El 100% del problema de acoplamiento está en `app.js`. La extracción a `core/` + `ui/` requiere dividir ~14 métodos en una capa de construcción de modelos (view models) y una capa de renderizadores de vista, sin alterar los módulos puros existentes.
