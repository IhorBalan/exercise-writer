"use client";

import type { SeriesDef } from "./series";

interface Item {
  dataKey?: string | number;
  value?: number | string | null;
}

interface Props {
  active?: boolean;
  label?: string;
  payload?: Item[];
  series: SeriesDef[];
  formatLabel: (label: string) => string;
  formatValue: (v: number) => string;
  hideZero?: boolean;
}

export function ChartTooltip({ active, label, payload, series, formatLabel, formatValue, hideZero }: Props) {
  if (!active || !payload?.length || label == null) return null;
  const rows = series
    .map((s) => ({ s, v: payload.find((p) => p.dataKey === s.slug)?.value }))
    .filter(({ v }) => typeof v === "number" && (!hideZero || v > 0)) as { s: SeriesDef; v: number }[];
  return (
    <div className="bg-popover text-popover-foreground min-w-36 rounded-lg border px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium">{formatLabel(String(label))}</p>
      {rows.length === 0 && <p className="text-muted-foreground">Nothing logged</p>}
      {rows.map(({ s, v }) => (
        <p key={s.slug} className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
            {s.name}
          </span>
          <span className="font-medium tabular-nums">{formatValue(v)}</span>
        </p>
      ))}
    </div>
  );
}
