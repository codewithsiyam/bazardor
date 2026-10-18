import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic gate: sends visitors without a session cookie to /signin before the page renders.
 * This is NOT the security boundary — the protected pages verify the session on the server
 * (see lib/session.ts) because a cookie's mere existence proves nothing.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const url = new URL("/signin", request.url);
  url.searchParams.set("callbackUrl", `${pathname}${search}`);
  url.searchParams.set("reason", "login-required");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
