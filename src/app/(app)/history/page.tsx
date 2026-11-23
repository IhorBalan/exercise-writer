import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { formatDay } from "@/lib/dates";
import { listWorkouts } from "@/lib/data/workouts";

export const metadata: Metadata = { title: "History · Exercise Writer" };

export default async function HistoryPage() {
  const user = await requireUser();
  const workouts = await listWorkouts(getDb(), user.id);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        {workouts.length > 0 && (
          <Button asChild variant="outline" size="sm">
            {/* Plain link: the browser downloads the CSV. */}
            <a href="/api/export" download>
              <Download /> Export CSV
            </a>
          </Button>
        )}
      </div>
      {workouts.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-dashed p-6 text-center">
          <p className="text-muted-foreground text-sm">No workouts yet.</p>
          <Button asChild>
            <Link href="/log">Log your first workout</Link>
          </Button>
        </div>
      ) : (
        <ul className="bg-card divide-y rounded-xl border shadow-sm">
          {workouts.map((w) => (
            <li key={w.id}>
              <Link href={`/history/${w.id}`} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{formatDay(w.performedOn)}</p>
                  <p className="text-muted-foreground truncate text-sm">
                    {w.entries
                      .map((e) => `${e.movement.name} ${e.step.stepNumber}`)
                      .join(" · ")}
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
