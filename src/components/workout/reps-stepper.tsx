"use client";

import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  label: string;
  value: number;
  unit: "reps" | "seconds";
  onChange: (value: number) => void;
  onRemove?: () => void;
}

export function RepsStepper({ label, value, unit, onChange, onRemove }: Props) {
  const step = unit === "seconds" ? 5 : 1;
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-12 shrink-0 text-sm">{label}</span>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(Math.max(0, value - step))}
      >
        <Minus />
      </Button>
      <div className="relative flex-1">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          aria-label={`${label} ${unit}`}
          className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-md border bg-transparent pr-10 text-center text-lg font-semibold tabular-nums shadow-xs outline-none focus-visible:ring-[3px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Math.floor(Number(e.target.value))))}
        />
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
          {unit === "seconds" ? "sec" : "reps"}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(value + step)}
      >
        <Plus />
      </Button>
      {onRemove ? (
        <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${label}`} onClick={onRemove}>
          <X />
        </Button>
      ) : (
        <span className="size-9 shrink-0" aria-hidden />
      )}
    </div>
  );
}
