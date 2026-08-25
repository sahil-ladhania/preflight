/**
 * applies-spec — appliesSpec(brief, spec) locked signature.
 * Why: DB judgement predicate JSON interpreter (documentation/12 Area 1).
 */
import type { StructuredBrief, PredicateSpec, Channel } from "./structured-brief.js";

const CHANNELS: readonly Channel[] = [
  "email",
  "linkedin",
  "display",
  "whatsapp",
  "landing",
];

export function appliesSpec(brief: StructuredBrief, spec: PredicateSpec): boolean {
  if (spec.field === "performanceFigures") {
    return false;
  }

  if (spec.op === "equals" && Array.isArray(spec.value)) {
    return false;
  }

  if (spec.op === "in" && typeof spec.value === "string") {
    return false;
  }

  switch (spec.field) {
    case "objective":
    case "schemeName":
    case "schemeCategory":
    case "audience":
    case "market":
      return evaluateScalarField(brief[spec.field], spec);
    case "channels":
      return evaluateArrayField(brief.channels, spec);
    case "claims":
      return evaluateArrayField(brief.claims, spec);
    default:
      return false;
  }
}

function evaluateScalarField(
  fieldValue: string,
  spec: PredicateSpec,
): boolean {
  if (spec.op === "equals") {
    return typeof spec.value === "string" && fieldValue === spec.value;
  }

  return (
    Array.isArray(spec.value) &&
    spec.value.some((candidate) => fieldValue === candidate)
  );
}

function evaluateArrayField(
  fieldValues: readonly string[],
  spec: PredicateSpec,
): boolean {
  if (spec.op === "equals") {
    if (typeof spec.value !== "string") {
      return false;
    }

    if (spec.field === "channels" && !CHANNELS.includes(spec.value as Channel)) {
      return false;
    }

    return fieldValues.includes(spec.value);
  }

  if (!Array.isArray(spec.value)) {
    return false;
  }

  const allowed = spec.value;
  return fieldValues.some((item) => allowed.includes(item));
}
