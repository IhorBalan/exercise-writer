"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatDay } from "@/lib/dates";

export interface SessionPoint {
  key: string;
  date: string;
  best: number;
}

const shortDay = (d: string) => formatDay(d, { weekday: undefined, year: undefined });

/** Best set per session on the current step, against the progression rep target. */
export function SessionChart({
  data,
  target,
  unitLabel,
  color,
}: {
  data: SessionPoint[];
  target: number;
  unitLabel: string;
  color: string;
}) {
  const max = Math.max(target, ...data.map((d) => d.best));
  return (
    <div className="h-52 w-full" role="img" aria-label={`Best set per session versus the ${target} ${unitLabel} progression target`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 4, bottom: 0, left: -24 }}>
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
              const p = payload?.[0]?.payload as SessionPoint | undefined;
              if (!active || !p) return null;
              return (
                <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
                  <p className="font-medium">{shortDay(p.date)}</p>
                  <p className="tabular-nums">
                    Best set: {p.best} {unitLabel}
                  </p>
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
          <Bar dataKey="best" fill={color} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
