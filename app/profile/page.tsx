"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import {
  User,
  Building2,
  Users,
  Shield,
  ChevronDown,
  Copy,
  Share2,
  X,
  MoreHorizontal,
  Check,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { HARDCODED_USERS } from "@/lib/auth/hardcoded-users"
import { AppSidebar, type SectionId } from "@/components/dashboard/app-sidebar"

// ── Helpers ───────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

const NOW = new Date().toISOString()

// ── Demo data (hardcoded for UI) ──────────────────────────

const DEMO_INVITATIONS = [
  {
    email: "invitado@example.com",
    role: "Editor",
    status: "Invitación pendiente" as const,
    invitedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    email: "colaborador@test.com",
    role: "Viewer",
    status: "Invitación pendiente" as const,
    invitedAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

const ALL_MEMBERS = [
  ...HARDCODED_USERS.map((u) => ({
    email: u.email,
    name: u.name,
    role: u.role,
    status: "Activo" as const,
    lastActive: NOW,
  })),
  ...DEMO_INVITATIONS.map((i) => ({
    email: i.email,
    name: i.email.split("@")[0],
    role: i.role,
    status: i.status,
    lastActive: null,
  })),
]

// ── Animation variants ────────────────────────────────────

const sectionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" as const } },
} satisfies Record<string, object>

// ── Button components ─────────────────────────────────────

function PrimaryButton({ children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="bg-gray-900 text-white hover:bg-gray-800 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}

// ── Section: Profile ──────────────────────────────────────

function ProfileSection() {
  const { user, updateUser } = useAuth()
  if (!user) return null

  const [name, setName] = useState(user.name)
  const initials = getInitials(user.name)

  function handleSave() {
    updateUser({ name })
    toast.success("Perfil actualizado")
  }

  return (
    <motion.div key="profile" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Perfil</h1>
      <p className="text-sm text-gray-500 mt-1">Gestiona tu información personal.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <button
            type="button"
            onClick={() => toast.info("Actualización de foto de perfil no disponible aún")}
            className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold shrink-0 transition-all duration-200 hover:ring-2 hover:ring-gray-300 hover:brightness-110 cursor-pointer active:scale-95"
          >
            {initials}
          </button>
          <div>
            <p className="text-base font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-900 mb-1.5">
              Nombre completo
            </label>
            <input
              id="full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full transition-shadow duration-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              defaultValue={user.email}
              disabled
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full opacity-60 cursor-not-allowed transition-shadow duration-200"
            />
          </div>
        </div>

        <div className="mt-8">
          <PrimaryButton type="button" onClick={handleSave}>
            Guardar cambios
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  )
}

// ── Section: Workspace ────────────────────────────────────

function WorkspaceSection() {
  const { user } = useAuth()
  if (!user) return null

  const isOwner = user.role === "Owner"
  const [wsName, setWsName] = useState(user.organization.name)

  function handleSave() {
    toast.success("Espacio de trabajo actualizado")
  }

  return (
    <motion.div key="workspace" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Espacio de trabajo</h1>
      <p className="text-sm text-gray-500 mt-1">Gestiona la información de tu espacio de trabajo actual.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 space-y-5">
        <div>
          <label htmlFor="ws-name" className="block text-sm font-medium text-gray-900 mb-1.5">
            Nombre del espacio de trabajo
          </label>
          <input
            id="ws-name"
            type="text"
            value={wsName}
            onChange={(e) => setWsName(e.target.value)}
            disabled={!isOwner}
            className={`h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full transition-shadow duration-200 ${
              !isOwner ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
        </div>
        <div>
          <label htmlFor="ws-slug" className="block text-sm font-medium text-gray-900 mb-1.5">
            Slug del espacio de trabajo
          </label>
          <input
            id="ws-slug"
            type="text"
            defaultValue={user.organization.slug}
            disabled
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none w-full opacity-60 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Tu rol</label>
          <input
            type="text"
            defaultValue={user.role}
            disabled
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none w-full opacity-60 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Estado</label>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            Activo
          </span>
        </div>

        {isOwner && (
          <div className="pt-2">
            <PrimaryButton type="button" onClick={handleSave}>
              Guardar cambios
            </PrimaryButton>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Section: Users & Permissions ──────────────────────────

const ROLE_COLORS: Record<string, string> = {
  Owner: "bg-red-500",
  Manager: "bg-blue-500",
  Editor: "bg-amber-500",
  Viewer: "bg-gray-400",
}

function RoleDropdown({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-gray-700 border border-gray-200 hover:text-gray-900 hover:bg-black/[0.04] hover:border-gray-300 hover:shadow-sm w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`block h-2 w-2 rounded-full ${ROLE_COLORS[value] ?? "bg-gray-400"}`} />
        {value}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className="ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className={[
          "absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-50 min-w-[180px] bg-white/92 backdrop-blur-md border border-gray-200/80 shadow-lg transition-all duration-200 ease-in-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="listbox"
      >
        {options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            role="option"
            aria-selected={value === opt}
            onClick={() => {
              onChange(opt)
              setOpen(false)
            }}
            className={[
              "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 text-left",
              value === opt ? "text-gray-900" : "text-gray-500",
              i > 0 ? "border-t border-gray-200/60" : "",
            ].join(" ")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span className="flex items-center gap-2">
              <span className={`block h-2 w-2 rounded-full ${ROLE_COLORS[opt] ?? "bg-gray-400"}`} />
              {opt}
            </span>
            {value === opt && (
              <Check size={16} strokeWidth={2} className="text-gray-400 shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function AddParticipantModal({
  open,
  onClose,
  userRole,
}: {
  open: boolean
  onClose: () => void
  userRole: string
}) {
  const [step, setStep] = useState<"form" | "done">("form")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Editor")

  if (!open) return null

  const roleOptions = userRole === "Owner"
    ? ["Owner", "Manager", "Editor", "Viewer"]
    : ["Editor", "Viewer"]

  function handleCreate() {
    if (!email) return
    setStep("done")
  }

  function handleClose() {
    setStep("form")
    setEmail("")
    setRole("Editor")
    onClose()
  }

  const inviteLink = `https://quotes.zivelo.dev/accept-invite?token=demo_${Date.now()}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {step === "form" ? "Añadir participante" : "Invitación creada"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {step === "form"
                ? "Invita a un usuario a este espacio de trabajo."
                : "Comparte el enlace de invitación con el nuevo miembro."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {step === "form" ? (
          <>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label htmlFor="invite-email" className="block text-sm font-medium text-gray-900 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="invite-email"
                  type="email"
                  placeholder="colaborador@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full transition-shadow duration-200"
                />
              </div>
              <div>
                <label htmlFor="invite-role" className="block text-sm font-medium text-gray-900 mb-1.5">
                  Rol
                </label>
                <RoleDropdown value={role} onChange={setRole} options={roleOptions} />
              </div>
              <p className="text-xs text-gray-400">
                Esta invitación generará un enlace que podrás compartir por WhatsApp.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6 pt-2">
              <SecondaryButton type="button" onClick={handleClose}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton type="button" onClick={handleCreate}>
                Crear invitación
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 py-5 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p className="text-sm text-gray-500">
                  Invitación para: <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Rol: <span className="font-medium text-gray-900">{role}</span>
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 font-mono break-all">
                {inviteLink}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink)
                  toast.success("Enlace copiado")
                }}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Copy className="size-4" />
                Copiar enlace
              </button>
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(
                    `Te invito a unirte a nuestro espacio de trabajo en Zivelo Quotes para crear y compartir cotizaciones y propuestas.\n\nEsta invitación fue creada para este correo:\n${email}\n\nAbre este enlace para aceptar la invitación:\n${inviteLink}`
                  )
                  window.open(`https://wa.me/?text=${msg}`, "_blank")
                }}
                className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Share2 className="size-4" />
                Compartir por WhatsApp
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

function UsersSection() {
  const { user } = useAuth()
  if (!user) return null

  const [modalOpen, setModalOpen] = useState(false)
  const isOwner = user.role === "Owner"
  const members = useMemo(() => ALL_MEMBERS, [])

  return (
    <motion.div key="users" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios y permisos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los usuarios, roles e invitaciones del espacio de trabajo.</p>
        </div>
        <div className="flex gap-2">
          <SecondaryButton type="button" onClick={() => toast.info("Importación no disponible aún")}>
            Importar
          </SecondaryButton>
          <SecondaryButton type="button" onClick={() => toast.info("Exportación no disponible aún")}>
            Exportar
          </SecondaryButton>
          <PrimaryButton type="button" onClick={() => setModalOpen(true)}>
            Añadir
          </PrimaryButton>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left">Nombre</th>
              <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left">Correo</th>
              <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left">Rol</th>
              <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left">Estado</th>
              <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left">Última actividad</th>
              <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const initials = getInitials(m.name)
              const isCurrentUser = m.email === user.email
              return (
                <tr key={m.email} className="text-sm text-gray-700 border-t border-gray-100 transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {m.name}
                          {isCurrentUser && <span className="text-gray-400 font-normal ml-1">(tú)</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        m.status === "Activo"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {m.lastActive ? "Hoy" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {(isOwner || (user.role === "Manager" && m.role !== "Owner" && m.role !== "Manager")) ? (
                      <button
                        type="button"
                        onClick={() => toast.info("Acción no disponible aún")}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="size-[18px]" />
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AddParticipantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userRole={user.role}
      />
    </motion.div>
  )
}

// ── Section: Security ─────────────────────────────────────

function SecuritySection() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <motion.div key="security" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Seguridad</h1>
      <p className="text-sm text-gray-500 mt-1">Gestiona tu método de inicio de sesión y la seguridad de tu cuenta.</p>

      <div className="mt-6 space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Método de inicio de sesión</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900">Cuenta de Google</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                Conectada
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Contraseña</h2>
          <p className="text-xs text-gray-500 mb-4">
            Establece una contraseña para iniciar sesión con correo y contraseña además de Google.
          </p>
          <SecondaryButton type="button" onClick={() => toast.info("No disponible aún")}>
            Cambiar contraseña
          </SecondaryButton>
        </div>

        <div className="bg-white border border-red-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-600 mb-1">Zona de peligro</h2>
          <p className="text-sm text-gray-500 mb-4">Elimina esta cuenta de forma permanente.</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toast.info("No disponible aún")}
              className="border border-red-200 text-red-600 hover:bg-red-50 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Eliminar cuenta
            </button>
            {user.role === "Owner" && (
              <button
                type="button"
                onClick={() => toast.info("No disponible aún")}
                className="border border-red-200 text-red-600 hover:bg-red-50 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Eliminar organización
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<SectionId>("profile")

  if (!user) return null

  return (
    <div className="flex flex-1 min-h-full gap-6 p-6 max-w-5xl mx-auto w-full">
      <AppSidebar active={activeSection} onSelect={setActiveSection} user={user} />
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {activeSection === "profile" && <ProfileSection key="profile" />}
          {activeSection === "workspace" && <WorkspaceSection key="workspace" />}
          {activeSection === "users" && (user.role === "Owner" || user.role === "Manager") && (
            <UsersSection key="users" />
          )}
          {activeSection === "security" && <SecuritySection key="security" />}
        </AnimatePresence>
      </div>
    </div>
  )
}
