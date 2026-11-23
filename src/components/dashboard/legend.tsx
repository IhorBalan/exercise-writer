import type { SeriesDef } from "./series";

export function Legend({ series }: { series: SeriesDef[] }) {
  return (
    <ul className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
      {series.map((s) => (
        <li key={s.slug} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: s.color }} aria-hidden />
          {s.name}
        </li>
      ))}
    </ul>
  );
}
