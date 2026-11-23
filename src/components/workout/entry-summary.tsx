import { ArrowUpRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { EntryView } from "@/lib/data/workouts";
import { highestLevelMet, LEVEL_LABEL, meetsStandard, standardFor } from "@/lib/standards";

export function EntrySummary({ entry, showFeedback = false }: { entry: EntryView; showFeedback?: boolean }) {
  const unit = entry.step.unit === "seconds" ? "s" : "";
  const total = entry.reps.reduce((a, b) => a + b, 0);
  const targetMet = meetsStandard(entry.reps, standardFor(entry.step, entry.level));
  const best = highestLevelMet(entry.reps, entry.step);
  const readyToMoveUp = best === "progression" && entry.step.stepNumber < 10;

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{entry.movement.name}</p>
          <p className="text-muted-foreground text-sm">
            Step {entry.step.stepNumber} · {entry.step.name}
          </p>
        </div>
        <Badge variant="secondary">{LEVEL_LABEL[entry.level]}</Badge>
      </div>
      {entry.warmups.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Warm-up:{" "}
          {entry.warmups
            .map((w) => `step ${w.step.stepNumber} × ${w.reps}${w.step.unit === "seconds" ? "s" : ""}`)
            .join(", ")}
        </p>
      )}
      <p className="text-sm tabular-nums">
        {entry.reps.map((r) => `${r}${unit}`).join(" · ")}
        {entry.reps.length > 1 && entry.step.unit === "reps" && (
          <span className="text-muted-foreground"> (total {total})</span>
        )}
      </p>
      {showFeedback && (
        <div className="flex flex-wrap gap-1.5">
          {targetMet ? (
            <Badge className="bg-emerald-600 text-white dark:bg-emerald-500">
              <Check /> {LEVEL_LABEL[entry.level]} standard met
            </Badge>
          ) : (
            <Badge variant="outline">{LEVEL_LABEL[entry.level]} standard not met yet</Badge>
          )}
          {readyToMoveUp && (
            <Badge className="bg-amber-500 text-black">
              <ArrowUpRight /> Ready for step {entry.step.stepNumber + 1}
            </Badge>
          )}
          {best === "progression" && entry.step.stepNumber === 10 && (
            <Badge className="bg-amber-500 text-black">Master step complete</Badge>
          )}
        </div>
      )}
    </div>
  );
}
