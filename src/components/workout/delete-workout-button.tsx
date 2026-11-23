"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteWorkoutAction } from "@/app/(app)/log/actions";
import { Button } from "@/components/ui/button";

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="outline"
      className="text-destructive flex-1"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Delete this workout? This can't be undone.")) return;
        startTransition(() => deleteWorkoutAction(workoutId));
      }}
    >
      <Trash2 /> {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
