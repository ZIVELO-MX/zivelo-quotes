"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  MenuIcon,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavContent } from "@/components/dashboard/dashboard-nav"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (!user) return null

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? ""

  function handleLogout() {
    logout()
    router.replace("/dashboard/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <button
                className="sm:hidden w-8 h-8 flex items-center justify-center rounded-md hover:bg-background-secondary transition-colors cursor-pointer"
                aria-label="Abrir menú de navegación"
              >
                <MenuIcon size={18} className="text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 px-5 h-14 border-b border-border shrink-0">
                  <Image
                    src="/logos/zivelo-bars-dark-full.svg"
                    alt="Zivelo"
                    width={100}
                    height={28}
                    priority
                    className="object-contain"
                    style={{ height: "auto" }}
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  <NavContent
                    user={user}
                    onNavigate={() => setMobileNavOpen(false)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 sm:gap-3 rounded-full sm:rounded-xl outline-none cursor-pointer transition-all duration-200 sm:hover:bg-black/[0.03] sm:data-[state=open]:bg-black/[0.03] hover:ring-2 hover:ring-border-strong sm:hover:ring-0 data-[state=open]:ring-2 data-[state=open]:ring-accent/20 sm:data-[state=open]:ring-0 sm:px-3 sm:py-1.5 sm:-mr-3">
              <Avatar className="size-8">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="text-xs bg-gray-900 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-foreground-dim leading-tight">{user.email}</p>
              </div>
              <ChevronDownIcon className="size-3.5 text-foreground-dim shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={() => router.push("/dashboard/settings")} className="cursor-pointer">
              <UserIcon className="size-4" />
              Ajustes
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
