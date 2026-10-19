import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Handles every Better Auth endpoint: /api/auth/sign-in/email, /sign-up/email,
// /get-session, /update-user, /callback/google, /callback/github, ...
export const { GET, POST } = toNextJsHandler(auth);
