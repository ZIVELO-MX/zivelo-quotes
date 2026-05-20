import { describe, it, expect, vi, beforeEach } from "vitest"

const mockCreate = vi.fn()

vi.mock("@/lib/prisma", () => ({
  prisma: {
    quote: {
      create: mockCreate,
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
