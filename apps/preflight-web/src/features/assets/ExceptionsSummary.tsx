/**
 * ExceptionsSummary — R2 waived rules block.
 * Why: exceptions visible even under blocked status.
 */

import type { ReactElement } from "react";

import type { ExceptionsSummaryProps } from "@/features/assets/types";
import { formatGeneratedAt } from "@/features/assets/lib";

export function ExceptionsSummary({
  exceptions,
}: ExceptionsSummaryProps): ReactElement {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface px-4 py-2">
      <p className="text-caption text-fg-muted">Exceptions</p>
      {exceptions.map((item) => (
        <div key={item.findingId} className="flex flex-col gap-1">
          <p className="text-caption text-fg-muted">
            <span className="text-mono">{item.ruleId}</span>
            {" · "}
            <span className="inline-flex items-center px-[5px] py-px text-verdict-chip uppercase chip-waived">
              Waived
            </span>
            {" · "}
            {item.humanActor}
            {" · "}
            {formatGeneratedAt(item.humanAt)}
          </p>
          <p className="text-body text-fg">{item.humanReason}</p>
        </div>
      ))}
    </div>
  );
}
