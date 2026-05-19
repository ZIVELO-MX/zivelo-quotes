import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex-shrink-0 flex items-center"
              aria-label="Zivelo home"
            >
              <Image
                src="/logos/zivelo-bars-dark-full.svg"
                alt="Zivelo"
                width={110}
                height={30}
                priority
                className="object-contain"
                style={{ height: "auto" }}
              />
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/dashboard/quotes/new"
                className="rounded-md px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Nueva cotización
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Cotizaciones
              </Link>
            </nav>
          </div>
          <Link
            href="/dashboard/login"
            className="inline-flex items-center text-sm font-medium bg-foreground text-white hover:bg-foreground/85 px-4 py-1.5 rounded-md transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {/* TODO: Replace with minimal dashboard footer */}
      <Footer />
    </div>
  )
}
