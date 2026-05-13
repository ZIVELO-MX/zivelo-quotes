"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "Why it feels different", href: "#why" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-border shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            : "bg-white border-b border-border",
        ].join(" ")}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center" aria-label="Zivelo home">
            <Image
              src="/logos/zivelo-bars-dark-full.svg"
              alt="Zivelo"
              width={120}
              height={36}
              priority
              className="object-contain"
              style={{ height: "auto" }}
            />
          </Link>

          {/* Desktop nav — centered */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-md hover:bg-background-secondary transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex text-sm text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-md hover:bg-background-secondary transition-colors duration-150"
            >
              Log in
            </Link>
            <a
              href="#cta"
              className="inline-flex items-center text-sm font-medium bg-foreground text-white hover:bg-foreground/85 px-4 py-1.5 rounded-md transition-colors duration-150"
            >
              Get started
            </a>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-md hover:bg-background-secondary transition-colors"
              aria-label="Open menu"
            >
              <Menu size={18} className="text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={[
          "fixed inset-0 z-[100] bg-white flex flex-col transition-opacity duration-200",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <Image
            src="/logos/zivelo-bars-dark-full.svg"
            alt="Zivelo"
            width={110}
            height={34}
            className="object-contain"
            style={{ height: "auto" }}
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background-secondary transition-colors"
            aria-label="Close menu"
          >
            <X size={18} className="text-foreground" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base text-foreground px-3 py-2.5 rounded-md hover:bg-background-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="text-base text-foreground-muted px-3 py-2.5 rounded-md hover:bg-background-secondary transition-colors"
            >
              Log in
            </Link>
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium bg-foreground text-white px-3 py-2.5 rounded-md text-center transition-colors hover:bg-foreground/85"
            >
              Get started
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
