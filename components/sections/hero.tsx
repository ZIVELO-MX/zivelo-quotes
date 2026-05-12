"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Subtle dark radial backdrop for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(204,0,0,0.07),transparent)]
                   bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(204,0,0,0.04),transparent)]"
      />

      {/* Badge */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-foreground-muted tracking-wide uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Private Beta — Zivelo Quotes
        </span>
      </div>

      {/* Headline */}
      <h1
        id="hero-heading"
        className="font-display text-center text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] text-balance max-w-4xl"
      >
        Quotes that{" "}
        <span className="text-accent">close deals.</span>
        <br />
        Not PDFs.
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-center text-lg sm:text-xl text-foreground-muted leading-relaxed max-w-2xl text-pretty">
        Zivelo Quotes turns your proposals into interactive, branded pages
        that clients can explore, understand, and act on — without ever
        opening an attachment.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/q/demo"
          className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-3 transition-colors duration-200"
        >
          View demo quote
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-border text-foreground text-sm font-medium px-6 py-3 transition-colors duration-200 hover:bg-background-secondary"
        >
          Access dashboard
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Quote preview mockup */}
      <div className="mt-20 w-full max-w-3xl">
        <QuotePreviewCard />
      </div>
    </section>
  )
}

function QuotePreviewCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background-secondary">
        <span className="h-3 w-3 rounded-full bg-foreground-dim/30" />
        <span className="h-3 w-3 rounded-full bg-foreground-dim/30" />
        <span className="h-3 w-3 rounded-full bg-foreground-dim/30" />
        <span className="ml-3 flex-1 rounded bg-background-tertiary text-foreground-dim text-xs px-3 py-1 text-left truncate max-w-xs">
          quotes.zivelo.com/q/acme-brand-strategy-2025
        </span>
      </div>

      {/* Quote content */}
      <div className="p-6 sm:p-8">
        {/* Quote header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">
              Proposal · Brand Strategy
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-balance">
              ACME Corp — Brand Strategy 2025
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Prepared by Zivelo &nbsp;·&nbsp; Valid until 30 Jun 2025
            </p>
          </div>
          <span className="flex-shrink-0 rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1 border border-accent/20">
            Active
          </span>
        </div>

        {/* Service items */}
        <div className="space-y-3 mb-8">
          {[
            { name: "Brand Identity System", desc: "Logo, palette, typography, guidelines", price: "$4,800" },
            { name: "Website Redesign", desc: "5-page site, mobile-first, CMS ready", price: "$8,200" },
            { name: "Launch Campaign", desc: "Social kit + press release + 3 ads", price: "$2,400" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background-secondary px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-foreground-muted truncate">{item.desc}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-foreground">{item.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-xl bg-accent/8 border border-accent/15 px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Total investment</span>
          <span className="text-lg font-bold text-accent">$15,400</span>
        </div>

        {/* CTA */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 rounded-full bg-accent text-white text-sm font-semibold py-2.5 transition-colors hover:bg-accent-hover">
            Approve proposal
          </button>
          <button className="rounded-full border border-border text-foreground-muted text-sm font-medium px-5 py-2.5 transition-colors hover:bg-background-secondary">
            Ask a question
          </button>
        </div>
      </div>
    </div>
  )
}
