import { describe, expect, it } from "vitest";

import { formatStandard, highestLevelMet, meetsStandard } from "./standards";

const fullPushups = {
  beginnerSets: 1,
  beginnerReps: 5,
  intermediateSets: 2,
  intermediateReps: 10,
  progressionSets: 2,
  progressionReps: 20,
};

describe("meetsStandard", () => {
  it("needs enough sets at or above the rep target", () => {
    expect(meetsStandard([20, 20], { sets: 2, reps: 20 })).toBe(true);
    expect(meetsStandard([20, 19], { sets: 2, reps: 20 })).toBe(false);
    expect(meetsStandard([25, 8, 21], { sets: 2, reps: 20 })).toBe(true);
    expect(meetsStandard([], { sets: 1, reps: 1 })).toBe(false);
  });
});

describe("highestLevelMet", () => {
  it("returns the best standard reached", () => {
    expect(highestLevelMet([4], fullPushups)).toBeNull();
    expect(highestLevelMet([5], fullPushups)).toBe("beginner");
    expect(highestLevelMet([12, 10], fullPushups)).toBe("intermediate");
    expect(highestLevelMet([20, 22], fullPushups)).toBe("progression");
  });
});

describe("formatStandard", () => {
  it("formats reps and timed holds", () => {
    expect(formatStandard({ sets: 3, reps: 50 }, "reps")).toBe("3 × 50");
    expect(formatStandard({ sets: 1, reps: 30 }, "seconds")).toBe("30 sec");
    expect(formatStandard({ sets: 1, reps: 120 }, "seconds")).toBe("2 min");
  });
});
