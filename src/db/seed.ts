import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import { PROGRAM } from "@/lib/program-data";
import { movements, steps } from "./schema";

type AnyPgDatabase = PgDatabase<PgQueryResultHKT, Record<string, unknown>>;

/**
 * Upserts the Big Six movements and their 60 steps. Idempotent: running it
 * again updates names and standards in place, so corrections ship with a deploy.
 */
export async function seedProgram(db: AnyPgDatabase) {
  const movementRows = await db
    .insert(movements)
    .values(PROGRAM.map((m, i) => ({ slug: m.slug, name: m.name, sortOrder: i + 1 })))
    .onConflictDoUpdate({
      target: movements.slug,
      set: { name: sql`excluded.name`, sortOrder: sql`excluded.sort_order` },
    })
    .returning({ id: movements.id, slug: movements.slug });

  const idBySlug = new Map(movementRows.map((r) => [r.slug, r.id]));

  const stepRows = PROGRAM.flatMap((m) =>
    m.steps.map((step, i) => ({
      movementId: idBySlug.get(m.slug)!,
      stepNumber: i + 1,
      name: step.name,
      unit: step.unit ?? "reps",
      beginnerSets: step.beginner[0],
      beginnerReps: step.beginner[1],
      intermediateSets: step.intermediate[0],
      intermediateReps: step.intermediate[1],
      progressionSets: step.progression[0],
      progressionReps: step.progression[1],
    })),
  );

  await db
    .insert(steps)
    .values(stepRows)
    .onConflictDoUpdate({
      target: [steps.movementId, steps.stepNumber],
      set: {
        name: sql`excluded.name`,
        unit: sql`excluded.unit`,
        beginnerSets: sql`excluded.beginner_sets`,
        beginnerReps: sql`excluded.beginner_reps`,
        intermediateSets: sql`excluded.intermediate_sets`,
        intermediateReps: sql`excluded.intermediate_reps`,
        progressionSets: sql`excluded.progression_sets`,
        progressionReps: sql`excluded.progression_reps`,
      },
    });

  return { movements: movementRows.length, steps: stepRows.length };
}
