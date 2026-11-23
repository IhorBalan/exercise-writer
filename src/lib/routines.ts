/**
 * Training routines from Convict Conditioning. Reference only: they shape the
 * schedule card and nothing is enforced. Movements are program slugs.
 */
export type MovementSlug =
  | "pushups"
  | "squats"
  | "pullups"
  | "leg-raises"
  | "bridges"
  | "handstand-pushups";

export interface RoutineDay {
  /** 0 = Sunday … 6 = Saturday, as Date#getDay. */
  day: number;
  movements: MovementSlug[];
}

export interface Routine {
  id: string;
  name: string;
  summary: string;
  /** Work sets per movement, as text ("2–3"). */
  workSets: string;
  days: RoutineDay[];
}

const SIX_DAY_CYCLE: RoutineDay[] = [
  { day: 1, movements: ["pullups", "squats"] },
  { day: 2, movements: ["pushups", "leg-raises"] },
  { day: 3, movements: ["handstand-pushups", "bridges"] },
  { day: 4, movements: ["pullups", "squats"] },
  { day: 5, movements: ["pushups", "leg-raises"] },
  { day: 6, movements: ["handstand-pushups", "bridges"] },
];

export const ROUTINES: Routine[] = [
  {
    id: "new-blood",
    name: "New Blood",
    summary: "The starting routine: four basic movements over two sessions a week.",
    workSets: "2–3",
    days: [
      { day: 1, movements: ["pushups", "leg-raises"] },
      { day: 5, movements: ["pullups", "squats"] },
    ],
  },
  {
    id: "good-behavior",
    name: "Good Behavior",
    summary: "All of the Big Six over three sessions a week.",
    workSets: "2",
    days: [
      { day: 1, movements: ["pushups", "leg-raises"] },
      { day: 3, movements: ["pullups", "squats"] },
      { day: 5, movements: ["handstand-pushups", "bridges"] },
    ],
  },
  {
    id: "three-day-split",
    name: "Three-day split",
    summary: "Good Behavior with bridges and handstand pushups moved to Wednesday.",
    workSets: "2",
    days: [
      { day: 1, movements: ["pushups", "leg-raises"] },
      { day: 3, movements: ["bridges", "handstand-pushups"] },
      { day: 5, movements: ["pullups", "squats"] },
    ],
  },
  {
    id: "veterano",
    name: "Veterano",
    summary: "One movement a day, six days a week.",
    workSets: "2–3",
    days: [
      { day: 1, movements: ["pullups"] },
      { day: 2, movements: ["bridges"] },
      { day: 3, movements: ["handstand-pushups"] },
      { day: 4, movements: ["leg-raises"] },
      { day: 5, movements: ["squats"] },
      { day: 6, movements: ["pushups"] },
    ],
  },
  {
    id: "solitary-confinement",
    name: "Solitary Confinement",
    summary: "A three-day cycle done twice a week, for experienced trainees.",
    workSets: "3–5",
    days: SIX_DAY_CYCLE,
  },
  {
    id: "supermax",
    name: "Supermax",
    summary: "The same six-day cycle at very high volume, for the advanced.",
    workSets: "10–50",
    days: SIX_DAY_CYCLE,
  },
];

export const DEFAULT_ROUTINE_ID = "new-blood";

export function routineById(id: string | null | undefined): Routine {
  return ROUTINES.find((r) => r.id === id) ?? ROUTINES.find((r) => r.id === DEFAULT_ROUTINE_ID)!;
}

export const MOVEMENT_LABEL: Record<MovementSlug, string> = {
  pushups: "Pushups",
  squats: "Squats",
  pullups: "Pullups",
  "leg-raises": "Leg Raises",
  bridges: "Bridges",
  "handstand-pushups": "Handstand Pushups",
};

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
