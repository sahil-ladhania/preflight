/**
 * NextActionBlock — Screen 1 pinned terminal action block.
 * Why: single driven next step for Arjun across every state (09 Screen 1 R3a/R4).
 */

import type { ReactElement } from "react";

import type { AssetStatus, FindingDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { openFindings } from "@/features/assets/ledger-lib";

export interface NextActionBlockProps {
  status: AssetStatus;
  findings: FindingDTO[];
  onAccept: () => void;
  onRegenerate: () => void;
  regenerateInFlight?: boolean;
}

export function NextActionBlock({
  status,
  findings,
  onAccept,
  onRegenerate,
  regenerateInFlight = false,
}: NextActionBlockProps): ReactElement | null {
  // New rule: Suppress block when any finding is still open.
  // The HUMAN DECISION — REQUIRED box is the next action; sticky header keeps {m} need you visible.
  if (openFindings(findings).length > 0) {
    return null;
  }

  if (status === "needs_regen") {
    const confirmed = findings.find((f) => f.humanVerdict === "confirmed");
    const ruleId = confirmed?.ruleId ?? "a rule";

    return (
      <div className="m-4 flex flex-col gap-3 border border-hairline bg-surface p-4">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-decision">
          Regenerate to ship
        </p>
        <p className="font-sans text-caption text-fg-muted">
          You confirmed {ruleId} as a real failure. This copy cannot ship —
          generate a new version.
        </p>
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-none border border-fg bg-surface px-4 font-sans text-xs font-medium text-fg hover:bg-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={regenerateInFlight}
            onClick={onRegenerate}
          >
            {regenerateInFlight ? "Regenerating…" : "Regenerate copy"}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "clear" || status === "cleared_with_exception") {
    return (
      <div className="m-4 flex flex-col gap-3 border border-hairline bg-surface p-4">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-decision">
          Ready for the compliance desk
        </p>
        <p className="font-sans text-caption text-fg-muted">
          Every pinned rule has been evaluated or carries a recorded human
          decision. Preflight does not publish.
        </p>
        <div className="pt-1">
          <Button
            type="button"
            className="h-8 rounded-none border border-fg bg-fg px-4 font-sans text-xs font-medium text-surface hover:opacity-90 cursor-pointer"
            onClick={onAccept}
          >
            Ready for compliance desk
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
