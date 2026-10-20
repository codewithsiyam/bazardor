import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { mongoClient, mongoDb } from "@/lib/mongodb";
import { PASSWORD_MAX, PASSWORD_MIN, validateName } from "@/lib/validation";

/**
 * Better Auth server instance (email + password, optional Google / GitHub).
 *
 * Social providers are registered ONLY when their credentials exist in the
 * environment, so a button can never point at a provider that does not work.
 */

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const githubEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

/** Read by the sign-in / sign-up pages to decide which buttons to render. */
export const socialProviders = { google: googleEnabled, github: githubEnabled } as const;

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: "BazarDor",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: mongodbAdapter(mongoDb, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN,
    maxPasswordLength: PASSWORD_MAX,
    // The assignment requires: after a successful sign-up, go to the sign-in page.
    autoSignIn: false,
  },
  socialProviders: {
    ...(googleEnabled
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
    ...(githubEnabled
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
  databaseHooks: {
    user: {
      update: {
        // Server-side validation for profile updates: an invalid name aborts the write.
        before: async (user) => {
          if (typeof user.name === "string" && validateName(user.name)) return false;
          return true;
        },
      },
    },
  },
  // Must stay the LAST plugin: lets server actions / handlers set auth cookies.
  plugins: [nextCookies()],
});
