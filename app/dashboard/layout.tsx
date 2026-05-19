import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              Zivelo Quotes
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/dashboard/quotes/new"
                className="rounded-md px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                New Quote
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Quotes
              </Link>
            </nav>
          </div>
          <Link
            href="/dashboard/login"
            className="rounded-md bg-foreground px-4 py-1.5 text-xs font-medium text-white hover:bg-foreground/85 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
