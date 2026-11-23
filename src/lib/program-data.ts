/**
 * The Big Six progressions and their standards, as published in
 * Convict Conditioning. Each standard is [sets, reps]; timed steps use
 * seconds instead of reps (with one set).
 */
export type StandardTuple = readonly [sets: number, reps: number];

export interface StepData {
  name: string;
  unit?: "reps" | "seconds";
  beginner: StandardTuple;
  intermediate: StandardTuple;
  progression: StandardTuple;
}

export interface MovementData {
  slug: string;
  name: string;
  steps: readonly StepData[];
}

const s = (
  name: string,
  beginner: StandardTuple,
  intermediate: StandardTuple,
  progression: StandardTuple,
  unit: "reps" | "seconds" = "reps",
): StepData => ({ name, unit, beginner, intermediate, progression });

export const PROGRAM: readonly MovementData[] = [
  {
    slug: "pushups",
    name: "Pushups",
    steps: [
      s("Wall Pushups", [1, 10], [2, 25], [3, 50]),
      s("Incline Pushups", [1, 10], [2, 20], [3, 40]),
      s("Kneeling Pushups", [1, 10], [2, 15], [3, 30]),
      s("Half Pushups", [1, 8], [2, 12], [2, 25]),
      s("Full Pushups", [1, 5], [2, 10], [2, 20]),
      s("Close Pushups", [1, 5], [2, 10], [2, 20]),
      s("Uneven Pushups", [1, 5], [2, 10], [2, 20]),
      s("1/2 One-Arm Pushups", [1, 5], [2, 10], [2, 20]),
      s("Lever Pushups", [1, 5], [2, 10], [2, 20]),
      s("One-Arm Pushups", [1, 5], [2, 10], [1, 100]),
    ],
  },
  {
    slug: "squats",
    name: "Squats",
    steps: [
      s("Shoulderstand Squats", [1, 10], [2, 25], [3, 50]),
      s("Jackknife Squats", [1, 10], [2, 20], [3, 40]),
      s("Supported Squats", [1, 10], [2, 15], [3, 30]),
      s("Half Squats", [1, 8], [2, 35], [2, 50]),
      s("Full Squats", [1, 5], [2, 10], [2, 30]),
      s("Close Squats", [1, 5], [2, 10], [2, 20]),
      s("Uneven Squats", [1, 5], [2, 10], [2, 20]),
      s("1/2 One-Leg Squats", [1, 5], [2, 10], [2, 20]),
      s("Assisted One-Leg Squats", [1, 5], [2, 10], [2, 20]),
      s("One-Leg Squats", [1, 5], [2, 10], [2, 50]),
    ],
  },
  {
    slug: "pullups",
    name: "Pullups",
    steps: [
      s("Vertical Pulls", [1, 10], [2, 20], [3, 40]),
      s("Horizontal Pulls", [1, 10], [2, 20], [3, 30]),
      s("Jackknife Pulls", [1, 10], [2, 15], [3, 20]),
      s("Half Pullups", [1, 8], [2, 11], [2, 15]),
      s("Full Pullups", [1, 5], [2, 8], [2, 10]),
      s("Close Pullups", [1, 5], [2, 8], [2, 10]),
      s("Uneven Pullups", [1, 5], [2, 7], [2, 9]),
      s("1/2 One-Arm Pullups", [1, 4], [2, 6], [2, 8]),
      s("Assisted One-Arm Pullups", [1, 3], [2, 5], [2, 7]),
      s("One-Arm Pullups", [1, 1], [2, 3], [2, 6]),
    ],
  },
  {
    slug: "leg-raises",
    name: "Leg Raises",
    steps: [
      s("Knee Tucks", [1, 10], [2, 25], [3, 40]),
      s("Flat Knee Raises", [1, 10], [2, 20], [3, 35]),
      s("Flat Bent Leg Raises", [1, 10], [2, 15], [3, 30]),
      s("Flat Frog Raises", [1, 8], [2, 15], [3, 25]),
      s("Flat Straight Leg Raises", [1, 5], [2, 10], [2, 20]),
      s("Hanging Knee Raises", [1, 5], [2, 10], [2, 15]),
      s("Hanging Bent Leg Raises", [1, 5], [2, 10], [2, 15]),
      s("Hanging Frog Raises", [1, 5], [2, 10], [2, 15]),
      s("Partial Straight Leg Raises", [1, 5], [2, 10], [2, 15]),
      s("Hanging Straight Leg Raises", [1, 5], [2, 10], [2, 30]),
    ],
  },
  {
    slug: "bridges",
    name: "Bridges",
    steps: [
      s("Short Bridges", [1, 10], [2, 25], [3, 50]),
      s("Straight Bridges", [1, 10], [2, 20], [3, 40]),
      s("Angled Bridges", [1, 8], [2, 15], [3, 30]),
      s("Head Bridges", [1, 8], [2, 15], [2, 25]),
      s("Half Bridges", [1, 8], [2, 15], [2, 20]),
      s("Full Bridges", [1, 6], [2, 10], [2, 15]),
      s("Wall Walking Bridges (Down)", [1, 3], [2, 6], [2, 10]),
      s("Wall Walking Bridges (Up)", [1, 2], [2, 4], [2, 8]),
      s("Closing Bridges", [1, 1], [2, 3], [2, 6]),
      s("Stand-to-Stand Bridges", [1, 1], [2, 3], [2, 30]),
    ],
  },
  {
    slug: "handstand-pushups",
    name: "Handstand Pushups",
    steps: [
      s("Wall Headstands", [1, 30], [1, 60], [1, 120], "seconds"),
      s("Crow Stands", [1, 10], [1, 30], [1, 60], "seconds"),
      s("Wall Handstands", [1, 30], [1, 60], [1, 120], "seconds"),
      s("Half Handstand Pushups", [1, 5], [2, 10], [2, 20]),
      s("Handstand Pushups", [1, 5], [2, 10], [2, 15]),
      s("Close Handstand Pushups", [1, 5], [2, 9], [2, 12]),
      s("Uneven Handstand Pushups", [1, 5], [2, 8], [2, 10]),
      s("1/2 One-Arm Handstand Pushups", [1, 4], [2, 6], [2, 8]),
      s("Lever Handstand Pushups", [1, 3], [2, 4], [2, 6]),
      s("One-Arm Handstand Pushups", [1, 1], [2, 2], [1, 5]),
    ],
  },
];
