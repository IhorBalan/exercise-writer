"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { RoutineDays } from "@/components/routine-days";
import { Card, CardContent } from "@/components/ui/card";
import { routineById } from "@/lib/routines";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** The user's routine as a small reference card; today's row is highlighted. */
export function WeeklySchedule({ routineId, className }: { routineId: string; className?: string }) {
  const routine = routineById(routineId);
  // The day comes from the device clock, so the server renders no highlight.
  const today = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getDay(),
    () => null,
  );
  const restDay = today !== null && !routine.days.some((d) => d.day === today);

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-2 px-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
            <CalendarDays className="size-3.5" /> {routine.name}
          </p>
          <Link href="/settings" className="text-muted-foreground text-xs underline-offset-2 hover:underline">
            Change
          </Link>
        </div>
        <RoutineDays routine={routine} today={today} />
        <p className="text-muted-foreground text-xs">
          {restDay ? "Rest day today. " : ""}
          {routine.workSets} work sets per movement.
        </p>
      </CardContent>
    </Card>
  );
}
