"use client"

import Image from "next/image"
import { Linkedin, Twitter, Instagram } from "lucide-react"
import { LanguageSelector } from "@/components/layout/language-selector"
import { useTranslate } from "@/lib/i18n"

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/zivelo", icon: Linkedin },
  { label: "X", href: "https://x.com/zivelo", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com/zivelo", icon: Instagram },
]

export function Footer() {
  const t = useTranslate()
  const year = new Date().getFullYear()

  const PRODUCT_LINKS = [
    { label: t("footer.product.demo"), href: "/q/demo" },
    { label: t("footer.product.features"), href: "#features" },
    { label: t("footer.product.dashboard"), href: "/dashboard" },
  ]

  const COMPANY_LINKS = [
    { label: t("footer.company.about"), href: "https://www.zivelo.dev/#about" },
    { label: t("footer.company.projects"), href: "https://www.zivelo.dev/#projects" },
    { label: t("footer.company.services"), href: "https://www.zivelo.dev/#services" },
  ]

  return (
    <footer className="border-t px-5 py-16 bg-[#f5f5f5]" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-16">
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

            <p className="text-sm leading-relaxed max-w-sm text-[#5a5a5a]">
              {t("footer.tagline")}
            </p>

            <p className="text-xs text-[#8a8a8a]">
              {t("footer.built-by")}
            </p>

            <div className="flex items-center gap-4 mt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#5a5a5a] hover:text-accent transition-colors duration-200"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            <LanguageSelector />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[#1d1d1b]" style={{ letterSpacing: "0.1em" }}>
              {t("footer.section.product")}
            </p>
            {PRODUCT_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#5a5a5a] hover:text-[#1d1d1b] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[#1d1d1b]" style={{ letterSpacing: "0.1em" }}>
              {t("footer.section.company")}
            </p>
            {COMPANY_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#5a5a5a] hover:text-[#1d1d1b] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[#1d1d1b]" style={{ letterSpacing: "0.1em" }}>
              {t("footer.section.contact")}
            </p>
            <a
              href="mailto:contacto@zivelo.dev"
              className="text-sm text-[#5a5a5a] hover:text-[#1d1d1b] transition-colors duration-200"
            >
              {t("footer.contact.email")}
            </a>
            <a
              href="tel:+5213921107274"
              className="text-sm text-[#5a5a5a] hover:text-[#1d1d1b] transition-colors duration-200 flex items-center gap-1.5"
            >
              <span aria-label="Mexico flag" role="img">🇲🇽</span>
              +52 1 392 110 7274
            </a>
            <a
              href="https://zivelo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#1d1d1b] hover:text-accent transition-colors duration-200 mt-2"
            >
              {t("footer.contact.explore")}
            </a>
          </div>
        </div>

        <div className="mt-20 pt-12 text-center" style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <p className="text-sm text-[#8a8a8a]">
            {t("footer.copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}
