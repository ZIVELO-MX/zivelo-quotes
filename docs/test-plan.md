# Test Plan

## Estrategia

| Herramienta | Uso |
|---|---|
| `vitest` 4.x | Test runner, assertions, mocks |
| `vi.mock()` | Mocking de Prisma y módulos externos |
| `@testing-library/react` | Tests de componentes (futuro, v0.2.0+) |
| `jsdom` | Entorno DOM simulado para componentes (futuro) |

**Principios:**
- Los schemas Zod se testean directamente (pura lógica, sin mocking)
- Las server actions se testean con Prisma mockeado (no requiere DB real)
- Los componentes se testean con `@testing-library/react` (sin navegador)
- No hay E2E ni base de datos real en CI hasta v0.3.0+

## Cobertura por fase

### v0.0.8 — Tests y validación

| Qué se prueba | Tipo | Archivo | Prioridad |
|---|---|---|---|
| `formSchema` (happy + unhappy path) | Unit — Zod | `tests/lib/schemas/quote.test.ts` | Hecho |
| `itemSchema` (reglas, defaults, errores) | Unit — Zod | `tests/lib/schemas/quote.test.ts` | Hecho |
| `createQuote` — datos válidos | Integration — mock | `tests/lib/actions/quote.test.ts` | |
| `createQuote` — datos inválidos | Integration — mock | `tests/lib/actions/quote.test.ts` | |
| `createQuote` — slug duplicado (P2002) | Integration — mock | `tests/lib/actions/quote.test.ts` | |

### v0.1.0 — MVP operativo

| Qué se prueba | Tipo | Archivo |
|---|---|---|
| `calculateTotal()` | Unit | `tests/lib/demo-quote-data.test.ts` |
| `formatPrice()` | Unit | `tests/lib/demo-quote-data.test.ts` |
| `cn()` | Unit | `tests/lib/utils.test.ts` |
| `slugify()` | Unit | `tests/lib/slugify.test.ts` |
| Render de `/q/[quoteSlug]` con datos mock | Smoke | `tests/app/q/[slug]/page.test.ts` |
| CI pipeline (GitHub Actions) | Infra | `.github/workflows/test.yml` |

### v0.2.0 — Experiencia mejorada

| Qué se prueba | Tipo | Archivo |
|---|---|---|
| `QuoteCreateForm` — render, validación, submit | Component | `tests/components/quote/quote-create-form.test.tsx` |
| `StatusDropdown` — open, select, close | Component | `tests/components/quote/status-dropdown.test.tsx` |
| `CurrencyDropdown` — open, select, close | Component | `tests/components/quote/currency-dropdown.test.tsx` |
| `QuoteHero`, `QuoteSummary`, `QuoteItemsList`, etc. | Component | `tests/components/quote/*.test.tsx` |
| Contexto i18n (EN/ES) | Unit | `tests/lib/i18n.test.ts` |

### v0.3.0 — Control y privacidad

| Qué se prueba | Tipo | Archivo |
|---|---|---|
| `generateQuotePdf` | Integration | `tests/lib/pdf/generate.test.ts` |
| Flujo completo crear → publicar → ver | E2E | `tests/e2e/create-and-publish.test.ts` |
| Validaciones avanzadas (private/password) | Unit | `tests/lib/schemas/*.test.ts` |

## Ejecución

```
pnpm test            # todos los tests
pnpm test:quote      # solo schemas Zod
pnpm test:action     # solo server actions (mock)
pnpm test:watch      # modo watch para desarrollo
```

---

## Cuándo actualizar este documento

- Se agregue una nueva capa al proyecto (ej. nuevo módulo, nueva server action)
- Cambie la estrategia de mocking (ej. migrar de mock a SQLite o testcontainers)
- Se introduzca un nuevo tipo de test (E2E, visual, performance)
- Se agregue CI/CD y cambien los comandos de ejecución
