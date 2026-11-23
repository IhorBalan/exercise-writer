import type { StandardLevel } from "@/db/schema";

export interface StepOption {
  id: number;
  stepNumber: number;
  name: string;
  unit: "reps" | "seconds";
  beginnerSets: number;
  beginnerReps: number;
  intermediateSets: number;
  intermediateReps: number;
  progressionSets: number;
  progressionReps: number;
}

export interface MovementOption {
  id: number;
  name: string;
  steps: StepOption[];
}

export interface Position {
  stepId: number;
  level: StandardLevel;
}

export interface EntryDraft {
  key: string;
  movementId: number;
  stepId: number;
  level: StandardLevel;
  reps: number[];
}
