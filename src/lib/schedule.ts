/** The weekly training split. Reference only: nothing is enforced. */
export const WEEKLY_SCHEDULE = [
  { day: 1, label: "Monday", short: "Mon", movements: ["Pushups", "Leg Raises"] },
  { day: 3, label: "Wednesday", short: "Wed", movements: ["Bridges", "Handstand Pushups"] },
  { day: 5, label: "Friday", short: "Fri", movements: ["Pullups", "Squats"] },
] as const;
