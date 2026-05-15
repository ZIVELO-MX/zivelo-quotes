"use client"

import {
  MousePointerClick,
  Link2,
  FileDown,
  Image as ImageIcon,
  LayoutDashboard,
  Globe,
} from "lucide-react"
import { useTranslate } from "@/lib/i18n"

export function FeaturesSection() {
  const t = useTranslate()

  const FEATURES = [
    {
      icon: MousePointerClick,
      title: t("features.feat1.title"),
      body: t("features.feat1.body"),
    },
    {
      icon: Link2,
      title: t("features.feat2.title"),
      body: t("features.feat2.body"),
    },
    {
      icon: FileDown,
      title: t("features.feat3.title"),
      body: t("features.feat3.body"),
    },
    {
      icon: ImageIcon,
      title: t("features.feat4.title"),
      body: t("features.feat4.body"),
    },
    {
      icon: LayoutDashboard,
      title: t("features.feat5.title"),
      body: t("features.feat5.body"),
    },
    {
      icon: Globe,
      title: t("features.feat6.title"),
      body: t("features.feat6.body"),
      soon: true,
    },
  ]

  return (
    <section
      id="features"
      className="py-24 px-5 border-t border-border bg-background-secondary"
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          {t("features.label")}
        </p>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          {t("features.title")}
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {FEATURES.map(({ icon: Icon, title, body, soon }) => (
            <div
              key={title}
              className="bg-background-secondary p-7 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-foreground-muted flex-shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  {soon && (
                    <span className="text-[10px] font-medium text-foreground-dim border border-border rounded-full px-2 py-0.5">
                      {t("features.badge-soon")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
