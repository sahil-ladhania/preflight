/**
 * rerun-lib — operator copy for POST /assets/:id/rerun strip.
 * Why: keep lib.ts under line limit; RerunStrip consumes these summaries.
 */

import type { DriftChange, DriftKind, RerunStripDTO } from "@preflight/schemas";

export function rulesetMatchesLive(strip: RerunStripDTO): boolean {
  return strip.rulesetHash === strip.liveRulesetHash;
}

export function rerunEngineVerdict(strip: RerunStripDTO): string {
  if (strip.hashesMatch) {
    return "Deterministic results unchanged — same pass/fail as when this asset was generated.";
  }
  return "Engine mismatch — contact support; stored run hash differs from re-run.";
}

export function rerunDriftSummary(strip: RerunStripDTO): string {
  if (rulesetMatchesLive(strip)) {
    return "Rulebook unchanged since Campaign Freeze.";
  }
  const count = strip.driftItems.length;
  const changeWord = count === 1 ? "change" : "changes";
  return `Rulebook updated since Freeze — ${count} catalog ${changeWord}. Recompile on Campaign to apply new rules to future assets.`;
}

export function driftKindLabel(kind: DriftKind): string {
  if (kind === "definition_changed") {
    return "Definition updated";
  }
  if (kind === "rules_added_outside_freeze") {
    return "New rule (not in this run)";
  }
  return "Removed from catalog";
}

export function driftChangeLabel(change: DriftChange): string {
  if (change === "wording") {
    return "Wording updated";
  }
  if (change === "predicate") {
    return "Rule logic updated";
  }
  return "Matcher updated";
}

export function formatRuleIdDisplay(ruleId: string): string {
  if (ruleId.startsWith("SEBI-") || ruleId.startsWith("AMFI-")) {
    return ruleId;
  }
  return ruleId.slice(0, 8);
}

export function isCatalogRuleId(ruleId: string): boolean {
  return ruleId.startsWith("SEBI-") || ruleId.startsWith("AMFI-");
}
