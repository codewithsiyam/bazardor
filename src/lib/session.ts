import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side session verification. This reads the session from the database
 * through Better Auth – the mere presence of a cookie is never trusted.
 */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export type ServerSession = NonNullable<Awaited<ReturnType<typeof getServerSession>>>;

/**
 * Use at the top of every protected Server Component. Logged-out visitors are
 * sent to /signin (with a callbackUrl so they return afterwards). A database
 * failure is NOT treated as "logged out": it surfaces in app/error.tsx instead.
 */
export async function requireSession(callbackPath: string): Promise<ServerSession> {
  const session = await getServerSession();
  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(callbackPath)}&reason=protected`);
  }
  return session;
}
