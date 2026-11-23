CREATE TABLE "workout_warmups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"step_id" integer NOT NULL,
	"reps" integer NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout_warmups" ADD CONSTRAINT "workout_warmups_entry_id_workout_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."workout_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_warmups" ADD CONSTRAINT "workout_warmups_step_id_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workout_warmups_entry_idx" ON "workout_warmups" USING btree ("entry_id");