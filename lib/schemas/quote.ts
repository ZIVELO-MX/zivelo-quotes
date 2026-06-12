import { z } from "zod"

const phoneRegex = /^\+?[1-9]\d{1,14}$/

export const itemSchema = z.object({
  title: z.string().min(1, "Requerido"),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  bullets: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  links: z.array(z.string()).default([]),
})

export const formSchema = z.object({
  title: z.string().min(3, "Al menos 3 caracteres"),
  slug: z
    .string()
    .min(1, "Requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  projectLabel: z.string().default(""),
  recipientName: z.string().min(1, "Requerido"),
  summary: z.string().default(""),
  preparedBy: z.string().default("Zivelo"),
  validUntil: z.string().default(""),
  status: z.enum(["draft", "active"]).default("draft"),
  currency: z.enum(["MXN", "USD", "EUR", "COP", "CLP", "ARS", "BRL"]).default("MXN"),
  phone: z
    .union([z.string().regex(phoneRegex, "Formato inválido (ej. +5213921107274)"), z.literal("")])
    .default(""),
  branding: z
    .object({
      logoPath: z.string().default(""),
    })
    .default({ logoPath: "" }),
  actions: z
    .object({
      approve: z.boolean().default(true),
      askQuestion: z.boolean().default(true),
      downloadPdf: z.boolean().default(true),
    })
    .default({ approve: true, askQuestion: true, downloadPdf: true }),
  items: z.array(itemSchema).min(1, "Al menos un elemento es requerido"),
})

export type FormValues = z.infer<typeof formSchema>
