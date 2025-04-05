import { betterFetch } from "@better-fetch/fetch"
import { NextResponse } from "next/server"

export default async function authMiddleware(request) {
  const { pathname, searchParams } = request.nextUrl

  if (searchParams.get("error") === "token_expired") {
    if (pathname !== "/signin") {
      return NextResponse.redirect(
        new URL("/signin?reason=token_expired", request.url),
      )
    }

    return NextResponse.next()
  }

  const { data: session } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/get-session`,
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  )

  if (
    !session &&
    (pathname.startsWith("/user") || pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(
      new URL("/signin?reason=not-authenticated", request.url),
    )
  }

  if (pathname.startsWith("/admin")) {
    const userRole = session.user.role
    const has2FA = session.user.hasTwoFactorEnabled

    const allowedRoles = ["admin", "superadmin", "support"]

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (!has2FA) {
      return NextResponse.redirect(
        new URL("/user/account-management?reason=2FArequired", request.url),
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
