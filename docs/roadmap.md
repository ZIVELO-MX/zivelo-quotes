# Roadmap

## Versión Actual

| Campo | Estado |
| --- | --- |
| Versión actual | v0.0.9 → v0.1.0 |
| Fase activa | MVP operativo |
| Avance actual | Landing pública, quote pública dinámica desde DB, Prisma + Supabase PostgreSQL, PDF export, OG image, WhatsApp actions, dashboard layout, creación de quotes, auth hardcodeado (login/logout/protección), página de perfil con 4 secciones (Profile, Workspace, Users & Permissions, Security) y tests base. |
| Siguiente foco | Listado de quotes, edición básica y pulir detalles pre-MVP. |
| Meta inmediata | Zivelo puede crear, editar, publicar y compartir cotizaciones reales desde un dashboard interno protegido. |

Este roadmap prioriza terminar primero el flujo interno de cotizaciones de Zivelo. La plataforma debe quedar preparada para organizaciones, miembros e invitaciones, pero esas funciones no deben bloquear el MVP operativo.

## Principios De Ejecución

| Principio | Decisión |
| --- | --- |
| MVP antes que plataforma completa | Primero debe existir un flujo real para operar cotizaciones internas. |
| Datos estructurados | Las quotes viven como datos renderizables, no como páginas hardcodeadas. |
| Seguridad gradual | El dashboard debe protegerse pronto, pero las organizaciones multiusuario llegan después. |
| Rutas simples | Mantener `/dashboard` y `/q/[quoteSlug]` hasta que el producto necesite rutas más complejas. |
| Escalabilidad preparada | Multi-company, invitaciones, white-label y custom domains quedan planificados sin adelantar complejidad. |

## Estado Real Del Proyecto

| Área | Estado |
| --- | --- |
| Landing `/` | Hecho |
| Quote pública `/q/[quoteSlug]` | Hecho |
| Persistencia | Hecho con Prisma + Supabase PostgreSQL |
| Modelo actual | Solo `Quote` |
| Creación de quote | Hecho en `/dashboard/quotes/new` |
| PDF | Hecho |
| Open Graph | Hecho |
| WhatsApp actions | Hecho |
| Tests de schemas | Hecho |
| Tests de server action | Hecho |
| Dashboard | Parcial, layout y creación |
| Página de settings `/dashboard/settings` | Hecho: migrada desde `/profile`, 4 secciones (Profile, Workspace, Users & Permissions, Security), navegación responsive con sidebar (desktop) / tabs (mobile) |
| Roles y permisos en UI | Hecho: Owner/Manager ven todo; Editor/Viewer ocultan Users; Viewer no crea quotes |
| Dropdown de roles | Hecho: custom con colores, scroll, estilo quote-form |
| Avatar | Hecho: foto con fallback a iniciales, Owner con logo Zivelo |
| Login | Funcional con datos hardcodeados en `/dashboard/login` |
| Auth real | Hardcodeado (`lib/auth/`), pendiente migrar a Supabase Auth |
| Protección de dashboard | Hecho (cliente-side, redirect a login si no hay sesión) |
| Logout | Hecho desde menú de usuario en header |
| Página 403 | Hecho en `/forbidden` |
| Organizaciones / miembros / invitaciones | Pendiente, futuro |

## Fases

| Fase | Versión | Objetivo | Resultado Esperado |
| --- | --- | --- | --- |
| Fundaciones | v0.0.1 | Definir arquitectura, alcance y estructura base. | Documentación clara y ruta técnica inicial. |
| Producto visible | v0.0.5 | Crear landing y quote demo navegable. | Producto demostrable antes del dashboard completo. |
| Tests y validación | v0.0.8 | Cubrir lógica core con tests automatizados. | Schemas y server actions validados. |
| MVP operativo | v0.1.0 | Operar cotizaciones reales desde dashboard interno protegido. | Crear, editar, publicar y compartir quotes reales. |
| Control y privacidad | v0.2.0 | Mejorar estados, privacidad y administración. | Mayor control sobre quotes sensibles. |
| Organizaciones e invitaciones | v0.5.0 | Agregar organizaciones, miembros, roles e invitaciones. | Acceso B2B controlado por organización. |
| Plataforma reutilizable | v0.7.0 | Preparar multi-company, white-label y templates. | La plataforma puede adaptarse a más clientes o marcas. |
| Infraestructura avanzada | v0.9.0 | Soportar dominios, workspaces y deploys administrados. | Operación flexible para clientes premium. |
| Producto maduro | v1.0.0 | Consolidar SaaS privado estable. | Plataforma robusta, reusable y lista para operación amplia. |

## v0.0.1 - Fundaciones

| Entregable | Descripción | Estado |
| --- | --- | --- |
| README del producto | Visión, alcance MVP y posicionamiento. | Hecho |
| Arquitectura inicial | Rutas, módulos sugeridos y modelo base de quote. | Hecho |
| Roadmap estable | Plan ejecutable por fases. | Hecho |
| Definición de MVP | Alineación de alcance inicial. | Hecho |

## v0.0.5 - Producto Visible

| Entregable | Alcance | Estado |
| --- | --- | --- |
| Landing pública | Página principal en `/`. | Hecho |
| Quote demo | Experiencia pública inicial en `/q/demo`. | Hecho |
| Quote schema | Estructura de datos para cotizaciones. | Hecho |
| Navegación mínima | Enlaces entre landing, demo y dashboard. | Hecho |
| Open Graph | Metadata e imagen social inicial. | Hecho |
| WhatsApp actions | Acciones para aprobar o preguntar por WhatsApp. | Hecho |

## v0.0.8 - Tests Y Validación

| Entregable | Descripción | Estado |
| --- | --- | --- |
| Setup de testing | Vitest, alias y scripts. | Hecho |
| Tests de schemas Zod | Happy path y unhappy path de `formSchema` e `itemSchema`. | Hecho |
| Tests de server actions | `createQuote` con Prisma mockeado. | Hecho |
| Tests de componentes | Render e interacción de componentes principales. | Futuro |
| CI | Ejecutar tests antes de deploy. | Futuro |

Ver [`docs/test-plan.md`](./test-plan.md) para cobertura detallada.

## v0.1.0 - MVP Operativo

Esta es la fase activa. El objetivo es que Zivelo pueda usar el producto internamente para propuestas reales.

| Entregable | Alcance | Estado |
| --- | --- | --- |
| Dashboard interno | Layout y rutas base bajo `/dashboard`. | Parcial |
| Crear quote | Formulario con react-hook-form, zod y Server Action. | Hecho |
| Listado de quotes | Tabla o vista de quotes con estado, cliente, slug y fecha. | Siguiente |
| Editar quote | Modificar contenido, items, pricing y CTA. | Siguiente |
| Auth hardcodeado | Login funcional para `/dashboard/login` con datos fijos. | Hecho |
| Protección de dashboard | Redirigir usuarios no autenticados fuera de `/dashboard`. | Hecho (cliente-side) |
| Logout | Salida clara desde el dashboard. | Hecho |
| DevUserSwitcher | Selector flotante para cambiar de rol al instante. BORRAR antes del MVP. | Hecho |
| Supabase Auth | Migrar auth hardcodeado a Supabase Auth real. | Siguiente |
| Remover DevUserSwitcher | Borrar `components/dashboard/dev-user-switcher.tsx` y su import en el layout antes del MVP. | Pendiente |
| Página de settings `/dashboard/settings` | 4 secciones con navbar responsive: sidebar (desktop) / índice Slack (mobile). Migrada desde `/profile`. | Hecho |
| Mobile Support | Viewport config, password visibility toggle, touch targets mejorados, iOS zoom prevention. | Hecho |
| Dashboard nav mobile | Menú hamburguesa con Sheet con links de navegación. | Hecho |
| AppSidebar responsive | Sidebar de escritorio reemplazado por tabs horizontales en mobile. | Hecho |
| Consolidación de rutas | `/profile` → `/dashboard/settings`, `/dashboard/user` redirige a `/dashboard/settings`. | Hecho |
| Página 403 | Ruta `/forbidden` para acceso denegado. | Hecho |
| Avatar con foto | Foto vía AvatarImage, fallback a iniciales (nombre+apellido). | Hecho |
| Pulir detalles pre-MVP | Extraer demo data a `lib/auth/demo-data.ts` | Siguiente |
| Pulir detalles pre-MVP | Extraer `RoleDropdown` a `components/ui/role-dropdown.tsx` | Siguiente |
| Pulir detalles pre-MVP | Agregar loading states y skeleton UI en dashboard y perfil | Siguiente |
| Pulir detalles pre-MVP | Agregar `Suspense` y skeletons donde haya carga asíncrona | Siguiente |
| Publicar / despublicar | Control claro de estado `draft` / `published`. | Parcial |
| Página pública | Render desde DB en `/q/[quoteSlug]`. | Hecho |
| Exportar PDF | Snapshot compartible. | Hecho |
| Open Graph dinámico | Preview social por quote. | Hecho |
| Validación core | Schemas y server actions cubiertos por tests. | Hecho |

### Criterio De Salida

La fase termina cuando Zivelo pueda iniciar sesión, crear una cotización desde el dashboard, verla en un listado, editarla, publicarla, compartir su URL pública y exportarla como PDF sin editar código.

## v0.2.0 - Control Y Privacidad

| Entregable | Descripción |
| --- | --- |
| Estados robustos | Draft, published, archived o expired según necesidad real. |
| Validaciones de publicación | Evitar publicar quotes incompletas. |
| Acciones rápidas | Duplicar, archivar, previsualizar y publicar. |
| Protección avanzada | Password o private links para quotes sensibles, si se valida la necesidad. |
| Historial básico | Timestamps o eventos importantes de administración. |
| Ownership básico | Asociar quotes con el usuario que las creó, si aporta valor operativo antes de organizaciones. |

### Criterio De Salida

El equipo puede manejar propuestas sensibles con menor riesgo operativo.

## v0.5.0 - Organizaciones E Invitaciones

Esta fase implementa el modelo B2B privado descrito en [`docs/auth-plan.md`](./auth-plan.md).

| Entregable | Descripción |
| --- | --- |
| Organizaciones | Modelo `Organization` con nombre, slug y branding. |
| Perfiles | Perfil de app ligado al usuario de Supabase Auth. |
| Membresías | Usuarios pertenecen a organizaciones con roles. |
| Roles | Owner, Manager, Editor y Viewer. |
| Members screen | `/dashboard/members` con miembros e invitaciones pendientes. |
| Invitaciones manuales | Links con token para copiar o compartir por WhatsApp. |
| Access gate | Login no basta: se requiere membresía activa. |
| RLS por organización | Quotes aisladas por `organizationId`. |

### Criterio De Salida

Una organización puede controlar quién entra al dashboard, qué rol tiene y qué acciones puede ejecutar.

## v0.7.0 - Plataforma Reutilizable

| Entregable | Descripción |
| --- | --- |
| Multi-company básico | Separación de datos y branding por organización. |
| White-label support | Base para adaptar identidad visual por cliente o marca. |
| Branding compartido | Tokens reutilizables entre landing, dashboard, quotes y OG. |
| Quote engine modular | Separación más clara entre datos, reglas y presentación. |
| Templates por industria | Variantes por tipo de servicio o cliente. |

### Criterio De Salida

La plataforma puede adaptarse a más de una marca o cliente sin duplicar la aplicación completa.

## v0.9.0 - Infraestructura Avanzada

| Entregable | Descripción |
| --- | --- |
| Custom domains | Dominios personalizados por cliente. |
| Managed workspaces | Espacios administrados para clientes o marcas. |
| Deploy-per-client | Base para despliegues dedicados cuando el caso lo requiera. |
| Configuración por entorno | Settings claros por deployment. |
| Observabilidad | Logs y monitoreo mínimos para operación confiable. |

### Criterio De Salida

Zivelo puede operar quotes en dominios o entornos diferenciados sin comprometer la base central del producto.

## v1.0.0 - Producto Maduro

| Pilar | Resultado Esperado |
| --- | --- |
| SaaS privado | Plataforma estable para uso interno y clientes administrados. |
| Invite-only access | Acceso controlado por organización, no autoservicio abierto. |
| White-label | Personalización visual madura. |
| Dedicated deployments | Infraestructura separada para clientes premium. |
| Templates avanzados | Biblioteca robusta de experiencias de quote. |
| Quote engine modular | Motor portable para futuros productos de Zivelo. |
| Branding maduro | Consistencia entre landing, dashboard, quotes y OG. |

## Dependencias Principales

| Dependencia | Bloquea | Decisión |
| --- | --- | --- |
| Base de datos | Persistencia de quotes | Prisma + Supabase PostgreSQL. |
| Auth | Dashboard interno | Supabase Auth recomendado. |
| Render PDF | Exportación | Librería local actual con `jspdf`. |
| Open Graph | Previews sociales | Generación dinámica por ruta. |
| Branding | Landing, demo y quotes | Tokens visuales base de Zivelo. |

## Orden Recomendado De Implementación

| Orden | Trabajo | Estado |
| --- | --- | --- |
| 1 | Base Next.js y layout principal | Hecho |
| 2 | Landing pública | Hecho |
| 3 | Quote demo sobre schema inicial | Hecho |
| 4 | Quote schema y datos mock | Hecho |
| 5 | Vista pública `/q/[quoteSlug]` + DB | Hecho |
| 6 | Crear quote desde dashboard | Hecho |
| 7 | RLS inicial en `Quote` | Hecho |
| 8 | Setup de testing | Hecho |
| 9 | Tests de schemas y server action | Hecho |
| 10 | Página de settings `/dashboard/settings` (4 secciones + sidebar/tabs + roles) | Hecho |
| 10b | Consolidación de rutas: `/profile` → `/dashboard/settings`, `/dashboard/user` redirige a `/dashboard/settings` | Hecho |
| 11 | Listado de quotes | Siguiente |
| 12 | Edición básica de quote | Siguiente |
| 13 | Auth hardcodeado (login/logout/protección) | Hecho |
| 14 | Pulir pre-MVP: skeletons, loading states, refactors | Siguiente |
| 15 | Supabase Auth para dashboard (migrar auth real) | Siguiente |
| 16 | Pulir publicación y estados | Después |
| 17 | Organizaciones, miembros e invitaciones | Futuro |

## Fuera Del MVP Operativo

| Funcionalidad | Motivo |
| --- | --- |
| Pagos | No es necesario para validar propuestas internas. |
| Comentarios de clientes | Puede agregarse después de validar el flujo principal. |
| Cuentas de clientes | El MVP es un SaaS privado administrado por Zivelo. |
| Analytics avanzado | Primero se necesita uso real y quotes publicadas. |
| Builder drag and drop | Alto costo para una primera versión operativa. |
| Subscription billing | No aplica al MVP interno. |
| CRM | Debe integrarse después, no dirigir la arquitectura inicial. |
| Organizaciones multiusuario | Planificado para una fase futura. |
| Invitaciones | Planificadas para una fase futura. |
| Dominios personalizados | Infraestructura avanzada. |
