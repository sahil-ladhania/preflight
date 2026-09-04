/**
 * DecisionButtons — human action buttons inside expanded finding.
 * Why: extracted from LedgerExpanded for file size (size-and-dry.mdc).
 */

import type { ReactElement } from "react";
import type { FindingDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";

export interface DecisionButtonsProps {
  finding: FindingDTO;
  onConfirm: () => void;
  onOverride: () => void;
  onWaive: () => void;
  onRetry: () => void;
}

export function DecisionButtons({
  finding,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
}: DecisionButtonsProps): ReactElement | null {
  if (finding.machineVerdict === "pass" || finding.evaluationStatus === "pending") {
    return null;
  }

  if (finding.evaluationStatus === "unavailable") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 rounded-none border border-fg px-3 font-sans text-button-sm font-normal text-fg hover:bg-fg hover:text-surface cursor-pointer"
        onClick={onRetry}
      >
        Retry
      </Button>
    );
  }

  if (finding.machineVerdict === "fail" && finding.kind === "deterministic") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 rounded-none border border-decision px-3 font-sans text-button-sm font-medium text-decision hover:bg-decision hover:text-surface cursor-pointer"
        onClick={onWaive}
      >
        Waive
      </Button>
    );
  }

  if (finding.machineVerdict === "fail" && finding.kind === "judgement") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-none border border-fg px-3 font-sans text-button-sm font-medium text-fg hover:bg-fg hover:text-surface cursor-pointer"
          onClick={onConfirm}
        >
          Confirm
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-none border border-fg px-3 font-sans text-button-sm font-medium text-fg hover:bg-fg hover:text-surface cursor-pointer"
          onClick={onOverride}
        >
          Override
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-none border border-decision px-3 font-sans text-button-sm font-medium text-decision hover:bg-decision hover:text-surface cursor-pointer"
          onClick={onWaive}
        >
          Waive
        </Button>
      </div>
    );
  }

  return null;
}
