import "server-only";

import { asc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { movements, steps, type Movement, type Step } from "@/db/schema";

export interface MovementWithSteps extends Movement {
  steps: Step[];
}

/** All six movements with their ten steps, in book order. Shared by every user. */
export async function getProgram(): Promise<MovementWithSteps[]> {
  const rows = await getDb()
    .select({ movement: movements, step: steps })
    .from(movements)
    .innerJoin(steps, eq(steps.movementId, movements.id))
    .orderBy(asc(movements.sortOrder), asc(steps.stepNumber));

  const byId = new Map<number, MovementWithSteps>();
  for (const { movement, step } of rows) {
    let entry = byId.get(movement.id);
    if (!entry) {
      entry = { ...movement, steps: [] };
      byId.set(movement.id, entry);
    }
    entry.steps.push(step);
  }
  return [...byId.values()];
}
