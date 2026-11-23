import { describe, expect, it } from "vitest";

import { csvField, toCsv } from "./csv";

describe("csvField", () => {
  it("quotes commas, quotes and newlines", () => {
    expect(csvField("plain")).toBe("plain");
    expect(csvField('say "hi", ok')).toBe('"say ""hi"", ok"');
    expect(csvField("line1\nline2")).toBe('"line1\nline2"');
    expect(csvField(42)).toBe("42");
  });

  it("neutralises formula-looking text", () => {
    expect(csvField("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(csvField("-felt good")).toBe("'-felt good");
  });
});

describe("toCsv", () => {
  it("writes one row per entry with totals", () => {
    const csv = toCsv([
      {
        performedOn: "2026-11-23",
        movement: "Pushups",
        stepNumber: 5,
        stepName: "Full Pushups",
        level: "intermediate",
        unit: "reps",
        reps: [12, 10],
        notes: "good, strong",
      },
    ]);
    const lines = csv.replace("﻿", "").trim().split("\r\n");
    expect(lines[0]).toBe("date,movement,step,step_name,level,unit,sets,reps_per_set,total,workout_note");
    expect(lines[1]).toBe('2026-11-23,Pushups,5,Full Pushups,intermediate,reps,2,12 10,22,"good, strong"');
  });
});
