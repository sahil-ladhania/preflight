/**
 * report-lib — compliance exhibit copy and status folding prose.
 * Why: auditor-facing sentences derived from ComplianceReportDTO (thinking.md).
 */

import type {
  AssetStatus,
  ComplianceReportDTO,
  FindingDTO,
} from "@preflight/schemas";

import { shortId } from "@/features/assets/lib";

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

function confirmedRegenRuleIds(findings: FindingDTO[]): string[] {
  return findings
    .filter(
      (finding) =>
        finding.kind === "judgement" &&
        finding.machineVerdict === "fail" &&
        finding.humanVerdict === "confirmed",
    )
    .map((finding) => finding.ruleId);
}

function waivedRuleIds(findings: FindingDTO[]): string[] {
  return findings
    .filter((finding) => finding.humanVerdict === "waived")
    .map((finding) => finding.ruleId);
}

function openFindingRuleIds(findings: FindingDTO[]): string[] {
  return findings
    .filter(
      (finding) =>
        finding.evaluationStatus !== "complete" ||
        (finding.machineVerdict === "fail" && finding.humanVerdict === null),
    )
    .map((finding) => finding.ruleId);
}

function joinRuleIds(ruleIds: string[]): string {
  if (ruleIds.length === 0) {
    return "";
  }
  if (ruleIds.length === 1) {
    return ruleIds[0] ?? "";
  }
  if (ruleIds.length === 2) {
    return `${ruleIds[0]} and ${ruleIds[1]}`;
  }
  const head = ruleIds.slice(0, -1).join(", ");
  const last = ruleIds[ruleIds.length - 1];
  return `${head}, and ${last}`;
}

export function reportStatusClosingSentence(
  status: AssetStatus,
  findings: FindingDTO[],
): string {
  if (status === "blocked") {
    const ruleIds = blockedDetRuleIds(findings);
    const joined = joinRuleIds(ruleIds);
    return joined.length > 0
      ? `Blocked because unwaived ${joined}.`
      : "Blocked — deterministic failure without waiver.";
  }

  if (status === "needs_regen") {
    const ruleIds = confirmedRegenRuleIds(findings);
    const joined = joinRuleIds(ruleIds);
    return joined.length > 0
      ? `Needs regenerate — human confirmed ${joined}.`
      : "Needs regenerate — confirmed judgement failure.";
  }

  if (status === "needs_human") {
    const ruleIds = openFindingRuleIds(findings);
    const joined = joinRuleIds(ruleIds);
    return joined.length > 0
      ? `Review in progress — open on ${joined}.`
      : "Review in progress — human decision required.";
  }

  if (status === "cleared_with_exception") {
    const ruleIds = waivedRuleIds(findings);
    const joined = joinRuleIds(ruleIds);
    return joined.length > 0
      ? `Cleared with exception — waived ${joined}.`
      : "Cleared with exception — waiver on record.";
  }

  return "Clear — every check resolved without exception.";
}

export function reportGeneratorProvenance(
  report: ComplianceReportDTO,
): string {
  const run = report.generatorRun;
  if (run === null) {
    return "Seeded — no live generator run";
  }
  return `${run.model} v${run.agentDefVersion} · ${run.latencyMs}ms · ${run.totalTokens ?? 0} tokens`;
}

export function reportIdentityCampaignLine(report: ComplianceReportDTO): string {
  return `Campaign ${shortId(report.campaignId)}`;
}

export function sortFindingsForReport(findings: FindingDTO[]): FindingDTO[] {
  return [...findings].sort((left, right) =>
    left.ruleId.localeCompare(right.ruleId),
  );
}

export function sortSnapshotsForReport(
  snapshots: ComplianceReportDTO["snapshots"],
): ComplianceReportDTO["snapshots"] {
  return [...snapshots].sort((left, right) =>
    left.ruleId.localeCompare(right.ruleId),
  );
}

export function isMaterialReportFinding(finding: FindingDTO): boolean {
  if (finding.humanVerdict !== null) {
    return true;
  }
  if (finding.evaluationStatus !== "complete") {
    return true;
  }
  return finding.machineVerdict === "fail";
}

export function partitionFindingsForReport(findings: FindingDTO[]): {
  material: FindingDTO[];
  passes: FindingDTO[];
} {
  const sorted = sortFindingsForReport(findings);
  const material: FindingDTO[] = [];
  const passes: FindingDTO[] = [];

  for (const finding of sorted) {
    if (isMaterialReportFinding(finding)) {
      material.push(finding);
    } else {
      passes.push(finding);
    }
  }

  return { material, passes };
}

export interface ReportCheckSummary {
  total: number;
  passed: number;
  failed: number;
  waived: number;
  open: number;
}

export function reportCheckSummary(findings: FindingDTO[]): ReportCheckSummary {
  const { passes } = partitionFindingsForReport(findings);
  let failed = 0;
  let waived = 0;
  let open = 0;

  for (const finding of findings) {
    if (finding.humanVerdict === "waived") {
      waived += 1;
    }
    if (finding.evaluationStatus !== "complete") {
      open += 1;
      continue;
    }
    if (finding.machineVerdict === "fail") {
      failed += 1;
      if (finding.humanVerdict === null) {
        open += 1;
      }
    }
  }

  return {
    total: findings.length,
    passed: passes.length,
    failed,
    waived,
    open,
  };
}
