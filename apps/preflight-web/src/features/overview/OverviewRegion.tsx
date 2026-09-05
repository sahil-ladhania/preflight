/**
 * OverviewRegion — lifted surface for one Overview content instrument.
 * Why: four regions read as distinct units on page ground (08 §13 #28).
 */

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function OverviewRegion({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}): ReactElement {
  return (
    <section
      id={id}
      className={cn(
        "flex flex-col rounded-none bg-surface p-6 shadow-region",
        id !== undefined && "scroll-mt-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
