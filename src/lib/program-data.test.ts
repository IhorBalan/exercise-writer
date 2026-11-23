import { describe, expect, it } from "vitest";

import { PROGRAM } from "./program-data";

describe("PROGRAM", () => {
  it("has the Big Six with ten steps each", () => {
    expect(PROGRAM).toHaveLength(6);
    for (const movement of PROGRAM) expect(movement.steps).toHaveLength(10);
    expect(new Set(PROGRAM.map((m) => m.slug)).size).toBe(6);
  });

  it("has standards that never get easier within a step", () => {
    for (const movement of PROGRAM) {
      for (const step of movement.steps) {
        const volume = ([sets, reps]: readonly [number, number]) => sets * reps;
        expect(volume(step.intermediate)).toBeGreaterThan(volume(step.beginner));
        expect(volume(step.progression)).toBeGreaterThan(volume(step.intermediate));
      }
    }
  });
});
