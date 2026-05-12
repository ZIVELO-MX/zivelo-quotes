"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

type Theme = "light" | "dark"
type Lang = "ES" | "EN"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")
  const [lang, setLang] = useState<Lang>("EN")
  const progressRef = useRef<HTMLSpanElement>(null)

  /* ── Initialise theme from localStorage ── */
  useEffect(() => {
    const stored = (localStorage.getItem("zivelo-theme") as Theme) ?? "dark"
    setTheme(stored)
    document.documentElement.classList.toggle("dark", stored === "dark")
  }, [])

  /* ── Scroll handler ── */
  const handleScroll = useCallback(() => {
    const y = window.scrollY
    setScrolled(y > 10)

    const total =
      document.documentElement.scrollHeight - window.innerHeight
    setProgress(total > 0 ? (y / total) * 100 : 0)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  /* ── Theme toggle ── */
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem("zivelo-theme", next)
  }

  /* ── Lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  /* ── Logo paths based on state & theme ── */
  const logoSrc = (() => {
    if (theme === "dark") {
      return scrolled
        ? "/logos/zivelo-bars-light-compact.svg"
        : "/logos/zivelo-bars-light-full.svg"
    }
    return scrolled
      ? "/logos/zivelo-bars-dark-compact.svg"
      : "/logos/zivelo-bars-dark-full.svg"
  })()

  return (
    <>
      {/* ── Fixed header ── */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-3 border-b shadow-sm"
            : "py-6",
          scrolled && theme === "dark"
            ? "bg-[#0a0000]/80 backdrop-blur-md border-white/7"
            : scrolled
            ? "bg-white/85 backdrop-blur-md border-black/10"
            : "bg-transparent border-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src={logoSrc}
              alt="Zivelo"
              width={scrolled ? 110 : 150}
              height={scrolled ? 38 : 52}
              priority
              className="transition-all duration-300 object-contain"
              style={{ height: "auto" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "text-sm tracking-wide transition-colors duration-200",
                  theme === "dark"
                    ? "text-[#f5f0f0]/70 hover:text-[#f5f0f0]"
                    : "text-[#1d1d1b]/60 hover:text-[#1d1d1b]",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === "EN" ? "ES" : "EN")}
              className={[
                "hidden md:flex items-center text-xs font-medium tracking-wider px-3 py-1.5 rounded transition-colors duration-200",
                theme === "dark"
                  ? "text-[#9a8585] hover:text-[#f5f0f0]"
                  : "text-[#5a5a5a] hover:text-[#1d1d1b]",
              ].join(" ")}
              aria-label="Toggle language"
            >
              {lang === "EN" ? "ES" : "EN"}
            </button>

            {/* Divider */}
            <span
              className={[
                "hidden md:block w-px h-4",
                theme === "dark" ? "bg-white/10" : "bg-black/10",
              ].join(" ")}
              aria-hidden
            />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={[
                "w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200",
                theme === "dark"
                  ? "text-[#9a8585] hover:text-[#f5f0f0] hover:bg-white/5"
                  : "text-[#5a5a5a] hover:text-[#1d1d1b] hover:bg-black/5",
              ].join(" ")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className={[
                "md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200",
                theme === "dark"
                  ? "text-[#f5f0f0] hover:bg-white/5"
                  : "text-[#1d1d1b] hover:bg-black/5",
              ].join(" ")}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <span
          ref={progressRef}
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] bg-[#cc0000] scroll-progress-bar pointer-events-none"
          style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
        />
      </header>

      {/* ── Mobile overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={[
          "fixed inset-0 z-[100] flex flex-col transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          theme === "dark"
            ? "bg-[#0a0000]/95 backdrop-blur-xl"
            : "bg-white/95 backdrop-blur-xl",
        ].join(" ")}
      >
        {/* Close button */}
        <div className="flex justify-between items-center px-6 py-5">
          <Image
            src={
              theme === "dark"
                ? "/logos/zivelo-bars-light-compact.svg"
                : "/logos/zivelo-bars-dark-compact.svg"
            }
            alt="Zivelo"
            width={100}
            height={35}
            className="object-contain"
            style={{ height: "auto" }}
          />
          <button
            onClick={() => setMobileOpen(false)}
            className={[
              "w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200",
              theme === "dark"
                ? "text-[#f5f0f0] hover:bg-white/5"
                : "text-[#1d1d1b] hover:bg-black/5",
            ].join(" ")}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav
          className="flex flex-col items-center justify-center flex-1 gap-8"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={[
                "font-display text-4xl font-semibold tracking-tight transition-colors duration-200",
                theme === "dark"
                  ? "text-[#f5f0f0]/80 hover:text-[#f5f0f0]"
                  : "text-[#1d1d1b]/70 hover:text-[#1d1d1b]",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="flex items-center justify-center gap-6 px-6 py-8">
          <button
            onClick={() => setLang(lang === "EN" ? "ES" : "EN")}
            className={[
              "text-sm font-medium tracking-wider transition-colors duration-200",
              theme === "dark"
                ? "text-[#9a8585] hover:text-[#f5f0f0]"
                : "text-[#5a5a5a] hover:text-[#1d1d1b]",
            ].join(" ")}
            aria-label="Toggle language"
          >
            {lang === "EN" ? "ES" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className={[
              "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
              theme === "dark"
                ? "text-[#9a8585] hover:text-[#f5f0f0]"
                : "text-[#5a5a5a] hover:text-[#1d1d1b]",
            ].join(" ")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>
      </div>
    </>
  )
}
