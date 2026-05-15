"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"
import { useLocale, type Locale } from "@/lib/i18n"

const LANGUAGES: { code: Locale; label: string; flag?: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇲🇽" },
]

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale } = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const current = LANGUAGES.find(l => l.code === locale)!

  return (
    <div ref={ref} className="relative mt-3">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-foreground-muted border border-border hover:text-foreground hover:bg-black/4 hover:border-border-strong hover:shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={16} strokeWidth={1.5} />
        {current.flag && <span className="text-sm">{current.flag}</span>}
        {current.label}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 rounded-xl overflow-hidden z-50 min-w-[148px] bg-white/92 backdrop-blur-md border border-border/80 shadow-lg"
          role="listbox"
        >
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={locale === lang.code}
              onClick={() => {
                setLocale(lang.code)
                setOpen(false)
              }}
              className={[
                "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 text-left",
                locale === lang.code ? "text-foreground" : "text-foreground-muted",
                i > 0 ? "border-t border-border/60" : "",
              ].join(" ")}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span className="flex items-center gap-2">
                {lang.flag && <span>{lang.flag}</span>}
                {lang.label}
              </span>
              {locale === lang.code && (
                <Check size={16} strokeWidth={2} className="text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
