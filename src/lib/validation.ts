import { z } from "zod";

export const workoutInputSchema = z.object({
  performedOn: z.iso.date("Pick a valid date."),
  notes: z
    .string()
    .trim()
    .max(2000, "Keep the note under 2000 characters.")
    .nullable()
    .transform((v) => (v ? v : null)),
  entries: z
    .array(
      z.object({
        stepId: z.number().int().positive(),
        level: z.enum(["beginner", "intermediate", "progression"]),
        reps: z
          .array(z.number().int().min(0).max(10000))
          .min(1, "Add at least one set.")
          .max(20, "That's a lot of sets. Keep it to 20."),
        warmups: z
          .array(
            z.object({
              stepId: z.number().int().positive(),
              reps: z.number().int().min(0).max(10000),
            }),
          )
          .max(2, "Keep it to two warm-ups per movement.")
          .default([]),
      }),
    )
    .min(1, "Add at least one movement.")
    .max(12),
});

export type WorkoutFormInput = z.input<typeof workoutInputSchema>;
