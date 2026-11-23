import { getDb } from "@/db";
import { getCurrentUser } from "@/lib/auth/session";
import { toCsv } from "@/lib/csv";
import { todayLocal } from "@/lib/dates";
import { listStatEntries } from "@/lib/data/workouts";

export const dynamic = "force-dynamic";

/** Downloads all of the signed-in user's workouts as CSV (one row per entry). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const entries = await listStatEntries(getDb(), user.id);
  const csv = toCsv(
    entries.map((e) => ({
      performedOn: e.performedOn,
      movement: e.movementName,
      stepNumber: e.stepNumber,
      stepName: e.stepName,
      level: e.level,
      unit: e.unit,
      reps: e.reps,
      notes: e.notes,
    })),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="exercise-writer-${todayLocal()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
