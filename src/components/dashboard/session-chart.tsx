"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatDay } from "@/lib/dates";
import { Legend } from "./legend";
import { SERIES_VARS } from "./series";

export interface SessionPoint {
  key: string;
  date: string;
  /** Reps (or seconds) per set, in order. */
  sets: number[];
}

const shortDay = (d: string) => formatDay(d, { weekday: undefined, year: undefined });

/** Every set per session on the current step, one colour per set number, against the target. */
export function SessionChart({
  data,
  target,
  unitLabel,
}: {
  data: SessionPoint[];
  target: number;
  unitLabel: string;
}) {
  const setCount = Math.min(SERIES_VARS.length, Math.max(1, ...data.map((d) => d.sets.length)));
  const setKeys = Array.from({ length: setCount }, (_, i) => `set${i + 1}`);
  const rows = data.map((d) => ({
    key: d.key,
    date: d.date,
    sets: d.sets,
    ...Object.fromEntries(setKeys.map((k, i) => [k, d.sets[i]])),
  }));
  const max = Math.max(target, ...data.flatMap((d) => d.sets));
  const series = setKeys.map((k, i) => ({ slug: k, name: `Set ${i + 1}`, color: SERIES_VARS[i] }));

  return (
    <div className="space-y-2">
      <Legend series={series} />
      <div
        className="h-52 w-full"
        role="img"
        aria-label={`Each set per session versus the ${target} ${unitLabel} progression target`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 16, right: 4, bottom: 0, left: -24 }} barGap={1}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="key"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(k: string) => shortDay(k.slice(0, 10))}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              domain={[0, Math.ceil(max * 1.1)]}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              content={({ active, payload }) => {
                const p = payload?.[0]?.payload as (typeof rows)[number] | undefined;
                if (!active || !p) return null;
                return (
                  <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
                    <p className="mb-1 font-medium">{shortDay(p.date)}</p>
                    {p.sets.map((v, i) => (
                      <p key={i} className="flex items-center gap-1.5 tabular-nums">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: SERIES_VARS[i % SERIES_VARS.length] }}
                          aria-hidden
                        />
                        Set {i + 1}: {v} {unitLabel}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={target}
              stroke="var(--foreground)"
              strokeDasharray="4 4"
              label={{ value: `Target ${target}`, position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            {setKeys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                name={`Set ${i + 1}`}
                fill={SERIES_VARS[i]}
                radius={[3, 3, 0, 0]}
                maxBarSize={14}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
