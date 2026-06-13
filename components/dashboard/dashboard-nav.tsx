"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronDown,
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
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { User as UserType } from "@/lib/auth/auth-context"

// ── Types ─────────────────────────────────────────────────

interface NavLink {
  label: string
  href: string
  icon: typeof LayoutDashboard
  hiddenFor?: string[]
  isActive: (pathname: string, searchParams: URLSearchParams) => boolean
}

interface NavGroup {
  id: string
  label: string
  icon: typeof LayoutDashboard
  /** Direct link — no children */
  href?: string
  isActive?: (pathname: string) => boolean
  /** Collapsed shortcut href (what to link to when sidebar is collapsed) */
  collapsedHref?: string
  children?: NavLink[]
}

// ── Nav structure ─────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    id: "resumen",
    label: "Resumen",
    icon: LayoutDashboard,
    href: "/dashboard",
    isActive: (p) => p === "/dashboard",
  },
  {
    id: "cotizaciones",
    label: "Cotizaciones",
    icon: FileText,
    collapsedHref: "/dashboard/quotes",
    children: [
      {
        label: "Todas",
        href: "/dashboard/quotes",
        icon: List,
        // Active for all quote pages EXCEPT /new
        isActive: (p) =>
          p.startsWith("/dashboard/quotes") && !p.startsWith("/dashboard/quotes/new"),
      },
      {
        label: "Nueva cotización",
        href: "/dashboard/quotes/new",
        icon: FilePlus,
        hiddenFor: ["Viewer"],
        isActive: (p) => p === "/dashboard/quotes/new",
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    collapsedHref: "/dashboard/settings",
    children: [
      {
        label: "Cuenta",
        href: "/dashboard/settings?section=account",
        icon: User,
        isActive: (p, s) =>
          p.startsWith("/dashboard/settings") && s.get("section") === "account",
      },
      {
        label: "Seguridad",
        href: "/dashboard/settings?section=security",
        icon: Shield,
        isActive: (p, s) =>
          p.startsWith("/dashboard/settings") && s.get("section") === "security",
      },
      {
        label: "Información general",
        href: "/dashboard/settings?section=general",
        icon: Building2,
        isActive: (p, s) =>
          p.startsWith("/dashboard/settings") && s.get("section") === "general",
      },
      {
        label: "Marca",
        href: "/dashboard/settings?section=brand",
        icon: Palette,
        hiddenFor: ["Viewer"],
        isActive: (p, s) =>
          p.startsWith("/dashboard/settings") && s.get("section") === "brand",
      },
      {
        label: "Equipo",
        href: "/dashboard/settings?section=team",
        icon: Users,
        hiddenFor: ["Editor", "Viewer"],
        isActive: (p, s) =>
          p.startsWith("/dashboard/settings") && s.get("section") === "team",
      },
      {
        label: "Acciones",
        href: "/dashboard/settings?section=quote-actions",
        icon: Sliders,
        hiddenFor: ["Viewer"],
        isActive: (p, s) =>
          p.startsWith("/dashboard/settings") && s.get("section") === "quote-actions",
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase()
}

function isGroupActive(group: NavGroup, pathname: string): boolean {
  if (group.isActive) return group.isActive(pathname)
  if (group.href) return pathname.startsWith(group.href)
  return (group.children ?? []).some((c) => c.isActive(pathname, new URLSearchParams()))
}

// ── NavContent (shared with mobile Sheet) ─────────────────

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

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    NAV_GROUPS.reduce<Record<string, boolean>>((acc, g) => {
      if (g.children) acc[g.id] = isGroupActive(g, pathname)
      return acc
    }, {})
  )

  function handleLogout() {
    logout()
    router.replace("/dashboard/login")
  }

  const initials = getInitials(user.name)

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_GROUPS.map((group) => {
          const Icon = group.icon

          if (group.href) {
            const active = group.isActive?.(pathname) ?? pathname === group.href
            return (
              <Link
                key={group.id}
                href={group.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                {group.label}
              </Link>
            )
          }

          const visibleChildren = (group.children ?? []).filter(
            (c) => !c.hiddenFor?.includes(user.role)
          )
          const groupActive = isGroupActive(group, pathname)
          const isOpen = openGroups[group.id] ?? false

          return (
            <Collapsible
              key={group.id}
              open={isOpen}
              onOpenChange={(open) =>
                setOpenGroups((prev) => ({ ...prev, [group.id]: open }))
              }
            >
              <CollapsibleTrigger
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left cursor-pointer",
                  groupActive && !isOpen
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="flex-1">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-gray-400 transition-transform duration-200",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-0.5 mt-0.5">
                {visibleChildren.map((child) => {
                  const ChildIcon = child.icon
                  const active = child.isActive(pathname, searchParams)
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 pl-6 pr-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        active
                          ? "bg-gray-900 text-white"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <ChildIcon className="size-3.5 shrink-0" />
                      {child.label}
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 shrink-0">
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
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="size-[18px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// ── Collapsed icon-only nav ────────────────────────────────

function CollapsedNav({ user, onExpand }: { user: UserType; onExpand: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const initials = getInitials(user.name)

  const topLinks = NAV_GROUPS.map((g) => ({
    icon: g.icon,
    label: g.label,
    href: g.href ?? g.collapsedHref ?? "/dashboard",
    isActive: g.isActive
      ? (p: string) => g.isActive!(p)
      : (p: string) => (g.href ? p === g.href : p.startsWith(g.collapsedHref ?? "")),
  }))

  return (
    <div className="flex flex-col h-full items-center">
      <nav className="flex-1 flex flex-col items-center gap-1 py-3 w-full px-2">
        {topLinks.map(({ icon: Icon, label, href, isActive }) => {
          const active = isActive(pathname)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="size-[18px]" />
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 flex flex-col items-center gap-1 pb-3 w-full px-2 border-t border-gray-100 pt-2">
        <button
          title={user.name}
          onClick={onExpand}
          className="flex items-center justify-center w-full"
        >
          <Avatar className="size-8">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-[10px] bg-gray-900 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
        <button
          type="button"
          title="Cerrar sesión"
          onClick={() => { logout(); router.replace("/dashboard/login") }}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="size-[18px]" />
        </button>
      </div>
    </div>
  )
}

// ── DashboardNav ──────────────────────────────────────────

const EXPANDED_W = 224
const COLLAPSED_W = 64

export function DashboardNav({ user }: { user: UserType }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="hidden sm:flex flex-col h-screen shrink-0 bg-white border-r border-gray-100 overflow-hidden z-20"
    >
      {/* Toggle button row */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-gray-100 shrink-0 px-3",
          collapsed ? "justify-center" : "justify-end"
        )}
      >
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChevronLeft className="size-4" />
          </motion.div>
        </button>
      </div>

      {/* Nav content */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <CollapsedNav user={user} onExpand={() => setCollapsed(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <NavContent user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
