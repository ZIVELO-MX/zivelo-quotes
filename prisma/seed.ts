import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const DEMO_DATA = {
  slug: "demo",
  projectLabel: "Propuesta · Proyecto Web",
  title: "ACME Corp — Propuesta de Sitio Web",
  recipientName: "ACME Corp",
  summary:
    "Propuesta integral para el desarrollo de presencia digital corporativa: dirección de marca, sitio web corporativo y soporte de lanzamiento.",
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
      title: "Dirección de marca",
      shortDescription: "Bases visuales y lineamientos generales de estilo.",
      description:
        "Dirección visual completa que establece la identidad de la marca: mood, referencias visuales, tipografía y paleta de color.",
      bullets: [
        "Definición del mood de marca",
        "Referencias visuales",
        "Dirección de tipografía y color",
      ],
      price: 4800,
      attachments: [],
      links: [],
    },
    {
      title: "Sitio web corporativo",
      shortDescription: "Sitio responsive para presentar empresa y servicios.",
      description:
        "Sitio web limpio y responsive diseñado para presentar la empresa, servicios, proyectos e información de contacto.",
      bullets: [
        "Página principal",
        "Sección de servicios",
        "Sección “Nosotros”",
        "CTA de contacto",
        "Diseño mobile-first",
      ],
      price: 12000,
      attachments: [],
      links: [],
    },
    {
      title: "Soporte de lanzamiento",
      shortDescription: "Deployment y ajustes post-lanzamiento.",
      description:
        "Acompañamiento durante el deployment, pruebas finales y ajustes posteriores al lanzamiento para garantizar una operación estable.",
      bullets: [
        "Configuración de hosting y dominio",
        "Pruebas de integración",
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

async function main() {
  const existing = await prisma.quote.findUnique({
    where: { slug: "demo" },
  })

  if (existing) {
    console.log("Seed skipped: quote with slug 'demo' already exists.")
    return
  }

  await prisma.quote.create({ data: DEMO_DATA })
  console.log("Seed complete: created quote with slug 'demo'.")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
