import { formCues } from "@/lib/form-cues";
import { cn } from "@/lib/utils";

/** Collapsed "How to do it" notes for one step. */
export function FormCues({
  movementSlug,
  stepNumber,
  className,
}: {
  movementSlug: string;
  stepNumber: number;
  className?: string;
}) {
  const cues = formCues(movementSlug, stepNumber);
  if (cues.length === 0) return null;
  return (
    <details className={cn("group text-sm", className)}>
      <summary className="text-muted-foreground flex cursor-pointer list-none items-center gap-1 text-xs font-medium [&::-webkit-details-marker]:hidden">
        <span className="transition-transform group-open:rotate-90" aria-hidden>
          ›
        </span>
        How to do it
      </summary>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {cues.map((cue) => (
          <li key={cue}>{cue}</li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-2 text-xs">
        A short summary. See Convict Conditioning for the full instructions.
      </p>
    </details>
  );
}
