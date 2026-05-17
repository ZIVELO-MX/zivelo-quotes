# Quote Schema Idea

The MVP quote system is designed around a simple card-based proposal structure.

Instead of using complex layouts or page builders, each proposal is composed of expandable proposal items displayed as cards.

This keeps the system:

- simple
- flexible
- visually clean
- easy to evolve later

---

# Quote Structure

```ts
const quote = {
  slug: 'acme-corp-sitio-web',

  projectLabel: 'Propuesta · Proyecto Web',

  title: 'ACME Corp — Propuesta de Sitio Web',

  recipientName: 'ACME Corp',

  summary:
    'Propuesta integral para el desarrollo de presencia digital corporativa: dirección de marca, sitio web corporativo y soporte de lanzamiento.',

  preparedBy: 'Zivelo',

  validUntil: '30 Jun 2026',

  status: 'active', // 'active' | 'draft' | 'expired'

  currency: 'MXN',

  phone: '+5213921107274',

  branding: {
    logoPath: 'public/logos/zivelo-bars-dark-full.svg',
  },

  items: [
    {
      title: 'Dirección de marca',

      shortDescription: 'Bases visuales y lineamientos generales de estilo.',

      description:
        'Dirección visual, bases tipográficas, referencias de color y lineamientos generales de estilo.',

      bullets: [
        'Definición del mood de marca',
        'Referencias visuales',
        'Dirección de tipografía y color',
      ],

      price: 4800,

      attachments: [
        {
          label: 'Referencias de marca',
          url: 'https://example.com/brand-references',
        },
      ],

      links: [],
    },
  ],

  actions: {
    approve: true,
    askQuestion: true,
    downloadPdf: true,
  },
};
```

---

# UI Behavior

## Initial Quote View

The proposal page initially displays:

- proposal title
- status
- compact proposal cards
- item prices
- total investment
- primary actions

Each item appears as a compact card.

---

# Card Structure

## Visible By Default

- title
- short description
- price
- attachment indicator

Example:

```txt
Dirección de marca

Bases visuales y lineamientos generales de estilo.

Attachment available

$4,800 MXN

[Ver detalles ↓]
```

---

# Expanded Card View

When clicking:

```txt
[Ver detalles ↓]
```

the card expands showing:

- full description
- bullet points
- attachments
- external links
- optional references
- optional wireframes/mockups

---

# Calculated Values

The following values should be calculated dynamically instead of stored directly:

```ts
function calculateTotal(items: QuoteItem[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

Examples of calculated values:

- total investment
- expiration state
- status label
- Open Graph metadata
- PDF export data
- export date (today's date at generation time)

---

# Suggested Database Structure

## quotes

```txt
- id
- slug
- project_label
- title
- recipient_name
- summary
- prepared_by
- valid_until
- status
- currency
- phone
- branding (jsonb)
- items (jsonb)
- actions (jsonb)
- created_at
- updated_at
```

---

# Slug Strategy

MVP routes:

```txt
/q/{slug}
```

Examples:

```txt
/q/cafe-luna
/q/gutven-web-corporativa
/q/clinica-smile
```

For MVP:

- slug is globally unique

Future:

- slug uniqueness can become company-based
- custom domains may be supported later

Example:

```txt
quotes.client.com/q/project
```

---

# PDF Export

The PDF should include a header with:

- Company logo (`logoUrl`) on the left
- Export date (today's date, calculated at generation time) on the right

```txt
┌──────────────────────────────────────────────┐
│  [Zivelo logo]           Generado: 15 May 2026 │
├──────────────────────────────────────────────┤
│                                              │
│  … quote content …                           │
```

---

# Open Graph

Each quote should automatically generate a custom Open Graph image.

Purpose:

- better WhatsApp sharing
- premium presentation
- visually rich previews

The Open Graph should be dynamically generated from quote data.

---

# MVP Philosophy

The MVP focuses on:

- simple proposal creation
- interactive presentation
- expandable cards
- visual clarity
- reusable structure

The system intentionally avoids:

- complex builders
- nested layouts
- enterprise workflows
- overengineered CMS behavior

# THIS FILES WILL BE DELETED WHEN DB SCHEMA IS CREATED
