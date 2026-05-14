# Arquitectura

Zivelo Quotes debe diseñarse como infraestructura reutilizable desde el primer día.

Aunque el MVP corra como un solo deploy, la arquitectura debe soportar crecimiento futuro separando la lógica de cotizaciones, presentación, branding, templates y estrategia de deploy.

## Forma Inicial De La Aplicación

El primer objetivo de implementación es una aplicación Next.js con:

- Un dashboard interno en `/dashboard`
- Páginas públicas de cotización en `/q/[quoteSlug]`
- Generación dinámica de Open Graph para cada cotización
- Exportación a PDF para snapshots de cotización
- Un quote engine estructurado que renderiza datos mediante templates

## Límites De Módulos Sugeridos

```txt
apps/web
  app/dashboard
  app/q/[quoteSlug]
  app/api

packages/quote-engine
  quote schema
  pricing sections
  quote state
  rendering contracts

packages/templates
  reusable quote templates
  section renderers
  presentation variants

packages/branding
  brand tokens
  theme generation
  Open Graph input models

packages/ui
  shared UI primitives
  dashboard components
  quote presentation components
```

El repositorio puede comenzar como una sola aplicación Next.js y evolucionar hacia esta estructura de paquetes cuando la implementación lo necesite.

## Modelo De Datos De Quote

Las cotizaciones deben ser datos estructurados, no páginas estáticas. Una quote debe poder renderizarse con diferentes templates sin cambiar el contenido comercial subyacente.

Un modelo inicial de quote debe incluir:

- Client information
- Quote metadata
- Slug
- Service summary
- Hero content
- Sections
- Line items
- Pricing groups
- Branding settings
- CTA configuration
- Public/private state
- Export settings

Estos nombres deben mantenerse en inglés cuando se conviertan en schemas, tipos, props, variables, keys de JSON o columnas de base de datos.

## Filosofía De Render

Las páginas públicas de quote deben sentirse como presentaciones interactivas, landing pages y flujos de checkout estilo ecommerce.

Los templates deben decidir la presentación. El quote engine debe ser responsable de los datos normalizados y de las reglas compartidas por todos los templates.

## Modos De Deploy

### MVP

Un deploy centralizado:

```txt
quotes.zivelo.dev
```

### Managed Mode

Las cotizaciones de clientes permanecen alojadas por Zivelo:

```txt
quotes.zivelo.dev/q/project
quotes.client.com/q/project
```

### Dedicated Deployments

Los clientes premium podrían recibir deploys aislados:

```txt
client.com/q/project
client.com/admin/quotes
```

Este modo futuro debe permitir infraestructura separada, custom branding, integración más profunda y personalización avanzada.
