export interface CsvEntry {
  performedOn: string;
  movement: string;
  stepNumber: number;
  stepName: string;
  level: string;
  unit: "reps" | "seconds";
  reps: number[];
  notes: string | null;
}

export const CSV_HEADER = [
  "date",
  "movement",
  "step",
  "step_name",
  "level",
  "unit",
  "sets",
  "reps_per_set",
  "total",
  "workout_note",
] as const;

/** Quotes a field when needed and neutralises spreadsheet formula injection. */
export function csvField(value: string | number): string {
  let s = String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(entries: readonly CsvEntry[]): string {
  const lines = [CSV_HEADER.join(",")];
  for (const e of entries) {
    lines.push(
      [
        e.performedOn,
        e.movement,
        e.stepNumber,
        e.stepName,
        e.level,
        e.unit,
        e.reps.length,
        e.reps.join(" "),
        e.reps.reduce((a, b) => a + b, 0),
        e.notes ?? "",
      ]
        .map(csvField)
        .join(","),
    );
  }
  // BOM so Excel opens UTF-8 correctly; CRLF per RFC 4180.
  return "﻿" + lines.join("\r\n") + "\r\n";
}
