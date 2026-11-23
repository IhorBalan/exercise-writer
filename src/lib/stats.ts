/**
 * Pure helpers that turn a user's logged entries into dashboard series.
 * Dates are YYYY-MM-DD strings; all week math is in UTC on those strings, so
 * results don't depend on the server's time zone.
 */

export interface StatEntry {
  performedOn: string;
  movementSlug: string;
  stepNumber: number;
  unit: "reps" | "seconds";
  reps: number[];
}

const DAY = 86_400_000;

export function toUtc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Monday of the ISO week containing the date. */
export function weekStart(iso: string): string {
  const ms = toUtc(iso);
  const dow = (new Date(ms).getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  return toIso(ms - dow * DAY);
}

export const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** Total reps per week per movement for the last `weeks` weeks (timed holds excluded). */
export function weeklyVolume(
  entries: readonly StatEntry[],
  slugs: readonly string[],
  today: string,
  weeks = 12,
): Array<{ week: string } & Record<string, number | string>> {
  const lastWeek = toUtc(weekStart(today));
  const rows = new Map<string, { week: string } & Record<string, number | string>>();
  for (let i = weeks - 1; i >= 0; i--) {
    const week = toIso(lastWeek - i * 7 * DAY);
    const row: { week: string } & Record<string, number | string> = { week };
    for (const s of slugs) row[s] = 0;
    rows.set(week, row);
  }
  for (const e of entries) {
    if (e.unit !== "reps") continue;
    const row = rows.get(weekStart(e.performedOn));
    if (row) row[e.movementSlug] = (row[e.movementSlug] as number) + sum(e.reps);
  }
  return [...rows.values()];
}

/**
 * Highest step trained per movement on each training day, carried forward so
 * every line continues until the next change. Movements appear from their
 * first session on (null before that).
 */
export function stepTimeline(
  entries: readonly StatEntry[],
  slugs: readonly string[],
): Array<{ date: string } & Record<string, number | null | string>> {
  const byDate = new Map<string, Map<string, number>>();
  for (const e of entries) {
    const day = byDate.get(e.performedOn) ?? new Map<string, number>();
    day.set(e.movementSlug, Math.max(day.get(e.movementSlug) ?? 0, e.stepNumber));
    byDate.set(e.performedOn, day);
  }
  const current: Record<string, number | null> = Object.fromEntries(slugs.map((s) => [s, null]));
  return [...byDate.keys()].sort().map((date) => {
    for (const [slug, step] of byDate.get(date)!) current[slug] = step;
    return { date, ...current };
  });
}

/** Consecutive weeks (ending this week, or last week if this one is still empty) with a workout. */
export function weekStreak(dates: readonly string[], today: string): number {
  const weeks = new Set(dates.map(weekStart));
  let cursor = toUtc(weekStart(today));
  if (!weeks.has(toIso(cursor))) cursor -= 7 * DAY;
  let streak = 0;
  while (weeks.has(toIso(cursor))) {
    streak++;
    cursor -= 7 * DAY;
  }
  return streak;
}

/** Training days in the last `weeks` weeks as a Monday-first grid of [week][day]. */
export function activityGrid(
  dates: readonly string[],
  today: string,
  weeks = 16,
): { date: string; count: number; future: boolean }[][] {
  const counts = new Map<string, number>();
  for (const d of dates) counts.set(d, (counts.get(d) ?? 0) + 1);
  const end = toUtc(today);
  const firstMonday = toUtc(weekStart(today)) - (weeks - 1) * 7 * DAY;
  const grid: { date: string; count: number; future: boolean }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const ms = firstMonday + (w * 7 + d) * DAY;
      const date = toIso(ms);
      col.push({ date, count: counts.get(date) ?? 0, future: ms > end });
    }
    grid.push(col);
  }
  return grid;
}
