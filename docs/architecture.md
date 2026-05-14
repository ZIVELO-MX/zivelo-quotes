# Architecture

Zivelo Quotes should be designed as reusable infrastructure from day one.

Even if the MVP runs as a single deployment, the architecture should support future scaling by separating quote logic, presentation, branding, templates, and deployment strategy.

## Initial Application Shape

The first implementation target is a Next.js application with:

- An internal dashboard at `/dashboard`
- Public quote pages at `/q/[quoteSlug]`
- Dynamic Open Graph generation for each quote
- PDF export for quote snapshots
- A structured quote engine that renders data through templates

## Suggested Module Boundaries

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

The repository can start as a single Next.js app and evolve into this package structure when the implementation needs it.

## Quote Data Model

Quotes should be structured data, not static pages. A quote should be renderable through different templates without changing the underlying commercial content.

An initial quote model should include:

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

## Rendering Philosophy

Public quote pages should feel like interactive presentations, landing pages, and ecommerce-style checkout flows.

Templates should decide presentation. The quote engine should own the normalized data and the rules that all templates share.

## Deployment Modes

### MVP

One centralized deployment:

```txt
quotes.zivelo.dev
```

### Managed Mode

Client quotes remain hosted by Zivelo:

```txt
quotes.zivelo.dev/q/project
quotes.client.com/q/project
```

### Dedicated Deployments

Premium clients may later receive isolated deployments:

```txt
client.com/q/project
client.com/admin/quotes
```

This future mode should allow separate infrastructure, custom branding, deeper integration, and advanced customization.
