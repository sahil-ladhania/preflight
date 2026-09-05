/**
 * ExceptionRow — one standing waiver record for Overview.
 * Why: record not alarm; serif italic for human words.
 */

import type { ReactElement } from "react";
import { UserRound } from "lucide-react";

import { formatGeneratedAt } from "@/features/assets/lib";
import type { OverviewExceptionRow } from "@/features/overview/types";

export function ExceptionRow({
  row,
}: {
  row: OverviewExceptionRow;
}): ReactElement {
  return (
    <div className="flex flex-col gap-2 border-b border-hairline px-3 py-4">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-mono text-mono-meta text-fg">{row.ruleId}</span>
        <span className="font-serif text-serif-row text-fg">{row.headline}</span>
      </div>
      <p className="inline-flex items-center gap-1.5 text-caption text-fg-muted">
        <UserRound className="size-3 shrink-0" aria-hidden="true" />
        {row.humanActor} · {formatGeneratedAt(row.humanAt)}
      </p>
      <p className="font-serif text-serif-row italic text-fg">
        &ldquo;{row.humanReason}&rdquo;
      </p>
    </div>
  );
}
