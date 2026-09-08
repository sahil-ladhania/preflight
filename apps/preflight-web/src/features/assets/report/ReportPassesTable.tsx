/**
 * ReportPassesTable — compact pass checklist for the compliance exhibit.
 * Why: S-2 passes listed without full expanded cards (report UX plan).
 */

import type { ReactElement } from "react";
import { Check } from "lucide-react";

import type { FindingDTO } from "@preflight/schemas";

export function ReportPassesTable({
  passes,
}: {
  passes: FindingDTO[];
}): ReactElement | null {
  if (passes.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-hairline py-6">
      <h2 className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
        Passed — {passes.length} rules
      </h2>
      <ul className="mt-3 border border-hairline bg-surface">
        {passes.map((finding) => {
          const kindLabel = finding.kind === "deterministic" ? "DET" : "JDG";

          return (
            <li
              key={finding.id}
              className="flex gap-2 border-b border-hairline px-3 py-2 last:border-b-0"
            >
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-fg-muted"
                aria-hidden
              />
              <div className="min-w-0 flex flex-col gap-0.5">
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-mono-meta text-fg">
                    {finding.ruleId}
                  </span>
                  <span className="font-mono text-kind-badge uppercase text-fg-muted">
                    {kindLabel}
                  </span>
                </p>
                <p className="font-serif text-serif-row text-fg">
                  {finding.frozenWording}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
