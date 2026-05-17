export type QuoteItem = {
  title: string
  shortDescription: string
  description: string
  bullets: string[]
  price: number
  attachments: { label: string; url: string }[]
  links: string[]
}

export type DemoQuote = {
  projectLabel: string
  title: string
  recipientName: string
  summary: string
  preparedBy: string
  validUntil: string
  status: "active"
  currency: string
  phone: string
  items: QuoteItem[]
  branding: {
    logoPath: string
  }
  actions: {
    approve: boolean
    askQuestion: boolean
    downloadPdf: boolean
  }
}

export const DEMO_QUOTE: DemoQuote = {
  projectLabel: "Propuesta \u00b7 Proyecto Web",
  title: "ACME Corp \u2014 Propuesta de Sitio Web",
  recipientName: "ACME Corp",
  summary:
    "Propuesta integral para el desarrollo de presencia digital corporativa: direcci\u00f3n de marca, sitio web corporativo y soporte de lanzamiento.",
  preparedBy: "Zivelo",
  validUntil: "30 Jun 2026",
  status: "active",
  currency: "MXN",
  phone: "+5213921107274",
  branding: {
    logoPath: "public/logos/zivelo-bars-dark-full.svg",
  },
  items: [
    {
      title: "Direcci\u00f3n de marca",
      shortDescription: "Bases visuales y lineamientos generales de estilo.",
      description:
        "Direcci\u00f3n visual completa que establece la identidad de la marca: mood, referencias visuales, tipograf\u00eda y paleta de color.",
      bullets: [
        "Definici\u00f3n del mood de marca",
        "Referencias visuales",
        "Direcci\u00f3n de tipograf\u00eda y color",
      ],
      price: 4800,
      attachments: [
        { label: "Referencias de marca", url: "#" },
      ],
      links: [],
    },
    {
      title: "Sitio web corporativo",
      shortDescription: "Sitio responsive para presentar empresa y servicios.",
      description:
        "Sitio web limpio y responsive dise\u00f1ado para presentar la empresa, servicios, proyectos e informaci\u00f3n de contacto.",
      bullets: [
        "P\u00e1gina principal",
        "Secci\u00f3n de servicios",
        "Secci\u00f3n \u201cNosotros\u201d",
        "CTA de contacto",
        "Dise\u00f1o mobile-first",
      ],
      price: 12000,
      attachments: [
        { label: "Wireframe del sitio web", url: "#" },
      ],
      links: [],
    },
    {
      title: "Soporte de lanzamiento",
      shortDescription: "Deployment y ajustes post-lanzamiento.",
      description:
        "Acompa\u00f1amiento durante el deployment, pruebas finales y ajustes posteriores al lanzamiento para garantizar una operaci\u00f3n estable.",
      bullets: [
        "Configuraci\u00f3n de hosting y dominio",
        "Pruebas de integraci\u00f3n",
        "Ajustes post-lanzamiento",
      ],
      price: 3200,
      attachments: [],
      links: [],
    },
  ],
  actions: {
    approve: true,
    askQuestion: true,
    downloadPdf: true,
  },
}

export function formatPrice(price: number, currency: string = "MXN") {
  return `$${price.toLocaleString("es-MX")} ${currency}`
}

export const total = DEMO_QUOTE.items.reduce((sum, item) => sum + item.price, 0)
