"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español", flag: "🇲🇽" },
]

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("en")
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

  const current = LANGUAGES.find(l => l.code === active)!

  return (
    <div ref={ref} className="relative mt-3">
      {/* Trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200"
        style={{
          color: "#5a5a5a",
          border: "1px solid rgba(0,0,0,0.12)",
          background: "transparent",
          boxShadow: "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(0,0,0,0.04)"
          e.currentTarget.style.borderColor = "rgba(0,0,0,0.22)"
          e.currentTarget.style.color = "#1d1d1b"
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent"
          e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"
          e.currentTarget.style.color = "#5a5a5a"
          e.currentTarget.style.boxShadow = "none"
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={12} strokeWidth={1.5} />
        {current.flag && <span className="text-xs">{current.flag}</span>}
        {current.label}
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 rounded-xl overflow-hidden z-50"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            minWidth: "148px",
          }}
          role="listbox"
        >
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={active === lang.code}
              onClick={() => {
                setActive(lang.code)
                setOpen(false)
              }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-xs font-medium transition-colors duration-150 text-left"
              style={{
                color: active === lang.code ? "#1d1d1b" : "#5a5a5a",
                background: "transparent",
                borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span className="flex items-center gap-2">
                {lang.flag && <span>{lang.flag}</span>}
                {lang.label}
              </span>
              {active === lang.code && (
                <Check size={12} strokeWidth={2} style={{ color: "#CC0000" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
