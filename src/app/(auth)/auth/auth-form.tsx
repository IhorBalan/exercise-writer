"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFormState } from "./actions";

interface Props {
  mode: "sign-in" | "sign-up";
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const signUp = mode === "sign-up";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {signUp && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" defaultValue={state.name} required />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={state.email}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={signUp ? "new-password" : "current-password"}
          minLength={signUp ? 8 : undefined}
          required
        />
      </div>
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : signUp ? "Create account" : "Sign in"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        {signUp ? "Already have an account? " : "New here? "}
        <Link
          href={signUp ? "/auth/sign-in" : "/auth/sign-up"}
          className="text-foreground font-medium underline underline-offset-4"
        >
          {signUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
