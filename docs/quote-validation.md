# Validación de cotizaciones

## Stack

| Librería | Uso |
|---|---|
| `zod` 3.x | Definición de schemas y reglas de validación |
| `react-hook-form` 7.x | Manejo de estado del formulario en cliente |
| `@hookform/resolvers` | Integración entre react-hook-form y zod |

## Ubicación de schemas

Los schemas compartidos viven en `lib/schemas/` y se importan tanto en el cliente como en el servidor.

| Archivo | Contenido |
|---|---|
| `lib/schemas/quote.ts` | `formSchema` (quote completo) e `itemSchema` (elemento individual) |

## Schema: `formSchema`

```typescript
// lib/schemas/quote.ts
```

### Reglas por campo

| Campo | Tipo | Regla | Mensaje |
|---|---|---|---|
| `title` | `string` | `min(3)` | "Al menos 3 caracteres" |
| `slug` | `string` | `min(1).regex(/^[a-z0-9-]+$/)` | "Solo minúsculas, números y guiones" |
| `projectLabel` | `string` | solo default `""` | — |
| `recipientName` | `string` | `min(1)` | "Requerido" |
| `summary` | `string` | solo default `""` | — |
| `preparedBy` | `string` | solo default `"Zivelo"` | — |
| `validUntil` | `string` | solo default `""` | — |
| `status` | `enum` | `enum(["draft", "active"])` | — |
| `currency` | `enum` | `enum(["MXN", "USD", "EUR", "COP", "CLP", "ARS", "BRL"])` | — |
| `phone` | `string` | `union([regex(E.164), literal("")])` | "Formato inválido (ej. +5213921107274)" |
| `branding.logoPath` | `string` | solo default `""` | — |
| `actions.approve` | `boolean` | solo default `true` | — |
| `actions.askQuestion` | `boolean` | solo default `true` | — |
| `actions.downloadPdf` | `boolean` | solo default `true` | — |
| `items` | `array` | `min(1)` | "Al menos un elemento es requerido" |

### Reglas por campo de item (`itemSchema`)

| Campo | Tipo | Regla | Mensaje |
|---|---|---|---|
| `title` | `string` | `min(1)` | "Requerido" |
| `shortDescription` | `string` | solo default `""` | — |
| `description` | `string` | solo default `""` | — |
| `price` | `coerce.number` | `min(0)` | "Debe ser 0 o mayor" |
| `bullets` | `string[]` | solo default `[]` | — |

## Validación en cliente

`QuoteCreateForm` usa `useForm` con `zodResolver`:

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
})
```

react-hook-form valúa el schema en cada cambio (`mode: "onChange"` por defecto con `zodResolver`). Los errores se muestran mediante el wrapper shadcn `<Form>` que provee `<FormField>`, `<FormItem>`, `<FormMessage>`.

## Validación en servidor

La server action `createQuote` (`lib/actions/quote.ts`) re-valida los datos entrantes con el mismo schema:

```typescript
import { formSchema } from "@/lib/schemas/quote"

export async function createQuote(data: unknown) {
  const parsed = formSchema.parse(data)
  // ...
}
```

Si la validación falla, devuelve `{ success: false, error: "mensaje" }` con el primer error de Zod.

## Flujo de validación

```
Usuario llena el formulario
  │
  ▼
react-hook-form + zodResolver validan en cliente
  │
  ├── Errores → se muestran en FormMessage
  │
  └── OK → onSubmit → Server Action
                    │
                    ▼
              formSchema.parse() (server-side)
                    │
                    ├── Error → toast con mensaje
                    │
                    └── OK → prisma.quote.create()
```

## UI de errores

Los mensajes de error se renderizan mediante `<FormMessage />` del wrapper shadcn/ui, que usa el token `--destructive` del tema (actualmente `#cc0000`, mismo color que `--accent`).

## Convenciones

1. **Schemas compartidos** — todo schema vive en `lib/schemas/` para que cliente y servidor usen las mismas reglas.
2. **Server action recibe `unknown`** — la server action declara `data: unknown` y usa `formSchema.parse(data)` para validar. Esto fuerza la validación en servidor sin confiar en el tipado de TypeScript.
3. **Mensajes en español** — todos los mensajes de validación están en español (idioma del producto).
4. **Wire up con shadcn Form** — los formularios usan el `<Form>` wrapper de shadcn/ui (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) para consistencia visual y de accesibilidad.

---

## Cuándo actualizar este documento

Actualiza este documento cuando:

- Se agregue un nuevo schema de validación (ej. `lib/schemas/settings.ts`, `lib/schemas/auth.ts`)
- Se modifiquen reglas existentes en `formSchema` o `itemSchema` (nuevos campos, cambios de tipo, mensajes)
- Se agregue un nuevo formulario en el dashboard que use validación
- Cambie la librería o versión de zod, react-hook-form o los resolvers
- Se modifique la UI de errores (cambio de token CSS, componente de error personalizado)
- Se implemente validación asíncrona (ej. uniqueness check de slug contra DB)
