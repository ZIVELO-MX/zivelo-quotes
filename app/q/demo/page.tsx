import { Footer } from "@/components/layout/footer"
import { QuoteHero, QuoteSummary, QuotePricing } from "@/components/quote"
import { QuoteItemsList } from "@/components/quote/quote-items-list"
import { QuoteActions } from "@/components/quote/quote-actions"
import { DEMO_QUOTE, calculateTotal } from "@/lib/demo-quote-data"

const total = calculateTotal(DEMO_QUOTE.items)

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-5 pt-24 pb-24">
        <QuoteHero
          projectLabel={DEMO_QUOTE.projectLabel}
          title={DEMO_QUOTE.title}
          preparedBy={DEMO_QUOTE.preparedBy}
          validUntil={DEMO_QUOTE.validUntil}
          status={DEMO_QUOTE.status}
        />
        <QuoteSummary summary={DEMO_QUOTE.summary} />
        <QuoteItemsList items={DEMO_QUOTE.items} />
        <QuotePricing total={total} />
        <QuoteActions phone={DEMO_QUOTE.phone} title={DEMO_QUOTE.title} quote={DEMO_QUOTE} />
      </div>
      <Footer />
    </main>
  )
}
