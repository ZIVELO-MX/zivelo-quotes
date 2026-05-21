"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { QuoteCreateForm } from "@/components/quote/quote-create-form"

export default function NewQuotePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === "Viewer") {
      router.replace("/forbidden")
    }
  }, [user, router])

  if (user?.role === "Viewer") {
    return null
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
