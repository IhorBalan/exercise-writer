import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SERIES_VARS } from "@/components/dashboard/series";
import { SessionChart } from "@/components/dashboard/session-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { formatDay } from "@/lib/dates";
import { getProgram } from "@/lib/data/program";
import { listStatEntries } from "@/lib/data/workouts";
import { formatStandard, highestLevelMet, LEVELS, LEVEL_LABEL, standardFor } from "@/lib/standards";

export const metadata: Metadata = { title: "Movement · Exercise Writer" };

export default async function MovementPage({ params }: PageProps<"/movements/[slug]">) {
  const { slug } = await params;
  const user = await requireUser();
  const [program, entries] = await Promise.all([getProgram(), listStatEntries(getDb(), user.id)]);
  const index = program.findIndex((m) => m.slug === slug);
  if (index === -1) notFound();
  const movement = program[index];
  const color = SERIES_VARS[index % SERIES_VARS.length];

  const mine = entries.filter((e) => e.movementSlug === slug);
  const last = mine.at(-1);
  const step = movement.steps.find((s) => s.stepNumber === (last?.stepNumber ?? 1))!;
  const onStep = mine.filter((e) => e.stepNumber === step.stepNumber);
  const target = standardFor(step, "progression");
  const unitLabel = step.unit === "seconds" ? "sec" : "reps";
  const points = onStep.map((e, i) => ({
    key: `${e.performedOn}#${i}`,
    date: e.performedOn,
    best: Math.max(...e.reps),
  }));
  const bestEver = onStep.reduce<(typeof LEVELS)[number] | null>((acc, e) => {
    const lvl = highestLevelMet(e.reps, step);
    if (!lvl) return acc;
    return !acc || LEVELS.indexOf(lvl) > LEVELS.indexOf(acc) ? lvl : acc;
  }, null);

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/">
          <ArrowLeft /> Dashboard
        </Link>
      </Button>
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <span className="size-3 rounded-full" style={{ background: color }} aria-hidden />
          {movement.name}
        </h1>
        <p className="text-muted-foreground text-sm">
          {last ? `Step ${step.stepNumber} of 10 · ${step.name}` : "Not started yet"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Standards for step {step.stepNumber}</CardTitle>
          <CardDescription>
            {bestEver ? `Best so far: ${LEVEL_LABEL[bestEver]} standard met` : "No standard met yet on this step"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {LEVELS.map((level) => (
              <div
                key={level}
                className="bg-muted rounded-md px-1 py-2 data-[met=true]:ring-2 data-[met=true]:ring-emerald-500"
                data-met={bestEver != null && LEVELS.indexOf(level) <= LEVELS.indexOf(bestEver)}
              >
                <dt className="text-muted-foreground text-[0.7rem] uppercase tracking-wide">{LEVEL_LABEL[level]}</dt>
                <dd className="text-sm font-medium tabular-nums">{formatStandard(standardFor(step, level), step.unit)}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {points.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best set per session</CardTitle>
            <CardDescription>
              Step {step.stepNumber}, dashed line = progression target ({target.reps} {unitLabel}
              {target.sets > 1 ? ` × ${target.sets} sets` : ""})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionChart data={points} target={target.reps} unitLabel={unitLabel} color={color} />
          </CardContent>
        </Card>
      )}

      {mine.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {mine
                .slice(-15)
                .reverse()
                .map((e, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 py-2">
                    <div>
                      <p className="font-medium">{formatDay(e.performedOn)}</p>
                      <p className="text-muted-foreground text-xs">
                        Step {e.stepNumber} · {e.reps.join(" · ")} {unitLabel}
                      </p>
                    </div>
                    <Badge variant="secondary">{LEVEL_LABEL[e.level]}</Badge>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
