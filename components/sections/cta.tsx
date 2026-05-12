import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section
      className="py-28 px-6 bg-background-secondary"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
            Get started
          </p>
          <h2
            id="cta-heading"
            className="font-display text-4xl sm:text-5xl font-bold text-foreground text-balance"
          >
            See what a great quote looks like.
          </h2>
          <p className="mt-5 text-lg text-foreground-muted leading-relaxed max-w-xl mx-auto text-pretty">
            No sign-up needed. Explore the interactive demo quote and experience
            what your clients will see.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/q/demo"
            className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-7 py-3.5 transition-colors duration-200"
          >
            View demo quote
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-border text-foreground text-sm font-medium px-7 py-3.5 transition-colors duration-200 hover:bg-background"
          >
            Access dashboard
          </Link>
        </div>

        <p className="text-xs text-foreground-dim">
          Zivelo Quotes is currently in private beta — invite only.
        </p>
      </div>
    </section>
  )
}
