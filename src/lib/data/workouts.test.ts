import { and, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import { movements, steps } from "@/db/schema";
import { createTestDb } from "@/test/db";
import {
  createWorkout,
  deleteWorkout,
  getCurrentPositions,
  getLastResults,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from "./workouts";

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

async function stepId(db: TestDb, slug: string, stepNumber: number) {
  const [row] = await db
    .select({ id: steps.id })
    .from(steps)
    .innerJoin(movements, eq(movements.id, steps.movementId))
    .where(and(eq(movements.slug, slug), eq(steps.stepNumber, stepNumber)));
  return row.id;
}

describe("workouts data layer", () => {
  let db: TestDb;
  beforeEach(async () => {
    db = await createTestDb();
  });

  it("creates and reads a workout with entries in order", async () => {
    const id = await createWorkout(db, "alice", {
      performedOn: "2026-11-20",
      notes: "felt strong",
      entries: [
        { stepId: await stepId(db, "pushups", 5), level: "intermediate", reps: [12, 10] },
        { stepId: await stepId(db, "squats", 4), level: "beginner", reps: [8] },
      ],
    });

    const w = await getWorkout(db, "alice", id);
    expect(w?.notes).toBe("felt strong");
    expect(w?.entries.map((e) => e.movement.slug)).toEqual(["pushups", "squats"]);
    expect(w?.entries[0]).toMatchObject({ reps: [12, 10], level: "intermediate" });
    expect(w?.entries[0].step.name).toBe("Full Pushups");
  });

  it("keeps each user's data private", async () => {
    const id = await createWorkout(db, "alice", {
      performedOn: "2026-11-20",
      notes: null,
      entries: [{ stepId: await stepId(db, "pullups", 1), level: "beginner", reps: [10] }],
    });

    expect(await listWorkouts(db, "bob")).toEqual([]);
    expect(await getWorkout(db, "bob", id)).toBeNull();
    expect(
      await updateWorkout(db, "bob", id, { performedOn: "2026-11-21", notes: "x", entries: [] }),
    ).toBe(false);
    expect(await deleteWorkout(db, "bob", id)).toBe(false);
    expect(await listWorkouts(db, "alice")).toHaveLength(1);
  });

  it("updates entries and deletes workouts", async () => {
    const id = await createWorkout(db, "alice", {
      performedOn: "2026-11-20",
      notes: null,
      entries: [{ stepId: await stepId(db, "bridges", 1), level: "beginner", reps: [10] }],
    });
    const ok = await updateWorkout(db, "alice", id, {
      performedOn: "2026-11-21",
      notes: "edited",
      entries: [
        { stepId: await stepId(db, "bridges", 2), level: "intermediate", reps: [20, 20] },
        { stepId: await stepId(db, "leg-raises", 3), level: "beginner", reps: [10] },
      ],
    });
    expect(ok).toBe(true);
    const w = await getWorkout(db, "alice", id);
    expect(w).toMatchObject({ performedOn: "2026-11-21", notes: "edited" });
    expect(w?.entries).toHaveLength(2);

    expect(await deleteWorkout(db, "alice", id)).toBe(true);
    expect(await listWorkouts(db, "alice")).toEqual([]);
  });

  it("stores warm-ups per entry and replaces them on update", async () => {
    const [p3, p4, p5] = await Promise.all([3, 4, 5].map((n) => stepId(db, "pushups", n)));
    const id = await createWorkout(db, "alice", {
      performedOn: "2026-11-23",
      notes: null,
      entries: [
        {
          stepId: p5,
          level: "beginner",
          reps: [10],
          warmups: [
            { stepId: p3, reps: 10 },
            { stepId: p4, reps: 10 },
          ],
        },
        { stepId: await stepId(db, "leg-raises", 2), level: "beginner", reps: [10] },
      ],
    });

    let w = await getWorkout(db, "alice", id);
    expect(w?.entries[0].warmups.map((x) => [x.step.stepNumber, x.reps])).toEqual([
      [3, 10],
      [4, 10],
    ]);
    expect(w?.entries[1].warmups).toEqual([]);

    await updateWorkout(db, "alice", id, {
      performedOn: "2026-11-23",
      notes: null,
      entries: [{ stepId: p5, level: "beginner", reps: [12], warmups: [{ stepId: p4, reps: 8 }] }],
    });
    w = await getWorkout(db, "alice", id);
    expect(w?.entries[0].warmups.map((x) => [x.step.stepNumber, x.reps])).toEqual([[4, 8]]);
  });

  it("returns the last result per movement, optionally skipping a workout", async () => {
    const p5 = await stepId(db, "pushups", 5);
    const first = await createWorkout(db, "alice", {
      performedOn: "2026-11-16",
      notes: null,
      entries: [{ stepId: p5, level: "beginner", reps: [8, 6] }],
    });
    const second = await createWorkout(db, "alice", {
      performedOn: "2026-11-23",
      notes: null,
      entries: [{ stepId: p5, level: "intermediate", reps: [10, 9] }],
    });
    const [pushups] = await db.select().from(movements).where(eq(movements.slug, "pushups"));

    expect((await getLastResults(db, "alice")).get(pushups.id)).toMatchObject({
      performedOn: "2026-11-23",
      stepNumber: 5,
      level: "intermediate",
      reps: [10, 9],
    });
    expect((await getLastResults(db, "alice", second)).get(pushups.id)?.reps).toEqual([8, 6]);
    expect((await getLastResults(db, "alice", first)).get(pushups.id)?.reps).toEqual([10, 9]);
    expect((await getLastResults(db, "bob")).size).toBe(0);
  });

  it("reports the latest step per movement", async () => {
    const pushups5 = await stepId(db, "pushups", 5);
    const pushups6 = await stepId(db, "pushups", 6);
    await createWorkout(db, "alice", {
      performedOn: "2026-11-10",
      notes: null,
      entries: [{ stepId: pushups5, level: "progression", reps: [20, 20] }],
    });
    await createWorkout(db, "alice", {
      performedOn: "2026-11-15",
      notes: null,
      entries: [{ stepId: pushups6, level: "beginner", reps: [5] }],
    });
    await createWorkout(db, "bob", {
      performedOn: "2026-11-16",
      notes: null,
      entries: [{ stepId: await stepId(db, "pushups", 9), level: "beginner", reps: [5] }],
    });

    const positions = await getCurrentPositions(db, "alice");
    expect(positions.size).toBe(1);
    expect([...positions.values()][0]).toMatchObject({ stepNumber: 6, level: "beginner" });
  });
});
