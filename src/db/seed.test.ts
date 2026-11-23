import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { asc, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { movements, steps } from "./schema";
import { seedProgram } from "./seed";

describe("migrations + seedProgram", () => {
  it("creates the schema and seeds the Big Six idempotently", async () => {
    const db = drizzle(new PGlite());
    await migrate(db, { migrationsFolder: "./drizzle" });

    expect(await seedProgram(db)).toEqual({ movements: 6, steps: 60 });
    // Running twice must not duplicate anything.
    await seedProgram(db);

    expect(await db.$count(movements)).toBe(6);
    expect(await db.$count(steps)).toBe(60);

    const [pushups] = await db.select().from(movements).where(eq(movements.slug, "pushups"));
    const pushupSteps = await db
      .select()
      .from(steps)
      .where(eq(steps.movementId, pushups.id))
      .orderBy(asc(steps.stepNumber));
    expect(pushupSteps[0].name).toBe("Wall Pushups");
    expect(pushupSteps[9]).toMatchObject({ name: "One-Arm Pushups", progressionReps: 100 });
  });
});
