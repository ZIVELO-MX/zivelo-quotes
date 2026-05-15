"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslate } from "@/lib/i18n"

export function HeroSection() {
  const t = useTranslate()

  return (
    <section
      id="hero"
      className="pt-36 pb-24 px-5 flex flex-col items-center text-center"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
          <span className="text-xs text-foreground-muted tracking-wide">
            {t("hero.badge")}
          </span>
        </div>

        <h1
          id="hero-heading"
          className="text-[2.75rem] sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance"
        >
          {t("hero.title.part1")}{" "}
          <span className="text-accent">{t("hero.title.part2")}</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-foreground-muted leading-relaxed max-w-xl mx-auto text-pretty">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#cta"
            className="inline-flex items-center gap-2 bg-foreground text-white hover:bg-foreground/85 text-sm font-medium px-5 py-2.5 rounded-md transition-colors duration-150"
          >
            {t("hero.cta.primary")}
            <ArrowRight size={14} />
          </a>
          <Link
            href="/q/demo"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border hover:bg-background-secondary px-5 py-2.5 rounded-md transition-colors duration-150"
          >
            {t("hero.cta.secondary")}
          </Link>
        </div>
      </div>

      <div className="mt-20 w-full max-w-4xl mx-auto">
        <QuotePreviewCard t={t} />
      </div>
    </section>
  )
}

function QuotePreviewCard({ t }: { t: (key: string) => string }) {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background-secondary">
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="ml-3 flex-1 max-w-xs rounded-md bg-background-tertiary text-foreground-dim text-xs px-3 py-1 text-left truncate">
          quotes.zivelo.com/q/acme-brand-strategy-2025
        </span>
      </div>

      <div className="p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="text-left">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-1.5">
              {t("hero.preview.badge")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-balance">
              {t("hero.preview.title")}
            </h2>
            <p className="mt-1.5 text-sm text-foreground-muted">
              {t("hero.preview.meta")}
            </p>
          </div>
          <span className="flex-shrink-0 rounded-full bg-green-50 text-green-700 text-xs font-medium px-3 py-1 border border-green-200">
            {t("hero.preview.status")}
          </span>
        </div>

        <div className="space-y-2 mb-8">
          {[
            { name: t("hero.preview.item1.name"), desc: t("hero.preview.item1.desc"), price: t("hero.preview.item1.price") },
            { name: t("hero.preview.item2.name"), desc: t("hero.preview.item2.desc"), price: t("hero.preview.item2.price") },
            { name: t("hero.preview.item3.name"), desc: t("hero.preview.item3.desc"), price: t("hero.preview.item3.price") },
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

        <div className="flex items-center justify-between border border-border-strong rounded-lg px-4 py-3 bg-background-secondary">
          <span className="text-sm font-semibold text-foreground">{t("hero.preview.total")}</span>
          <span className="text-lg font-bold text-foreground">{t("hero.preview.total-amount")}</span>
        </div>

        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-md bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent-hover transition-colors">
            {t("hero.preview.approve")}
          </button>
          <button className="rounded-md border border-border text-foreground-muted text-sm font-medium px-5 py-2.5 hover:bg-background-secondary transition-colors">
            {t("hero.preview.ask")}
          </button>
        </div>
      </div>
    </div>
  )
}
