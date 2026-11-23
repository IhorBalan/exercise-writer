import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** A styled native <select>: best picker UX on phones. */
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="native-select"
        className={cn(
          "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full appearance-none rounded-md border bg-transparent py-1 pr-9 pl-3 text-base shadow-xs outline-none focus-visible:ring-[3px] disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
        aria-hidden
      />
    </div>
  );
}

export { NativeSelect };
