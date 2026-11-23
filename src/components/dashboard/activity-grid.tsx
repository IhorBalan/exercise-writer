import { formatDay } from "@/lib/dates";

type Cell = { date: string; count: number; future: boolean };

const DAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

/** Training-day heatmap: one hue, darker = more movements logged that day. */
export function ActivityGrid({ grid }: { grid: Cell[][] }) {
  const fill = (c: Cell) => {
    if (c.future) return "transparent";
    if (c.count === 0) return "var(--muted)";
    const pct = c.count >= 4 ? 100 : c.count === 3 ? 80 : c.count === 2 ? 60 : 40;
    return `color-mix(in oklab, var(--heat) ${pct}%, var(--muted))`;
  };
  return (
    <div className="flex gap-1.5">
      <div className="text-muted-foreground grid grid-rows-7 gap-[3px] text-[10px] leading-none">
        {DAYS.map((d, i) => (
          <span key={i} className="flex h-full items-center">
            {d}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
        {grid.flatMap((week) =>
          week.map((c) => (
            <span
              key={c.date}
              className="aspect-square rounded-[3px]"
              style={{ background: fill(c) }}
              title={c.future ? undefined : `${formatDay(c.date)}: ${c.count ? `${c.count} movement${c.count > 1 ? "s" : ""}` : "rest"}`}
            />
          )),
        )}
      </div>
    </div>
  );
}
