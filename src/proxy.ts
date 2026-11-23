import type { NextRequest } from "next/server";

import { getAuth } from "@/lib/auth/server";

/** Sends anyone without a session to the sign-in page and refreshes sessions. */
export function proxy(request: NextRequest) {
  return getAuth().middleware({ loginUrl: "/auth/sign-in" })(request);
}

export const config = {
  matcher: [
    // Everything except auth pages, the auth API, the health check and static files.
    "/((?!auth|api/auth|api/health|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico|webmanifest)$).*)",
  ],
};
