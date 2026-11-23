import "server-only";

import { getDb } from "@/db";
import type { MovementOption, Position } from "@/components/workout/types";
import { getProgram } from "./program";
import { getCurrentPositions } from "./workouts";

/** Program and the user's current positions, shaped for the workout form. */
export async function getWorkoutFormProps(userId: string) {
  const [program, positions] = await Promise.all([
    getProgram(),
    getCurrentPositions(getDb(), userId),
  ]);
  const movementOptions: MovementOption[] = program.map((m) => ({
    id: m.id,
    name: m.name,
    steps: m.steps.map((s) => ({
      id: s.id,
      stepNumber: s.stepNumber,
      name: s.name,
      unit: s.unit,
      beginnerSets: s.beginnerSets,
      beginnerReps: s.beginnerReps,
      intermediateSets: s.intermediateSets,
      intermediateReps: s.intermediateReps,
      progressionSets: s.progressionSets,
      progressionReps: s.progressionReps,
    })),
  }));
  const positionMap: Record<number, Position> = {};
  for (const [movementId, p] of positions) positionMap[movementId] = { stepId: p.stepId, level: p.level };
  return { movements: movementOptions, positions: positionMap };
}
