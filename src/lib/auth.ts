import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

/**
 * Server-side BetterAuth instance. Users/sessions live in MongoDB (MONGODB_URI).
 * MongoClient connects lazily, so importing this at build time is safe.
 */
const globalForMongo = globalThis as unknown as { _mongo?: MongoClient };
const client =
  globalForMongo._mongo ?? new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017");
if (process.env.NODE_ENV !== "production") globalForMongo._mongo = client;

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? { github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET } }
    : {}),
};

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB ?? "bazardor"), { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // The assignment sends new users to /signin after sign-up, so don't auto-log them in.
    autoSignIn: false,
  },
  socialProviders,
  // nextCookies must be the LAST plugin: lets server actions/components set auth cookies.
  plugins: [nextCookies()],
});
