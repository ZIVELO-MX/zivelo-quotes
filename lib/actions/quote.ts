"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { formSchema, type FormValues } from "@/lib/schemas/quote"
import { z } from "zod"
import type { Prisma } from "@prisma/client"

export async function createQuote(data: unknown) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "No autorizado" }
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
  const session = await auth()
  if (!session?.user) return { success: false, error: "No autorizado" }
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

export type QuoteSummary = {
  id: string
  slug: string
  title: string
  client: string
  status: string
  validUntil: string | null
  total: number
  currency: string
  updatedAt: string
}

export async function listQuotes(): Promise<{ success: boolean; quotes: QuoteSummary[] }> {
  try {
    const rows = await prisma.quote.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        recipientName: true,
        status: true,
        validUntil: true,
        currency: true,
        items: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    })
    const quotes: QuoteSummary[] = rows.map((row) => {
      const items = Array.isArray(row.items)
        ? (row.items as Array<{ price?: number }>)
        : []
      const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0)
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        client: row.recipientName,
        status: row.status,
        validUntil: row.validUntil || null,
        total,
        currency: row.currency,
        updatedAt: row.updatedAt.toISOString().split("T")[0],
      }
    })
    return { success: true, quotes }
  } catch {
    return { success: false, quotes: [] }
  }
}

export async function publishQuote(slug: string) {
  try {
    const quote = await prisma.quote.update({
      where: { slug },
      data: { status: "active" },
    })
    revalidatePath("/dashboard")
    revalidatePath(`/q/${quote.slug}`)
    return { success: true, slug: quote.slug }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return { success: false, error: "Cotización no encontrada" }
    }
    return { success: false, error: "Error al publicar la cotización" }
  }
}

export async function unpublishQuote(slug: string) {
  try {
    const quote = await prisma.quote.update({
      where: { slug },
      data: { status: "draft" },
    })
    revalidatePath("/dashboard")
    revalidatePath(`/q/${quote.slug}`)
    return { success: true, slug: quote.slug }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return { success: false, error: "Cotización no encontrada" }
    }
    return { success: false, error: "Error al despublicar la cotización" }
  }
}
