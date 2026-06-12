import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const SLUGS_TO_DELETE = [
  "test-branding-agencia",
  "test-ecommerce-borrador",
  "zivelo-web-app-2026",
  "zivelo-branding-2026",
]

async function main() {
  console.log("Eliminando cotizaciones de prueba (se conserva 'demo')…\n")
  for (const slug of SLUGS_TO_DELETE) {
    try {
      await prisma.quote.delete({ where: { slug } })
      console.log(`✓ eliminado: ${slug}`)
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2025") {
        console.log(`— no existe: ${slug}`)
      } else {
        throw e
      }
    }
  }
  console.log("\nListo.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
