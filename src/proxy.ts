import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 "proxy" (formerly middleware): a FAST, optimistic gate that sends
 * visitors without a session cookie to /signin before the page renders.
 *
 * It is deliberately not the only line of defence: every protected page also
 * calls requireSession() (lib/session.ts), which verifies the session server-side.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  signInUrl.searchParams.set("reason", "protected");
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
