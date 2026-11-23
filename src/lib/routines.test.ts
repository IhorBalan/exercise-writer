import { describe, expect, it } from "vitest";

import { PROGRAM } from "./program-data";
import { DEFAULT_ROUTINE_ID, MOVEMENT_LABEL, ROUTINES, routineById } from "./routines";

describe("routines", () => {
  it("only uses movements from the program, with matching names", () => {
    const names = new Map(PROGRAM.map((m) => [m.slug, m.name]));
    for (const r of ROUTINES)
      for (const d of r.days)
        for (const slug of d.movements) expect(names.get(slug)).toBe(MOVEMENT_LABEL[slug]);
  });

  it("has unique ids and days in weekday order", () => {
    expect(new Set(ROUTINES.map((r) => r.id)).size).toBe(ROUTINES.length);
    for (const r of ROUTINES) {
      const days = r.days.map((d) => d.day);
      expect(days).toEqual([...days].sort());
    }
  });

  it("falls back to the default routine", () => {
    expect(routineById("nope").id).toBe(DEFAULT_ROUTINE_ID);
    expect(routineById(null).id).toBe(DEFAULT_ROUTINE_ID);
    expect(routineById("veterano").name).toBe("Veterano");
  });
});
