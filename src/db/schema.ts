import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const stepUnit = pgEnum("step_unit", ["reps", "seconds"]);
export const standardLevel = pgEnum("standard_level", [
  "beginner",
  "intermediate",
  "progression",
]);

/** The Big Six. Shared by all users, seeded by scripts/migrate.ts. */
export const movements = pgTable("movements", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: smallint("sort_order").notNull(),
});

/** Ten steps per movement with the book's three standards. Shared, seeded. */
export const steps = pgTable(
  "steps",
  {
    id: serial("id").primaryKey(),
    movementId: integer("movement_id")
      .notNull()
      .references(() => movements.id, { onDelete: "cascade" }),
    stepNumber: smallint("step_number").notNull(),
    name: text("name").notNull(),
    unit: stepUnit("unit").notNull().default("reps"),
    beginnerSets: smallint("beginner_sets").notNull(),
    beginnerReps: smallint("beginner_reps").notNull(),
    intermediateSets: smallint("intermediate_sets").notNull(),
    intermediateReps: smallint("intermediate_reps").notNull(),
    progressionSets: smallint("progression_sets").notNull(),
    progressionReps: smallint("progression_reps").notNull(),
  },
  (t) => [uniqueIndex("steps_movement_step_idx").on(t.movementId, t.stepNumber)],
);

/**
 * One training session. `userId` is the Neon Auth user id (users live in the
 * `neon_auth` schema, managed by Neon, so there is no foreign key).
 */
export const workouts = pgTable(
  "workouts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    performedOn: date("performed_on").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("workouts_user_date_idx").on(t.userId, t.performedOn)],
);

/** One movement done in a session: a step, the target level, reps per set. */
export const workoutEntries = pgTable(
  "workout_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workoutId: uuid("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    stepId: integer("step_id")
      .notNull()
      .references(() => steps.id),
    level: standardLevel("level").notNull(),
    /** One value per set: reps, or seconds for timed steps. */
    reps: integer("reps").array().notNull(),
    position: smallint("position").notNull().default(0),
  },
  (t) => [index("workout_entries_workout_idx").on(t.workoutId)],
);

export type Movement = typeof movements.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutEntry = typeof workoutEntries.$inferSelect;
export type StandardLevel = (typeof standardLevel.enumValues)[number];
