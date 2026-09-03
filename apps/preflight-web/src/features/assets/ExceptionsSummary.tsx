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
    <div className="flex flex-col gap-3">
      {exceptions.map((item) => (
        <div
          key={item.findingId}
          className="flex flex-col gap-2 border border-decision bg-decision-wash px-4 py-3"
        >
          <p className="text-label-strong uppercase text-decision">
            Waived by human decision{" "}
            <span className="font-mono text-mono-meta normal-case tracking-normal">
              {item.ruleId}
            </span>{" "}
            <span className="font-sans text-caption font-normal normal-case tracking-normal text-fg">
              {item.humanActor} · {formatGeneratedAt(item.humanAt)}
            </span>
          </p>
          <p className="font-serif text-copy italic text-fg">
            &ldquo;{item.humanReason}&rdquo;
          </p>
        </div>
      ))}
    </div>
  );
}
