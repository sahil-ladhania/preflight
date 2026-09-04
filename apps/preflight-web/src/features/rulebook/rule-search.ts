/**
 * rule-search — client-side filter over the loaded rules catalog.
 * Why: single permitted logic addition per Phase 3b.
 * Matches on rule ID, wording, and applicability summary, case-insensitive.
 */

import type { RuleCatalogRowDTO } from "@preflight/schemas";

export function filterCatalogRules(
  rules: RuleCatalogRowDTO[],
  query: string,
): RuleCatalogRowDTO[] {
  if (!Array.isArray(rules)) {
    return [];
  }
  const normalized = (query ?? "").trim().toLowerCase();
  if (normalized.length === 0) {
    return rules;
  }

  return rules.filter((rule) => {
    if (!rule) return false;
    const ruleId = typeof rule.ruleId === "string" ? rule.ruleId.toLowerCase() : "";
    const wording = typeof rule.wording === "string" ? rule.wording.toLowerCase() : "";
    const summary =
      typeof rule.applicabilitySummary === "string"
        ? rule.applicabilitySummary.toLowerCase()
        : "";
    return (
      ruleId.includes(normalized) ||
      wording.includes(normalized) ||
      summary.includes(normalized)
    );
  });
}
