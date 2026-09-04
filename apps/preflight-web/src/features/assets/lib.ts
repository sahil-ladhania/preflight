/**
 * lib — assets-only helpers.
 * Why: shortId 8-char truncate and co-located helpers.
 */
// size: caption predicates co-located with accept helpers until extracted on third use

import type {
  AssetStatus,
  Channel,
  ExceptionItemDTO,
  FindingDTO,
  HumanVerdict,
} from "@preflight/schemas";

export const ASSETS_LIST_SUBTITLE =
  "All generated copy and its compliance status — open a row to review.";

const CHANNEL_LABELS: Record<Channel, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  display: "Display",
  whatsapp: "WhatsApp",
  landing: "Landing",
};

export function channelLabel(channel: Channel): string {
  return CHANNEL_LABELS[channel];
}

export function formatRelativeAge(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now.getTime() - then);
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 60) {
    return `${Math.max(1, minutes)}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function formatAssetDetailSubtitle(
  channel: Channel,
  assetId: string,
  generatedAt: string,
): string {
  return `${channelLabel(channel)} · ${shortId(assetId)} · ${formatRelativeAge(generatedAt)} ago`;
}

export function formatContextSubtitle(
  channel: Channel,
  generatedAt: string,
): string {
  return `${channelLabel(channel)} · ${formatRelativeAge(generatedAt)} ago`;
}

export function shortId(id: string): string {
  return id.slice(0, 8);
}

export function complianceReportFilename(assetId: string): string {
  return `preflight-asset-${shortId(assetId)}-report.json`;
}

export function downloadJson(filename: string, payload: unknown): void {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function blockedDetRuleIds(findings: FindingDTO[]): string[] {
  return findings
    .filter(
      (finding) =>
        finding.kind === "deterministic" &&
        finding.machineVerdict === "fail" &&
        finding.humanVerdict !== "waived",
    )
    .map((finding) => finding.ruleId);
}

function openJudgementCount(findings: FindingDTO[]): number {
  return findings.filter(
    (finding) =>
      finding.kind === "judgement" &&
      (finding.evaluationStatus !== "complete" ||
        (finding.machineVerdict === "fail" && finding.humanVerdict === null)),
  ).length;
}

export function acceptDisabledCaption(
  status: AssetStatus,
  findings: FindingDTO[],
): string | null {
  if (findings.length === 0) {
    return "Empty constraint set — not a proof.";
  }
  if (acceptIsEnabled(status)) {
    return null;
  }
  if (status === "blocked") {
    const ruleIds = blockedDetRuleIds(findings);
    return ruleIds.length > 0 ? `Blocked by ${ruleIds.join(", ")}.` : null;
  }
  if (status === "needs_regen") {
    return "Confirmed — the copy must change.";
  }
  if (status === "needs_human") {
    const pending = countPending(findings);
    if (pending > 0) {
      return `Still evaluating ${pending} rules.`;
    }
    const openCount = openJudgementCount(findings);
    return openCount === 1
      ? "1 finding still open."
      : `${openCount} findings still open.`;
  }
  return null;
}

export function acceptIsEnabled(status: AssetStatus): boolean {
  return status === "clear" || status === "cleared_with_exception";
}

export function complianceDeskName(clientName: string): string {
  return `${clientName} Compliance`;
}

export function buildComplianceDeskExceptionsLine(
  status: AssetStatus,
  exceptions: ExceptionItemDTO[],
): string | null {
  if (status !== "cleared_with_exception" || exceptions.length === 0) {
    return null;
  }

  if (exceptions.length === 1) {
    const ruleId = exceptions[0]?.ruleId ?? "unknown";
    return `This asset ships with 1 waived exception (${ruleId}). Exceptions remain visible on this page.`;
  }

  return `This asset ships with ${exceptions.length} waived exceptions. Exceptions remain visible on this page.`;
}

export function formatComplianceDeskHandoffToast(clientName: string): string {
  return `Handed off to ${complianceDeskName(clientName)} — publishing is outside Preflight.`;
}

export function countPending(findings: FindingDTO[]): number {
  return findings.filter((f) => f.evaluationStatus === "pending").length;
}

export function verdictCounts(findings: FindingDTO[]): {
  passed: number;
  needsYou: number;
} {
  let passed = 0;
  let needsYou = 0;
  for (const finding of findings) {
    if (finding.humanVerdict !== null) {
      passed++;
      continue;
    }
    if (
      finding.evaluationStatus === "pending" ||
      finding.evaluationStatus === "unavailable"
    ) {
      needsYou++;
      continue;
    }
    if (finding.machineVerdict === "pass") {
      passed++;
    } else {
      needsYou++;
    }
  }
  return { passed, needsYou };
}

export function findingById(
  findings: FindingDTO[],
  findingId: string,
): FindingDTO | undefined {
  return findings.find((f) => f.id === findingId);
}

export function humanVerdictLabel(verdict: HumanVerdict): string {
  const labels: Record<HumanVerdict, string> = {
    confirmed: "Confirmed",
    overridden: "Overridden",
    waived: "Waived",
  };
  return labels[verdict];
}

export function isFailFinding(finding: FindingDTO): boolean {
  return (
    finding.evaluationStatus === "complete" && finding.machineVerdict === "fail"
  );
}

export function scrollFindingTarget(
  findingId: string,
  target: "span" | "row",
): void {
  const attribute =
    target === "span" ? "data-finding-span" : "data-finding-row";
  document
    .querySelector(`[${attribute}="${findingId}"]`)
    ?.scrollIntoView({ block: "nearest" });
}
