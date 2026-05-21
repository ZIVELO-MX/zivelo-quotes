"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { QuoteCreateForm } from "@/components/quote/quote-create-form"

export default function NewQuotePage() {
  const { user } = useAuth()

  if (user?.role === "Viewer") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-md mx-auto px-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            Acceso denegado
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance mb-4">
            No tienes permiso
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Tu rol de lector no permite crear cotizaciones. Contacta al dueño del espacio de trabajo para obtener permisos adicionales.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 pb-24">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nueva cotización
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Crea una nueva propuesta interactiva
        </p>
      </div>
      <QuoteCreateForm />
    </div>
  )
}
