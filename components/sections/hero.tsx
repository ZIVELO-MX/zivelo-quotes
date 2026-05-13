"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/app/language-provider"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section
      id="hero"
      className="pt-36 pb-24 px-5 flex flex-col items-center text-center"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
          <span className="text-xs text-foreground-muted tracking-wide">
            Private Beta — Zivelo Quotes
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="text-[2.75rem] sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance"
        >
          {t.hero.title}
        </h1>

        {/* Sub */}
        <p className="mt-6 text-lg sm:text-xl text-foreground-muted leading-relaxed max-w-xl mx-auto text-pretty">
          {t.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#cta"
            className="inline-flex items-center gap-2 bg-foreground text-white hover:bg-foreground/85 text-sm font-medium px-5 py-2.5 rounded-md transition-colors duration-150"
          >
            {t.hero.cta}
            <ArrowRight size={14} />
          </a>
          <Link
            href="/q/demo"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border hover:bg-background-secondary px-5 py-2.5 rounded-md transition-colors duration-150"
          >
            {t.footer.demo}
          </Link>
        </div>
      </div>

      {/* Product mockup */}
      <div className="mt-20 w-full max-w-4xl mx-auto">
        <QuotePreviewCard />
      </div>
    </section>
  )
}

function QuotePreviewCard() {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background-secondary">
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="ml-3 flex-1 max-w-xs rounded-md bg-background-tertiary text-foreground-dim text-xs px-3 py-1 text-left truncate">
          quotes.zivelo.com/q/acme-brand-strategy-2025
        </span>
      </div>

      {/* Quote body */}
      <div className="p-7 sm:p-9">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="text-left">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-1.5">
              Proposal · Brand Strategy
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-balance">
              ACME Corp — Brand Strategy 2025
            </h2>
            <p className="mt-1.5 text-sm text-foreground-muted">
              Prepared by Zivelo &nbsp;·&nbsp; Valid until 30 Jun 2025
            </p>
          </div>
          <span className="flex-shrink-0 rounded-full bg-green-50 text-green-700 text-xs font-medium px-3 py-1 border border-green-200">
            Active
          </span>
        </div>

        {/* Line items */}
        <div className="space-y-2 mb-8">
          {[
            { name: "Brand Identity System", desc: "Logo, palette, typography, guidelines", price: "$4,800" },
            { name: "Website Redesign", desc: "5-page site, mobile-first, CMS ready", price: "$8,200" },
            { name: "Launch Campaign", desc: "Social kit + press release + 3 ads", price: "$2,400" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 border border-border rounded-lg px-4 py-3 hover:bg-background-secondary transition-colors"
            >
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-foreground-muted truncate">{item.desc}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-foreground">{item.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border border-border-strong rounded-lg px-4 py-3 bg-background-secondary">
          <span className="text-sm font-semibold text-foreground">Total investment</span>
          <span className="text-lg font-bold text-foreground">$15,400</span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-md bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent-hover transition-colors">
            Approve proposal
          </button>
          <button className="rounded-md border border-border text-foreground-muted text-sm font-medium px-5 py-2.5 hover:bg-background-secondary transition-colors">
            Ask a question
          </button>
        </div>
      </div>
    </div>
  )
}
