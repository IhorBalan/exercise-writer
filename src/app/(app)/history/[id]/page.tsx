import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteWorkoutButton } from "@/components/workout/delete-workout-button";
import { EntrySummary } from "@/components/workout/entry-summary";
import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { formatDay } from "@/lib/dates";
import { getWorkout } from "@/lib/data/workouts";

export const metadata: Metadata = { title: "Workout · Exercise Writer" };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function WorkoutPage({ params, searchParams }: PageProps<"/history/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const user = await requireUser();
  const workout = UUID.test(id) ? await getWorkout(getDb(), user.id, id) : null;
  if (!workout) notFound();

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/history">
          <ArrowLeft /> History
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{formatDay(workout.performedOn)}</h1>
        {saved && <p className="text-sm text-emerald-600 dark:text-emerald-400">Workout saved.</p>}
      </div>

      <Card>
        <CardContent className="divide-y">
          {workout.entries.map((entry) => (
            <div key={entry.id} className="py-3 first:pt-0 last:pb-0">
              <EntrySummary entry={entry} showFeedback />
            </div>
          ))}
        </CardContent>
      </Card>

      {workout.notes && (
        <Card>
          <CardContent>
            <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wide">Note</p>
            <p className="text-sm whitespace-pre-wrap">{workout.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/history/${workout.id}/edit`}>
            <Pencil /> Edit
          </Link>
        </Button>
        <DeleteWorkoutButton workoutId={workout.id} />
      </div>
    </div>
  );
}
