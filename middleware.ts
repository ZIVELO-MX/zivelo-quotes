import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const path = req.nextUrl.pathname
  const isDashboard =
    path.startsWith("/dashboard") && !path.startsWith("/dashboard/login")

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/login", req.nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
