/**
 * generator-hints — compile-time det implementation lines for the generator prompt.
 * Why: snapshot wordings are vague; matchers check exact phrases (Phase 1 pass rate).
 */
import { BANNED_PHRASES } from "../matchers/banned-phrase.js";
import { REQUIRED_DISCLAIMER_PHRASE } from "../matchers/disclaimer.js";
import { SUBSTANTIATION_MARKERS } from "../matchers/performance-substantiation.js";

export interface GeneratorHintBrief {
  schemeName: string;
  performanceFigures: Array<{ value: string; period: string }>;
}

export function buildGeneratorHintLines(
  pinnedDetRuleIds: readonly string[],
  brief: GeneratorHintBrief,
): string[] {
  const ids = new Set(pinnedDetRuleIds);
  const lines: string[] = [];

  if (ids.has("SEBI-01")) {
    lines.push(
      `SEBI-01: Put this exact phrase in disclaimer: "${REQUIRED_DISCLAIMER_PHRASE}."`,
    );
  }

  if (ids.has("SEBI-02") && brief.schemeName.trim().length > 0) {
    lines.push(
      `SEBI-02: Open body or headline with scheme name "${brief.schemeName}" before any generic "fund" mention.`,
    );
  }

  if (ids.has("SEBI-03")) {
    lines.push(
      "SEBI-03: Every % figure or CAGR label must sit within ~120 characters of a period label (e.g. 3 years, 5-year CAGR).",
    );
  }

  if (ids.has("SEBI-04")) {
    lines.push(
      `SEBI-04: Never use these phrases (any casing): ${BANNED_PHRASES.join(", ")}.`,
    );
  }

  if (ids.has("SEBI-05")) {
    lines.push(
      `SEBI-05: Any % or "past performance" triggers substantiation — include one of: ${SUBSTANTIATION_MARKERS.join(", ")}.`,
    );
  }

  if (
    brief.performanceFigures.length > 0 &&
    (ids.has("SEBI-03") || ids.has("SEBI-05"))
  ) {
    const examples = brief.performanceFigures
      .map((figure) => `${figure.value} over ${figure.period}`)
      .join("; ");
    lines.push(
      `Brief performance figures (cite compliantly in body, not headline/CTA): ${examples}. Example pattern: "Past performance of {value} over {period} is not indicative of future results."`,
    );
  }

  return lines;
}
