"use client"

import { User, Building2, Users, Shield } from "lucide-react"
import type { User as UserType } from "@/lib/auth/auth-context"

export type SectionId = "profile" | "workspace" | "users" | "security"

interface Section {
  id: SectionId
  label: string
  icon: typeof User
}

const ALL_SECTIONS: Section[] = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "workspace", label: "Espacio de trabajo", icon: Building2 },
  { id: "users", label: "Usuarios y permisos", icon: Users },
  { id: "security", label: "Seguridad", icon: Shield },
]

function getVisibleSections(role: string): Section[] {
  if (role === "Owner" || role === "Manager") return ALL_SECTIONS
  return ALL_SECTIONS.filter((s) => s.id !== "users")
}

interface AppSidebarProps {
  active: SectionId
  onSelect: (id: SectionId) => void
  user: UserType
}

export function AppSidebar({ active, onSelect, user }: AppSidebarProps) {
  const sections = getVisibleSections(user.role)

  return (
    <aside className="w-56 shrink-0">
      <div className="bg-white border border-gray-100 rounded-2xl p-2 sticky top-24">
        <div className="px-3 pt-1 pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Ajustes
          </p>
        </div>
        <nav className="flex flex-col gap-0.5">
          {sections.map((s) => {
            const Icon = s.icon
            const isActive = active === s.id
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
        </nav>
      </div>
    </aside>
  )
}
