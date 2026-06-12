import "dotenv/config"
import nodemailer from "nodemailer"
import { readFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://quotes.zivelo.dev"

function parseArgs(): { email: string; name: string; to?: string } {
  const args = process.argv.slice(2)
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      result[args[i].slice(2)] = args[i + 1] ?? ""
      i++
    }
  }
  if (!result.email || !result.name) {
    console.error("Uso: pnpm send:invite --email <email> --name <nombre> [--to <override>]")
    console.error('Ejemplo: pnpm send:invite --email maria@ejemplo.com --name "María García"')
    process.exit(1)
  }
  return { email: result.email, name: result.name, to: result.to }
}

function buildHtml(name: string, email: string): string {
  const loginUrl = `${BASE_URL}/dashboard/login`
  const template = readFileSync(resolve("docs/email-templates/invite.html"), "utf-8")
  return template
    .replace(/{{NAME}}/g, name)
    .replace(/{{EMAIL}}/g, email)
    .replace(/{{LOGIN_URL}}/g, loginUrl)
}

async function main() {
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"]
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    console.error(`Faltan variables de entorno: ${missing.join(", ")}`)
    process.exit(1)
  }

  const { email, name, to } = parseArgs()
  const recipient = to ?? email

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_PORT !== "587",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  console.log(`Enviando invitación a ${recipient}...`)

  const info = await transporter.sendMail({
    from: `Zivelo Quotes <${process.env.SMTP_USER}>`,
    to: recipient,
    subject: "Te invitaron a Zivelo Quotes",
    html: buildHtml(name, email),
  })

  console.log(`Correo enviado. ID: ${info.messageId}`)
  console.log(`Destinatario: ${recipient}`)
  console.log(`Cuenta:       ${email}`)
  console.log(`Nombre:       ${name}`)
}

main().catch((e) => {
  console.error("Error al enviar:", e)
  process.exit(1)
})
