"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

export const ROLE_COLORS: Record<string, string> = {
  Owner: "#cc0000",
  Manager: "#2563eb",
  Editor: "#d97706",
  Viewer: "#9ca3af",
}

export function RoleDropdown({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  const [open, setOpen] = useState(false)
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-gray-700 border border-gray-200 hover:text-gray-900 hover:bg-black/[0.04] hover:border-gray-300 hover:shadow-sm w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: ROLE_COLORS[value] ?? "#9ca3af" }} />
        {value}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className="ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className={[
          "absolute top-full left-0 right-0 sm:right-auto mt-2 rounded-xl overflow-hidden z-50 min-w-[180px] bg-white/92 backdrop-blur-md border border-gray-200/80 shadow-lg transition-all duration-200 ease-in-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="listbox"
      >
        <div className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={[
                "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 text-left",
                value === opt ? "text-gray-900" : "text-gray-500",
                i > 0 ? "border-t border-gray-200/60" : "",
              ].join(" ")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: ROLE_COLORS[opt] ?? "#9ca3af" }} />
                {opt}
              </span>
              {value === opt && (
                <Check size={16} strokeWidth={2} className="text-gray-400 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
