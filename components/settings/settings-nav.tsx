"use client"

import {
  ArrowLeft,
  ChevronRight,
  User,
  Shield,
  Building2,
  Users,
  Palette,
  GripHorizontal,
  Settings2,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import type { User as UserType } from "@/lib/auth/auth-context"

export type SectionId = "general" | "brand" | "team" | "quote-actions" | "account" | "security"

interface Section {
  id: SectionId
  label: string
  icon: typeof User
}

interface SettingsNavProps {
  user: UserType
  activeSection: SectionId | null
  onSelect: (section: SectionId) => void
  onBack: () => void
}

const ALL_SECTIONS: Section[] = [
  { id: "account", label: "Cuenta", icon: User },
  { id: "security", label: "Seguridad", icon: Shield },
  { id: "general", label: "Información general", icon: Building2 },
  { id: "brand", label: "Marca", icon: Palette },
  { id: "team", label: "Equipo", icon: Users },
  { id: "quote-actions", label: "Acciones", icon: GripHorizontal },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function getVisibleSections(role: string): Section[] {
  if (role === "Owner" || role === "Manager") return ALL_SECTIONS
  if (role === "Viewer") return ALL_SECTIONS.filter((s) => s.id !== "team" && s.id !== "quote-actions" && s.id !== "brand")
  return ALL_SECTIONS.filter((s) => s.id !== "team")
}

// ── Desktop Sidebar ─────────────────────────────────────────

function DesktopSidebar({
  activeSection,
  onSelect,
  sections,
}: {
  activeSection: SectionId | null
  onSelect: (id: SectionId) => void
  sections: Section[]
}) {
  return (
    <aside className="w-56 shrink-0 hidden sm:block">
      <div className="bg-white border border-gray-100 rounded-2xl p-2 sticky top-24">
        <div className="px-3 pt-1 pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Ajustes
          </p>
        </div>
        <nav className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-1">
            Personales
          </p>
          <div className="flex flex-col gap-0.5">
            {sections.filter((s) => ["account", "security"].includes(s.id)).map((s) => {
              const Icon = s.icon
              const isActive = activeSection === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="size-[18px] shrink-0" />
                  {s.label}
                </button>
              )
            })}
          </div>

          {sections.filter((s) => ["general", "brand", "team", "quote-actions"].includes(s.id)).length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-1 mt-3">
                Workspace
              </p>
              <div className="flex flex-col gap-0.5">
                {sections.filter((s) => ["general", "brand", "team", "quote-actions"].includes(s.id)).map((s) => {
                  const Icon = s.icon
                  const isActive = activeSection === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelect(s.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="size-[18px] shrink-0" />
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}

// ── Mobile Detail Header ────────────────────────────────────

function MobileDetailHeader({
  section,
  onBack,
}: {
  section: Section
  onBack: () => void
}) {
  const Icon = section.icon
  return (
    <div className="sm:hidden flex items-center gap-3 px-1 py-2">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Volver a ajustes"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </button>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="size-[18px] text-gray-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{section.label}</h1>
      </div>
    </div>
  )
}

// ── Mobile Settings Index ───────────────────────────────────

function MobileSettingsIndex({
  user,
  onSelect,
  sections,
}: {
  user: UserType
  onSelect: (id: SectionId) => void
  sections: Section[]
}) {
  const initials = getInitials(user.name)

  const accountSections = sections.filter((s) =>
    ["account", "security"].includes(s.id)
  )
  const workspaceSections = sections.filter((s) =>
    ["general", "brand", "team", "quote-actions"].includes(s.id)
  )

  function NavRow({ section }: { section: Section }) {
    const Icon = section.icon
    return (
      <button
        type="button"
        onClick={() => onSelect(section.id)}
        className="flex items-center gap-3 w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <Icon className="size-[18px] text-gray-600" />
        </div>
        <span className="flex-1 text-left font-medium">{section.label}</span>
        <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300 shrink-0" />
      </button>
    )
  }

  return (
    <div className="sm:hidden">
      <div className="px-1 pt-2 pb-3">
        <h1 className="text-lg font-semibold text-gray-900">Ajustes</h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-3">
        <div className="flex items-center gap-3 px-1 py-2">
          <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1 pb-1">
          Personales
        </p>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {accountSections.map((s, i) => (
            <div key={s.id} className={i > 0 ? "border-t border-gray-100" : ""}>
              <NavRow section={s} />
            </div>
          ))}
        </div>
      </div>

      {workspaceSections.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1 pb-1">
            Workspace
          </p>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {workspaceSections.map((s, i) => (
              <div key={s.id} className={i > 0 ? "border-t border-gray-100" : ""}>
                <NavRow section={s} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main SettingsNav ────────────────────────────────────────

export function SettingsNav({
  user,
  activeSection,
  onSelect,
  onBack,
}: SettingsNavProps) {
  const isMobile = useIsMobile()
  const sections = getVisibleSections(user.role)

  // On desktop the persistent sidebar (DashboardNav) handles navigation;
  // SettingsNav only renders on mobile.
  if (!isMobile) return null

  if (activeSection) {
    const section = sections.find((s) => s.id === activeSection)
    if (!section) return null
    return <MobileDetailHeader section={section} onBack={onBack} />
  }
  return (
    <MobileSettingsIndex user={user} onSelect={onSelect} sections={sections} />
  )
}
