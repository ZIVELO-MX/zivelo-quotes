# Mapeo de Datos — Fuentes y Correspondencias

> Mapa completo de dónde se definen, validan, persisten y presentan los datos del proyecto.

## Convenciones

| Abreviatura | Significado |
|---|---|
| **DB** | PostgreSQL — columna real en Supabase |
| **Prisma** | Modelo en `prisma/schema.prisma` |
| **Zod** | Schema de validación en `lib/schemas/quote.ts` |
| **UI Mock** | Tipo hardcodeado usado en componentes dashboard |
| **Auth** | Tipo definido en `lib/auth/hardcoded-users.ts` o `auth-context.tsx` |

---

## 1. Modelo `Quote` — DB ↔ Prisma ↔ Zod ↔ UI Mock

| DB / Prisma | Zod (`formSchema`) | UI Mock (`QuotesPage`) | UI Mock (`DashboardPage`) |
|---|---|---|---|
| `id` cuid PK | — | `id: string` | — |
| `slug` string unique | `slug: z.string().regex(/^[a-z0-9-]+$/)` | `slug: string` | — |
| `projectLabel` string | `projectLabel: z.string().default("")` | — | — |
| `title` string | `title: z.string().min(3)` | `title: string` | `title: string` |
| `recipientName` string | `recipientName: z.string().min(1)` | `client: string` | `client: string` |
| `summary` string | `summary: z.string().default("")` | — | — |
| `preparedBy` string | `preparedBy: z.string().default("Zivelo")` | — | — |
| `validUntil` string | `validUntil: z.string().default("")` | `validUntil: string \| null` | — |
| `status` string | `status: z.enum(["draft","active"]).default("draft")` | `status: "active" \| "draft" \| "expired"` | `status: "active" \| "draft" \| "expired"` |
| `currency` string | `currency: z.enum(["MXN","USD","EUR","COP","CLP","ARS","BRL"]).default("MXN")` | `currency: string` | `currency: string` |
| `phone` string | `phone: z.union([z.string().regex(phoneRegex), z.literal("")]).default("")` | — | — |
| `branding` JSONB | `branding: z.object({ logoPath: z.string().default("") })` | — | — |
| `items` JSONB | `items: z.array(itemSchema).min(1)` | `total: number` (derivado) | — |
| `actions` JSONB | `actions: z.object({ approve, askQuestion, downloadPdf: z.boolean() })` | — | — |
| `createdAt` datetime | — | — | — |
| `updatedAt` datetime | — | `updatedAt: string` | — |

> **Nota:** `status` en DB es `string` libre (Zod restringe a `"draft"` / `"active"`). El mock de UI agrega `"expired"` como estado de presentación, aunque Zod no lo incluya en creación.

---

## 2. Item (`items[]`) — Zod ↔ DB (JSONB)

| Zod (`itemSchema`) | JSONB en DB | Ejemplo |
|---|---|---|
| `title` string min(1) | `title` | `"Desarrollo Web"` |
| `shortDescription` string default("") | `shortDescription` | `"Sitio completo"` |
| `description` string default("") | `description` | `"Incluye frontend y backend..."` |
| `price` number min(0) | `price` | `24000` |
| `bullets` string[] default([]) | `bullets` | `["SEO incluido", "3 revisiones"]` |

---

## 3. Branding — Zod ↔ DB (JSONB)

| Zod (`branding`) | JSONB en DB | Valor típico |
|---|---|---|
| `logoPath` string default("") | `logoPath` | `"/logos/zivelo-bars-dark-full.svg"` |

La organización también tiene branding hardcodeado (ver sección 6). A futuro,
`Quote.branding` heredará de `Organization.branding` si está vacío.

---

## 4. Actions — Zod ↔ DB (JSONB)

| Zod (`actions`) | JSONB en DB | Default |
|---|---|---|
| `approve` boolean | `approve` | `true` |
| `askQuestion` boolean | `askQuestion` | `true` |
| `downloadPdf` boolean | `downloadPdf` | `true` |

---

## 5. Dashboard Mock — Interfaces Internas (Sin DB)

### `DashboardPage` (`app/dashboard/(dashboard)/page.tsx`)

```ts
interface MockQuote {
  id: string
  title: string
  client: string
  status: "active" | "draft" | "expired"
  total: number
  currency: string
}
```

Proviene de `MOCK_QUOTES[]` — array estático, no de DB.

### `QuotesPage` (`app/dashboard/(dashboard)/quotes/page.tsx`)

```ts
interface Quote {
  id: string
  title: string
  client: string       // ← corresponde a recipientName en DB
  status: QuoteStatus   // "active" | "draft" | "expired"
  validUntil: string | null
  total: number         // ← derivado de items[].price, no columna directa
  currency: string
  slug: string
  updatedAt: string
}
```

Proviene de `ALL_QUOTES[]` — array estático, no de DB.

---

## 6. Autenticación — AuthContext + Hardcoded

### `User` (en `auth-context.tsx`)

| Campo | Fuente | Persistencia |
|---|---|---|
| `email` | `hardcoded-users.ts` | `localStorage` |
| `username` | `hardcoded-users.ts` | `localStorage` |
| `name` | `hardcoded-users.ts` | `localStorage` |
| `avatar` | `hardcoded-users.ts` | `localStorage` |
| `role` | `hardcoded-users.ts` | `localStorage` |
| `organization` | `hardcoded-users.ts` | `localStorage` |

### `OrgData` (en `hardcoded-users.ts`)

| Campo | Valor hardcodeado | Futuro (DB) |
|---|---|---|
| `name` | `"Zivelo Studio"` | `Organization.name` |
| `slug` | `"zivelo"` | `Organization.slug` |
| `branding.primaryColor` | `"#cc0000"` | `Organization.branding -> primaryColor` |
| `branding.logo` | `"/logos/zivelo-bars-dark-full.svg"` | `Organization.branding -> logo` |

---

## 7. Settings UI — Mapeo a Datos Reales

| Sección | UI Muestra | Fuente Actual | Fuente Futura |
|---|---|---|---|
| General | Resumen del negocio, membresía, plan | `useAuth().user.organization` + hardcode | `Organization` + `OrganizationMember[]` |
| Brand | Nombre, slug, moneda, WhatsApp, logo, color | `useAuth().user.organization` | `Organization.branding` + `Organization` |
| Team | Lista de miembros del equipo | `hardcoded-users.ts` | `OrganizationMember[]` + `UserProfile[]` |
| Account | Nombre, email, avatar | `useAuth().user` | `UserProfile` |
| Security | Cambio de contraseña | Hardcode (placeholder) | Supabase Auth |
| Quote Actions | Botones CTA habilitados | Hardcode (valor fijo) | `Organization.quoteActions` o `Quote.actions` |

---

## 8. Formulario de Creación — Zod → Server Action → DB

| Paso | Ubicación | Responsabilidad |
|---|---|---|
| Definición de tipos | `lib/schemas/quote.ts` | Zod `formSchema` + `itemSchema` |
| Validación cliente | `app/dashboard/quotes/new/page.tsx` | `react-hook-form` + `@hookform/resolvers/zod` |
| Server Action | `lib/actions/create-quote.ts` | Recibe `FormValues`, revalida, escribe a DB |
| Persistencia | `prisma/schema.prisma` → Supabase PostgreSQL | `prisma.quote.create()` con JSONB serializado |
| Lectura pública | `app/q/[quoteSlug]/page.tsx` | `prisma.quote.findUnique()` |
