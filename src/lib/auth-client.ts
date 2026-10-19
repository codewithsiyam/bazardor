"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side Better Auth client. No baseURL is passed on purpose: requests go
 * to the same origin (/api/auth/*), so local, preview and production deployments
 * all work without extra configuration.
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
