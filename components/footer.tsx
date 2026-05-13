import Image from "next/image"

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "Why it feels different", href: "#why" },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo — light mode only, always dark variant */}
        <a href="#hero" aria-label="Back to top">
          <Image
            src="/logos/zivelo-bars-dark-compact.svg"
            alt="Zivelo"
            width={88}
            height={28}
            className="object-contain"
            style={{ height: "auto" }}
          />
        </a>

        {/* Nav */}
        <nav className="flex flex-wrap items-center justify-center gap-5" aria-label="Footer navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-foreground-muted hover:text-foreground transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-foreground-dim text-center sm:text-right">
          &copy; {new Date().getFullYear()} Zivelo. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
