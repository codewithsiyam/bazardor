import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { signUpHooks } from "./auth-hooks";
import { appOrigin, enabledProviders } from "./env";

/**
 * Server-side BetterAuth instance. Users/sessions live in MongoDB (MONGODB_URI).
 * MongoClient connects lazily, so importing this at build time is safe. If MONGODB_URI /
 * BETTER_AUTH_SECRET are missing, the API route and getSession() refuse to use this instance
 * (see lib/env.ts), so the placeholders below are never used to authenticate anyone.
 */
const globalForMongo = globalThis as unknown as { _mongo?: MongoClient };
const client =
  globalForMongo._mongo ?? new MongoClient(process.env.MONGODB_URI?.trim() || "mongodb://127.0.0.1:27017", {
    // Fail fast (instead of hanging ~30s) when the URI, password or Atlas IP allow-list is wrong.
    serverSelectionTimeoutMS: 8000,
  });
if (process.env.NODE_ENV !== "production") globalForMongo._mongo = client;

const providers = enabledProviders();
const socialProviders = {
  ...(providers.google
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! } }
    : {}),
  ...(providers.github
    ? { github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! } }
    : {}),
};

const origin = appOrigin();
const vercelPreview = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

export const auth = betterAuth({
  // No { client } option on purpose: that enables MongoDB transactions, which fail on standalone
  // (non-replica-set) local MongoDB. Plain db access works on Atlas and local instances alike.
  database: mongodbAdapter(client.db(process.env.MONGODB_DB?.trim() || "bazardor")),
  baseURL: origin,
  secret: process.env.BETTER_AUTH_SECRET?.trim() || "unconfigured-secret-never-used-see-lib-env",
  trustedOrigins: [origin, vercelPreview].filter((o): o is string => Boolean(o)),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // The assignment sends new users to /signin after sign-up, so don't auto-log them in.
    autoSignIn: false,
    // No email verification and no forgot-password flow (assignment note).
    requireEmailVerification: false,
  },
  socialProviders,
  hooks: signUpHooks,
  // nextCookies must be the LAST plugin: lets server actions/components set auth cookies.
  plugins: [nextCookies()],
});
