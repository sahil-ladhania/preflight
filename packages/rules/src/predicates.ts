/**
 * predicates — applies(brief) for package det rules.
 * Why: compile predicates on StructuredBrief (documentation/12 Area 1).
 */
import type { StructuredBrief } from "./structured-brief.js";

export function appliesSebi01(brief: StructuredBrief): boolean {
  return brief.channels.length > 0;
}

export function appliesSebi02(brief: StructuredBrief): boolean {
  return brief.schemeName.trim().length > 0;
}

export function appliesSebi03(brief: StructuredBrief): boolean {
  return (
    brief.performanceFigures.length > 0 ||
    brief.performanceFigures.some((figure) =>
      /cagr/i.test(`${figure.value} ${figure.period}`),
    )
  );
}

export function appliesSebi04(brief: StructuredBrief): boolean {
  void brief;
  return true;
}

export function appliesSebi05(brief: StructuredBrief): boolean {
  return brief.performanceFigures.length > 0;
}
