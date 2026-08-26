/**
 * ExtractResultCard — dashed extract summary after Workbench handoff.
 * Why: stay on /workbench; operator reviews fields before Save.
 */

import type { ReactElement } from "react";

import { CommentSheet } from "@/features/workbench/CommentSheet";
import { proposalSummaryLines } from "@/features/workbench/journey";
import type { ExtractResultCardProps } from "@/features/workbench/types";

export function ExtractResultCard({
  proposal,
}: ExtractResultCardProps): ReactElement {
  const lines = proposalSummaryLines(proposal);

  return (
    <CommentSheet label="Extracted brief">
      {lines.length === 0 ? (
        <p className="text-body-airy text-fg-muted">No fields extracted.</p>
      ) : (
        <dl className="flex flex-col gap-2">
          {lines.map((line) => (
            <div
              key={line.label}
              className="rounded-md border border-dashed border-border bg-canvas-subtle/50 px-3 py-2"
            >
              <dt className="text-caption text-fg-muted">{line.label}</dt>
              <dd className="text-body-airy text-fg">{line.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </CommentSheet>
  );
}
