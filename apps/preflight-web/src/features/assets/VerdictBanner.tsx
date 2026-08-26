/**
 * VerdictBanner — one-line verdict summary and primary decision actions.
 * Why: review-at-end moment after autonomous build (doc 19).
 */

import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import type { AssetStatus, FindingDTO } from "@preflight/schemas";

import {
  acceptDisabledCaption,
  acceptIsEnabled,
  verdictCounts,
} from "@/features/assets/lib";

export function VerdictBanner({
  status,
  findings,
  onApprove,
  onRegenerate,
  regenerateInFlight = false,
}: {
  status: AssetStatus;
  findings: FindingDTO[];
  onApprove: () => void;
  onRegenerate: () => void;
  regenerateInFlight?: boolean;
}): ReactElement {
  const { passed, needsYou } = verdictCounts(findings);
  const approveEnabled = acceptIsEnabled(status);
  const disabledCaption = acceptDisabledCaption(status, findings.length);

  const passedLabel = passed === 1 ? "1 rule passed" : `${passed} rules passed`;
  const needsLabel =
    needsYou === 1 ? "1 needs you" : `${needsYou} need you`;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-canvas px-4 py-3">
      <p className="text-body font-medium text-fg">
        {passedLabel} · {needsLabel}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          className="h-9 rounded-md px-5"
          disabled={!approveEnabled}
          onClick={approveEnabled ? onApprove : undefined}
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-md px-5"
          disabled={regenerateInFlight}
          onClick={onRegenerate}
        >
          {regenerateInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "Regenerate"
          )}
        </Button>
      </div>
      {!approveEnabled && disabledCaption !== null ? (
        <p className="text-caption text-fg-muted">{disabledCaption}</p>
      ) : null}
    </div>
  );
}
