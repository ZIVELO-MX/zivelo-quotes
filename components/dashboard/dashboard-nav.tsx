"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  List,
  FilePlus,
  User,
  Shield,
  Building2,
  Palette,
  Users,
  Sliders,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User as UserType } from "@/lib/auth/auth-context"

// ── Types ─────────────────────────────────────────────────

interface NavLink {
  label: string
  href: string
  icon: typeof LayoutDashboard
  hiddenFor?: string[]
}

interface NavGroup {
  id: string
  label: string
  icon: typeof LayoutDashboard
  href?: string
  children?: NavLink[]
}

// ── Nav structure ─────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    id: "resumen",
    label: "Resumen",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "cotizaciones",
    label: "Cotizaciones",
    icon: FileText,
    children: [
      { label: "Todas", href: "/dashboard/quotes", icon: List },
      { label: "Nueva cotización", href: "/dashboard/quotes/new", icon: FilePlus, hiddenFor: ["Viewer"] },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    children: [
      { label: "Cuenta", href: "/dashboard/settings?section=account", icon: User },
      { label: "Seguridad", href: "/dashboard/settings?section=security", icon: Shield },
      { label: "Información general", href: "/dashboard/settings?section=general", icon: Building2 },
      { label: "Marca", href: "/dashboard/settings?section=brand", icon: Palette, hiddenFor: ["Viewer"] },
      { label: "Equipo", href: "/dashboard/settings?section=team", icon: Users, hiddenFor: ["Editor", "Viewer"] },
      { label: "Acciones", href: "/dashboard/settings?section=quote-actions", icon: Sliders, hiddenFor: ["Viewer"] },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase()
}

function isGroupActive(group: NavGroup, pathname: string): boolean {
  if (group.href) {
    return group.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(group.href)
  }
  return (group.children ?? []).some((child) =>
    pathname.startsWith(child.href.split("?")[0])
  )
}

// Checks both pathname and query params so only the exact settings section is active.
function isChildActive(childHref: string, pathname: string, searchParams: URLSearchParams): boolean {
  const [path, query] = childHref.split("?")
  if (!pathname.startsWith(path)) return false
  if (!query) return true
  const childParams = new URLSearchParams(query)
  for (const [key, value] of childParams.entries()) {
    if (searchParams.get(key) !== value) return false
  }
  return true
}

// ── NavContent (shared between desktop sidebar and mobile Sheet) ──

export function NavContent({
  user,
  onNavigate,
}: {
  user: UserType
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { logout } = useAuth()

  const initialExpanded = NAV_GROUPS.reduce<Record<string, boolean>>((acc, group) => {
    if (group.children) {
      acc[group.id] = isGroupActive(group, pathname)
    }
    return acc
  }, {})

  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded)

  function toggleGroup(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleLogout() {
    logout()
    router.replace("/dashboard/login")
  }

  const initials = getInitials(user.name)

  return (
    <div className="flex flex-col h-full">
      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        {NAV_GROUPS.map((group) => {
          const Icon = group.icon

          // Direct link (no children)
          if (group.href) {
            const active = pathname === group.href
            return (
              <Link
                key={group.id}
                href={group.href}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="size-[18px] shrink-0" />
                {group.label}
              </Link>
            )
          }

          // Collapsible group
          const groupActive = isGroupActive(group, pathname)
          const isOpen = expanded[group.id] ?? false
          const visibleChildren = (group.children ?? []).filter(
            (child) => !child.hiddenFor?.includes(user.role)
          )

          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer ${
                  groupActive && !isOpen
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="flex-1">{group.label}</span>
                {isOpen ? (
                  <ChevronDown className="size-3.5 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0 text-gray-400" />
                )}
              </button>

              {isOpen && visibleChildren.length > 0 && (
                <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                  {visibleChildren.map((child) => {
                    const ChildIcon = child.icon
                    const childActive = isChildActive(child.href, pathname, searchParams)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-2 pl-6 pr-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          childActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <ChildIcon className="size-3.5 shrink-0" />
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer: user info + logout */}
      <div className="p-2 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-0.5">
          <Avatar className="size-7 shrink-0">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-[10px] bg-gray-900 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 truncate leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-500 truncate leading-tight">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 w-full text-left cursor-pointer"
        >
          <LogOut className="size-[18px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// ── DashboardNav: desktop sticky sidebar ──────────────────

export function DashboardNav({ user }: { user: UserType }) {
  return (
    <aside className="w-56 shrink-0 hidden sm:flex flex-col sticky top-14 self-start max-h-[calc(100vh-3.5rem)]">
      <div className="bg-white border border-gray-100 rounded-2xl m-3 flex flex-col overflow-y-auto" style={{ maxHeight: "calc(100vh - 3.5rem - 1.5rem)" }}>
        <NavContent user={user} />
      </div>
    </aside>
  )
}
