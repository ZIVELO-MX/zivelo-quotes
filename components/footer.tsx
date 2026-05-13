"use client"

import Image from "next/image"
import { Linkedin, Twitter, Instagram } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "@/app/language-provider"

const PRODUCT_LINKS = [
  { key: "demo", href: "/q/demo" },
  { key: "features", href: "#features" },
  { key: "dashboard", href: "#" },
]

const COMPANY_LINKS = [
  { key: "about", href: "https://www.zivelo.dev/#about" },
  { key: "projects", href: "https://www.zivelo.dev/#projects" },
  { key: "services", href: "https://www.zivelo.dev/#services" },
]

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/zivelo", icon: Linkedin },
  { label: "X", href: "https://x.com/zivelo", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com/zivelo", icon: Instagram },
]

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t px-5"
      style={{
        background: "#f5f5f5",
        borderColor: "rgba(0,0,0,0.1)",
        paddingTop: "64px",
        paddingBottom: "64px",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Main grid: 5 cols on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-16">

          {/* Brand — spans 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <a href="#hero" aria-label="Zivelo home">
              <Image
                src="/logos/zivelo-bars-dark-full.svg"
                alt="Zivelo"
                width={120}
                height={28}
                style={{ height: "28px", width: "auto" }}
              />
            </a>

            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "#5a5a5a" }}
            >
              {t.footer.tagline}
            </p>

            <p className="text-xs" style={{ color: "#8a8a8a" }}>
              {t.footer.built}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200"
                  style={{ color: "#5a5a5a" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#CC0000")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* Language selector */}
            <div className="mt-2">
              <LanguageSelector />
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#1d1d1b", letterSpacing: "0.1em" }}
            >
              {t.footer.product}
            </p>
            {PRODUCT_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "#5a5a5a" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
              >
                {t.footer[link.key as keyof typeof t.footer]}
              </a>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#1d1d1b", letterSpacing: "0.1em" }}
            >
              {t.footer.company}
            </p>
            {COMPANY_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "#5a5a5a" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
              >
                {t.footer[link.key as keyof typeof t.footer]}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#1d1d1b", letterSpacing: "0.1em" }}
            >
              {t.footer.contact}
            </p>
            <a
              href="mailto:contacto@zivelo.dev"
              className="text-sm transition-colors duration-200"
              style={{ color: "#5a5a5a" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1b")}
              onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
            >
              contacto@zivelo.dev
            </a>
            <a
              href="tel:+5213921107274"
              className="text-sm transition-colors duration-200 flex items-center gap-1.5"
              style={{ color: "#5a5a5a" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1b")}
              onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
            >
              <span aria-label="Mexico flag" role="img">🇲🇽</span>
              +52 1 392 110 7274
            </a>
            <a
              href="https://zivelo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors duration-200 mt-2"
              style={{ color: "#1d1d1b" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#CC0000")}
              onMouseLeave={e => (e.currentTarget.style.color = "#1d1d1b")}
            >
              {t.footer.exploreMore}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-20 pt-12 text-center"
          style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
        >
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            &copy; {year} Zivelo. {t.footer.copyright}
          </p>
        </div>

      </div>
    </footer>
  )
}
