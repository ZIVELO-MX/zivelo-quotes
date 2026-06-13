"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { changePassword } from "@/lib/actions/user"

export default function ChangePasswordPage() {
  const [password, setPassword]           = useState("")
  const [confirm, setConfirm]             = useState("")
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [loading, setLoading]             = useState(false)
  const [errors, setErrors]               = useState<{ password?: string; confirm?: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const pwdError = password.length < 8 ? "Mínimo 8 caracteres" : ""
    const cfmError = password !== confirm ? "Las contraseñas no coinciden" : ""
    setErrors({ password: pwdError || undefined, confirm: cfmError || undefined })
    if (pwdError || cfmError) return

    setLoading(true)
    try {
      const result = await changePassword(password)
      if (!result.success) {
        toast.error(result.error ?? "Error al cambiar la contraseña")
        return
      }
      // Sign out so the next login gets a fresh JWT with mustChangePassword=false
      toast.success("Contraseña guardada — inicia sesión para continuar")
      await signOut({ callbackUrl: "/dashboard/login" })
    } catch {
      toast.error("Error inesperado — intenta de nuevo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
            Primer acceso
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Crea tu contraseña
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Elige una contraseña segura para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                className={`pr-10 text-base ${errors.password ? "border-accent! focus-visible:ring-accent/50!" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-dim hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-accent">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setErrors((prev) => ({ ...prev, confirm: undefined }))
                }}
                className={`pr-10 text-base ${errors.confirm ? "border-accent! focus-visible:ring-accent/50!" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-dim hover:text-foreground transition-colors cursor-pointer"
                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            {errors.confirm && <p className="text-xs text-accent">{errors.confirm}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="size-4" /> : "Guardar contraseña"}
          </Button>
        </form>
      </div>
    </div>
  )
}
