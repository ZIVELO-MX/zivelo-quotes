import Image from "next/image"
import Link from "next/link"

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          {/* Use dark variant as a static fallback — header manages theme switching */}
          <Image
            src="/logos/zivelo-bars-dark-compact.svg"
            alt="Zivelo"
            width={90}
            height={32}
            className="dark:hidden object-contain"
            style={{ height: "auto" }}
          />
          <Image
            src="/logos/zivelo-bars-light-compact.svg"
            alt="Zivelo"
            width={90}
            height={32}
            className="hidden dark:block object-contain"
            style={{ height: "auto" }}
          />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-5" aria-label="Footer navigation">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-foreground-muted hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
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
