"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { formSchema } from "@/lib/schemas/quote"
import { z } from "zod"
import type { Prisma } from "@prisma/client"

export async function createQuote(data: unknown) {
  try {
    const parsed = formSchema.parse(data)
    const quote = await prisma.quote.create({
      data: parsed as Prisma.QuoteCreateInput,
    })
    revalidatePath("/dashboard")
    return { success: true, slug: quote.slug }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Datos inválidos" }
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "El slug ya existe" }
    }
    return { success: false, error: "Error al crear la cotización" }
  }
}
