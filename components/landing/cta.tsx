"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslate } from "@/lib/i18n"

export function CTASection() {
  const t = useTranslate()

  return (
    <section
      id="cta"
      className="py-24 px-5 border-t border-border bg-background-secondary"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {t("cta.label")}
          </p>
          <h2
            id="cta-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance"
          >
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-base text-foreground-muted leading-relaxed max-w-md mx-auto text-pretty">
            {t("cta.subtitle")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/q/demo"
            className="inline-flex items-center gap-2 bg-foreground text-white hover:bg-foreground/85 text-sm font-medium px-6 py-2.5 rounded-md transition-colors duration-150"
          >
            {t("cta.primary")}
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-foreground border border-border hover:bg-background px-6 py-2.5 rounded-md transition-colors duration-150"
          >
            {t("cta.secondary")}
          </Link>
        </div>

        <p className="text-xs text-foreground-dim">
          {t("cta.disclaimer")}
        </p>
      </div>
    </section>
  )
}
