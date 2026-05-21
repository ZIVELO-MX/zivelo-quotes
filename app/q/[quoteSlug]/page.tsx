import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MinimalFooter } from "@/components/layout/minimal-footer"
import { QuoteHero, QuoteSummary, QuotePricing } from "@/components/quote"
import { QuoteItemsList } from "@/components/quote/quote-items-list"
import { QuoteActions } from "@/components/quote/quote-actions"
import { calculateTotal } from "@/lib/demo-quote-data"
import type { QuoteData } from "@/lib/demo-quote-data"

type Props = {
  params: Promise<{ quoteSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { quoteSlug } = await params
  return {
    title: `${quoteSlug} — Zivelo Quotes`,
    description: "Interactive quote proposal powered by Zivelo Quotes.",
  }
}

async function getQuote(slug: string): Promise<QuoteData | null> {
  try {
    const row = await prisma.quote.findUnique({ where: { slug } })
    if (!row) return null
    return {
      projectLabel: row.projectLabel,
      title: row.title,
      recipientName: row.recipientName,
      summary: row.summary,
      preparedBy: row.preparedBy,
      validUntil: row.validUntil,
      status: row.status as QuoteData["status"],
      currency: row.currency,
      phone: row.phone,
      items: row.items as QuoteData["items"],
      branding: row.branding as QuoteData["branding"],
      actions: row.actions as QuoteData["actions"],
    }
  } catch {
    return null
  }
}

export default async function QuotePage({ params }: Props) {
  const { quoteSlug } = await params

  const quote = await getQuote(quoteSlug)
  if (!quote) notFound()
  const total = calculateTotal(quote.items)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 pt-24 pb-24">
          <QuoteHero
            projectLabel={quote.projectLabel}
            title={quote.title}
            preparedBy={quote.preparedBy}
            validUntil={quote.validUntil}
            status={quote.status}
          />
          <QuoteSummary summary={quote.summary} />
          <QuoteItemsList items={quote.items} />
          <QuotePricing total={total} />
          <QuoteActions phone={quote.phone} title={quote.title} quote={quote} />
        </div>
      </main>
      <MinimalFooter />
    </div>
  )
}
