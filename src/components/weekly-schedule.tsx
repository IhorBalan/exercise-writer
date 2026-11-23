"use client";

import { useSyncExternalStore } from "react";
import { CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { WEEKLY_SCHEDULE } from "@/lib/schedule";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** The weekly split as a small reference card; today's row is highlighted. */
export function WeeklySchedule({ className }: { className?: string }) {
  // The day comes from the device clock, so the server renders no highlight.
  const today = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getDay(),
    () => null,
  );

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-2 px-4">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
          <CalendarDays className="size-3.5" /> Weekly schedule
        </p>
        <ul className="space-y-1 text-sm">
          {WEEKLY_SCHEDULE.map((d) => (
            <li
              key={d.day}
              className={cn(
                "flex gap-3 rounded-md px-2 py-1",
                today === d.day && "bg-accent text-accent-foreground font-medium",
              )}
            >
              <span className="w-10 shrink-0">{d.short}</span>
              <span>{d.movements.join(" + ")}</span>
              {today === d.day && <span className="text-muted-foreground ml-auto text-xs">Today</span>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
