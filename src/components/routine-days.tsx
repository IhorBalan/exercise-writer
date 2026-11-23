import { DAY_SHORT, MOVEMENT_LABEL, type Routine } from "@/lib/routines";
import { cn } from "@/lib/utils";

/** A routine's training days, one row each; `today` (0–6) is highlighted. */
export function RoutineDays({ routine, today }: { routine: Routine; today?: number | null }) {
  return (
    <ul className="space-y-1 text-sm">
      {routine.days.map((d) => (
        <li
          key={d.day}
          className={cn(
            "flex gap-3 rounded-md px-2 py-1",
            today === d.day && "bg-accent text-accent-foreground font-medium",
          )}
        >
          <span className="w-9 shrink-0">{DAY_SHORT[d.day]}</span>
          <span>{d.movements.map((m) => MOVEMENT_LABEL[m]).join(" + ")}</span>
          {today === d.day && <span className="text-muted-foreground ml-auto text-xs">Today</span>}
        </li>
      ))}
    </ul>
  );
}
