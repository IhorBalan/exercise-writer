import { eq, sql } from "drizzle-orm";

import { userSettings } from "@/db/schema";
import type { Db } from "@/db/types";
import { routineById, type Routine } from "@/lib/routines";

/** The user's chosen routine, or the default when they haven't picked one. */
export async function getRoutine(db: Db, userId: string): Promise<Routine> {
  const [row] = await db
    .select({ routine: userSettings.routine })
    .from(userSettings)
    .where(eq(userSettings.userId, userId));
  return routineById(row?.routine);
}

export async function setRoutine(db: Db, userId: string, routineId: string): Promise<void> {
  await db
    .insert(userSettings)
    .values({ userId, routine: routineId })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { routine: routineId, updatedAt: sql`now()` },
    });
}
