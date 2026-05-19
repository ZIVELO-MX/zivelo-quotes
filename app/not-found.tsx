export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-5">
        <p className="text-7xl font-bold text-foreground mb-4">404</p>
        <p className="text-lg text-foreground-muted mb-8">No encontramos esta página.</p>
        <a
          href="/"
          className="inline-block rounded-md bg-accent text-white text-sm font-medium px-6 py-2.5 hover:bg-accent-hover transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  )
}
