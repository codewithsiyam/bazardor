import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(
    "[bazardor] MONGODB_URI is not set. Add it to .env.local (or Vercel → Environment Variables); sign-in/sign-up will fail until then.",
  );
}

// Re-use one client across hot reloads in development.
const globalForMongo = globalThis as unknown as { __bazardorMongo?: MongoClient };
const client =
  globalForMongo.__bazardorMongo ??
  new MongoClient(uri ?? "mongodb://127.0.0.1:27017", {
    appName: "bazardor",
    serverSelectionTimeoutMS: 8000,
  });
if (process.env.NODE_ENV !== "production") globalForMongo.__bazardorMongo = client;

const db = client.db(process.env.MONGODB_DB || undefined);

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;

// Providers are registered only when fully configured.
const socialProviders = {
  ...(googleId && googleSecret ? { google: { clientId: googleId, clientSecret: googleSecret } } : {}),
  ...(githubId && githubSecret ? { github: { clientId: githubId, clientSecret: githubSecret } } : {}),
};

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: "বাজার দর",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // The assignment sends the user to the Sign In page after registration,
    // so registration must not create a session by itself.
    autoSignIn: false,
  },
  socialProviders,
  trustedOrigins,
});
