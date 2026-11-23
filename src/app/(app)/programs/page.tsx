import type { Metadata } from "next";

import { getProgram } from "@/lib/data/program";
import { formatStandard, LEVELS, LEVEL_LABEL, standardFor } from "@/lib/standards";

export const metadata: Metadata = { title: "Programs · Exercise Writer" };

export default async function ProgramsPage() {
  const program = await getProgram();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Programs</h1>
        <p className="text-muted-foreground text-sm">The Big Six, ten steps each, with the three standards per step.</p>
      </div>
      {program.length === 0 && (
        <p className="text-muted-foreground text-sm">Program data hasn&apos;t been loaded yet.</p>
      )}
      <div className="space-y-3">
        {program.map((movement) => (
          <details key={movement.id} className="bg-card group rounded-xl border shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
              {movement.name}
              <span className="text-muted-foreground text-sm font-normal transition-transform group-open:rotate-90" aria-hidden>
                ›
              </span>
            </summary>
            <ol className="divide-y border-t">
              {movement.steps.map((step) => (
                <li key={step.id} className="px-4 py-3">
                  <p className="text-sm font-medium">
                    <span className="text-muted-foreground mr-2 tabular-nums">{step.stepNumber}.</span>
                    {step.name}
                  </p>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
                    {LEVELS.map((level) => (
                      <div key={level} className="bg-muted rounded-md px-1 py-1.5">
                        <dt className="text-muted-foreground text-[0.7rem] uppercase tracking-wide">{LEVEL_LABEL[level]}</dt>
                        <dd className="text-sm font-medium tabular-nums">
                          {formatStandard(standardFor(step, level), step.unit)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </div>
  );
}
