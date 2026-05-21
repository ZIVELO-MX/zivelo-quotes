"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  Settings,
} from "lucide-react"
import type { User as UserType } from "@/lib/auth/auth-context"

interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

const NAV_ITEMS: NavItem[] = [
  { label: "Resumen", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cotizaciones", href: "/dashboard/quotes", icon: FileText },
  { label: "Ajustes", href: "/dashboard/settings", icon: Settings },
]

function getVisibleItems(_role: string): NavItem[] {
  return NAV_ITEMS
}

export function DashboardNav({ user }: { user: UserType }) {
  const pathname = usePathname()
  const items = getVisibleItems(user.role)

  function isActive(item: NavItem): boolean {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="w-56 shrink-0 hidden sm:block">
      <div className="bg-white border border-gray-100 rounded-2xl p-2 sticky top-24">
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="size-[18px] shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
