"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { MinimalFooter } from "@/components/layout/minimal-footer"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isEditQuote = pathname.startsWith("/dashboard/quotes/") && pathname.endsWith("/edit")
  const showNav =
    pathname !== "/dashboard/login" &&
    pathname !== "/dashboard/settings" &&
    pathname !== "/dashboard/quotes/new" &&
    !isEditQuote

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        {showNav && <DashboardNav user={user} />}
        <main className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12, ease: "easeIn" } }}
              className="flex-1 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MinimalFooter />
    </div>
  )
}
