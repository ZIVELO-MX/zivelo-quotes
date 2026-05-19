# Base de Datos — Zivelo Quotes

## Presente

### Stack
- **Base de datos:** PostgreSQL 15 en Supabase (us-east-1)
- **ORM:** Prisma v6.19.3
- **Conexión:** Session pooler (`aws-1-us-east-1.pooler.supabase.com:5432`) con autenticación MD5
- **Pooler elegido sobre directo:** El host directo (`db.wdleyusuhjwxzsoeocep.supabase.co`) solo responde a IPv6, inalcanzable desde WSL sin IPv6 global.

### Estructura Actual

Una sola tabla `Quote` con datos semiestructurados en JSONB:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `cuid` | PK generada por Prisma |
| `slug` | `string (unique)` | Identificador único para la URL pública |
| `projectLabel` | `string` | Etiqueta del proyecto (ej. "Propuesta · Proyecto Web") |
| `title` | `string` | Título completo de la cotización |
| `recipientName` | `string` | Cliente o empresa destinataria |
| `summary` | `string` | Resumen ejecutivo de la propuesta |
| `preparedBy` | `string` | Nombre de quien preparó la cotización |
| `validUntil` | `string` | Fecha de validez (ISO o texto legible) |
| `status` | `string` | `active` / `draft` / `expired` |
| `currency` | `string` | Código de moneda (ej. MXN) |
| `phone` | `string` | Teléfono de contacto para WhatsApp |
| `branding` | `JSONB` | Logo, colores, nombre de empresa |
| `items` | `JSONB` | Array de items de la propuesta |
| `actions` | `JSONB` | Configuración de botones de acción |
| `createdAt` | `datetime` | Fecha de creación |
| `updatedAt` | `datetime` | Fecha de última modificación |

### Schema de Tipos (TypeScript)

```ts
type QuoteItem = {
  title: string
  shortDescription: string
  description: string
  bullets: string[]
  price: number
  attachments: { label: string; url: string }[]
  links: string[]
}

type QuoteBranding = {
  logoPath: string
}

type QuoteActions = {
  approve: boolean
  askQuestion: boolean
  downloadPdf: boolean
}
```

### Conexión

**String de conexión:**
```
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

- El usuario debe usar el formato `postgres.<project_ref>` (ej. `postgres.wdleyusuhjwxzsoeocep`)
- Session pooler (puerto `5432`) en lugar de transaction pooler (`6543`) porque Prisma usa prepared statements que colisionan en modo transaccional
- El cliente Prisma se instancia como singleton en `lib/prisma.ts`

### Consultas

```ts
import { prisma } from "@/lib/prisma"

// Obtener por slug
const quote = await prisma.quote.findUnique({ where: { slug: "demo" } })

// Listar todas
const quotes = await prisma.quote.findMany({
  orderBy: { createdAt: "desc" },
})

// Crear
await prisma.quote.create({ data: { ... } })

// Actualizar
await prisma.quote.update({
  where: { slug: "demo" },
  data: { status: "expired" },
})
```

---

## Futuro

La estructura crecerá a medida que el producto evolucione de una tabla única a un modelo relacional.

### v0.1 — MVP Operativo

En esta fase la tabla `Quote` sigue siendo la única entidad. Se agregan:
- **Autenticación:** Supabase Auth para proteger el dashboard
- **Quotes por usuario:** Columna `userId` opcional (sin RLS aún)
- **Validación de datos:** Se define el contrato de los JSONB con tipos TS compartidos entre servidor y cliente

### v0.3 — Control y Privacidad

Posibles nuevas columnas en `Quote`:
- `password` — contraseña opcional para acceso restringido
- `publishedAt` — fecha de publicación
- `viewCount` — contador de visitas

### v0.5 — Multi-company

Se normalizan entidades separadas:

```
Organization
  - id
  - name
  - slug
  - branding (JSONB — logo, colores, etc.)
  - createdAt

User
  - id
  - email
  - name
  - organizationId → Organization
  - createdAt

Quote
  - ...columnas actuales...
  - organizationId → Organization
  - userId → User
```

Las columnas JSONB (`branding`, `items`, `actions`) se mantienen como dato flexible dentro de cada quote, mientras que el branding global se mueve a `Organization.branding` con herencia: si `Quote.branding` está vacío, se usa el de la organización.

### v1.0 — Producto Maduro

- **RLS (Row Level Security):** Políticas de Supabase para aislamiento multi-company a nivel DB
- **Historial de cambios:** Tabla `QuoteVersion` para tracking de ediciones
- **Templates:** Tabla `QuoteTemplate` con estructura reutilizable de items y pricing
- **Índices:** Sobre `slug`, `organizationId`, `status`, `createdAt`
- **Full-text search:** Índice GIN sobre `title`, `summary`, `recipientName`

### Resumen de Evolución

| Versión | Modelo | Entidades |
|---|---|---|
| Ahora | Flat + JSONB | `Quote` |
| v0.1 | Flat + JSONB + Auth | `Quote` + (Supabase Auth) |
| v0.5 | Relacional simple | `Organization`, `User`, `Quote` |
| v1.0 | Relacional completo | + `QuoteVersion`, `QuoteTemplate` |
