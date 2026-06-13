"use client"

import { signOut } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const ERROR_MESSAGES: Record<string, string> = {
  Configuration:  "Error de configuración del servidor.",
  AccessDenied:   "No tienes permiso para ingresar.",
  Verification:   "El enlace de verificación expiró o ya fue usado.",
  CredentialsSignin: "Correo o contraseña incorrectos.",
  Default:        "Ocurrió un error al iniciar sesión.",
}

function ErrorContent() {
  const params = useSearchParams()
  const code = params.get("error") ?? "Default"
  const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          Error de autenticación
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          No pudimos iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">{message}</p>
      </div>

      <div className="space-y-3">
        <a
          href="/dashboard/login"
          className="flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 min-h-[44px]"
        >
          Volver al inicio de sesión
        </a>

        <p className="text-center text-xs text-foreground-muted pt-2">
          Si tienes problemas,{" "}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/dashboard/login" })}
            className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors cursor-pointer"
          >
            cierra sesión
          </button>{" "}
          y vuelve a ingresar.
        </p>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <Suspense fallback={null}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
