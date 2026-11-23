import type { Metadata } from "next";

import { WeeklySchedule } from "@/components/weekly-schedule";
import { getDb } from "@/db";
import { getRoutine } from "@/lib/data/settings";
import { WorkoutForm } from "@/components/workout/workout-form";
import { requireUser } from "@/lib/auth/session";
import { getWorkoutFormProps } from "@/lib/data/form-props";

export const metadata: Metadata = { title: "Log workout · Exercise Writer" };

export default async function LogPage() {
  const user = await requireUser();
  const [props, routine] = await Promise.all([
    getWorkoutFormProps(user.id),
    getRoutine(getDb(), user.id),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Log workout</h1>
        <p className="text-muted-foreground text-sm">
          Steps and levels start where you left off on each movement. Do the two warm-ups before
          your working sets.
        </p>
      </div>
      <WeeklySchedule routineId={routine.id} />
      <WorkoutForm {...props} routineId={routine.id} />
    </div>
  );
}
