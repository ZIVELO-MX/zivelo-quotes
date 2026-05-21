"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? ""

  function handleLogout() {
    logout()
    router.replace("/dashboard/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex-shrink-0 flex items-center"
            aria-label="Zivelo home"
          >
            <Image
              src="/logos/zivelo-bars-dark-full.svg"
              alt="Zivelo"
              width={110}
              height={30}
              priority
              className="object-contain"
              style={{ height: "auto" }}
            />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {user.role !== "Viewer" && (
              <Link
                href="/dashboard/quotes/new"
                className="rounded-md px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Nueva cotización
              </Link>
            )}
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Cotizaciones
            </Link>
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 sm:gap-3 rounded-full sm:rounded-xl outline-none cursor-pointer transition-all duration-200 sm:hover:bg-black/[0.03] sm:data-[state=open]:bg-black/[0.03] hover:ring-2 hover:ring-border-strong sm:hover:ring-0 data-[state=open]:ring-2 data-[state=open]:ring-accent/20 sm:data-[state=open]:ring-0 sm:px-3 sm:py-1.5 sm:-mr-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-foreground-dim leading-tight">{user.email}</p>
              </div>
              <ChevronDownIcon className="size-3.5 text-foreground-dim shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={() => router.push("/profile")} className="cursor-pointer">
              <UserIcon className="size-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout} className="text-red-600 hover:text-red-600 focus:text-red-600 cursor-pointer">
              <LogOutIcon className="size-4 text-red-600" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
