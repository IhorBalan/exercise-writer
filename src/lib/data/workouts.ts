import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { movements, steps, workoutEntries, workouts, type StandardLevel } from "@/db/schema";
import type { Db } from "@/db/types";

export interface EntryInput {
  stepId: number;
  level: StandardLevel;
  reps: number[];
}

export interface WorkoutInput {
  performedOn: string; // YYYY-MM-DD
  notes: string | null;
  entries: EntryInput[];
}

export interface EntryView {
  id: string;
  level: StandardLevel;
  reps: number[];
  step: typeof steps.$inferSelect;
  movement: { id: number; slug: string; name: string };
}

export interface WorkoutView {
  id: string;
  performedOn: string;
  notes: string | null;
  createdAt: Date;
  entries: EntryView[];
}

/**
 * Runs the queries atomically where the driver supports it (Neon HTTP batch),
 * otherwise one after another (PGlite in tests).
 */
async function runAll(db: Db, queries: Promise<unknown>[] & unknown[]) {
  const maybeBatch = db as unknown as { batch?: (q: unknown[]) => Promise<unknown> };
  if (typeof maybeBatch.batch === "function") {
    await maybeBatch.batch(queries);
  } else {
    for (const q of queries) await q;
  }
}

function entryRows(workoutId: string, entries: EntryInput[]) {
  return entries.map((e, i) => ({
    workoutId,
    stepId: e.stepId,
    level: e.level,
    reps: e.reps,
    position: i,
  }));
}

export async function createWorkout(db: Db, userId: string, input: WorkoutInput): Promise<string> {
  const id = crypto.randomUUID();
  await runAll(db, [
    db.insert(workouts).values({ id, userId, performedOn: input.performedOn, notes: input.notes }),
    db.insert(workoutEntries).values(entryRows(id, input.entries)),
  ]);
  return id;
}

/** Replaces a workout's fields and entries. Returns false when it isn't the user's. */
export async function updateWorkout(
  db: Db,
  userId: string,
  id: string,
  input: WorkoutInput,
): Promise<boolean> {
  const [owned] = await db
    .select({ id: workouts.id })
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
  if (!owned) return false;

  await runAll(db, [
    db
      .update(workouts)
      .set({ performedOn: input.performedOn, notes: input.notes, updatedAt: sql`now()` })
      .where(and(eq(workouts.id, id), eq(workouts.userId, userId))),
    db.delete(workoutEntries).where(eq(workoutEntries.workoutId, id)),
    db.insert(workoutEntries).values(entryRows(id, input.entries)),
  ]);
  return true;
}

export async function deleteWorkout(db: Db, userId: string, id: string): Promise<boolean> {
  const deleted = await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning({ id: workouts.id });
  return deleted.length > 0;
}

async function attachEntries(
  db: Db,
  rows: (typeof workouts.$inferSelect)[],
): Promise<WorkoutView[]> {
  if (rows.length === 0) return [];
  const entryRowsResult = await db
    .select({ entry: workoutEntries, step: steps, movement: movements })
    .from(workoutEntries)
    .innerJoin(steps, eq(steps.id, workoutEntries.stepId))
    .innerJoin(movements, eq(movements.id, steps.movementId))
    .where(inArray(workoutEntries.workoutId, rows.map((r) => r.id)))
    .orderBy(asc(workoutEntries.position));

  const byWorkout = new Map<string, EntryView[]>();
  for (const { entry, step, movement } of entryRowsResult) {
    const list = byWorkout.get(entry.workoutId) ?? [];
    list.push({
      id: entry.id,
      level: entry.level,
      reps: entry.reps,
      step,
      movement: { id: movement.id, slug: movement.slug, name: movement.name },
    });
    byWorkout.set(entry.workoutId, list);
  }
  return rows.map((w) => ({
    id: w.id,
    performedOn: w.performedOn,
    notes: w.notes,
    createdAt: w.createdAt,
    entries: byWorkout.get(w.id) ?? [],
  }));
}

export async function listWorkouts(
  db: Db,
  userId: string,
  opts: { limit?: number } = {},
): Promise<WorkoutView[]> {
  const rows = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.performedOn), desc(workouts.createdAt))
    .limit(opts.limit ?? 200);
  return attachEntries(db, rows);
}

export async function getWorkout(db: Db, userId: string, id: string): Promise<WorkoutView | null> {
  const rows = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
  const [view] = await attachEntries(db, rows);
  return view ?? null;
}

/**
 * The step and level of the most recent entry per movement: where the user is
 * now on each ladder. Movement ids without any entries are absent.
 */
export async function getCurrentPositions(
  db: Db,
  userId: string,
): Promise<Map<number, { stepId: number; stepNumber: number; level: StandardLevel; performedOn: string }>> {
  const rows = await db
    .selectDistinctOn([steps.movementId], {
      movementId: steps.movementId,
      stepId: steps.id,
      stepNumber: steps.stepNumber,
      level: workoutEntries.level,
      performedOn: workouts.performedOn,
    })
    .from(workoutEntries)
    .innerJoin(workouts, eq(workouts.id, workoutEntries.workoutId))
    .innerJoin(steps, eq(steps.id, workoutEntries.stepId))
    .where(eq(workouts.userId, userId))
    .orderBy(steps.movementId, desc(workouts.performedOn), desc(workouts.createdAt), desc(steps.stepNumber));

  return new Map(rows.map((r) => [r.movementId, r]));
}
