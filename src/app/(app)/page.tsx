import Link from "next/link";
import { ChevronRight, Flame, Plus } from "lucide-react";

import { ActivityGrid } from "@/components/dashboard/activity-grid";
import { Legend } from "@/components/dashboard/legend";
import { SERIES_VARS, type SeriesDef } from "@/components/dashboard/series";
import { StepChart } from "@/components/dashboard/step-chart";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { formatDay, todayLocal } from "@/lib/dates";
import { getProgram } from "@/lib/data/program";
import { listStatEntries } from "@/lib/data/workouts";
import { LEVEL_LABEL } from "@/lib/standards";
import { activityGrid, stepTimeline, sum, weekStreak, weeklyVolume } from "@/lib/stats";

function TableView({ children }: { children: React.ReactNode }) {
  return (
    <details className="text-sm">
      <summary className="text-muted-foreground cursor-pointer text-xs">Show as table</summary>
      <div className="mt-2 max-h-64 overflow-auto">{children}</div>
    </details>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [program, entries] = await Promise.all([getProgram(), listStatEntries(getDb(), user.id)]);
  const today = todayLocal();

  const series: SeriesDef[] = program.map((m, i) => ({
    slug: m.slug,
    name: m.name,
    color: SERIES_VARS[i % SERIES_VARS.length],
  }));
  const slugs = series.map((s) => s.slug);

  const latest = new Map<string, (typeof entries)[number]>();
  for (const e of entries) latest.set(e.movementSlug, e); // ordered by date asc → last wins

  const dates = [...new Set(entries.map((e) => e.performedOn))];
  const streak = weekStreak(dates, today);
  const volume = weeklyVolume(entries, slugs, today, 12);
  const timeline = stepTimeline(entries, slugs);
  const grid = activityGrid(entries.map((e) => e.performedOn), today, 16);
  const repsThisWeek = sum(volume.at(-1) ? slugs.map((s) => volume.at(-1)![s] as number) : []);
  const sessions = dates.length;

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Hi, {user.name.split(" ")[0]}</h1>
        <Card>
          <CardHeader>
            <CardTitle>No workouts yet</CardTitle>
            <CardDescription>Log your first session and your progress will show up here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full">
              <Link href="/log">
                <Plus /> Log a workout
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Hi, {user.name.split(" ")[0]}</h1>
        <Button asChild size="sm">
          <Link href="/log">
            <Plus /> Log
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Week streak", value: streak, icon: <Flame className="size-4 text-orange-500" aria-hidden /> },
          { label: "Reps this week", value: repsThisWeek },
          { label: "Sessions", value: sessions },
        ].map((t) => (
          <Card key={t.label} className="gap-1 py-3">
            <CardContent className="px-3">
              <p className="flex items-center gap-1 text-2xl font-semibold tabular-nums">
                {t.value}
                {t.icon}
              </p>
              <p className="text-muted-foreground text-xs">{t.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section aria-labelledby="ladders" className="space-y-2">
        <h2 id="ladders" className="text-sm font-semibold">Where you are</h2>
        <ul className="grid grid-cols-2 gap-2">
          {series.map((s) => {
            const pos = latest.get(s.slug);
            return (
              <li key={s.slug}>
                <Link
                  href={`/movements/${s.slug}`}
                  className="bg-card hover:bg-accent block rounded-xl border p-3 shadow-sm transition-colors"
                >
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden />
                    <span className="truncate">{s.name}</span>
                    <ChevronRight className="text-muted-foreground ml-auto size-4 shrink-0" aria-hidden />
                  </p>
                  {pos ? (
                    <>
                      <p className="mt-1 text-xl font-semibold tabular-nums">
                        Step {pos.stepNumber}
                        <span className="text-muted-foreground text-sm font-normal">/10</span>
                      </p>
                      <div className="bg-muted mt-1 h-1.5 overflow-hidden rounded-full" aria-hidden>
                        <div className="h-full rounded-full" style={{ width: `${pos.stepNumber * 10}%`, background: s.color }} />
                      </div>
                      <p className="text-muted-foreground mt-1.5 truncate text-xs">
                        {LEVEL_LABEL[pos.level]} · {formatDay(pos.performedOn, { weekday: undefined, year: undefined })}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground mt-1 text-sm">Not started</p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Step progression</CardTitle>
          <CardDescription>Highest step trained per movement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <StepChart data={timeline} series={series.filter((s) => latest.has(s.slug))} />
          <Legend series={series.filter((s) => latest.has(s.slug))} />
          <TableView>
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1 font-medium">Date</th>
                  {series.filter((s) => latest.has(s.slug)).map((s) => (
                    <th key={s.slug} className="py-1 font-medium">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeline.map((row) => (
                  <tr key={row.date} className="border-t">
                    <td className="py-1">{formatDay(row.date, { weekday: undefined })}</td>
                    {series.filter((s) => latest.has(s.slug)).map((s) => (
                      <td key={s.slug} className="py-1">{row[s.slug] ?? "–"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableView>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly volume</CardTitle>
          <CardDescription>Total reps per week, last 12 weeks (timed holds not counted)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <VolumeChart data={volume} series={series} />
          <Legend series={series} />
          <TableView>
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1 font-medium">Week of</th>
                  <th className="py-1 font-medium">Total</th>
                  {series.map((s) => (
                    <th key={s.slug} className="py-1 font-medium">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {volume.map((row) => (
                  <tr key={row.week} className="border-t">
                    <td className="py-1">{formatDay(row.week, { weekday: undefined })}</td>
                    <td className="py-1">{sum(slugs.map((s) => row[s] as number))}</td>
                    {series.map((s) => (
                      <td key={s.slug} className="py-1">{row[s.slug]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableView>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consistency</CardTitle>
          <CardDescription>Training days, last 16 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityGrid grid={grid} />
        </CardContent>
      </Card>
    </div>
  );
}
