import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { authConfigured, missingAuthEnv } from "./env";

/** Current session, or null when signed out. Also null (with a server log) when auth env vars are missing. */
export async function getSession() {
  if (!authConfigured()) {
    console.error(`[auth] Missing environment variables: ${missingAuthEnv().join(", ")}. Sessions are disabled.`);
    return null;
  }
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    // e.g. MongoDB unreachable: treat as signed out instead of crashing the page.
    console.error("[auth] getSession failed:", error);
    return null;
  }
}

/** Real (server-side) protection: validates the session in the DB, not just "a cookie exists". */
export async function requireSession(nextPath: string) {
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(nextPath)}&reason=protected`);
  return session;
}
