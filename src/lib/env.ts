import "server-only";

/** Variables BetterAuth + MongoDB cannot work without. */
const REQUIRED = ["MONGODB_URI", "BETTER_AUTH_SECRET"] as const;

/** Names of required variables that are unset/blank. Empty array = auth is configured. */
export function missingAuthEnv(): string[] {
  return REQUIRED.filter((k) => !process.env[k]?.trim());
}

export const authConfigured = (): boolean => missingAuthEnv().length === 0;

/** A social provider is only offered when BOTH its id and secret exist. */
export function enabledProviders(): { google: boolean; github: boolean } {
  return {
    google: Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()),
    github: Boolean(process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim()),
  };
}

/**
 * Public origin of the app. BETTER_AUTH_URL wins; on Vercel we fall back to the production/preview domain
 * so OAuth callbacks still resolve even if the variable was forgotten.
 */
export function appOrigin(): string | undefined {
  const explicit = process.env.BETTER_AUTH_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : undefined;
}
