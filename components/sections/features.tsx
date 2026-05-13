"use client"

import {
  MousePointerClick,
  Link2,
  FileDown,
  Image as ImageIcon,
  LayoutDashboard,
  Globe,
} from "lucide-react"
import { useLanguage } from "@/app/language-provider"

export function FeaturesSection() {
  const { t } = useLanguage()

  const FEATURES = [
    {
      icon: MousePointerClick,
      title: t.features.features[0].title,
      body: t.features.features[0].description,
    },
    {
      icon: Link2,
      title: t.features.features[1].title,
      body: t.features.features[1].description,
    },
    {
      icon: FileDown,
      title: t.features.features[2].title,
      body: t.features.features[2].description,
    },
    {
      icon: ImageIcon,
      title: t.features.features[3].title,
      body: t.features.features[3].description,
    },
    {
      icon: LayoutDashboard,
      title: t.features.features[4].title,
      body: t.features.features[4].description,
    },
    {
      icon: Globe,
      title: t.features.features[5].title,
      body: t.features.features[5].description,
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
          {t.features.label}
        </p>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          {t.features.title}
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
                      Soon
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
