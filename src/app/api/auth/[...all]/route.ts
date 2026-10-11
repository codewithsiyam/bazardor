import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { authConfigured, missingAuthEnv } from "@/lib/env";

const handlers = toNextJsHandler(auth);

/** Clear JSON error (instead of an opaque 500) when the deployment is missing its auth environment variables. */
function notConfigured() {
  console.error(`[auth] Missing environment variables: ${missingAuthEnv().join(", ")}`);
  return Response.json(
    { message: "লগইন সিস্টেম এখনো কনফিগার করা হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।", code: "AUTH_NOT_CONFIGURED" },
    { status: 503 },
  );
}

export const GET = (req: Request) => (authConfigured() ? handlers.GET(req) : notConfigured());
export const POST = (req: Request) => (authConfigured() ? handlers.POST(req) : notConfigured());
