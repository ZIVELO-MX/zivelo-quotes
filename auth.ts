import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { scryptSync } from "crypto"
import { prisma } from "@/lib/prisma"

function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const attempt = scryptSync(plain, salt, 64).toString("hex")
  return attempt === hash
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email o usuario", type: "text" },
        password:   { label: "Contraseña",      type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier as string | undefined
        const password   = credentials?.password   as string | undefined
        if (!identifier || !password) return null

        const user = await prisma.user.findFirst({
          where: { email: identifier.trim().toLowerCase() },
        })
        if (!user?.passwordHash) return null
        if (!verifyPassword(password, user.passwordHash)) return null

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: null,
        }
      },
    }),
    {
      id: "zoho",
      name: "Zoho",
      type: "oidc",
      issuer: "https://accounts.zoho.com",
      clientId: process.env.ZOHO_CLIENT_ID!,
      clientSecret: process.env.ZOHO_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
      profile(profile: Record<string, unknown>) {
        return {
          id: String(profile.sub ?? profile.ZSOID ?? profile.email ?? ""),
          name: String(
            profile.name ??
            profile.display_name ??
            profile.First_Name ??
            profile.email ??
            ""
          ),
          email: String(profile.email ?? ""),
          image: null,
        }
      },
    },
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) {
        const ownerEmails = (process.env.OWNER_EMAILS ?? "")
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean)
        token.role = ownerEmails.includes(user.email) ? "Owner" : "Manager"
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role ?? "Manager"
      }
      return session
    },
  },
  pages: {
    signIn: "/dashboard/login",
    error:  "/dashboard/error",
  },
  trustHost: true,
})
