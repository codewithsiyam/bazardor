"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: the client talks to the same origin (/api/auth), so it works on
// localhost, Vercel previews and production without extra configuration.
export const authClient = createAuthClient();
