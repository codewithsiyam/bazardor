import { mongoClient } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * Development-only diagnostics: open http://localhost:3000/api/health to see
 * whether the environment variables are present and MongoDB answers a ping.
 * Secret values are never returned. Disabled (404) in production.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const env = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI?.trim()),
    BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET?.trim()),
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? null,
  };

  let mongo: { status: "ok" } | { status: "error"; name: string; message: string };
  try {
    await mongoClient.db(process.env.MONGODB_DB_NAME?.trim() || undefined).command({ ping: 1 });
    mongo = { status: "ok" };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    mongo = {
      status: "error",
      name: err.name,
      // Strip anything that looks like a connection string, just in case.
      message: err.message.replace(/mongodb(\+srv)?:\/\/\S+/gi, "[connection string hidden]").slice(0, 300),
    };
  }

  return Response.json({ env, mongo });
}
