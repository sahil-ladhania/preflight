/**
 * RulePressureRow — one ranked rule row matching Rulebook shape.
 * Why: rule ID mono, wording serif, DET/JDG badge — no third treatment.
 */

import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { rulePressureCountLabel } from "@/features/overview/overview-copy";
import type { RulePressureRow } from "@/features/overview/types";

export function RulePressureRowView({
  row,
  suffix,
}: {
  row: RulePressureRow;
  suffix: "failed" | "waived";
}): ReactElement {
  return (
    <div className="grid grid-cols-[100px_60px_minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline px-3 py-2.5">
      <span className="font-mono text-mono-meta text-fg">{row.ruleId}</span>
      <Badge
        variant="outline"
        className="w-fit border-0 p-0 font-mono text-kind-badge font-normal uppercase text-fg-muted"
      >
        {row.kind === "deterministic" ? "DET" : "JDG"}
      </Badge>
      <span className="font-serif text-serif-row text-fg">{row.wording}</span>
      <span className="whitespace-nowrap font-sans text-caption text-fg-muted">
        {rulePressureCountLabel(row.eventCount, row.assetCount, suffix)}
      </span>
    </div>
  );
}
