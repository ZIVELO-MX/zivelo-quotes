import { describe, it, expect } from "vitest"
import { formSchema } from "@/lib/schemas/quote"

const validQuote = {
  title: "Propuesta de sitio web",
  slug: "propuesta-sitio-web",
  recipientName: "ACME Corp",
  items: [{ title: "Diseño UI/UX", price: 4800 }],
}

describe("formSchema", () => {
  describe("happy path", () => {
    it("accepts a minimal valid quote and applies defaults", () => {
      const result = formSchema.safeParse(validQuote)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe("Propuesta de sitio web")
        expect(result.data.slug).toBe("propuesta-sitio-web")
        expect(result.data.recipientName).toBe("ACME Corp")
        expect(result.data.status).toBe("draft")
        expect(result.data.currency).toBe("MXN")
        expect(result.data.phone).toBe("")
        expect(result.data.preparedBy).toBe("Zivelo")
        expect(result.data.branding).toEqual({ logoPath: "" })
        expect(result.data.actions).toEqual({
          approve: true,
          askQuestion: true,
          downloadPdf: true,
        })
        expect(result.data.items).toHaveLength(1)
        expect(result.data.items[0].title).toBe("Diseño UI/UX")
        expect(result.data.items[0].price).toBe(4800)
        expect(result.data.items[0].bullets).toEqual([])
      }
    })

    it("accepts a full quote with all fields", () => {
      const input = {
        ...validQuote,
        projectLabel: "Propuesta · Proyecto Web",
        summary: "Resumen ejecutivo de la propuesta",
        preparedBy: "Juan Pérez",
        validUntil: "30 Jun 2026",
        status: "active" as const,
        currency: "USD" as const,
        phone: "+525512345678",
        branding: { logoPath: "custom/logo.svg" },
        actions: { approve: false, askQuestion: true, downloadPdf: false },
        items: [
          {
            title: "Branding",
            shortDescription: "Identidad visual",
            description: "Diseño de logotipo y guía de marca",
            price: 12000,
            bullets: ["Investigación de mercado", "Propuestas de concepto"],
          },
          {
            title: "Desarrollo web",
            shortDescription: "Sitio corporativo",
            description: "Desarrollo en Next.js",
            price: 24000,
            bullets: [],
          },
        ],
      }
      const result = formSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.items).toHaveLength(2)
        expect(result.data.items[0].bullets).toHaveLength(2)
        expect(result.data.items[1].bullets).toEqual([])
        expect(result.data.status).toBe("active")
        expect(result.data.currency).toBe("USD")
        expect(result.data.actions.approve).toBe(false)
      }
    })

    it("accepts all currency enum values", () => {
      for (const currency of ["MXN", "USD", "EUR", "COP", "CLP", "ARS", "BRL"] as const) {
        const result = formSchema.safeParse({ ...validQuote, currency })
        expect(result.success).toBe(true)
      }
    })

    it("accepts valid international phone numbers", () => {
      const phones = ["+5213921107274", "+15551234567", "5213921107274"]
      for (const phone of phones) {
        const result = formSchema.safeParse({ ...validQuote, phone })
        expect(result.success).toBe(true)
      }
    })

    it("accepts empty phone", () => {
      const result = formSchema.safeParse({ ...validQuote, phone: "" })
      expect(result.success).toBe(true)
    })
  })

  describe("unhappy path", () => {
    it("rejects empty title", () => {
      const result = formSchema.safeParse({ ...validQuote, title: "" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Al menos 3 caracteres")
      }
    })

    it("rejects title shorter than 3 characters", () => {
      const result = formSchema.safeParse({ ...validQuote, title: "ab" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Al menos 3 caracteres")
      }
    })

    it("rejects empty slug", () => {
      const result = formSchema.safeParse({ ...validQuote, slug: "" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Requerido")
      }
    })

    it("rejects slug with invalid characters", () => {
      const result = formSchema.safeParse({ ...validQuote, slug: "Mi Slug!" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Solo minúsculas, números y guiones",
        )
      }
    })

    it("rejects empty recipientName", () => {
      const result = formSchema.safeParse({ ...validQuote, recipientName: "" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Requerido")
      }
    })

    it("rejects invalid phone format", () => {
      const result = formSchema.safeParse({ ...validQuote, phone: "abc" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Formato inválido (ej. +5213921107274)",
        )
      }
    })

    it("rejects currency not in the allowed enum", () => {
      const result = formSchema.safeParse({ ...validQuote, currency: "GBP" })
      expect(result.success).toBe(false)
    })

    it("rejects empty items array", () => {
      const result = formSchema.safeParse({ ...validQuote, items: [] })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Al menos un elemento es requerido",
        )
      }
    })

    it("rejects item with empty title", () => {
      const result = formSchema.safeParse({
        ...validQuote,
        items: [{ title: "", price: 100 }],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Requerido")
      }
    })

    it("rejects item with negative price", () => {
      const result = formSchema.safeParse({
        ...validQuote,
        items: [{ title: "Servicio", price: -1 }],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Debe ser 0 o mayor")
      }
    })

    it("rejects invalid status value", () => {
      const result = formSchema.safeParse({
        ...validQuote,
        status: "archived",
      })
      expect(result.success).toBe(false)
    })
  })
})
