"use client"

import { Eye, Layout, Sparkles, Share2 } from "lucide-react"
import { useLanguage } from "@/app/language-provider"

export function SolutionSection() {
  const { t } = useLanguage()

  const REASONS = t.solution.reasons

  return (
    <section
      id="why"
      className="py-24 px-5 border-t border-border"
      aria-labelledby="why-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          {t.solution.label}
        </p>
        <h2
          id="why-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          {t.solution.title}
        </h2>

        <div className="mt-16 grid gap-12 md:gap-16">
          {REASONS.map(({ icon, title, description }, i) => {
            const iconMap: Record<string, typeof Eye> = {
              Eye,
              Map: Layout,
              Sparkles,
              Share2,
            }
            const IconComponent = iconMap[icon] || Eye

            return (
              <div
                key={title}
                className={[
                  "grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12 items-start",
                  i < REASONS.length - 1 ? "pb-12 md:pb-16 border-b border-border" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-border bg-background-secondary flex items-center justify-center text-foreground-muted">
                    <IconComponent size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-base text-foreground-muted leading-relaxed md:pt-2">
                  {description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
