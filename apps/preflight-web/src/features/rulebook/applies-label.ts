/**
 * applies-label — plain-language applicator strings for Rulebook table.
 * Why: plain-English summaries ("Every campaign", "Campaigns on LinkedIn or email").
 */

import type { PredicateSpec, RuleCatalogRowDTO } from "@preflight/schemas";

const CHANNEL_TITLES: Record<string, string> = {
  linkedin: "LinkedIn",
  email: "email",
  whatsapp: "WhatsApp",
  display: "display",
  landing: "landing page",
};

function formatOrList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} or ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}

export function formatPredicateSpec(spec?: PredicateSpec | null): string {
  if (!spec || typeof spec !== "object") {
    return "Every campaign";
  }
  const val = spec.value;
  const rawList: string[] = Array.isArray(val)
    ? val.map((v) => String(v ?? ""))
    : val !== undefined && val !== null
      ? [String(val)]
      : [];

  if (rawList.length === 0) {
    return "Every campaign";
  }

  if (spec.field === "channels") {
    const formatted = rawList.map((c) => CHANNEL_TITLES[c.toLowerCase()] ?? c);
    return `Campaigns on ${formatOrList(formatted)}`;
  }
  if (spec.field === "claims") {
    const formatted = rawList.map((c) => c.replace(/-/g, " "));
    return `Campaigns claiming ${formatOrList(formatted)}`;
  }
  if (spec.field === "market" || spec.field === "audience") {
    return `Campaigns targeting ${formatOrList(rawList)}`;
  }
  if (spec.field === "schemeCategory") {
    return `Campaigns in ${formatOrList(rawList)}`;
  }
  return `Campaigns where ${String(spec.field)} is ${rawList.join(", ")}`;
}

export function appliesLabel(rule?: RuleCatalogRowDTO | null): string {
  if (!rule) {
    return "Every campaign";
  }
  const wording = typeof rule.wording === "string" ? rule.wording.toLowerCase() : "";
  if (rule.kind === "deterministic") {
    if (rule.ruleId === "SEBI-03" || wording.includes("cagr")) {
      return "Campaigns quoting a CAGR figure";
    }
    if (rule.ruleId === "SEBI-05" || wording.includes("performance figures")) {
      return "Campaigns with performance figures";
    }
    return "Every campaign";
  }
  if (rule.predicateSpec) {
    return formatPredicateSpec(rule.predicateSpec);
  }
  if (typeof rule.applicabilitySummary === "string" && rule.applicabilitySummary.trim().length > 0) {
    return rule.applicabilitySummary;
  }
  return "Every campaign";
}
