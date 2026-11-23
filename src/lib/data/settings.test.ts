import { beforeEach, describe, expect, it } from "vitest";

import { createTestDb } from "@/test/db";
import { getRoutine, setRoutine } from "./settings";

describe("settings data layer", () => {
  let db: Awaited<ReturnType<typeof createTestDb>>;
  beforeEach(async () => {
    db = await createTestDb();
  });

  it("defaults to New Blood and saves a choice per user", async () => {
    expect((await getRoutine(db, "alice")).id).toBe("new-blood");
    await setRoutine(db, "alice", "veterano");
    await setRoutine(db, "alice", "good-behavior");
    expect((await getRoutine(db, "alice")).id).toBe("good-behavior");
    expect((await getRoutine(db, "bob")).id).toBe("new-blood");
  });
});
