/**
 * DecisionHistoryModal — read-only audit trail for finding decisions.
 * Why: full history at 720px measure; ledger row shows link only (09 R4).
 */

import type { ReactElement } from "react";

import type { FindingDecisionDTO, FindingDTO } from "@preflight/schemas";

import {
  decisionHistoryFooterLine,
  decisionsNewestFirst,
  decisionTransitionLabel,
  decisionVerdictLabel,
} from "@/features/assets/decision-history-lib";
import { formatGeneratedAt } from "@/features/assets/lib";
import type { DecisionHistoryModalProps } from "@/features/assets/types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const UNAVAILABLE_COPY =
  "Evaluation unavailable — span not found in asset. Deterministic results unaffected.";

const modalShellClass = cn(
  "flex max-h-[80vh] w-full max-w-[720px] flex-col overflow-hidden rounded-none border border-fg bg-surface p-0 text-fg shadow-none ring-0",
  "duration-0 data-open:animate-none data-closed:animate-none",
);

const modalOverlayClass = cn(
  "bg-[rgba(28,26,23,0.5)] backdrop-blur-none duration-0",
  "data-open:animate-none data-closed:animate-none",
);

const closeLinkClass =
  "shrink-0 cursor-pointer font-sans text-caption font-normal text-fg-muted underline underline-offset-4";

function MachineFindingSection({
  finding,
}: {
  finding: FindingDTO;
}): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-micro uppercase text-fg-muted">Machine finding</p>
      {finding.evaluationStatus === "pending" ? (
        <p className="font-sans text-caption font-normal text-fg-muted">
          Evaluation in progress.
        </p>
      ) : finding.evaluationStatus === "unavailable" ? (
        <p className="font-sans text-caption font-normal text-attention">
          {finding.machineReason ?? UNAVAILABLE_COPY}
        </p>
      ) : finding.spans.length === 0 ? (
        <p className="font-sans text-caption font-normal text-fg-muted">
          No matching span — absence rule.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {finding.spans.map((span) => (
            <p
              key={`${span.start}-${span.end}`}
              className="border-l-2 border-fail py-0 pl-2.5 font-mono text-mono-meta text-fg"
            >
              {span.text}
            </p>
          ))}
        </div>
      )}
      {finding.evaluationStatus === "complete" && finding.machineReason !== null ? (
        <p className="font-sans text-caption font-normal text-fg">
          {finding.machineReason}
        </p>
      ) : null}
    </div>
  );
}

function DecisionEntry({
  row,
  inForce,
}: {
  row: FindingDecisionDTO;
  inForce: boolean;
}): ReactElement {
  const transition = decisionTransitionLabel(row);
  const verdictLine = `${decisionVerdictLabel(row)} · ${row.actor} · ${formatGeneratedAt(row.at)}`;

  return (
    <div
      className={cn(
        inForce
          ? "flex flex-col gap-1 border border-decision bg-decision-wash px-3.5 py-3"
          : "flex flex-col gap-1 border-l-2 border-hairline pl-3",
      )}
    >
      {inForce ? (
        <p className="text-micro uppercase text-decision">In force</p>
      ) : null}
      {transition !== null ? (
        <p className="font-sans text-caption font-normal text-fg-muted">
          {transition}
        </p>
      ) : null}
      <p className="font-sans text-caption font-normal text-fg">{verdictLine}</p>
      {row.reason !== null && row.reason.length > 0 ? (
        <p className="font-serif text-(length:--text-caption) leading-[18px] italic text-fg">
          &ldquo;{row.reason}&rdquo;
        </p>
      ) : null}
    </div>
  );
}

export function DecisionHistoryModal({
  finding,
  open,
  onClose,
}: DecisionHistoryModalProps): ReactElement {
  const sorted = decisionsNewestFirst(finding.decisions);

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={modalOverlayClass}
        className={modalShellClass}
      >
        <header className="shrink-0 border-b border-fg bg-ground px-7 py-5">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-mono-faint text-fg-muted">
              {finding.ruleId}
            </p>
            <button type="button" className={closeLinkClass} onClick={onClose}>
              Close
            </button>
          </div>
          <p className="mt-2 font-serif text-copy text-fg">
            {finding.frozenWording}
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
          <div className="flex flex-col gap-5">
            <MachineFindingSection finding={finding} />
            <div className="border-t border-hairline" aria-hidden />
            <p className="text-micro uppercase text-fg-muted">
              Decisions ({finding.decisions.length})
            </p>
            <div className="flex flex-col gap-4">
              {sorted.map((row, index) => (
                <DecisionEntry
                  key={row.id}
                  row={row}
                  inForce={index === 0}
                />
              ))}
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-hairline px-7 py-4">
          <p className="font-sans text-caption font-normal text-fg-muted">
            {decisionHistoryFooterLine(finding.decisions)}
          </p>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
