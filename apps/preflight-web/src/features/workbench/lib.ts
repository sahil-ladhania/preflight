/**
 * lib — workbench-only helpers.
 * Why: catalog filter and message id generation.
 */

import type { RuleCatalogRowDTO } from "@preflight/schemas";

export const WORKBENCH_EMPTY_PROMPT =
  "Ask about a rule, applicability, or what Preflight checks.";

export function nextMessageId(): string {
  return crypto.randomUUID();
}

export function rulesForIds(
  rules: RuleCatalogRowDTO[],
  ruleIds: string[],
): RuleCatalogRowDTO[] {
  const byId = new Map(rules.map((rule) => [rule.ruleId, rule]));
  return ruleIds
    .map((ruleId) => byId.get(ruleId))
    .filter((rule): rule is RuleCatalogRowDTO => rule !== undefined);
}

export function searchRules(
  rules: RuleCatalogRowDTO[],
  query: string,
  limit = 10,
): RuleCatalogRowDTO[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return [];
  }
  return rules
    .filter(
      (rule) =>
        rule.ruleId.toLowerCase().includes(needle) ||
        rule.wording.toLowerCase().includes(needle),
    )
    .slice(0, limit);
}
