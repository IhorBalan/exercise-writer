import type { StandardLevel } from "@/db/schema";

export const LEVELS: readonly StandardLevel[] = ["beginner", "intermediate", "progression"];

export const LEVEL_LABEL: Record<StandardLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  progression: "Progression",
};

export interface Standard {
  sets: number;
  reps: number;
}

export interface StepStandards {
  beginnerSets: number;
  beginnerReps: number;
  intermediateSets: number;
  intermediateReps: number;
  progressionSets: number;
  progressionReps: number;
}

export function standardFor(step: StepStandards, level: StandardLevel): Standard {
  switch (level) {
    case "beginner":
      return { sets: step.beginnerSets, reps: step.beginnerReps };
    case "intermediate":
      return { sets: step.intermediateSets, reps: step.intermediateReps };
    case "progression":
      return { sets: step.progressionSets, reps: step.progressionReps };
  }
}

/** True when at least `sets` sets reached at least `reps` each. */
export function meetsStandard(sets: readonly number[], standard: Standard): boolean {
  return sets.filter((r) => r >= standard.reps).length >= standard.sets;
}

/** Highest standard met by the given sets, or null if none. */
export function highestLevelMet(
  sets: readonly number[],
  step: StepStandards,
): StandardLevel | null {
  let best: StandardLevel | null = null;
  for (const level of LEVELS) {
    if (meetsStandard(sets, standardFor(step, level))) best = level;
  }
  return best;
}

export function formatStandard(standard: Standard, unit: "reps" | "seconds"): string {
  if (unit === "seconds") {
    return standard.reps >= 60 && standard.reps % 60 === 0
      ? `${standard.reps / 60} min`
      : `${standard.reps} sec`;
  }
  return `${standard.sets} × ${standard.reps}`;
}
