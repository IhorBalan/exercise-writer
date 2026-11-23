"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { createWorkout, deleteWorkout, updateWorkout } from "@/lib/data/workouts";
import { workoutInputSchema, type WorkoutFormInput } from "@/lib/validation";

export interface SaveResult {
  error?: string;
}

export async function saveWorkoutAction(
  workoutId: string | null,
  input: WorkoutFormInput,
): Promise<SaveResult> {
  const user = await requireUser();
  const parsed = workoutInputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const db = getDb();
  let id = workoutId;
  if (id) {
    const ok = await updateWorkout(db, user.id, id, parsed.data);
    if (!ok) return { error: "That workout doesn't exist anymore." };
  } else {
    id = await createWorkout(db, user.id, parsed.data);
  }

  revalidatePath("/", "layout");
  redirect(`/history/${id}?saved=1`);
}

export async function deleteWorkoutAction(workoutId: string): Promise<void> {
  const user = await requireUser();
  await deleteWorkout(getDb(), user.id, workoutId);
  revalidatePath("/", "layout");
  redirect("/history");
}
