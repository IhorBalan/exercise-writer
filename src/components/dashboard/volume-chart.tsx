"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatDay } from "@/lib/dates";
import { ChartTooltip } from "./chart-tooltip";
import type { SeriesDef } from "./series";

type Row = { week: string } & Record<string, number | string>;

const shortWeek = (w: string) => formatDay(w, { weekday: undefined, year: undefined });

export function VolumeChart({ data, series }: { data: Row[]; series: SeriesDef[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Total reps per week, stacked by movement">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barCategoryGap="20%">
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickFormatter={shortWeek}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            width={36}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            content={(props) => (
              <ChartTooltip
                {...(props as object)}
                series={series}
                hideZero
                formatLabel={(w) => `Week of ${shortWeek(w)}`}
                formatValue={(v) => `${v} reps`}
              />
            )}
          />
          {series.map((s, i) => (
            <Bar
              key={s.slug}
              dataKey={s.slug}
              stackId="volume"
              fill={s.color}
              stroke="var(--card)"
              strokeWidth={1}
              radius={i === series.length - 1 ? [4, 4, 0, 0] : 0}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
