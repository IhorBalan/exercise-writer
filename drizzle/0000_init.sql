CREATE TYPE "public"."standard_level" AS ENUM('beginner', 'intermediate', 'progression');--> statement-breakpoint
CREATE TYPE "public"."step_unit" AS ENUM('reps', 'seconds');--> statement-breakpoint
CREATE TABLE "movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" smallint NOT NULL,
	CONSTRAINT "movements_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"movement_id" integer NOT NULL,
	"step_number" smallint NOT NULL,
	"name" text NOT NULL,
	"unit" "step_unit" DEFAULT 'reps' NOT NULL,
	"beginner_sets" smallint NOT NULL,
	"beginner_reps" smallint NOT NULL,
	"intermediate_sets" smallint NOT NULL,
	"intermediate_reps" smallint NOT NULL,
	"progression_sets" smallint NOT NULL,
	"progression_reps" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"step_id" integer NOT NULL,
	"level" "standard_level" NOT NULL,
	"reps" integer[] NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"performed_on" date NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "steps_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_entries" ADD CONSTRAINT "workout_entries_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_entries" ADD CONSTRAINT "workout_entries_step_id_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "steps_movement_step_idx" ON "steps" USING btree ("movement_id","step_number");--> statement-breakpoint
CREATE INDEX "workout_entries_workout_idx" ON "workout_entries" USING btree ("workout_id");--> statement-breakpoint
CREATE INDEX "workouts_user_date_idx" ON "workouts" USING btree ("user_id","performed_on");