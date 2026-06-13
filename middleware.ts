import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const path = req.nextUrl.pathname

  const isLogin        = path.startsWith("/dashboard/login")
  const isError        = path.startsWith("/dashboard/error")
  const isChangePwd    = path.startsWith("/dashboard/change-password")
  const isDashboard    = path.startsWith("/dashboard") && !isLogin && !isError

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/login", req.nextUrl))
  }

  const user = req.auth?.user as { mustChangePassword?: boolean } | undefined
  if (isDashboard && isLoggedIn && user?.mustChangePassword && !isChangePwd) {
    return NextResponse.redirect(new URL("/dashboard/change-password", req.nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
