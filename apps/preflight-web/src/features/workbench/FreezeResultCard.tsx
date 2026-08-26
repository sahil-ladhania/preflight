/**
 * FreezeResultCard — compile result in the Workbench thread.
 * Why: N rules, applicability, short hash — no wait on judges.
 */

import type { ReactElement } from "react";

import { shortHash } from "@/features/campaign/lib";
import { CommentSheet } from "@/features/workbench/CommentSheet";
import type { FreezeResultCardProps } from "@/features/workbench/types";

export function FreezeResultCard({
  compile,
}: FreezeResultCardProps): ReactElement {
  const ruleCount = compile.ruleIds.length;

  return (
    <CommentSheet label="Freeze">
      <p className="text-body-airy text-fg">
        {ruleCount} {ruleCount === 1 ? "rule" : "rules"} frozen ·{" "}
        <span className="text-hash text-fg-muted">
          {shortHash(compile.rulesetHash)}
        </span>
      </p>
      {compile.rules.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {compile.rules.map((rule) => (
            <li
              key={rule.ruleId}
              className="rounded-md border border-border bg-canvas-subtle/50 px-3 py-2"
            >
              <p className="text-mono text-fg-muted">{rule.ruleId}</p>
              <p className="text-caption text-fg-muted">
                {rule.applicabilityReason}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-caption text-fg-muted">
          No rules apply to this brief.
        </p>
      )}
    </CommentSheet>
  );
}
