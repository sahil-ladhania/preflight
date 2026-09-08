/**
 * ReportFinding — always-expanded check row for the compliance exhibit.
 * Why: S-2 passes listed; machine/human blocks read-only (03 §5).
 */
// size: machine/human/decision-history blocks mirror ledger expanded read-only surface

import type { ReactElement, ReactNode } from "react";
import { Check, Cpu, Stamp, X } from "lucide-react";

import type { FindingDTO } from "@preflight/schemas";

import {
  decisionHistoryFooterLine,
  decisionsNewestFirst,
  decisionTransitionLabel,
  decisionVerdictLabel,
} from "@/features/assets/decision-history-lib";
import { formatGeneratedAt, humanVerdictLabel } from "@/features/assets/lib";
import { findingOffersHumanActions } from "@/features/assets/ledger-lib";
import { cn } from "@/lib/utils";

const UNAVAILABLE_COPY =
  "Evaluation unavailable — span not found in asset. Deterministic results unaffected.";

function SectionMicro({
  label,
  icon,
  className,
}: {
  label: string;
  icon: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-micro uppercase tracking-[0.06em] font-semibold",
        className,
      )}
    >
      <span className="shrink-0" aria-hidden>
        {icon}
      </span>
      {label}
    </p>
  );
}

function MachineSpanQuote({ finding }: { finding: FindingDTO }): ReactElement {
  if (finding.evaluationStatus === "pending") {
    return (
      <p className="font-sans text-caption text-fg-muted">
        Evaluation in progress.
      </p>
    );
  }

  if (finding.evaluationStatus === "unavailable") {
    return (
      <p className="font-sans text-caption text-attention">
        {finding.machineReason ?? UNAVAILABLE_COPY}
      </p>
    );
  }

  if (finding.spans.length === 0) {
    return (
      <p className="font-sans text-caption text-fg-muted">
        No matching span — absence rule.
      </p>
    );
  }

  return (
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
  );
}

function HumanDecisionReadOnly({
  finding,
}: {
  finding: FindingDTO;
}): ReactElement | null {
  if (finding.humanVerdict !== null) {
    const actorName = finding.humanActor?.trim() || "Unrecorded actor";
    const line =
      finding.humanAt !== null
        ? `${humanVerdictLabel(finding.humanVerdict)} · ${actorName} · ${formatGeneratedAt(finding.humanAt)}`
        : humanVerdictLabel(finding.humanVerdict);

    return (
      <div className="flex flex-col gap-1 border border-decision bg-decision-wash px-3 py-2.5">
        <SectionMicro
          label="Human decision"
          icon={<Stamp className="size-3.5 text-decision" />}
          className="text-decision"
        />
        <p className="font-sans text-caption text-fg">{line}</p>
        {finding.humanReason !== null && finding.humanReason.length > 0 ? (
          <p className="font-serif text-copy italic text-fg">
            &ldquo;{finding.humanReason}&rdquo;
          </p>
        ) : null}
      </div>
    );
  }

  if (!findingOffersHumanActions(finding)) {
    return null;
  }

  return (
    <div className="border border-hairline bg-ground px-3 py-2.5">
      <SectionMicro
        label="Human decision"
        icon={<Stamp className="size-3.5 text-fg-muted" />}
        className="text-fg-muted"
      />
      <p className="mt-1 font-sans text-caption text-fg-muted">
        No human decision recorded.
      </p>
    </div>
  );
}

function DecisionHistoryList({
  finding,
}: {
  finding: FindingDTO;
}): ReactElement | null {
  if (finding.decisions.length <= 1) {
    return null;
  }

  const rows = decisionsNewestFirst(finding.decisions);

  return (
    <div className="border-t border-hairline pt-2">
      <p className="font-sans text-caption text-fg-muted">
        {decisionHistoryFooterLine(finding.decisions)}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {rows.map((row) => {
          const transition = decisionTransitionLabel(row);
          return (
            <li
              key={row.id}
              className="font-sans text-caption text-fg-muted"
            >
              {formatGeneratedAt(row.at)} · {decisionVerdictLabel(row)}
              {transition !== null ? ` (${transition})` : null}
              {row.reason !== null && row.reason.length > 0
                ? ` — “${row.reason}”`
                : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ReportFinding({
  finding,
}: {
  finding: FindingDTO;
}): ReactElement {
  const isFail =
    finding.evaluationStatus === "complete" && finding.machineVerdict === "fail";
  const showMachineReason =
    finding.evaluationStatus === "complete" && finding.machineReason !== null;
  const kindLabel = finding.kind === "deterministic" ? "DET" : "JDG";

  return (
    <article className="border border-hairline bg-surface px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {isFail ? (
          <X className="size-3.5 shrink-0 text-fail" aria-hidden />
        ) : (
          <Check className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
        )}
        <span className="font-mono text-mono-meta text-fg">{finding.ruleId}</span>
        <span className="font-mono text-kind-badge uppercase text-fg-muted">
          {kindLabel}
        </span>
      </div>
      <p className="mt-2 font-serif text-serif-row text-fg">
        {finding.frozenWording}
      </p>

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <SectionMicro
            label="Machine finding"
            icon={<Cpu className="size-3.5 text-fg-muted" />}
            className="text-fg-muted"
          />
          <MachineSpanQuote finding={finding} />
          {showMachineReason && finding.machineReason !== null ? (
            <p className="font-sans text-caption text-fg">
              {finding.machineReason}
            </p>
          ) : null}
        </div>

        <HumanDecisionReadOnly finding={finding} />
        <DecisionHistoryList finding={finding} />
      </div>
    </article>
  );
}
