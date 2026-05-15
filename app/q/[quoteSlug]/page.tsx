import Link from "next/link"
import type { Metadata } from "next"

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

export default async function QuotePage({ params }: Props) {
  const { quoteSlug } = await params

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Quote
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance mb-2">
          {quoteSlug}
        </h1>
        <p className="text-sm text-foreground-muted leading-relaxed mb-8">
          This quote is being prepared. Check back soon or contact us for more information.
        </p>
        <Link
          href="/"
          className="inline-flex text-sm font-medium bg-foreground text-white hover:bg-foreground/85 px-5 py-2.5 rounded-md transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
