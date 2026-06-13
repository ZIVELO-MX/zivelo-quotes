import type { NextAuthConfig } from "next-auth"

/**
 * Edge-safe auth configuration — no Node.js modules (crypto, prisma).
 * Imported by middleware.ts. The full config lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/dashboard/login",
    error:  "/dashboard/error",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role ?? "Manager"
        ;(session.user as Record<string, unknown>).mustChangePassword =
          token.mustChangePassword ?? false
      }
      return session
    },
  },
  trustHost: true,
}
