import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center max-w-md mx-auto px-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance mb-4">
          Próximamente
        </h1>
        <p className="text-sm text-foreground-muted leading-relaxed mb-8">
          El panel interno está en desarrollo. Aquí podrás crear, gestionar y publicar cotizaciones.
        </p>
        <Link
          href="/"
          className="inline-flex text-sm font-medium bg-foreground text-white hover:bg-foreground/85 px-5 py-2.5 rounded-md transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
