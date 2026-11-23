"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatDay } from "@/lib/dates";
import { ChartTooltip } from "./chart-tooltip";
import type { SeriesDef } from "./series";

type Row = { date: string } & Record<string, number | null | string>;

const shortDay = (d: string) => formatDay(d, { weekday: undefined, year: undefined });

/**
 * Lines often sit on the same step, so each series is nudged by a small fixed
 * offset to keep every line visible. Tooltips show the real (rounded) step.
 */
export function StepChart({ data, series }: { data: Row[]; series: SeriesDef[] }) {
  const mid = (series.length - 1) / 2;
  const offset = (i: number) => (i - mid) * 0.07;
  const shifted = data.map((row) => {
    const out: Row = { date: row.date };
    series.forEach((s, i) => {
      const v = row[s.slug];
      out[s.slug] = typeof v === "number" ? v + offset(i) : null;
    });
    return out;
  });
  return (
    <div className="h-56 w-full" role="img" aria-label="Current step per movement over time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={shifted} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickFormatter={shortDay}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={[0.5, 10.5]}
            ticks={[1, 4, 7, 10]}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
            content={(props) => (
              <ChartTooltip
                {...(props as object)}
                series={series}
                formatLabel={shortDay}
                formatValue={(v) => `Step ${Math.round(v)}`}
              />
            )}
          />
          {series.map((s) => (
            <Line
              key={s.slug}
              dataKey={s.slug}
              type="stepAfter"
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
