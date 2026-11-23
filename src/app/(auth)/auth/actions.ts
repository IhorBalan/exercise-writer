"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuth } from "@/lib/auth/server";

export interface AuthFormState {
  error?: string;
  email?: string;
  name?: string;
}

const signInSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80),
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message, email };

  const { error } = await getAuth().signIn.email(parsed.data);
  if (error) return { error: error.message || "Wrong email or password.", email };
  redirect("/");
}

export async function signUpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message, email, name };

  const { error } = await getAuth().signUp.email(parsed.data);
  if (error) return { error: error.message || "Could not create the account.", email, name };
  redirect("/");
}

export async function signOutAction() {
  await getAuth().signOut();
  redirect("/auth/sign-in");
}
