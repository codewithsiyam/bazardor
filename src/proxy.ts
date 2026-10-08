import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * First line of defence (runs before the page renders): no session cookie -> /signin.
 * This is only an optimistic check; pages still call requireSession() to verify it for real.
 */
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    url.searchParams.set("reason", "protected");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/product/:path*", "/profile/:path*"] };
