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
| `status` | `string` | `draft` / `active` / `expired` |
| `currency` | `string` | Código de moneda (ej. MXN) |
| `phone` | `string` | Teléfono de contacto para WhatsApp |
| `branding` | `JSONB` | Logo, colores, nombre de empresa |
| `items` | `JSONB` | Array de items de la propuesta |
| `actions` | `JSONB` | Configuración de botones de acción |
| `createdAt` | `datetime` | Fecha de creación |
| `updatedAt` | `datetime` | Fecha de última modificación |

### Schema de Tipos — Zod (definición única y validación)

Los tipos fuente viven en `lib/schemas/quote.ts` como esquemas Zod. No hay interfaces TS duplicadas — se infieren con `z.infer<>`.

```ts
// ── Item ────────────────────────────────────────────────────
const itemSchema = z.object({
  title:           z.string().min(1, "Requerido"),
  shortDescription: z.string().default(""),
  description:     z.string().default(""),
  price:           z.coerce.number().min(0, "Debe ser 0 o mayor"),
  bullets:         z.array(z.string()).default([]),
})

// ── Formulario completo ─────────────────────────────────────
const formSchema = z.object({
  title:          z.string().min(3, "Al menos 3 caracteres"),
  slug:           z.string().min(1).regex(/^[a-z0-9-]+$/),
  projectLabel:   z.string().default(""),
  recipientName:  z.string().min(1, "Requerido"),
  summary:        z.string().default(""),
  preparedBy:     z.string().default("Zivelo"),
  validUntil:     z.string().default(""),
  status:         z.enum(["draft", "active"]).default("draft"),
  currency:       z.enum(["MXN","USD","EUR","COP","CLP","ARS","BRL"]).default("MXN"),
  phone:          z.union([z.string().regex(phoneRegex), z.literal("")]).default(""),
  branding:       z.object({ logoPath: z.string().default("") }).default({ logoPath: "" }),
  actions:        z.object({
                    approve: z.boolean().default(true),
                    askQuestion: z.boolean().default(true),
                    downloadPdf: z.boolean().default(true),
                  }).default({ approve: true, askQuestion: true, downloadPdf: true }),
  items:          z.array(itemSchema).min(1, "Al menos un elemento es requerido"),
})
```

### Correspondencia Zod → JSONB en DB

| Campo Zod | JSONB DB | Notas |
|---|---|---|
| `items` | Array de objetos con `title`, `shortDescription`, `description`, `price`, `bullets` | Sin `attachments`/`links` (se eliminaron) |
| `branding` | `{ logoPath: string }` | Solo logo; color y nombre vienen de `Organization` |
| `actions` | `{ approve, askQuestion, downloadPdf: boolean }` | Control de CTA en vista pública |

> Ver `docs/data-map.md` para el mapeo completo DB ↔ Zod ↔ UI mock.

### Autenticación (Hardcodeada — Sin Modelo en DB)

Actualmente no hay modelos `User` ni `Organization` en Prisma. La autenticación es completamente hardcodeada:

- **`lib/auth/hardcoded-users.ts`**: 4 usuarios fijos (Owner, Manager, Editor, Viewer) con roles y organización demo
- **`lib/auth/auth-context.tsx`**: Contexto React que almacena el usuario en `localStorage`
- **`HARDCODED_ORGANIZATION`**: Datos quemados (`Zivelo Studio`, slug `zivelo`, color `#cc0000`)

| Archivo | Propósito | Estado |
|---|---|---|
| `prisma/schema.prisma` | Solo modelo `Quote` | Actual |
| `lib/auth/hardcoded-users.ts` | Usuarios demo con roles y org | Temporal (MVP) |
| `lib/auth/auth-context.tsx` | Provider React + localStorage | Temporal (MVP) |
| `app/dashboard/(dashboard)/settings/page.tsx` | Settings UI con secciones hardcodeadas | Actual |

Los datos de organización y miembros que se ven en la UI de settings (`/dashboard/settings`) provienen de estos archivos hardcodeados, no de la base de datos.

### RLS Actual

```sql
-- anon puede leer quotes publicadas
CREATE POLICY "anon_select_published" ON "Quote"
  FOR SELECT TO anon
  USING (status = 'active');

-- authenticated tiene acceso total
CREATE POLICY "auth_all" ON "Quote"
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
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

La estructura crecerá a medida que el producto evolucione de una tabla única a un modelo relacional. Las fases están alineadas con el roadmap del proyecto.

### v0.1 — MVP Operativo

En esta fase la tabla `Quote` sigue siendo la única entidad. Se agregan:

- **Autenticación real:** Migrar de auth hardcodeado a Supabase Auth
- **Quotes por usuario:** Columna opcional `createdByUserId` en `Quote` (sin RLS aún)
- **Validación de datos:** Contrato de JSONB mantenido con tipos TS compartidos

No se crean modelos `User` ni `Organization` en Prisma durante esta fase. Supabase Auth maneja la sesión; Prisma solo persiste quotes.

### v0.3 — Control y Privacidad

Posibles nuevas columnas en `Quote`:
- `password` — contraseña opcional para acceso restringido
- `publishedAt` — fecha de publicación
- `viewCount` — contador de visitas

### v0.5 — Multi-company (Organizaciones y Membresías)

Se normalizan entidades separadas. Modelo basado en el [auth-plan.md](./auth-plan.md):

```prisma
model UserProfile {
  id          String   @id @default(cuid())
  authUserId  String   @unique // referencia a Supabase Auth
  email       String
  name        String
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  memberships       OrganizationMember[]
  createdInvitations OrganizationInvitation[] @relation("InvitedBy")
  acceptedInvitations OrganizationInvitation[] @relation("AcceptedBy")
  quotes            Quote[]
}

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  branding  Json     @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members   OrganizationMember[]
  invitations OrganizationInvitation[]
  quotes    Quote[]
}

model OrganizationMember {
  id               String   @id @default(cuid())
  role             String   // Owner | Manager | Editor | Viewer
  status           String   @default("active")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  organizationId   String
  organization     Organization @relation(fields: [organizationId], references: [id])
  userProfileId    String
  userProfile      UserProfile @relation(fields: [userProfileId], references: [id])

  @@unique([organizationId, userProfileId])
}

model OrganizationInvitation {
  id                  String    @id @default(cuid())
  email               String
  role                String
  tokenHash           String
  status              String    @default("pending") // pending | accepted | expired | cancelled
  expiresAt           DateTime
  acceptedAt          DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  organizationId      String
  organization        Organization @relation(fields: [organizationId], references: [id])
  invitedByUserProfileId String?
  invitedBy           UserProfile? @relation("InvitedBy", fields: [invitedByUserProfileId], references: [id])
  acceptedByUserProfileId String?
  acceptedBy          UserProfile? @relation("AcceptedBy", fields: [acceptedByUserProfileId], references: [id])
}

model Quote {
  // ...columnas actuales...
  organizationId          String?
  organization            Organization?  @relation(fields: [organizationId], references: [id])
  createdByUserProfileId  String?
  createdBy               UserProfile?   @relation(fields: [createdByUserProfileId], references: [id])
}
```

Las columnas JSONB (`branding`, `items`, `actions`) se mantienen como dato flexible dentro de cada quote, mientras que el branding global se mueve a `Organization.branding` con herencia: si `Quote.branding` está vacío, se usa el de la organización.

La RLS de `Quote` debe actualizarse para restringir dashboard CRUD a miembros de la organización, manteniendo lectura pública para quotes publicadas.

### v0.7 — Plataforma Reutilizable

- **QuoteTemplate:** Tabla con estructura reutilizable de items y pricing
- **Branding por organización:** Tokens visuales para landing, dashboard y quotes

```prisma
model QuoteTemplate {
  id            String   @id @default(cuid())
  name          String
  description   String?
  items         Json     @default("[]") // estructura de items reutilizable
  organizationId String?
  organization  Organization? @relation(fields: [organizationId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### v1.0 — Producto Maduro

- **RLS completo:** Políticas de Supabase para aislamiento multi-company a nivel DB
- **Historial de cambios:** Tabla `QuoteVersion` para tracking de ediciones
- **Full-text search:** Índice GIN sobre `title`, `summary`, `recipientName`
- **Índices adicionales:** Sobre `slug`, `organizationId`, `status`, `createdAt`

```prisma
model QuoteVersion {
  id        String   @id @default(cuid())
  quoteId   String
  quote     Quote    @relation(fields: [quoteId], references: [id])
  data      Json     // snapshot completo de la quote en ese momento
  createdBy String?  // UserProfile id
  createdAt DateTime @default(now())
}
```

### Resumen de Evolución

| Versión | Modelo | Entidades en Prisma |
|---|---|---|
| Ahora (v0.1) | Flat + JSONB | `Quote` |
| v0.3 | Flat + JSONB + Auth | `Quote` + (Supabase Auth, sin modelos nuevos) |
| v0.5 | Relacional simple | `Quote`, `UserProfile`, `Organization`, `OrganizationMember`, `OrganizationInvitation` |
| v0.7 | Relacional + Templates | + `QuoteTemplate` |
| v1.0 | Relacional completo | + `QuoteVersion` |

### Notas de Migración

- `UserProfile.authUserId` referencia el usuario de Supabase Auth (UUID), no es FK de Prisma
- Prisma almacena el perfil y permisos de aplicación; Supabase Auth almacena identidad y credenciales
- No guardar `password_hash` en Prisma si Supabase Auth administra credenciales
- El email debe normalizarse (toLowerCase + trim) para comparar invitaciones y usuarios
- Los tokens de invitación deben guardarse hasheados (ej. bcrypt o SHA-256)
