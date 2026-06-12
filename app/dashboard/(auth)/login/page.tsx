"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
            Dashboard
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Accede al panel de administración con tu cuenta Zoho.
          </p>
        </div>
        <Button
          className="w-full"
          disabled={loading}
          onClick={() => {
            setLoading(true)
            signIn("zoho", { callbackUrl: "/dashboard" })
          }}
        >
          {loading && <Spinner className="size-4 mr-2" />}
          Continuar con Zoho
        </Button>
      </div>
    </div>
  )
}
