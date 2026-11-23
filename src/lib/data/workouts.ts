import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";

import {
  movements,
  steps,
  workoutEntries,
  workouts,
  workoutWarmups,
  type StandardLevel,
} from "@/db/schema";
import type { Db } from "@/db/types";

export interface WarmupInput {
  stepId: number;
  reps: number;
}

export interface EntryInput {
  stepId: number;
  level: StandardLevel;
  reps: number[];
  warmups?: WarmupInput[];
}

export interface WarmupView {
  id: string;
  reps: number;
  step: typeof steps.$inferSelect;
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
  warmups: WarmupView[];
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

/** Insert queries for a workout's entries and their warm-ups. */
function entryInserts(db: Db, workoutId: string, entries: EntryInput[]) {
  const entryRows = entries.map((e, i) => ({
    id: crypto.randomUUID(),
    workoutId,
    stepId: e.stepId,
    level: e.level,
    reps: e.reps,
    position: i,
  }));
  const warmupRows = entries.flatMap((e, i) =>
    (e.warmups ?? []).map((w, j) => ({
      entryId: entryRows[i].id,
      stepId: w.stepId,
      reps: w.reps,
      position: j,
    })),
  );
  const queries = [db.insert(workoutEntries).values(entryRows)];
  if (warmupRows.length > 0) queries.push(db.insert(workoutWarmups).values(warmupRows) as never);
  return queries;
}

export async function createWorkout(db: Db, userId: string, input: WorkoutInput): Promise<string> {
  const id = crypto.randomUUID();
  await runAll(db, [
    db.insert(workouts).values({ id, userId, performedOn: input.performedOn, notes: input.notes }),
    ...entryInserts(db, id, input.entries),
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
    ...entryInserts(db, id, input.entries),
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

  const warmupRows =
    entryRowsResult.length === 0
      ? []
      : await db
          .select({ warmup: workoutWarmups, step: steps })
          .from(workoutWarmups)
          .innerJoin(steps, eq(steps.id, workoutWarmups.stepId))
          .where(inArray(workoutWarmups.entryId, entryRowsResult.map((r) => r.entry.id)))
          .orderBy(asc(workoutWarmups.position));
  const warmupsByEntry = new Map<string, WarmupView[]>();
  for (const { warmup, step } of warmupRows) {
    const list = warmupsByEntry.get(warmup.entryId) ?? [];
    list.push({ id: warmup.id, reps: warmup.reps, step });
    warmupsByEntry.set(warmup.entryId, list);
  }

  const byWorkout = new Map<string, EntryView[]>();
  for (const { entry, step, movement } of entryRowsResult) {
    const list = byWorkout.get(entry.workoutId) ?? [];
    list.push({
      id: entry.id,
      level: entry.level,
      reps: entry.reps,
      warmups: warmupsByEntry.get(entry.id) ?? [],
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

/** Every entry of the user in a flat shape for dashboard statistics. */
export async function listStatEntries(db: Db, userId: string) {
  return db
    .select({
      performedOn: workouts.performedOn,
      notes: workouts.notes,
      movementName: movements.name,
      movementSlug: movements.slug,
      movementId: movements.id,
      stepNumber: steps.stepNumber,
      stepName: steps.name,
      unit: steps.unit,
      level: workoutEntries.level,
      reps: workoutEntries.reps,
    })
    .from(workoutEntries)
    .innerJoin(workouts, eq(workouts.id, workoutEntries.workoutId))
    .innerJoin(steps, eq(steps.id, workoutEntries.stepId))
    .innerJoin(movements, eq(movements.id, steps.movementId))
    .where(eq(workouts.userId, userId))
    .orderBy(asc(workouts.performedOn), asc(workouts.createdAt));
}

export interface LastResult {
  performedOn: string;
  stepNumber: number;
  stepName: string;
  unit: "reps" | "seconds";
  level: StandardLevel;
  reps: number[];
}

/**
 * The most recent entry per movement id, for showing "last time" while
 * logging. `excludeWorkoutId` leaves out the workout being edited.
 */
export async function getLastResults(
  db: Db,
  userId: string,
  excludeWorkoutId?: string,
): Promise<Map<number, LastResult>> {
  const rows = await db
    .selectDistinctOn([steps.movementId], {
      movementId: steps.movementId,
      performedOn: workouts.performedOn,
      stepNumber: steps.stepNumber,
      stepName: steps.name,
      unit: steps.unit,
      level: workoutEntries.level,
      reps: workoutEntries.reps,
    })
    .from(workoutEntries)
    .innerJoin(workouts, eq(workouts.id, workoutEntries.workoutId))
    .innerJoin(steps, eq(steps.id, workoutEntries.stepId))
    .where(
      excludeWorkoutId
        ? and(eq(workouts.userId, userId), ne(workouts.id, excludeWorkoutId))
        : eq(workouts.userId, userId),
    )
    .orderBy(
      steps.movementId,
      desc(workouts.performedOn),
      desc(workouts.createdAt),
      desc(workoutEntries.position),
    );
  return new Map(rows.map(({ movementId, ...r }) => [movementId, r]));
}
