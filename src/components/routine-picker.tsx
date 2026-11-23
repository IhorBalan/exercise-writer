"use client";

import { useOptimistic, useTransition } from "react";
import { Check } from "lucide-react";

import { saveRoutineAction } from "@/app/(app)/settings/actions";
import { RoutineDays } from "@/components/routine-days";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_ROUTINE_ID, ROUTINES } from "@/lib/routines";
import { cn } from "@/lib/utils";

export function RoutinePicker({ selectedId }: { selectedId: string }) {
  const [selected, setSelected] = useOptimistic(selectedId);
  const [pending, startTransition] = useTransition();

  return (
    <div role="radiogroup" aria-label="Routine" className="space-y-3">
      {ROUTINES.map((routine) => {
        const active = routine.id === selected;
        return (
          <button
            key={routine.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setSelected(routine.id);
                await saveRoutineAction(routine.id);
              })
            }
            className={cn(
              "bg-card w-full space-y-2 rounded-xl border p-4 text-left shadow-sm transition-colors",
              active && "border-primary ring-primary ring-1",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  {routine.name}
                  {routine.id === DEFAULT_ROUTINE_ID && <Badge variant="secondary">Start here</Badge>}
                </p>
                <p className="text-muted-foreground text-sm">{routine.summary}</p>
              </div>
              {active && <Check className="text-primary size-5 shrink-0" aria-hidden />}
            </div>
            <RoutineDays routine={routine} />
            <p className="text-muted-foreground text-xs">
              {routine.workSets} work sets per movement, plus warm-ups.
            </p>
          </button>
        );
      })}
    </div>
  );
}
