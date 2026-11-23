import { describe, expect, it } from "vitest";

import { activityGrid, stepTimeline, weekStart, weekStreak, weeklyVolume, type StatEntry } from "./stats";

const e = (performedOn: string, movementSlug: string, stepNumber: number, reps: number[], unit: "reps" | "seconds" = "reps"): StatEntry => ({
  performedOn,
  movementSlug,
  stepNumber,
  reps,
  unit,
});

describe("weekStart", () => {
  it("returns the Monday", () => {
    expect(weekStart("2026-11-23")).toBe("2026-11-23"); // Monday
    expect(weekStart("2026-11-29")).toBe("2026-11-23"); // Sunday
    expect(weekStart("2026-11-22")).toBe("2026-11-16");
  });
});

describe("weeklyVolume", () => {
  it("sums reps per week and movement, skipping timed holds", () => {
    const rows = weeklyVolume(
      [
        e("2026-11-17", "pushups", 5, [10, 10]),
        e("2026-11-19", "pushups", 5, [12]),
        e("2026-11-23", "squats", 4, [8]),
        e("2026-11-23", "handstand-pushups", 1, [30], "seconds"),
        e("2025-01-01", "pushups", 5, [99]),
      ],
      ["pushups", "squats", "handstand-pushups"],
      "2026-11-24",
      2,
    );
    expect(rows).toEqual([
      { week: "2026-11-16", pushups: 32, squats: 0, "handstand-pushups": 0 },
      { week: "2026-11-23", pushups: 0, squats: 8, "handstand-pushups": 0 },
    ]);
  });
});

describe("stepTimeline", () => {
  it("carries the latest step forward per movement", () => {
    expect(
      stepTimeline(
        [e("2026-11-02", "pushups", 5, [5]), e("2026-11-01", "pushups", 4, [5]), e("2026-11-02", "squats", 2, [5]), e("2026-11-05", "squats", 3, [5])],
        ["pushups", "squats"],
      ),
    ).toEqual([
      { date: "2026-11-01", pushups: 4, squats: null },
      { date: "2026-11-02", pushups: 5, squats: 2 },
      { date: "2026-11-05", pushups: 5, squats: 3 },
    ]);
  });
});

describe("weekStreak", () => {
  it("counts consecutive weeks with training", () => {
    expect(weekStreak([], "2026-11-24")).toBe(0);
    expect(weekStreak(["2026-11-24", "2026-11-18", "2026-11-10"], "2026-11-25")).toBe(3);
    // This week empty so far: streak counts from last week.
    expect(weekStreak(["2026-11-18", "2026-11-10"], "2026-11-24")).toBe(2);
    expect(weekStreak(["2026-11-03"], "2026-11-24")).toBe(0);
  });
});

describe("activityGrid", () => {
  it("builds Monday-first weeks ending this week", () => {
    const grid = activityGrid(["2026-11-24", "2026-11-24"], "2026-11-25", 2);
    expect(grid).toHaveLength(2);
    expect(grid[0][0].date).toBe("2026-11-16");
    expect(grid[1][1]).toEqual({ date: "2026-11-24", count: 2, future: false });
    expect(grid[1][3].future).toBe(true);
  });
});
