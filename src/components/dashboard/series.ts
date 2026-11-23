/** Fixed color per movement, in book order (color follows the entity). */
export const SERIES_VARS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
] as const;

export interface SeriesDef {
  slug: string;
  name: string;
  color: string;
}
