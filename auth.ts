import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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
  },
  trustHost: true,
})
