import type { Metadata } from "next";

import { signUpAction } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create account · Exercise Writer" };

export default function SignUpPage() {
  return <AuthForm mode="sign-up" action={signUpAction} />;
}
