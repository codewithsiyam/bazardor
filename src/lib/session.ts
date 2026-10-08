import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Real (server-side) protection: validates the session in the DB, not just "a cookie exists". */
export async function requireSession(nextPath: string) {
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(nextPath)}&reason=protected`);
  return session;
}
