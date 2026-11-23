import type { Metadata } from "next";

import { RoutinePicker } from "@/components/routine-picker";
import { getDb } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { getRoutine } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Settings · Exercise Writer" };

export default async function SettingsPage() {
  const user = await requireUser();
  const routine = await getRoutine(getDb(), user.id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Pick the routine you follow. Its schedule shows on Log and Programs as a reminder; you
          can still log any movement on any day.
        </p>
      </div>
      <RoutinePicker selectedId={routine.id} />
    </div>
  );
}
