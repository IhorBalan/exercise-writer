import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkoutForm } from "@/components/workout/workout-form";
import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { getWorkoutFormProps } from "@/lib/data/form-props";
import { getWorkout } from "@/lib/data/workouts";

export const metadata: Metadata = { title: "Edit workout · Exercise Writer" };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function EditWorkoutPage({ params }: PageProps<"/history/[id]/edit">) {
  const { id } = await params;
  const user = await requireUser();
  const [workout, props] = await Promise.all([
    UUID.test(id) ? getWorkout(getDb(), user.id, id) : null,
    getWorkoutFormProps(user.id),
  ]);
  if (!workout) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Edit workout</h1>
      <WorkoutForm
        {...props}
        initial={{
          id: workout.id,
          performedOn: workout.performedOn,
          notes: workout.notes,
          entries: workout.entries.map((e) => ({
            key: e.id,
            movementId: e.movement.id,
            stepId: e.step.id,
            level: e.level,
            reps: e.reps,
          })),
        }}
      />
    </div>
  );
}
