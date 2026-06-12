import { PrismaClient } from "@prisma/client"
import { scryptSync, randomBytes } from "crypto"

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = "Zivelo1234!"

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

const USERS = [
  { email: "benjamin.rodriguez@zivelo.dev", name: "Benjamin Rodriguez", role: "Owner" as const },
  { email: "raul.mendez@zivelo.dev",        name: "Raúl Méndez",        role: "Owner" as const },
]

const QUOTES = [
  {
    slug: "zivelo-web-app-2026",
    projectLabel: "Propuesta · Aplicación Web",
    title: "Zivelo Dashboard — Aplicación Web",
    recipientName: "Zivelo Studio",
    summary:
      "Desarrollo de dashboard interno para gestión de cotizaciones: creación, edición, publicación y seguimiento de propuestas comerciales.",
    preparedBy: "Zivelo",
    validUntil: "31 Ago 2026",
    status: "active",
    currency: "MXN",
    phone: "+5213921107274",
    branding: { logoPath: "public/logos/zivelo-bars-dark-full.svg" },
    items: [
      {
        title: "Diseño de producto",
        shortDescription: "UX, wireframes y diseño visual del dashboard.",
        description:
          "Definición de flujos de usuario, wireframes de pantallas clave y diseño visual final en Figma con sistema de componentes.",
        bullets: ["Mapa de flujos", "Wireframes de 8 vistas", "Design system en Figma"],
        price: 22000,
        attachments: [],
        links: [],
      },
      {
        title: "Desarrollo Next.js",
        shortDescription: "Implementación del dashboard con Next.js 16 y Prisma.",
        description:
          "Desarrollo completo del dashboard: autenticación, CRUD de cotizaciones, listados, edición y exportación PDF.",
        bullets: ["Auth con NextAuth v5", "CRUD completo de quotes", "Exportación a PDF", "Deploy en Vercel"],
        price: 48000,
        attachments: [],
        links: [],
      },
      {
        title: "Base de datos y API",
        shortDescription: "Supabase PostgreSQL con Prisma ORM.",
        description:
          "Configuración de base de datos en Supabase, schema con Prisma, RLS y server actions.",
        bullets: ["Schema Prisma", "RLS por organización", "Server actions tipados"],
        price: 12000,
        attachments: [],
        links: [],
      },
    ],
    actions: { approve: true, askQuestion: true, downloadPdf: true },
  },
  {
    slug: "zivelo-branding-2026",
    projectLabel: "Propuesta · Identidad de Marca",
    title: "Zivelo — Identidad Visual 2026",
    recipientName: "Zivelo Studio",
    summary:
      "Revisión y evolución de la identidad visual de Zivelo: refinamiento de logotipo, sistema tipográfico, paleta de color y guía de aplicación.",
    preparedBy: "Zivelo",
    validUntil: "15 Sep 2026",
    status: "draft",
    currency: "MXN",
    phone: "+5213921107274",
    branding: { logoPath: "public/logos/zivelo-bars-dark-full.svg" },
    items: [
      {
        title: "Auditoría de marca",
        shortDescription: "Revisión del estado actual de la identidad.",
        description:
          "Análisis del sistema visual existente: consistencia, usos incorrectos, oportunidades de mejora y benchmarking de referentes.",
        bullets: ["Revisión de activos actuales", "Benchmarking", "Reporte de hallazgos"],
        price: 8000,
        attachments: [],
        links: [],
      },
      {
        title: "Evolución de logotipo",
        shortDescription: "Refinamiento del símbolo y wordmark.",
        description:
          "Refinamiento del logotipo actual con variantes actualizadas: principal, reducido, monocromático y versiones para fondos oscuros y claros.",
        bullets: ["Variante principal refinada", "Versiones monocromáticas", "Archivos SVG y PNG"],
        price: 16000,
        attachments: [],
        links: [],
      },
      {
        title: "Guía de marca actualizada",
        shortDescription: "Manual de uso del sistema visual renovado.",
        description:
          "Documento PDF con lineamientos actualizados: tipografía, paleta, espaciados, uso de logotipo en distintos medios y ejemplos de aplicación.",
        bullets: ["Paleta de color con códigos", "Sistema tipográfico", "Ejemplos en digital e impreso"],
        price: 9000,
        attachments: [],
        links: [],
      },
    ],
    actions: { approve: false, askQuestion: true, downloadPdf: true },
  },
]

async function seedUsers() {
  let created = 0
  let skipped = 0

  for (const user of USERS) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } })
    if (existing) {
      console.log(`  skip  ${user.email} (ya existe)`)
      skipped++
    } else {
      await prisma.user.create({
        data: {
          ...user,
          passwordHash: hashPassword(DEFAULT_PASSWORD),
          mustChangePassword: true,
        },
      })
      console.log(`  ✓     ${user.email}`)
      created++
    }
  }

  console.log(`\n${created} usuario(s) creado(s), ${skipped} omitido(s).`)
  if (created > 0) {
    console.log(`Password temporal: ${DEFAULT_PASSWORD}`)
    console.log(`(mustChangePassword = true — deberá cambiarse en el primer login)`)
  }
}

async function seedQuotes() {
  let created = 0
  let skipped = 0

  for (const quote of QUOTES) {
    const existing = await prisma.quote.findUnique({ where: { slug: quote.slug } })
    if (existing) {
      console.log(`  skip  ${quote.slug} (ya existe)`)
      skipped++
    } else {
      await prisma.quote.create({ data: quote })
      console.log(`  ✓     ${quote.slug}`)
      created++
    }
  }

  console.log(`\n${created} cotización(es) creada(s), ${skipped} omitida(s).`)
}

function printOwnerEmailsHelp(emails: string[]) {
  if (emails.length === 0) return
  console.log("\n── OWNER_EMAILS ──────────────────────────────────────")
  console.log("Agrega esto a tu .env.local:\n")
  console.log(`OWNER_EMAILS=${emails.join(",")}`)
  console.log("\nEstos emails tendrán rol Owner. Los demás que")
  console.log("inicien sesión con Zoho quedan como Manager.")
  console.log("─────────────────────────────────────────────────────\n")
}

async function main() {
  const extraEmails = process.argv.slice(2).filter((a) => a.includes("@"))

  console.log("\n── Usuarios ──────────────────────────────────────────")
  await seedUsers()

  console.log("\n── Cotizaciones de Zivelo ────────────────────────────")
  await seedQuotes()

  printOwnerEmailsHelp(extraEmails)
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
