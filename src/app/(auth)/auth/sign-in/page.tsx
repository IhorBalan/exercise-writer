import type { Metadata } from "next";

import { signInAction } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Sign in · Exercise Writer" };

export default function SignInPage() {
  return <AuthForm mode="sign-in" action={signInAction} />;
}
