/**
 * lib — rulebook-only helpers.
 * Why: catalog sort, applicability labels, form parsing.
 */

import type { PredicateSpec, RuleCatalogRowDTO } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import type { JudgementFormState } from "@/features/rulebook/types";

export const PREDICATE_FIELD_OPTIONS: BriefField[] = [
  "objective",
  "schemeName",
  "schemeCategory",
  "audience",
  "channels",
  "market",
  "claims",
];

export const BRIEF_FIELD_LABELS: Record<BriefField, string> = {
  objective: "Objective",
  schemeName: "Scheme name",
  schemeCategory: "Scheme category",
  audience: "Audience",
  channels: "Channels",
  market: "Market",
  performanceFigures: "Performance figures",
  claims: "Claims",
};

export function sortCatalogRules(
  rules: RuleCatalogRowDTO[],
): RuleCatalogRowDTO[] {
  const det = rules
    .filter((rule) => rule.kind === "deterministic")
    .sort((left, right) => left.ruleId.localeCompare(right.ruleId));
  const jdg = rules
    .filter((rule) => rule.kind === "judgement")
    .sort((left, right) => left.ruleId.localeCompare(right.ruleId));
  return [...det, ...jdg];
}

export function appliesLabel(rule: RuleCatalogRowDTO): string {
  if (rule.kind === "deterministic") {
    return "In code";
  }
  if (rule.applicabilitySummary !== null) {
    return rule.applicabilitySummary;
  }
  if (rule.predicateSpec === null) {
    return "—";
  }
  return formatPredicateSpec(rule.predicateSpec);
}

export function formatPredicateSpec(spec: PredicateSpec): string {
  if (spec.op === "equals") {
    return `${spec.field} equals ${spec.value}`;
  }
  return `${spec.field} in ${spec.value.join(", ")}`;
}

export function emptyJudgementForm(): JudgementFormState {
  return {
    wording: "",
    field: "channels",
    op: "equals",
    valueText: "",
  };
}

export function formFromRule(rule: RuleCatalogRowDTO): JudgementFormState {
  if (rule.predicateSpec === null) {
    return { ...emptyJudgementForm(), wording: rule.wording };
  }
  const valueText =
    rule.predicateSpec.op === "equals"
      ? rule.predicateSpec.value
      : rule.predicateSpec.value.join(", ");
  return {
    wording: rule.wording,
    field: rule.predicateSpec.field,
    op: rule.predicateSpec.op,
    valueText,
  };
}

export function parsePredicateSpec(
  form: JudgementFormState,
): PredicateSpec | null {
  const trimmed = form.valueText.trim();
  if (form.wording.trim().length === 0 || trimmed.length === 0) {
    return null;
  }
  if (form.op === "equals") {
    return { field: form.field, op: "equals", value: trimmed };
  }
  const values = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (values.length === 0) {
    return null;
  }
  return { field: form.field, op: "in", value: values };
}

export function formIsValid(form: JudgementFormState): boolean {
  return parsePredicateSpec(form) !== null;
}

export function rowFromForm(
  ruleId: string,
  form: JudgementFormState,
): RuleCatalogRowDTO | null {
  const predicateSpec = parsePredicateSpec(form);
  if (predicateSpec === null) {
    return null;
  }
  return {
    ruleId,
    kind: "judgement",
    wording: form.wording.trim(),
    predicateSpec,
    applicabilitySummary: formatPredicateSpec(predicateSpec),
    editable: true,
  };
}
