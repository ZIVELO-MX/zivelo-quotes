"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { formSchema, type FormValues } from "@/lib/schemas/quote"
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

export async function getQuoteBySlug(slug: string) {
  try {
    const quote = await prisma.quote.findUnique({ where: { slug } })
    if (!quote) return null

    const parsed = formSchema.safeParse({
      title: quote.title,
      slug: quote.slug,
      projectLabel: quote.projectLabel,
      recipientName: quote.recipientName,
      summary: quote.summary,
      preparedBy: quote.preparedBy,
      validUntil: quote.validUntil,
      status: quote.status,
      currency: quote.currency,
      phone: quote.phone,
      branding: quote.branding,
      actions: quote.actions,
      items: quote.items,
    })

    if (!parsed.success) return null
    return parsed.data as FormValues
  } catch {
    return null
  }
}

export async function updateQuote(slug: string, data: unknown) {
  try {
    const parsed = formSchema.parse(data)
    const quote = await prisma.quote.update({
      where: { slug },
      data: parsed as Prisma.QuoteUpdateInput,
    })
    revalidatePath("/dashboard")
    revalidatePath(`/q/${quote.slug}`)
    return { success: true, slug: quote.slug }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Datos inválidos" }
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return { success: false, error: "Cotización no encontrada" }
    }
    return { success: false, error: "Error al actualizar la cotización" }
  }
}
