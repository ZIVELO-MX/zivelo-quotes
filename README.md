# Zivelo Quotes

Zivelo Quotes is a private SaaS and quote platform designed to centralize, standardize, and modernize the way Zivelo creates and presents proposals to clients.

The initial goal is to solve Zivelo's internal quoting workflow while building reusable infrastructure that can later evolve into a client-facing platform and reusable commercial product.

The platform focuses on delivering interactive, visually rich quote experiences instead of static PDFs or traditional documents.

## Core Vision

The platform should allow Zivelo to:

- Create professional quotes internally
- Share visually rich proposals with clients
- Present services as interactive experiences
- Reuse infrastructure across future projects
- Potentially offer the platform to clients in the future

The long-term objective is to stop rebuilding proposal systems from scratch and instead maintain a reusable quote infrastructure.

## Product Positioning

Zivelo Quotes is positioned as:

- A private SaaS managed by Zivelo
- A reusable quote platform
- A foundation for future reusable business modules

The system is not intended to be a public self-service SaaS during the MVP phase.

## Quote Experience

Quotes should feel closer to:

- Interactive presentations
- Modern landing pages
- Ecommerce-style checkout flows

Instead of:

- Traditional PDFs
- Static documents
- Plain proposal templates

The client experience should allow visual presentation of ideas, examples, components, mockups, and wireframes.

## URL Structure

Platform:

```txt
quotes.zivelo.dev
```

Dashboard:

```txt
quotes.zivelo.dev/dashboard
```

Public quotes:

```txt
quotes.zivelo.dev/q/cafe-luna
quotes.zivelo.dev/q/gutven-web-corporativa
quotes.zivelo.dev/q/clinica-smile
```

The public quote route follows:

```txt
/q/{quote-slug}
```

## Open Graph System

Every quote should automatically generate a custom Open Graph image.

The generated image should improve sharing through WhatsApp and social platforms, create a premium first impression before opening the proposal, and reinforce branding and visual consistency.

Open Graph images should be generated dynamically from quote information such as:

- Client name
- Service name
- Title
- Branding colors
- Hero content
- Logo
- CTA

## MVP Scope - v0.1.0

The MVP focuses on solving Zivelo's internal quoting workflow.

### Included

- Internal admin dashboard
- Login-protected quote creation
- Public shareable quote pages
- Dynamic quote slugs
- Interactive quote presentation
- PDF export
- Custom Open Graph generation
- Quote templates
- Reusable architecture

### Not Included

- Payments
- Client comments
- Client accounts
- Analytics
- Drag and drop builder
- Subscription billing
- CRM
- Automation systems
- Multi-user organizations
- Custom domains

## Technical Direction

The platform should be designed with:

- Next.js
- Reusable modules
- Shared UI
- Dynamic routing
- Template-driven rendering

The quote system should not be hardcoded around static pages. Quotes should behave as structured data rendered dynamically into interactive experiences.

## Repository Strategy

This repository contains the quote platform, admin dashboard, public quote viewer, shared UI/components, and shared quote engine.

The goal is to keep the platform reusable and portable.

## Deployment Philosophy

The MVP should run as a centralized deployment:

```txt
quotes.zivelo.dev
```

Future architecture should support managed quote hosting, custom client domains, and dedicated deployments for premium clients.

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
