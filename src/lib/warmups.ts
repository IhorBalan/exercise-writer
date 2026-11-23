/** Two warm-up sets before the working sets, as Convict Conditioning suggests. */
export const WARMUP_COUNT = 2;

export interface WarmupStep {
  id: number;
  stepNumber: number;
  beginnerReps: number;
}

export interface WarmupDraft {
  stepId: number;
  reps: number;
}

/**
 * Default warm-ups for working on `stepNumber`: one set two steps back, then
 * one set one step back, each at that step's beginner reps. Steps 1 and 2
 * fall back to the easiest steps available.
 */
export function defaultWarmups(steps: WarmupStep[], stepNumber: number): WarmupDraft[] {
  const byNumber = new Map(steps.map((s) => [s.stepNumber, s]));
  const drafts: WarmupDraft[] = [];
  for (let back = WARMUP_COUNT; back >= 1; back--) {
    const step = byNumber.get(Math.max(1, stepNumber - back)) ?? steps[0];
    if (step) drafts.push({ stepId: step.id, reps: step.beginnerReps });
  }
  return drafts;
}
