import { APIError, createAuthMiddleware } from "better-auth/api";

/**
 * With `autoSignIn: false` BetterAuth answers a duplicate sign-up with a *fake success* (to avoid
 * revealing which emails exist). The assignment needs a clear "email already used" error instead,
 * so we check for an existing user before the sign-up endpoint runs.
 */
export const signUpHooks = {
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path !== "/sign-up/email") return;
    const body = ctx.body as { email?: unknown } | undefined;
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email) return;
    const existing = await ctx.context.internalAdapter.findUserByEmail(email);
    if (existing?.user) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি করা আছে",
        code: "USER_ALREADY_EXISTS",
      });
    }
  }),
};
