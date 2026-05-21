"use client"

import { useState } from "react"
import { HARDCODED_USERS } from "@/lib/auth/hardcoded-users"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

// DEV TOOL — BORRAR ANTES DEL MVP
// Permite cambiar de usuario al instante para probar roles
// sin tener que cerrar sesión y volver a iniciar.
// Reemplazar con Supabase Auth real y flujo de login normal.

export function DevUserSwitcher() {
  const [open, setOpen] = useState(false)
  const { user, login } = useAuth()

  if (!user) return null

  const currentUser = user
  const currentLabel = `${currentUser.name} (${currentUser.role})`

  function switchTo(target: (typeof HARDCODED_USERS)[number]) {
    if (target.email === currentUser.email) {
      setOpen(false)
      return
    }
    // login devuelve { success, error }
    const result = login(target.username, target.password)
    if (result.success) {
      toast.success(`Cambiado a ${target.name} (${target.role})`)
    }
    setOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs text-foreground-dim shadow-sm transition-all hover:text-foreground hover:border-border-strong hover:shadow-md cursor-pointer"
        title="Cambiar usuario (DEV)"
      >
        <span className="size-2 rounded-full bg-accent animate-pulse" />
        {currentLabel}
      </button>
      {open && (
        <div className="absolute bottom-12 right-0 w-64 rounded-xl border border-border bg-background p-2 shadow-lg">
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-xs font-semibold text-foreground">Cambiar usuario</p>
            <p className="text-[10px] text-accent/70">DEV — borrar antes del MVP</p>
          </div>
          <div className="space-y-0.5">
            {HARDCODED_USERS.map((u) => {
              const initials = u.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
              const isActive = u.email === user.email
              return (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => switchTo(u)}
                  disabled={isActive}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-background-tertiary text-foreground"
                      : "text-foreground-muted hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px] bg-foreground text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-foreground-dim truncate">{u.role}</p>
                  </div>
                  {isActive && (
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
