import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export type RequireUserResult = { state: "ok"; user: SessionUser } | { state: "unavailable" };

/**
 * Server-side session check (validates the session against the database — not just the cookie).
 * Redirects to /signin when logged out; reports "unavailable" if the auth backend cannot be reached.
 */
export async function requireUser(returnTo: string): Promise<RequireUserResult> {
  let user: SessionUser | null = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      };
    }
  } catch (error) {
    console.error("[bazardor] session check failed:", error instanceof Error ? error.message : "unknown error");
    return { state: "unavailable" };
  }

  if (!user) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(returnTo)}&reason=login-required`);
  }
  return { state: "ok", user };
}
