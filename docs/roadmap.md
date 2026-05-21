# Roadmap

## Versión Actual

| Campo | Estado |
| --- | --- |
| Versión actual | v0.0.8 → v0.1.0 — Tests y validación + MVP Operativo — fases en curso |
| Avance actual | Landing pública, ruta `/q/[quoteSlug]` desde DB (Prisma + Supabase PostgreSQL), i18n EN/ES, PDF export, OG image premium, WhatsApp integration. Dashboard layout con navegación, página de creación de quotes (`/dashboard/quotes/new`) con formulario completo (react-hook-form + zod, items dinámicos, tags, switch toggles, validación), Server Action para persistir vía Prisma, login placeholder (`/dashboard/login`). Tests automatizados de schemas Zod con vitest (15 tests: happy path + unhappy path de `formSchema` e `itemSchema`). |
| Siguiente fase | v0.1.0 - MVP Operativo |
| Siguiente foco | Listado de quotes, edición, autenticación real con Supabase Auth. |
| Meta inmediata | Zivelo puede crear, publicar y compartir cotizaciones reales desde el dashboard. |

Este roadmap organiza Zivelo Quotes como un producto que puede arrancar pequeño, validar su flujo interno y crecer hacia una plataforma reutilizable sin rehacer su base.

El plan prioriza cuatro superficies iniciales:

- Landing pública del producto
- Quote demo para mostrar la experiencia final
- Dashboard interno de administración
- Funcionalidad central para crear, publicar y compartir cotizaciones

## Principios De Ejecución

| Principio | Decisión |
| --- | --- |
| Primero experiencia, luego complejidad | El MVP debe demostrar una cotización interactiva antes de agregar automatizaciones avanzadas. |
| Datos estructurados | Las quotes deben vivir como datos renderizables por templates, no como páginas hardcodeadas. |
| Dashboard funcional | El admin debe permitir operar el flujo real de Zivelo, aunque inicie con una edición simple. |
| Demo estable | Debe existir una quote demo pulida que sirva para ventas, pruebas visuales y validación interna. |
| Escalabilidad gradual | Multi-company, white-label y custom domains quedan preparados, pero no bloquean el MVP. |

## Fases

| Fase | Versión | Objetivo | Resultado Esperado |
| --- | --- | --- | --- |
| Fundaciones | v0.0.1 | Definir arquitectura, alcance y estructura base del producto. | Documentación clara, modelo inicial y ruta técnica validada. |
| Producto visible | v0.0.5 | Crear landing y quote demo navegable. | Se puede mostrar el producto antes de tener todo el dashboard terminado. |
| Autenticación y organizaciones | v0.0.7 | Registro de usuarios, organizaciones, roles y permisos. | Zivelo puede gestionar quién accede al dashboard y con qué nivel de control. |
| Tests y validación | v0.0.8 | Validar la lógica core del producto con tests automatizados. | Schemas, validaciones y utilidades cubiertas por tests antes del release operativo. |
| MVP operativo | v0.1.0 | Crear y compartir cotizaciones reales desde un dashboard interno. | Zivelo puede usar la plataforma para propuestas internas. |
| Experiencia mejorada | v0.2.0 | Mejorar templates, mobile, branding y rich media. | Las cotizaciones se sienten más premium y flexibles. |
| Control y privacidad | v0.3.0 | Agregar estados, privacidad y mejores flujos administrativos. | Mayor control sobre quotes publicadas y borradores. |
| Plataforma reutilizable | v0.5.0 | Preparar base multi-company y white-label. | La plataforma puede adaptarse a más marcas y clientes. |
| Infraestructura avanzada | v0.7.0 | Soportar dominios, workspaces y deploys administrados. | Base lista para clientes premium o despliegues dedicados. |
| Producto maduro | v1.0.0 | Consolidar SaaS privado estable. | Plataforma completa, reutilizable y lista para operar a largo plazo. |

## v0.0.1 - Fundaciones

| Entregable | Descripción | Estado Objetivo |
| --- | --- | --- |
| README del producto | Definir visión, alcance MVP y posicionamiento. | Completo |
| Arquitectura inicial | Documentar rutas, módulos sugeridos y modelo base de quote. | Completo |
| Roadmap estable | Convertir la lista inicial en plan ejecutable por fases. | Completo |
| Definición de MVP | Alinear qué entra y qué queda fuera del primer release operativo. | Completo |

### Criterio De Salida

La fase termina cuando el equipo pueda construir sin dudas mayores sobre alcance, rutas principales, prioridades y entregables del MVP.

## v0.0.5 - Producto Visible

Esta fase crea la primera experiencia que puede mostrarse a clientes o stakeholders aunque la funcionalidad interna todavía no esté completa.

| Entregable | Alcance | Prioridad |
| --- | --- | --- |
| Landing pública | Página principal en `/` que explique Zivelo Quotes y dirija a una demo. | Completo |
| Quote wireframe | Documento de diseño visual para la cotización demo. | Completo |
| Quote schema | Definición de tipos TS y estructura de base de datos para quotes. | Completo |
| Quote demo | Cotización demo en `/q/demo` con hero, resumen, cards expandibles, pricing y acciones. | Completo |
| Navegación mínima | Enlaces claros entre landing, demo y acceso al dashboard. | Completo |
| Open Graph base | Metadata social inicial para landing y demo. | Completo |
| Open Graph premium | Imagen OG personalizada para `/q/demo` con logo, headline, items y CTA. | Completo |
| WhatsApp actions | Los botones "Aprobar propuesta" y "Hacer una pregunta" abren WhatsApp con mensaje template. | Completo |

### Landing

| Sección | Objetivo |
| --- | --- |
| Hero | Presentar Zivelo Quotes como una experiencia moderna de propuestas. |
| Problema | Explicar la diferencia contra PDFs, documentos estáticos y propuestas tradicionales. |
| Experiencia | Mostrar que una quote puede sentirse como landing, presentación y checkout. |
| Casos de uso | Propuestas web, branding, ecommerce, automatizaciones y proyectos a medida. |
| CTA | Llevar a la quote demo y al dashboard interno cuando exista login. |

### Quote Demo

| Elemento | Objetivo |
| --- | --- |
| Hero de cotización | Mostrar cliente, servicio, valor principal y CTA. |
| Resumen ejecutivo | Explicar la propuesta en lenguaje claro. |
| Alcance | Agrupar entregables por secciones. |
| Pricing | Mostrar paquetes, line items o fases de inversión. |
| Open Graph dinámico | Imagen social 1200×630 con logo Zivelo, headline, recipient, cards de items y CTA. |
| CTA final | Facilitar contacto, aprobación o siguiente paso. |

### Criterio De Salida

La fase termina cuando una persona pueda abrir la landing, entender el producto y navegar a una quote demo convincente sin depender de explicaciones externas.

## v0.0.7 - Autenticación y Organizaciones

Base de usuarios, organizaciones y control de acceso antes de abrir el dashboard a operación real.

| Entregable | Descripción |
| --- | --- |
| Modelo de datos | Esquema de usuarios, organizaciones, roles y permisos en Prisma. |
| Registro de organizaciones | Flujo para crear una nueva organización con un usuario admin inicial. |
| Autenticación | Login y registro con email + contraseña (Supabase Auth). |
| Sesión y protección | Middleware que redirige al login si no hay sesión activa. |
| Roles base | Admin (control total), Editor (crear/editar quotes), Viewer (solo lectura). |
| Permisos por acción | Cada acción del dashboard validada contra el rol del usuario. |
| Un usuario / una organización | Un usuario pertenece a una sola organización y no puede cambiarla por sí mismo. |
| Gestión de usuarios | Pantalla en dashboard para que admins inviten, creen y desactiven usuarios de su organización. |
| Google SSO | Inicio de sesión con Google como alternativa al email+password. |

### Criterio De Salida

Zivelo puede crear una organización, invitar usuarios con distintos roles, y cada usuario accede al dashboard con los permisos correspondientes. Sin esta fase el dashboard no puede operar con múltiples personas ni proteger datos entre organizaciones.

## v0.0.8 - Tests y Validación

Validar la lógica core del producto con tests automatizados antes del release operativo. Esta fase se ejecuta en paralelo con los entregables del MVP y no bloquea el avance de funcionalidad, pero sus criterios deben cumplirse antes de declarar el MVP completo.

| Entregable | Descripción | Prioridad |
| --- | --- | --- |
| Setup de testing | Instalar vitest, configurar `@/` alias, scripts `test`, `test:quote`, `test:watch`. | Hecho |
| Tests de schemas Zod | Happy path y unhappy path de `formSchema` e `itemSchema`: reglas de validación, defaults, valores inválidos. | Hecho |
| Tests de server actions | Validación server-side de `createQuote` con mocks de Prisma (`vi.mock()`). | Hecho |
| Tests de componentes | Tests de renderizado e interacción de `QuoteCreateForm` (react-hook-form + shadcn Form). | |
| Tests de páginas públicas | Validar render de `/q/[quoteSlug]` con datos mock. | |
| Integración continua | Ejecutar `pnpm test` en CI (pre-commit hook o GitHub Actions). | |

### Stack de testing

| Herramienta | Uso |
| --- | --- |
| `vitest` 4.x | Test runner, assertions, mocks |
| `vi.mock()` | Mocking de Prisma y módulos externos |
| `zod` | Tests directos de schemas (sin mocking necesario) |

### Documento asociado

Ver [`docs/test-plan.md`](./test-plan.md) para el plan detallado de cobertura por fase.

### Criterio De Salida

Toda validación core (schemas, server actions) tiene cobertura de tests. `pnpm test` pasa sin errores. Los tests se ejecutan automáticamente antes de cada deploy.

---

## v0.1.0 - MVP Operativo

El MVP debe permitir que Zivelo cree, edite, publique y comparta cotizaciones reales desde un flujo interno.

| Entregable | Alcance | Prioridad |
| --- | --- | --- |
| Dashboard interno | Área `/dashboard` protegida por login. Layout con navegación. Login placeholder. | Media |
| Creación de quote | Formulario en `/dashboard/quotes/new` con react-hook-form + zod, items dinámicos, tags, switch toggles, Server Action. | Hecho |
| Tests de validación | Tests automatizados de schemas Zod (happy path + unhappy path). | Hecho |
| Edición básica | Edición de contenido, secciones, line items, pricing y CTA. | |
| Publicación | Estados draft/published y URL pública por slug. | Hecho |
| Página pública | Ruta `/q/[quoteSlug]` renderizada desde datos estructurados. | Alta |
| Listado de quotes | Vista con estado, cliente, slug y última actualización. | Alta |
| Exportación PDF | Generar snapshot compartible de la cotización con logo, tabla y adjuntos. | Hecho |
| Open Graph dinámico | Imagen o metadata personalizada por quote. | Hecho |
| Persistencia inicial | Base de datos (Prisma + Supabase PostgreSQL). | Hecho |
| RLS en Quote table | Row Level Security habilitado con políticas: anon solo lectura de publicadas, authenticated full CRUD. | Hecho |

### Dashboard

| Vista | Funcionalidad Requerida |
| --- | --- |
| `/dashboard` | Resumen de cotizaciones recientes y accesos rápidos. |
| `/dashboard/quotes` | Tabla de quotes con filtros simples por estado. |
| `/dashboard/quotes/new` | Creación de una nueva cotización. |
| `/dashboard/quotes/[id]` | Edición de contenido, pricing, secciones y ajustes públicos. |
| `/dashboard/settings` | Configuración inicial de branding y datos de Zivelo. |

### Funcionalidad Central

| Función | Descripción | MVP |
| --- | --- | --- |
| Quote schema | Estructura común para contenido, pricing, branding, CTA y estado. | Si |
| Slugs dinámicos | Cada quote debe tener URL pública legible. | Si |
| Estados | Draft y published como mínimo. | Si |
| Templates | Render inicial mediante un template base. | Si |
| Branding | Colores, logo y datos visibles por quote o defaults globales. | Si |
| PDF | Exportación básica de la vista pública. | Si |
| Open Graph | Metadata dinámica y base para imagen personalizada. | Si |
| Password/public-private | Protección avanzada por quote. | No, v0.3.0 |
| Analytics | Métricas de visitas y actividad. | No |
| Pagos | Cobro o checkout real. | No |

### Criterio De Salida

La fase termina cuando Zivelo pueda crear una cotización desde el dashboard, publicarla, compartir su URL pública y exportarla como PDF sin editar código.

## v0.2.0 - Experiencia Mejorada

| Entregable | Descripción |
| --- | --- |
| Templates mejorados | Variantes visuales para diferentes tipos de proyecto. |
| Branding avanzado | Mejor manejo de logos, paletas, estilos y tokens visuales. |
| Rich media | Soporte para imágenes, videos, mockups, embeds o previews. |
| Mobile refinado | Experiencia pública y dashboard más robustos en pantallas pequeñas. |
| Componentes reutilizables | Consolidar UI compartida para dashboard y quotes. |
| Preview en creación | Vista previa en vivo de la cotización dentro de `/dashboard/quotes/new`. |

### Criterio De Salida

Las cotizaciones deben sentirse suficientemente premium para usarse con clientes reales de diferentes tipos de proyecto, no solo con una demo controlada.

## v0.3.0 - Control Y Privacidad

| Entregable | Descripción |
| --- | --- |
| Quotes private/public | Control claro de visibilidad por cotización. |
| Protección con password | Acceso restringido a quotes sensibles. |
| Mejor flujo de administración | Acciones rápidas para duplicar, archivar, previsualizar y publicar. |
| Historial básico | Registro simple de cambios importantes o timestamps útiles. |
| Validaciones | Reglas para evitar publicar quotes incompletas. |

### Criterio De Salida

El equipo debe poder manejar propuestas sensibles con mayor control y menor riesgo operativo.

## v0.5.0 - Plataforma Reutilizable

| Entregable | Descripción |
| --- | --- |
| White-label support | Base para adaptar identidad visual por cliente o marca. |
| Multi-company básico | Separación inicial de datos y branding por organización. |
| Branding compartido | Sistema de tokens reutilizables entre landing, dashboard y quotes. |
| Quote engine modular | Separación más clara entre datos, reglas y presentación. |
| Templates por industria | Variantes por tipo de servicio o cliente. |

### Criterio De Salida

La plataforma debe poder adaptarse a más de una marca o cliente sin duplicar la aplicación completa.

## v0.7.0 - Infraestructura Avanzada

| Entregable | Descripción |
| --- | --- |
| Custom domains | Soporte para dominios personalizados por cliente. |
| Managed client workspaces | Espacios administrados para clientes o marcas. |
| Deploy-per-client | Base para despliegues dedicados cuando el caso lo requiera. |
| Configuración por entorno | Separación clara de settings por deployment. |
| Observabilidad inicial | Logs y monitoreo mínimos para operación confiable. |

### Criterio De Salida

Zivelo debe poder operar quotes en dominios o entornos diferenciados sin comprometer la base central del producto.

## v1.0.0 - Producto Maduro

| Pilar | Resultado Esperado |
| --- | --- |
| SaaS privado | Plataforma estable para uso interno y clientes administrados. |
| White-label | Personalización visual madura. |
| Dedicated deployments | Capacidad de separar infraestructura para clientes premium. |
| Templates avanzados | Biblioteca robusta de experiencias de quote. |
| Quote engine modular | Motor portable para futuros productos de Zivelo. |
| Branding maduro | Sistema consistente entre landing, dashboard, quotes y OG. |
| Propuestas interactivas | Experiencias ricas que superan documentos estáticos. |

## Dependencias Principales

| Dependencia | Bloquea | Decisión Necesaria |
| --- | --- | --- |
| Stack de datos | Creación y edición de quotes | Definir base de datos y ORM o servicio administrado. |
| Autenticación | Dashboard interno | Elegir proveedor o estrategia de login. |
| Render PDF | Exportación | Definir si se usa browser rendering, servicio externo o librería local. |
| Open Graph | Previews sociales | OG image 1200×630 generada con `ImageResponse` + Satori, logo inline como base64, Inter desde CDN. |
| Branding | Landing, demo y quotes | Definir tokens visuales base de Zivelo. |

## Orden Recomendado De Implementación

| Orden | Trabajo | Razón |
| --- | --- | --- |
| 1 | Crear base Next.js y layout principal | Habilita landing, demo, dashboard y rutas públicas. |
| 2 | Implementar landing | Da contexto inmediato al producto. |
| 3 | Implementar quote demo hardcodeada sobre schema inicial | Valida experiencia visual antes de construir todo el editor. | Hecho |
| 4 | Crear quote schema y datos mock | Estabiliza el contrato del quote engine. | Hecho |
| 5 | Construir vista pública `/q/[quoteSlug]` + conexión DB | Convierte la demo en render dinámico desde base de datos. | Hecho |
| 6 | Agregar creación de quote con formulario | Permite crear cotizaciones desde el dashboard. | Hecho |
| 7 | Habilitar RLS en Quote table | Protege datos con Row Level Security: anon solo lectura de publicadas, authenticated full CRUD. | Hecho |
| 8 | Setup de testing (vitest, scripts, alias) | Habilita tests automatizados antes del release. | Hecho |
| 9 | Tests de schemas Zod (happy + unhappy path) | Valida reglas de negocio en capa de datos. | Hecho |
| 10 | Construir listado de quotes | Visualiza y gestiona todas las cotizaciones. |
| 11 | Agregar edición básica | Permite modificar cotizaciones existentes. |

## Fuera De Alcance Del MVP

| Funcionalidad | Motivo |
| --- | --- |
| Pagos | No es necesario para validar propuestas internas. |
| Comentarios de clientes | Puede agregarse después de validar el flujo principal. |
| Cuentas de clientes | El MVP es un SaaS privado administrado por Zivelo. |
| Analytics avanzado | Primero se necesita uso real y quotes publicadas. |
| Builder drag and drop | Alto costo de complejidad para una primera versión. |
| Subscription billing | No aplica al MVP interno. |
| CRM | Debe integrarse después, no dirigir la arquitectura inicial. |
| Organizaciones multiusuario | Queda preparado para v0.5.0. |
| Dominios personalizados | Queda para infraestructura avanzada. |
