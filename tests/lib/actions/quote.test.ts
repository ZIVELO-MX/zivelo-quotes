import { describe, it, expect, vi, beforeEach } from "vitest"

const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockFindUnique = vi.fn()

vi.mock("@/lib/prisma", () => ({
  prisma: {
    quote: {
      create: mockCreate,
      update: mockUpdate,
      findUnique: mockFindUnique,
    },
  },
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

const validData = {
  title: "Propuesta de sitio web",
  slug: "propuesta-sitio-web",
  recipientName: "ACME Corp",
  items: [{ title: "Diseño UI/UX", price: 4800 }],
}

const fullRecord = {
  id: "1",
  title: "Propuesta de sitio web",
  slug: "propuesta-sitio-web",
  projectLabel: "",
  recipientName: "ACME Corp",
  summary: "",
  preparedBy: "Zivelo",
  validUntil: "",
  status: "draft",
  currency: "MXN",
  phone: "",
  branding: { logoPath: "" },
  actions: { approve: true, askQuestion: true, downloadPdf: true },
  items: [{ title: "Diseño UI/UX", shortDescription: "", description: "", price: 4800, bullets: [] }],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("createQuote", () => {
  beforeEach(async () => {
    mockCreate.mockReset()
  })

  it("returns success when Prisma creates the quote", async () => {
    mockCreate.mockResolvedValue({ slug: "propuesta-sitio-web", id: 1 })

    const { createQuote } = await import("@/lib/actions/quote")
    const result = await createQuote(validData)

    expect(result.success).toBe(true)
    expect(result.slug).toBe("propuesta-sitio-web")
    expect(mockCreate).toHaveBeenCalledOnce()
  })

  it("does not call Prisma when data fails Zod validation", async () => {
    const { createQuote } = await import("@/lib/actions/quote")
    const result = await createQuote({ ...validData, title: "" })

    expect(result.success).toBe(false)
    expect(result.error).toBe("Al menos 3 caracteres")
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it("returns error when Prisma throws P2002 (duplicate slug)", async () => {
    const prismaError = new Error("Unique constraint")
    ;(prismaError as any).code = "P2002"
    mockCreate.mockRejectedValue(prismaError)

    const { createQuote } = await import("@/lib/actions/quote")
    const result = await createQuote(validData)

    expect(result.success).toBe(false)
    expect(result.error).toBe("El slug ya existe")
  })

  it("returns generic error on unexpected Prisma failure", async () => {
    mockCreate.mockRejectedValue(new Error("Connection refused"))

    const { createQuote } = await import("@/lib/actions/quote")
    const result = await createQuote(validData)

    expect(result.success).toBe(false)
    expect(result.error).toBe("Error al crear la cotización")
  })
})

describe("updateQuote", () => {
  beforeEach(() => {
    mockUpdate.mockReset()
  })

  it("returns success when Prisma updates the quote", async () => {
    mockUpdate.mockResolvedValue({ slug: "propuesta-sitio-web" })

    const { updateQuote } = await import("@/lib/actions/quote")
    const result = await updateQuote("propuesta-sitio-web", {
      ...validData,
      title: "Título actualizado",
    })

    expect(result.success).toBe(true)
    expect(result.slug).toBe("propuesta-sitio-web")
    expect(mockUpdate).toHaveBeenCalledOnce()
  })

  it("returns error when data fails Zod validation", async () => {
    const { updateQuote } = await import("@/lib/actions/quote")
    const result = await updateQuote("propuesta-sitio-web", { ...validData, title: "" })

    expect(result.success).toBe(false)
    expect(result.error).toBe("Al menos 3 caracteres")
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("returns error when quote is not found (P2025)", async () => {
    const prismaError = new Error("Record not found")
    ;(prismaError as any).code = "P2025"
    mockUpdate.mockRejectedValue(prismaError)

    const { updateQuote } = await import("@/lib/actions/quote")
    const result = await updateQuote("nonexistent", validData)

    expect(result.success).toBe(false)
    expect(result.error).toBe("Cotización no encontrada")
  })

  it("returns generic error on unexpected Prisma failure", async () => {
    mockUpdate.mockRejectedValue(new Error("Connection refused"))

    const { updateQuote } = await import("@/lib/actions/quote")
    const result = await updateQuote("propuesta-sitio-web", validData)

    expect(result.success).toBe(false)
    expect(result.error).toBe("Error al actualizar la cotización")
  })
})

describe("getQuoteBySlug", () => {
  beforeEach(() => {
    mockFindUnique.mockReset()
  })

  it("returns parsed data when quote exists", async () => {
    mockFindUnique.mockResolvedValue(fullRecord)

    const { getQuoteBySlug } = await import("@/lib/actions/quote")
    const result = await getQuoteBySlug("propuesta-sitio-web")

    expect(result).not.toBeNull()
    expect(result!.title).toBe("Propuesta de sitio web")
    expect(result!.slug).toBe("propuesta-sitio-web")
    expect(result!.items).toHaveLength(1)
    expect(result!.items[0].title).toBe("Diseño UI/UX")
  })

  it("returns null when quote does not exist", async () => {
    mockFindUnique.mockResolvedValue(null)

    const { getQuoteBySlug } = await import("@/lib/actions/quote")
    const result = await getQuoteBySlug("nonexistent")

    expect(result).toBeNull()
  })

  it("returns null on Prisma error", async () => {
    mockFindUnique.mockRejectedValue(new Error("DB error"))

    const { getQuoteBySlug } = await import("@/lib/actions/quote")
    const result = await getQuoteBySlug("propuesta-sitio-web")

    expect(result).toBeNull()
  })
})
