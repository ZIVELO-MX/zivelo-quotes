"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { en } from "./locales/en"
import { es } from "./locales/es"

export type Locale = "en" | "es"

const translations: Record<Locale, Record<string, string>> = { en, es }

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "es"
  return navigator.language?.startsWith("en") ? "en" : "es"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es")

  useEffect(() => {
    const detected = detectBrowserLocale()
    if (detected !== "es") setLocale(detected)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const value = translations[locale][key]
      if (!value) return key
      if (!params) return value
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        value,
      )
    },
    [locale],
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLocale must be used within a LanguageProvider")
  return ctx
}

export function useTranslate() {
  const { t } = useLocale()
  return t
}
