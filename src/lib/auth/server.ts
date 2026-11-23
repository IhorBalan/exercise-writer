import "server-only";

import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

let instance: NeonAuth | undefined;

/** Neon Auth server instance, created on first use so builds don't need the env vars. */
export function getAuth(): NeonAuth {
  if (!instance) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    const secret = process.env.NEON_AUTH_COOKIE_SECRET;
    if (!baseUrl || !secret) {
      throw new Error("NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET must be set");
    }
    instance = createNeonAuth({ baseUrl, cookies: { secret } });
  }
  return instance;
}
