# Auth Plan — Zivelo Quotes

Este documento define la estrategia de autenticación y control de acceso para Zivelo Quotes. Está dividido entre el estado actual del proyecto, el MVP inmediato y la dirección futura de organizaciones, miembros e invitaciones.

## Estado Actual Del Proyecto

La app todavía no tiene autenticación real implementada.

| Área | Estado |
| --- | --- |
| Framework | Next.js App Router |
| Base de datos | Supabase PostgreSQL |
| ORM | Prisma |
| Modelo Prisma actual | Solo `Quote` |
| Login | Placeholder en `/dashboard/login` |
| Dashboard | No protegido por sesión real todavía |
| Middleware auth | No implementado |
| Usuarios / organizaciones | No existen en Prisma todavía |
| Invitaciones | No implementadas |
| RLS actual | `Quote` tiene RLS en SQL: `anon` lee publicadas, `authenticated` tiene acceso total |

El archivo `prisma/schema.prisma` actualmente solo contiene:

- `Quote`

Por lo tanto, cualquier plan de usuarios, organizaciones, roles o invitaciones debe tratarse como trabajo futuro, no como funcionalidad existente.

## Objetivo Inmediato Del MVP

Para el MVP operativo, el objetivo principal es proteger el dashboard interno mientras Zivelo termina el flujo real de creación, edición, publicación y compartición de cotizaciones.

El MVP inmediato debe resolver:

- Login real para el dashboard.
- Protección de `/dashboard` y rutas internas.
- Acceso privado para el equipo de Zivelo.
- Cotizaciones públicas compartibles en `/q/[quoteSlug]`.
- Un camino técnico que no bloquee organizaciones e invitaciones en fases posteriores.

La implementación recomendada para este MVP es **Supabase Auth**.

Supabase Auth debe encargarse de:

- Login.
- Logout.
- Sesión.
- Proveedores OAuth como Google.
- Email/password si se decide mantenerlo.
- Recuperación de acceso si se habilita email/password.

Prisma debe encargarse solo de datos de aplicación:

- Quotes.
- Perfiles internos futuros.
- Organizaciones futuras.
- Membresías futuras.
- Invitaciones futuras.

No se debe guardar `password_hash` en Prisma si Supabase Auth administra credenciales.

## Rutas

### Rutas actuales

| Ruta | Estado |
| --- | --- |
| `/` | Landing pública |
| `/q/[quoteSlug]` | Quote pública por slug |
| `/dashboard` | Dashboard interno, aún no protegido |
| `/dashboard/quotes/new` | Crear quote |
| `/dashboard/login` | Login placeholder |

### Rutas objetivo futuras

La dirección futura puede migrar la autenticación pública a:

```txt
/login
/accept-invite
```

Pero esa migración no debe asumirse como hecha. Mientras el proyecto mantenga la estructura actual, los enlaces del dashboard deben seguir apuntando a:

```txt
/dashboard/login
```

Cuando se decida migrar a `/login`, se debe actualizar:

- Header del dashboard.
- Middleware de protección.
- Redirecciones post-login.
- Links desde landing o CTA.
- Documentación.

## Fase 1 — Auth Real Para El Dashboard

Objetivo: convertir el placeholder de login en autenticación funcional.

Alcance:

- Configurar Supabase Auth en el proyecto.
- Agregar variables necesarias en `.env.example`.
- Implementar cliente/server helpers de Supabase para Next.js.
- Convertir `/dashboard/login` en login funcional.
- Agregar logout.
- Proteger rutas bajo `/dashboard`, excepto `/dashboard/login`.
- Redirigir usuarios no autenticados a `/dashboard/login`.
- Redirigir usuarios autenticados fuera de `/dashboard/login` hacia `/dashboard`.

Decisión recomendada:

- Google OAuth puede estar disponible desde esta fase.
- Email/password puede existir si ayuda a operar internamente.
- No agregar signup público de autoservicio como flujo principal del producto.

Mensaje de producto:

- El dashboard es privado.
- El login existe para usuarios autorizados.
- La app no debe sentirse como SaaS abierto donde cualquiera puede crear cuenta y operar.

## Fase 2 — Ownership Básico De Quotes

Objetivo: preparar las cotizaciones para pertenecer a usuarios autenticados sin introducir todavía organizaciones completas.

Cambios posibles:

- Agregar a `Quote` un campo opcional `createdByUserId`.
- Guardar el id del usuario autenticado al crear una quote.
- Mantener la lectura pública por slug para quotes publicadas.
- Mantener el dashboard como operación interna de Zivelo.

Esta fase debe ser simple. No debe bloquear el MVP con un modelo multiempresa completo.

## Fase 3 — Organizaciones Y Membresías

Objetivo: pasar de acceso interno simple a control por organización.

Modelo conceptual:

```txt
UserProfile
  id
  authUserId
  email
  name
  createdAt
  updatedAt

Organization
  id
  name
  slug
  branding
  createdAt
  updatedAt

OrganizationMember
  id
  organizationId
  userProfileId
  role
  status
  createdAt
  updatedAt

OrganizationInvitation
  id
  organizationId
  email
  role
  tokenHash
  status
  invitedByUserProfileId
  acceptedByUserProfileId
  acceptedAt
  expiresAt
  createdAt
  updatedAt
```

Notas:

- `UserProfile.authUserId` referencia el usuario de Supabase Auth.
- Prisma almacena el perfil y los permisos de aplicación.
- Supabase Auth almacena identidad, sesión y credenciales.
- El email debe normalizarse para comparar invitaciones y usuarios.

## Fase 4 — Invitaciones

Objetivo: controlar el acceso mediante invitaciones creadas por miembros autorizados.

El producto no debe permitir que cualquier persona se registre y empiece a usar el dashboard. Autenticarse con Google solo prueba identidad; no concede acceso por sí mismo.

Regla principal:

> Para entrar al dashboard, el usuario debe tener una membresía activa en una organización.

Flujo:

1. Un Owner o Manager abre `/dashboard/members`.
2. Crea una invitación.
3. Ingresa el email del invitado.
4. Selecciona un rol permitido.
5. El sistema genera un token único.
6. Guarda solo el hash del token en base de datos.
7. Muestra un link para copiar o compartir por WhatsApp.
8. El invitado abre `/accept-invite?token=...`.
9. El sistema valida token, estado y expiración.
10. El invitado inicia sesión con el mismo email de la invitación.
11. Si el email coincide, puede aceptar.
12. Se crea `OrganizationMember`.
13. La invitación se marca como `accepted`.
14. Se guarda quién la aceptó y cuándo.
15. El usuario entra a `/dashboard`.

Para el MVP de esta fase, las invitaciones por email automático quedan fuera. El link puede copiarse o compartirse manualmente por WhatsApp.

## Roles Futuros

Roles recomendados:

| Rol | Propósito |
| --- | --- |
| Owner | Control total de organización, miembros, roles, invitaciones y quotes |
| Manager | Gestión operativa de quotes e invitaciones limitadas |
| Editor | Crear y editar quotes |
| Viewer | Ver y compartir quotes |

Permisos:

| Permiso | Owner | Manager | Editor | Viewer |
| --- | --- | --- | --- | --- |
| Ver quotes | Sí | Sí | Sí | Sí |
| Crear quotes | Sí | Sí | Sí | No |
| Editar quotes | Sí | Sí | Sí | No |
| Compartir quotes | Sí | Sí | Sí | Sí |
| Invitar miembros | Sí | Sí, limitado | No | No |
| Cancelar invitaciones | Sí | Sí, limitado | No | No |
| Remover miembros | Sí | Limitado | No | No |
| Cambiar roles | Sí | Limitado | No | No |
| Gestionar organización | Sí | No | No | No |

Reglas de jerarquía:

- Owner tiene control total.
- Manager no puede modificar Owners.
- Manager no puede invitar Managers.
- Manager solo puede invitar Editor y Viewer.
- Manager no puede remover Owners ni Managers.
- Editor y Viewer no pueden invitar usuarios.

## Estados De Invitación

Estados recomendados:

| Estado | Significado |
| --- | --- |
| `pending` | Invitación creada y usable |
| `accepted` | Invitación ya usada |
| `expired` | Invitación vencida |
| `cancelled` | Invitación cancelada por un usuario autorizado |

Reglas de seguridad:

- El token debe expirar, por ejemplo, después de 7 días.
- El token solo puede usarse una vez.
- El token debe guardarse hasheado.
- La invitación debe estar ligada a un email específico.
- El usuario autenticado debe tener el mismo email de la invitación.
- Si el email no coincide, no se debe permitir aceptar.
- Si el usuario ya pertenece a la organización, mostrar estado claro.
- Si la invitación expiró, fue cancelada o ya fue aceptada, mostrar estado claro.

## Members Screen Futuro

Ruta sugerida:

```txt
/dashboard/members
```

Debe mostrar:

- Miembros activos.
- Nombre.
- Email.
- Rol.
- Acciones disponibles según permisos.
- Invitaciones pendientes.
- Botón para crear invitación.
- Acciones para copiar link, compartir por WhatsApp o cancelar.

Texto recomendado para WhatsApp:

```txt
Hello, I’m inviting you to join our organization on Zivelo Quotes to create and share quotes/proposals.

This invitation was created for this email address:
{{email}}

Open this link to accept the invitation:
{{invite_link}}
```

## RLS Futuro

La RLS actual de `Quote` es suficiente como punto inicial, pero no es suficiente para multi-organización.

Cuando existan organizaciones:

- `Quote` debe tener `organizationId`.
- Las policies deben restringir dashboard CRUD a miembros de la organización.
- La lectura pública debe seguir permitiendo quotes publicadas por slug.
- Los roles deben validarse también en server actions.
- No se debe confiar solo en UI para permisos.

Modelo futuro de `Quote`:

```txt
Quote
  id
  slug
  organizationId
  createdByUserProfileId
  ...
```

## Fuera Del MVP Inmediato

No entra en el MVP operativo actual:

- Organizaciones multiusuario completas.
- Pantalla de miembros.
- Invitaciones funcionales.
- Emails automáticos de invitación.
- Corporate SSO.
- Multi-organization switching.
- Planes o límites por plan.
- Audit logs.
- Permisos ultra granulares.

Estas funciones quedan planificadas para una fase futura después de que el flujo central de quotes esté operativo.
