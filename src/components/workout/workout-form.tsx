"use client";

import { useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { ListChecks, Plus, Trash2 } from "lucide-react";

import { saveWorkoutAction } from "@/app/(app)/log/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { StandardLevel } from "@/db/schema";
import type { LastResult } from "@/lib/data/workouts";
import { formatDay } from "@/lib/dates";
import { todayLocal } from "@/lib/dates";
import { formatStandard, LEVELS, LEVEL_LABEL, standardFor } from "@/lib/standards";
import { MOVEMENT_LABEL, routineById } from "@/lib/routines";
import { cn } from "@/lib/utils";
import { defaultWarmups } from "@/lib/warmups";
import { RepsStepper } from "./reps-stepper";
import type { EntryDraft, MovementOption, Position, StepOption } from "./types";

interface Props {
  movements: MovementOption[];
  /** Latest step/level per movement id, used as defaults. */
  positions: Record<number, Position>;
  /** The user's previous result per movement id, shown for reference. */
  lastResults?: Record<number, LastResult>;
  /** The user's routine; on its training days a "Follow program" button appears. */
  routineId?: string;
  initial?: {
    id: string;
    performedOn: string;
    notes: string | null;
    entries: EntryDraft[];
  };
}

let keySeq = 0;
const newKey = () => `e${++keySeq}`;

function defaultReps(step: StepOption, level: StandardLevel): number[] {
  const { sets, reps } = standardFor(step, level);
  return Array.from({ length: sets }, () => reps);
}

const noopSubscribe = () => () => {};

export function WorkoutForm({ movements, positions, lastResults = {}, routineId, initial }: Props) {
  const stepsById = useMemo(() => {
    const map = new Map<number, StepOption>();
    for (const m of movements) for (const s of m.steps) map.set(s.id, s);
    return map;
  }, [movements]);

  const [performedOn, setPerformedOn] = useState(initial?.performedOn ?? todayLocal());
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [entries, setEntries] = useState<EntryDraft[]>(initial?.entries ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Weekday from the device clock; null during server render.
  const today = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getDay(),
    () => null,
  );
  const routine = routineId ? routineById(routineId) : null;
  const routineDay =
    !initial && routine && today !== null ? routine.days.find((d) => d.day === today) : undefined;
  const programMovementIds = (routineDay?.movements ?? [])
    .map((slug) => movements.find((m) => m.slug === slug)?.id)
    .filter((id): id is number => id !== undefined);

  const usedMovements = new Set(entries.map((e) => e.movementId));
  const missingProgramMovements = programMovementIds.filter((id) => !usedMovements.has(id));
  const nextMovement = movements.find((m) => !usedMovements.has(m.id)) ?? movements[0];

  function draftFor(movementId: number): EntryDraft {
    const movement = movements.find((m) => m.id === movementId)!;
    const pos = positions[movementId];
    const step = (pos && stepsById.get(pos.stepId)) || movement.steps[0];
    const level = pos?.level ?? "beginner";
    return {
      key: newKey(),
      movementId,
      stepId: step.id,
      level,
      reps: defaultReps(step, level),
      warmups: defaultWarmups(movement.steps, step.stepNumber),
    };
  }

  function update(key: string, patch: Partial<EntryDraft>) {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, ...patch } : e)));
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await saveWorkoutAction(initial?.id ?? null, {
        performedOn,
        notes: notes.trim() || null,
        entries: entries.map(({ stepId, level, reps, warmups }) => ({ stepId, level, reps, warmups })),
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="performedOn">Date</Label>
        <Input
          id="performedOn"
          type="date"
          value={performedOn}
          max={todayLocal()}
          onChange={(e) => setPerformedOn(e.target.value)}
          required
        />
      </div>

      {routine && routineDay && missingProgramMovements.length > 0 && (
        <Button
          type="button"
          size="lg"
          className="h-auto w-full flex-col gap-0.5 py-3"
          onClick={() =>
            setEntries((prev) => [...prev, ...missingProgramMovements.map((id) => draftFor(id))])
          }
        >
          <span className="flex items-center gap-2">
            <ListChecks /> Follow {routine.name}
          </span>
          <span className="text-xs font-normal opacity-80">
            Adds today&apos;s {routineDay.movements.map((m) => MOVEMENT_LABEL[m]).join(" + ")}
          </span>
        </Button>
      )}

      {entries.map((entry, index) => {
        const movement = movements.find((m) => m.id === entry.movementId)!;
        const step = stepsById.get(entry.stepId)!;
        const target = standardFor(step, entry.level);
        return (
          <Card key={entry.key}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Movement {index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${movement.name}`}
                onClick={() => setEntries((prev) => prev.filter((e) => e.key !== entry.key))}
              >
                <Trash2 />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${entry.key}-movement`}>Movement</Label>
                <NativeSelect
                  id={`${entry.key}-movement`}
                  value={entry.movementId}
                  onChange={(e) => {
                    const draft = draftFor(Number(e.target.value));
                    update(entry.key, { ...draft, key: entry.key });
                  }}
                >
                  {movements.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </NativeSelect>
                <LastResultLine result={lastResults[entry.movementId]} />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${entry.key}-step`}>Step</Label>
                <NativeSelect
                  id={`${entry.key}-step`}
                  value={entry.stepId}
                  onChange={(e) => {
                    const s = stepsById.get(Number(e.target.value))!;
                    update(entry.key, {
                      stepId: s.id,
                      reps: defaultReps(s, entry.level),
                      warmups: defaultWarmups(movement.steps, s.stepNumber),
                    });
                  }}
                >
                  {movement.steps.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.stepNumber}. {s.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Level</legend>
                <div className="bg-muted grid grid-cols-3 gap-1 rounded-lg p-1">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={entry.level === level}
                      onClick={() => update(entry.key, { level, reps: defaultReps(step, level) })}
                      className={cn(
                        "rounded-md px-1 py-2 text-sm font-medium transition-colors",
                        entry.level === level
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground",
                      )}
                    >
                      {LEVEL_LABEL[level]}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  Target: {formatStandard(target, step.unit)}
                  {step.unit === "seconds" ? " hold" : ""}
                </p>
              </fieldset>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Warm-up</p>
                  {entry.warmups.length > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-7"
                      onClick={() => update(entry.key, { warmups: [] })}
                    >
                      Skip warm-up
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() =>
                        update(entry.key, { warmups: defaultWarmups(movement.steps, step.stepNumber) })
                      }
                    >
                      <Plus /> Add warm-up
                    </Button>
                  )}
                </div>
                {entry.warmups.map((warmup, i) => {
                  const wStep = stepsById.get(warmup.stepId)!;
                  const setWarmup = (patch: Partial<typeof warmup>) =>
                    update(entry.key, {
                      warmups: entry.warmups.map((w, j) => (j === i ? { ...w, ...patch } : w)),
                    });
                  return (
                    <div key={i} className="bg-muted/50 space-y-2 rounded-lg p-2">
                      <NativeSelect
                        aria-label={`Warm-up ${i + 1} step`}
                        value={warmup.stepId}
                        onChange={(e) => {
                          const s = stepsById.get(Number(e.target.value))!;
                          setWarmup({ stepId: s.id, reps: s.beginnerReps });
                        }}
                      >
                        {movement.steps
                          .filter((s) => s.stepNumber <= step.stepNumber)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.stepNumber}. {s.name}
                            </option>
                          ))}
                      </NativeSelect>
                      <RepsStepper
                        label={`W${i + 1}`}
                        value={warmup.reps}
                        unit={wStep.unit}
                        onChange={(v) => setWarmup({ reps: v })}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Working sets</p>
                {entry.reps.map((value, i) => (
                  <RepsStepper
                    key={i}
                    label={`Set ${i + 1}`}
                    value={value}
                    unit={step.unit}
                    onChange={(v) =>
                      update(entry.key, { reps: entry.reps.map((r, j) => (j === i ? v : r)) })
                    }
                    onRemove={
                      entry.reps.length > 1
                        ? () => update(entry.key, { reps: entry.reps.filter((_, j) => j !== i) })
                        : undefined
                    }
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    update(entry.key, {
                      reps: [...entry.reps, entry.reps.at(-1) ?? target.reps],
                    })
                  }
                >
                  <Plus /> Add set
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => setEntries((prev) => [...prev, draftFor(nextMovement.id)])}
      >
        <Plus /> Add movement
      </Button>

      <div className="space-y-2">
        <Label htmlFor="notes">Note (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          placeholder="How did it feel?"
          maxLength={2000}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending || entries.length === 0}>
        {pending ? "Saving…" : initial ? "Save changes" : "Save workout"}
      </Button>
    </form>
  );
}

const LEVEL_SHORT: Record<StandardLevel, string> = {
  beginner: "Beg",
  intermediate: "Int",
  progression: "Prog",
};

/** One muted line with the previous session's result for this movement. */
function LastResultLine({ result }: { result?: LastResult }) {
  if (!result) {
    return <p className="text-muted-foreground text-xs">First time logging this movement.</p>;
  }
  const unit = result.unit === "seconds" ? "s" : "";
  return (
    <p className="text-muted-foreground text-xs tabular-nums">
      Last time ({formatDay(result.performedOn, { weekday: undefined, year: undefined })}): step{" "}
      {result.stepNumber} {result.stepName} · {LEVEL_SHORT[result.level]} ·{" "}
      <span className="text-foreground/80 font-medium">
        {result.reps.map((r) => `${r}${unit}`).join(" / ")}
      </span>
    </p>
  );
}
