import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getAuth } from "./server";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

/** The signed-in user, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const { data } = await getAuth().getSession();
  const user = data?.user;
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name || user.email };
});

/** The signed-in user; redirects to sign-in when there is none. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  return user;
}
