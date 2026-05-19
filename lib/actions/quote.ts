"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"

type CreateQuoteInput = {
  slug: string
  projectLabel: string
  title: string
  recipientName: string
  summary: string
  preparedBy: string
  validUntil: string
  status: string
  currency: string
  phone: string
  branding: Prisma.InputJsonValue
  items: Prisma.InputJsonValue[]
  actions: Prisma.InputJsonValue
}

export async function createQuote(data: CreateQuoteInput) {
  try {
    const quote = await prisma.quote.create({ data: data as Prisma.QuoteCreateInput })
    revalidatePath("/dashboard")
    return { success: true, slug: quote.slug }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Slug already exists" }
    }
    return { success: false, error: "Failed to create quote" }
  }
}
