"use client"

import { useState } from "react"
import Image from "next/image"
import { Linkedin, Twitter, Instagram, Globe } from "lucide-react"

const PRODUCT_LINKS = [
  { label: "Demo quote", href: "/q/demo" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#" },
]

const COMPANY_LINKS = [
  { label: "About", href: "https://www.zivelo.dev/#about" },
  { label: "Projects", href: "https://www.zivelo.dev/#projects" },
  { label: "Services", href: "https://www.zivelo.dev/#services" },
]

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/zivelo", icon: Linkedin },
  { label: "X", href: "https://x.com/zivelo", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com/zivelo", icon: Instagram },
]

export function Footer() {
  const [openLanguage, setOpenLanguage] = useState(false)
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
              Interactive quote experiences for modern teams.
            </p>

            <p className="text-xs" style={{ color: "#8a8a8a" }}>
              Built and maintained by Zivelo.
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
            <div className="relative mt-3">
              <button
                onClick={() => setOpenLanguage(!openLanguage)}
                className="text-xs font-medium px-3 py-1.5 rounded flex items-center gap-2 transition-colors duration-200"
                style={{ color: "#f5f5f5", backgroundColor: "#1d1d1b" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#CC0000")}
                onMouseLeave={e => !openLanguage && (e.currentTarget.style.backgroundColor = "#1d1d1b")}
              >
                <Globe size={14} />
                English
              </button>
              
              {openLanguage && (
                <div
                  className="absolute top-full left-0 mt-1 rounded border bg-white z-10"
                  style={{ borderColor: "#e0e0e0", minWidth: "150px" }}
                >
                  <button
                    onClick={() => setOpenLanguage(false)}
                    className="w-full text-left text-xs font-medium px-3 py-2 transition-colors duration-200"
                    style={{ color: "#f5f5f5", backgroundColor: "#1d1d1b" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#CC0000")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d1d1b")}
                  >
                    <Globe size={14} className="inline mr-2" />
                    English
                  </button>
                  <button
                    onClick={() => setOpenLanguage(false)}
                    className="w-full text-left text-xs font-medium px-3 py-2 transition-colors duration-200"
                    style={{ color: "#5a5a5a", borderTop: "1px solid #e0e0e0" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    🇲🇽 Español (MX)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#1d1d1b", letterSpacing: "0.1em" }}
            >
              Product
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
                {link.label}
              </a>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#1d1d1b", letterSpacing: "0.1em" }}
            >
              Company
            </p>
            {COMPANY_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "#5a5a5a" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#1d1d1b", letterSpacing: "0.1em" }}
            >
              Contact
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
              Explore more →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-20 pt-12 text-center"
          style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
        >
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            &copy; {year} Zivelo. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
