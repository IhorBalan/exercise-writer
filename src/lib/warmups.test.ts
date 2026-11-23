import { describe, expect, it } from "vitest";

import { defaultWarmups } from "./warmups";

const steps = Array.from({ length: 10 }, (_, i) => ({
  id: 100 + i + 1,
  stepNumber: i + 1,
  beginnerReps: 10 + i,
}));

describe("defaultWarmups", () => {
  it("uses two steps back, then one step back, at beginner reps", () => {
    expect(defaultWarmups(steps, 5)).toEqual([
      { stepId: 103, reps: 12 },
      { stepId: 104, reps: 13 },
    ]);
  });

  it("falls back to step 1 on the first steps", () => {
    expect(defaultWarmups(steps, 1)).toEqual([
      { stepId: 101, reps: 10 },
      { stepId: 101, reps: 10 },
    ]);
    expect(defaultWarmups(steps, 2)).toEqual([
      { stepId: 101, reps: 10 },
      { stepId: 101, reps: 10 },
    ]);
  });
});
