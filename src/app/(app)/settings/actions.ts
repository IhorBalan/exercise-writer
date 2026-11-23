"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { setRoutine } from "@/lib/data/settings";
import { ROUTINES } from "@/lib/routines";

const routineSchema = z.enum(ROUTINES.map((r) => r.id) as [string, ...string[]]);

export async function saveRoutineAction(routineId: string): Promise<void> {
  const user = await requireUser();
  const parsed = routineSchema.safeParse(routineId);
  if (!parsed.success) return;
  await setRoutine(getDb(), user.id, parsed.data);
  revalidatePath("/", "layout");
}
