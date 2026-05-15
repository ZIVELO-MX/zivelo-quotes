"use client"

import { Globe, Palette, Server, Lock } from "lucide-react"
import { useTranslate } from "@/lib/i18n"

export function FutureSection() {
  const t = useTranslate()

  const ROADMAP = [
    { icon: Globe, label: t("future.item1.label"), desc: t("future.item1.desc") },
    { icon: Palette, label: t("future.item2.label"), desc: t("future.item2.desc") },
    { icon: Server, label: t("future.item3.label"), desc: t("future.item3.desc") },
    { icon: Lock, label: t("future.item4.label"), desc: t("future.item4.desc") },
  ]

  return (
    <section
      id="roadmap"
      className="py-24 px-5 border-t border-border"
      aria-labelledby="future-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-10 lg:p-12 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                {t("future.label")}
              </p>
              <h2
                id="future-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance"
              >
                {t("future.title")}
              </h2>
              <p className="mt-4 text-base text-foreground-muted leading-relaxed text-pretty">
                {t("future.subtitle")}
              </p>
            </div>

            <div className="bg-background-secondary border-t md:border-t-0 md:border-l border-border p-10 lg:p-12 grid grid-cols-2 gap-8">
              {ROADMAP.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col gap-2.5">
                  <div className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-foreground-muted">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
