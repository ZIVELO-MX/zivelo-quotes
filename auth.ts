import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "zoho",
      name: "Zoho",
      type: "oauth",
      authorization: {
        url: "https://accounts.zoho.com/oauth/v2/auth",
        params: { scope: "email profile" },
      },
      token: "https://accounts.zoho.com/oauth/v2/token",
      userinfo: "https://accounts.zoho.com/oauth/v2/userinfo",
      clientId: process.env.ZOHO_CLIENT_ID!,
      clientSecret: process.env.ZOHO_CLIENT_SECRET!,
      profile(profile: Record<string, unknown>) {
        return {
          id: String(profile.ZSOID ?? profile.sub ?? profile.email ?? ""),
          name: String(
            profile.display_name ??
            profile.First_Name ??
            profile.name ??
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
