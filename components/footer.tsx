import Image from "next/image"

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Problem", href: "#problem" },
  { label: "Why it feels different", href: "#why" },
  { label: "Product", href: "#features" },
  { label: "Demo", href: "/q/demo" },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-5">
      <div className="max-w-5xl mx-auto">
        {/* Top row: logo + nav */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">
          {/* Logo */}
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
          <nav
            className="flex flex-wrap items-start gap-x-8 gap-y-2"
            aria-label="Footer navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <a
              href="mailto:contacto@zivelo.dev"
              className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150"
            >
              contacto@zivelo.dev
            </a>
            <a
              href="tel:+5213921107274"
              className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150 flex items-center gap-1.5"
            >
              <span aria-label="Mexico">🇲🇽</span>
              +52 1 392 110 7274
            </a>
          </div>
        </div>

        {/* Bottom row: copyright */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-foreground-dim">
            &copy; {new Date().getFullYear()} Zivelo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
