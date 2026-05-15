"use client"

import { FileX, Clock, Frown } from "lucide-react"
import { useTranslate } from "@/lib/i18n"

export function ProblemSection() {
  const t = useTranslate()

  const PAINS = [
    {
      icon: FileX,
      title: t("problem.pain1.title"),
      body: t("problem.pain1.body"),
    },
    {
      icon: Clock,
      title: t("problem.pain2.title"),
      body: t("problem.pain2.body"),
    },
    {
      icon: Frown,
      title: t("problem.pain3.title"),
      body: t("problem.pain3.body"),
    },
  ]

  return (
    <section
      id="problem"
      className="py-24 px-5 border-t border-border bg-background-secondary"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          {t("problem.label")}
        </p>
        <h2
          id="problem-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          {t("problem.title")}
        </h2>
        <p className="mt-4 text-base text-foreground-muted leading-relaxed max-w-lg text-pretty">
          {t("problem.subtitle")}
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-px bg-border">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-background-secondary p-8 flex flex-col gap-4"
            >
              <div className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-foreground-muted flex-shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
