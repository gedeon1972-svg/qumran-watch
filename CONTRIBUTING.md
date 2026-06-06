# Contribuyendo a Qumran Watch

Gracias por tu interés en contribuir a la restauración del Calendario Solar de 364 Días. Este documento establece los lineamientos para mantener la calidad y coherencia del proyecto.

---

## Flujo de Trabajo

1. **Fork** el repositorio a tu cuenta de GitHub.
2. **Crea una rama** con un nombre descriptivo:

   ```bash
   git checkout -b feat/mi-mejora
   # o
   git checkout -b fix/correccion-calculo
   ```

3. **Realiza tus cambios** siguiendo los estándares de código.
4. **Asegúrate de que los tests pasen** antes de abrir un Pull Request:

   ```bash
   npm test
   npm run lint
   npm run format:check
   ```

5. **Abre un Pull Request** contra la rama `main` con una descripción clara.

---

## Estándares de Código

### JavaScript

- **ES6 Modules** — Usa `import`/`export`, no CommonJS.
- **Vanilla JS** — Sin React, Vue ni frameworks. Cero dependencias runtime.
- **JSDoc** — Documenta funciones públicas con tipos y descripciones.
- **Nombres** — `camelCase` para variables y funciones, `PascalCase` para clases/configuraciones.
- **Sin alertas de consola** — Usa `console.warn` o `console.error` solo para depuración; no dejes `console.log` en producción.

### CSS

- **Variables CSS** — Usa las variables definidas en `:root` en lugar de valores hardcodeados.
- **Mobile-first** — Diseña para pantallas pequeñas primero; añade `@media` para desktop.
- **Contraste WCAG AA** — Todo texto debe cumplir al menos 4.5:1 (normal) o 3:1 (grande).

### Commits

Usa commits semánticos:

```
feat: nueva característica
fix: corrección de error
refactor: cambio sin corrección ni feature
test: añadir o modificar tests
docs: cambios en documentación
chore: tooling, config, dependencias
```

---

## Pull Requests

- El título debe describir el cambio (ej. `feat: agrega soporte para año sabático`).
- Incluye una descripción del problema y la solución.
- Asegúrate de que la cobertura de tests no disminuya.
- El PR debe pasar el CI (**GitHub Actions**) antes de ser fusionado.
- Se requiere al menos una revisión de código.

---

## Tests

- Usamos **Vitest** con cobertura **v8**.
- Todo código nuevo debe incluir tests.
- La cobertura global debe mantenerse sobre **70%**.
- Para ejecutar los tests:

  ```bash
  npm test                    # Tests rápidos
  npm run test:coverage       # Tests con reporte de cobertura
  ```

---

## Linter y Formateador

Ejecuta siempre antes de commit:

```bash
npm run lint          # ESLint
npm run format:check  # Prettier (sin modificar)
npm run format        # Prettier (formatea)
```

El pre-commit hook (Husky + lint-staged) ejecuta ESLint y Prettier automáticamente sobre los archivos staged.

---

## Reportar Issues

Si encuentras un bug o tienes una sugerencia:

1. Verifica que no exista ya un issue abierto.
2. Abre un issue describiendo:
   - Comportamiento esperado vs. real.
   - Pasos para reproducir (si es bug).
   - Entorno (navegador, versión, offline/online).

---

## Código de Conducta

Este proyecto sigue un estándar de respeto y colaboración. No se tolera discriminación, acoso ni spam. Todos los aportes son bienvenidos independientemente de experiencia, religión o procedencia.
