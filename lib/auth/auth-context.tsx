"use client"

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

export interface OrgData {
  name: string
  slug: string
  branding: {
    primaryColor: string
    logo: string
  }
}

export interface User {
  email: string
  username: string
  name: string
  avatar: string
  role: string
  organization: OrgData
}

const ZIVELO_ORG: OrgData = {
  name: "Zivelo Studio",
  slug: "zivelo",
  branding: {
    primaryColor: "#cc0000",
    logo: "/logos/zivelo-bars-dark-full.svg",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export function useAuth() {
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        email: session.user.email ?? "",
        username: (session.user.email ?? "").split("@")[0],
        name: session.user.name ?? "",
        avatar: session.user.image ?? "",
        role: (session.user as { role?: string }).role ?? "Manager",
        organization: ZIVELO_ORG,
      }
    : null

  return {
    user,
    isLoading: status === "loading",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: (_identifier?: string, _password?: string): { success: boolean; error?: string } => {
      signIn("zoho", { callbackUrl: "/dashboard" })
      return { success: true }
    },
    logout: () => {
      signOut({ callbackUrl: "/dashboard/login" })
    },
    updateUser: (_data: Partial<Pick<User, "name" | "avatar">>) => {
      // Profile updates deferred to v0.5.0 (org + user DB model)
    },
  }
}
