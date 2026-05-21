"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import {
  User,
  Building2,
  Users,
  Shield,
  Palette,
  GripHorizontal,
  ChevronDown,
  Copy,
  Share2,
  X,
  MoreHorizontal,
  Check,
  LogOut,
  ArrowLeft,
  ChevronRight,
  ImageIcon,
  Upload,
  Globe,
  DollarSign,
  Phone,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { HARDCODED_USERS } from "@/lib/auth/hardcoded-users"
import { SettingsNav, type SectionId } from "@/components/settings/settings-nav"

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

// ── Section: Account ──────────────────────────────────────

function AccountSection() {
  const { user, updateUser } = useAuth()
  if (!user) return null

  const [name, setName] = useState(user.name)

  function handleSave() {
    updateUser({ name })
    toast.success("Cuenta actualizada")
  }

  return (
    <motion.div key="account" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Cuenta</h1>
      <p className="text-sm text-gray-500 mt-1">Gestiona tu información personal.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-gray-900 mb-1.5">
              Nombre completo
            </label>
            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full transition-shadow duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Correo electrónico</label>
            <input
              type="email"
              defaultValue={user.email}
              disabled
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 opacity-60 cursor-not-allowed w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Rol actual</label>
            <input
              type="text"
              defaultValue={user.role}
              disabled
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 opacity-60 cursor-not-allowed w-full"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton type="button" onClick={handleSave}>
            Guardar cambios
          </PrimaryButton>
          <button
            type="button"
            onClick={() => toast.info("Función de cierre de sesión simulada")}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Currency Dropdown ─────────────────────────────────────

const CURRENCIES = [
  { value: "MXN", label: "MXN — Peso mexicano" },
  { value: "USD", label: "USD — Dólar estadounidense" },
  { value: "EUR", label: "EUR — Euro" },
] as const

function CurrencyDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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

  const current = CURRENCIES.find((c) => c.value === value)!

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-gray-600 border border-gray-200 hover:text-gray-900 hover:bg-black/[0.04] hover:border-gray-300 hover:shadow-sm w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className="ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className={[
          "absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-50 min-w-[220px] bg-white/92 backdrop-blur-md border border-gray-200/80 shadow-lg transition-all duration-200 ease-in-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="listbox"
      >
        {CURRENCIES.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={value === opt.value}
            onClick={() => {
              onChange(opt.value)
              setOpen(false)
            }}
            className={[
              "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 text-left",
              value === opt.value ? "text-gray-900" : "text-gray-500",
              i > 0 ? "border-t border-gray-200/60" : "",
            ].join(" ")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {opt.label}
            {value === opt.value && (
              <Check size={16} strokeWidth={2} className="text-gray-400 shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Section: General ──────────────────────────────────────

function GeneralSection() {
  const { user } = useAuth()
  if (!user) return null

  const membersCount = 4
  const plan = "Pro"

  const info = [
    { label: "Nombre del negocio", value: user.organization.name, icon: Building2 },
    { label: "Slug", value: user.organization.slug, icon: Globe },
    { label: "Moneda predeterminada", value: "MXN — Peso mexicano", icon: DollarSign },
    { label: "Teléfono de contacto", value: "+52 55 1234 5678", icon: Phone },
    { label: "Miembros", value: `${membersCount} miembros`, icon: Users },
    { label: "Plan", value: `${plan} · Creado en Mar 2026`, icon: Shield },
  ]

  return (
    <motion.div key="general" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Información general</h1>
      <p className="text-sm text-gray-500 mt-1">Resumen de la configuración de tu negocio.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {info.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{item.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Section: Brand ────────────────────────────────────────

function BrandSection() {
  const { user } = useAuth()
  const [primaryColor, setPrimaryColor] = useState("#2563eb")
  const [preparedBy] = useState(user?.organization.name ?? "Zivelo")
  const [orgName, setOrgName] = useState(user?.organization.name ?? "Zivelo Studio")
  const [currency, setCurrency] = useState("MXN")
  const [whatsapp, setWhatsapp] = useState("+52 55 1234 5678")
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoMode, setLogoMode] = useState<"default" | "upload">("default")

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrimaryColor(e.target.value)
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setLogoPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setLogoMode("upload")
  }

  function handleSave() {
    toast.success("Marca actualizada")
  }

  return (
    <motion.div key="brand" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Marca</h1>
      <p className="text-sm text-gray-500 mt-1">Personaliza la identidad visual de tus cotizaciones.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 space-y-6">
        {/* Business info */}
        <div className="space-y-5">
          <div>
            <label htmlFor="brand-org-name" className="block text-sm font-medium text-gray-900 mb-1.5">
              Nombre del negocio
            </label>
            <input
              id="brand-org-name"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full transition-shadow duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Slug de la organización</label>
            <input
              type="text"
              defaultValue={user?.organization.slug}
              disabled
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 opacity-60 cursor-not-allowed w-full"
            />
          </div>
          <div>
            <label htmlFor="brand-currency" className="block text-sm font-medium text-gray-900 mb-1.5">
              Moneda predeterminada
            </label>
            <CurrencyDropdown value={currency} onChange={setCurrency} />
          </div>
          <div>
            <label htmlFor="brand-whatsapp" className="block text-sm font-medium text-gray-900 mb-1.5">
              Teléfono de contacto (WhatsApp)
            </label>
            <input
              id="brand-whatsapp"
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-full transition-shadow duration-200"
              placeholder="+52 55 1234 5678"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-900 mb-2">Logo</label>
          <div className="space-y-2">
            <div className="relative flex gap-1 rounded-xl border border-gray-200 bg-gray-50/50 p-1 text-sm font-medium">
              <div
                className={[
                  "absolute left-1 top-1 bottom-1 w-[calc(50%-0.125rem)] rounded-lg bg-white shadow-xs transition-transform duration-200 ease-in-out",
                  logoMode === "upload" ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={() => { setLogoPreview(null); setLogoMode("default") }}
                className={[
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-150 flex-1 justify-center z-10",
                  logoMode === "default" ? "text-gray-900" : "text-gray-500 hover:text-gray-900",
                ].join(" ")}
              >
                <ImageIcon size={16} strokeWidth={1.5} />
                Logo empresarial
              </button>
              <button
                type="button"
                onClick={() => setLogoMode("upload")}
                className={[
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-150 flex-1 justify-center z-10",
                  logoMode === "upload" ? "text-gray-900" : "text-gray-500 hover:text-gray-900",
                ].join(" ")}
              >
                <Upload size={16} strokeWidth={1.5} />
                Subir logo
              </button>
            </div>
            {logoMode === "upload" && !logoPreview ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/30 px-6 py-8 text-center transition-colors hover:border-gray-300 hover:bg-black/[0.02]">
                <Upload size={24} strokeWidth={1.5} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Sube tu logo aquí</p>
                  <p className="text-xs text-gray-400 mt-0.5">SVG o PNG · Se reemplazará el logo por defecto</p>
                </div>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/30 px-5 py-4">
                <div className="flex h-14 w-28 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-3">
                  <img
                    src={logoPreview || "/logos/zivelo-bars-dark-full.svg"}
                    alt="Logo"
                    className="max-h-10 max-w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Logotipo de Zivelo</p>
                  <p className="text-xs text-gray-500 mt-0.5">Se usará como imagen de marca en la cotización</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary color */}
        <div>
          <label htmlFor="primary-color" className="block text-sm font-medium text-gray-900 mb-1.5">
            Color primario
          </label>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden">
              <input
                type="color"
                id="primary-color"
                value={primaryColor}
                onChange={handleColorChange}
                className="w-14 h-14 -m-1 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 w-28 transition-shadow duration-200"
            />
          </div>
        </div>

        {/* Public quote preview */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Vista previa de cotización pública
          </p>
          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="p-5 flex items-center gap-4 border-b border-gray-100">
              <div className="w-20 h-10 shrink-0 flex items-center">
                <img
                  src={logoPreview || "/logos/zivelo-bars-dark-full.svg"}
                  alt="Logo"
                  className="max-h-8 max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold" style={{ color: primaryColor }}>
                  Propuesta · Proyecto Web
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  Cliente — Propuesta de servicios
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Preparado por <span style={{ color: primaryColor }}>{preparedBy}</span>
                  <span className="text-gray-400"> · Válido hasta 30 Jun 2026</span>
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-gray-100" />
              <div className="h-3 w-1/2 rounded-full bg-gray-100" />
              <div className="h-3 w-2/3 rounded-full bg-gray-100" />
              <div className="h-3 w-1/3 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <PrimaryButton type="button" onClick={handleSave}>
            Guardar cambios
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  )
}

// ── Section: Team ─────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  Owner: "#cc0000",
  Manager: "#2563eb",
  Editor: "#d97706",
  Viewer: "#9ca3af",
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
        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: ROLE_COLORS[value] ?? "#9ca3af" }} />
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
          "absolute top-full left-0 right-0 sm:right-auto mt-2 rounded-xl overflow-hidden z-50 min-w-[180px] bg-white/92 backdrop-blur-md border border-gray-200/80 shadow-lg transition-all duration-200 ease-in-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="listbox"
      >
        <div className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
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
              <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: ROLE_COLORS[opt] ?? "#9ca3af" }} />
              {opt}
            </span>
            {value === opt && (
              <Check size={16} strokeWidth={2} className="text-gray-400 shrink-0" />
            )}
          </button>
          ))}
        </div>
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
        className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {step === "form" ? "Añadir miembro" : "Invitación creada"}
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

function TeamSection() {
  const { user } = useAuth()
  if (!user) return null

  const [modalOpen, setModalOpen] = useState(false)
  const isOwner = user.role === "Owner"
  const members = useMemo(() => ALL_MEMBERS, [])

  return (
    <motion.div key="team" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los miembros del espacio de trabajo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton type="button" onClick={() => toast.info("Importación no disponible aún")}>
            Importar
          </SecondaryButton>
          <SecondaryButton type="button" onClick={() => toast.info("Exportación no disponible aún")}>
            Exportar
          </SecondaryButton>
          <PrimaryButton type="button" onClick={() => setModalOpen(true)}>
            Invitar usuario
          </PrimaryButton>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Los usuarios mostrados son datos de demostración. La funcionalidad de base de datos estará disponible próximamente.
      </p>

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
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: ROLE_COLORS[m.role] ?? "#9ca3af" }}>
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

// ── Section: Quote Actions ────────────────────────────────

function QuoteActionsSection() {
  const [allowApproval, setAllowApproval] = useState(true)
  const [allowWhatsApp, setAllowWhatsApp] = useState(true)
  const [allowPdf, setAllowPdf] = useState(true)

  function handleSave() {
    toast.success("Acciones de cotización actualizadas")
  }

  return (
    <motion.div key="quote-actions" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-semibold text-gray-900">Acciones de cotización</h1>
      <p className="text-sm text-gray-500 mt-1">Configura las acciones disponibles por defecto en las cotizaciones nuevas.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 space-y-5">
        <ToggleRow
          label="Permitir aprobación"
          description="El cliente podrá aprobar la cotización directamente desde la vista pública."
          checked={allowApproval}
          onChange={setAllowApproval}
        />
        <ToggleRow
          label="Permitir preguntas por WhatsApp"
          description="Mostrar un botón de WhatsApp para que el cliente haga preguntas sobre la cotización."
          checked={allowWhatsApp}
          onChange={setAllowWhatsApp}
        />
        <ToggleRow
          label="Permitir descarga de PDF"
          description="El cliente podrá descargar la cotización en formato PDF desde la vista pública."
          checked={allowPdf}
          onChange={setAllowPdf}
        />

        <div className="pt-2">
          <PrimaryButton type="button" onClick={handleSave}>
            Guardar cambios
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-gray-900" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
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

// ── NotForYou ───────────────────────────────────────────────

function NotForYou() {
  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4"
    >
      <p className="text-5xl mb-4">👀</p>
      <h2 className="text-lg font-semibold text-gray-900">Ups, no deberías estar viendo esto</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        O te perdiste, o andas de curioso. Cualquiera de las dos, mejor vuelve al dashboard.
      </p>
    </motion.div>
  )
}

// ── Settings Index (centered landing) ─────────────────────

const ALL_SECTION_META: { id: SectionId; label: string; icon: typeof User; description: string }[] = [
  { id: "general", label: "Información general", icon: Building2, description: "Nombre del negocio, moneda y contacto" },
  { id: "brand", label: "Marca", icon: Palette, description: "Logo, colores y apariencia de cotizaciones" },
  { id: "team", label: "Equipo", icon: Users, description: "Miembros y roles del espacio de trabajo" },
  { id: "quote-actions", label: "Acciones de cotización", icon: GripHorizontal, description: "Opciones por defecto en nuevas cotizaciones" },
  { id: "account", label: "Cuenta", icon: User, description: "Tu información personal" },
  { id: "security", label: "Seguridad", icon: Shield, description: "Inicio de sesión y seguridad de la cuenta" },
]

function SettingsIndex({ onSelect, role }: { onSelect: (id: SectionId) => void; role: string }) {
  const meta = role === "Owner" || role === "Manager"
    ? ALL_SECTION_META
    : role === "Viewer"
      ? ALL_SECTION_META.filter((s) => s.id !== "team" && s.id !== "quote-actions" && s.id !== "brand")
      : ALL_SECTION_META.filter((s) => s.id !== "team")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Ajustes</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Administra la información de tu negocio, tu marca y tus preferencias de cotización.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {meta.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={20} className="text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeSection = searchParams.get("section") as SectionId | null

  if (!user) return null

  function handleSelect(section: SectionId) {
    router.push(`/dashboard/settings?section=${section}`, { scroll: false })
  }

  function handleBack() {
    router.push("/dashboard/settings", { scroll: false })
  }

  return (
    <div className="flex flex-1 min-h-full gap-4 sm:gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full flex-col sm:flex-row">
      <SettingsNav
        user={user}
        activeSection={activeSection}
        onSelect={handleSelect}
        onBack={handleBack}
      />
      <div className="flex-1 min-w-0">
        {/* Mobile: show back arrow when a section is active */}
        {activeSection && (
          <div className="sm:hidden mb-4">
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver a ajustes
            </Link>
          </div>
        )}

        {/* Desktop: show "← Volver al dashboard" above the content */}
        <div className="hidden sm:block mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al dashboard
          </Link>
        </div>

        {activeSection === null && <SettingsIndex onSelect={handleSelect} role={user.role} />}

        <AnimatePresence mode="wait">
          {activeSection === "general" && <GeneralSection key="general" />}
          {activeSection === "brand" && user.role !== "Viewer" && <BrandSection key="brand" />}
          {activeSection === "brand" && user.role === "Viewer" && <NotForYou key="brand-no-perm" />}
          {activeSection === "team" && (user.role === "Owner" || user.role === "Manager") && (
            <TeamSection key="team" />
          )}
          {activeSection === "team" && user.role !== "Owner" && user.role !== "Manager" && (
            <NotForYou key="team-no-perm" />
          )}
          {activeSection === "quote-actions" && user.role !== "Viewer" && <QuoteActionsSection key="quote-actions" />}
          {activeSection === "quote-actions" && user.role === "Viewer" && (
            <NotForYou key="quote-actions-no-perm" />
          )}
          {activeSection === "account" && <AccountSection key="account" />}
          {activeSection === "security" && <SecuritySection key="security" />}
        </AnimatePresence>
      </div>
    </div>
  )
}
