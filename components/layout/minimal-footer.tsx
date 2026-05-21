"use client"

import { useTranslate } from "@/lib/i18n"

export function MinimalFooter() {
  const t = useTranslate()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-center text-xs text-foreground-dim">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  )
}
