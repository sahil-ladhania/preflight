/**
 * text — whitespace normalization for deterministic matchers.
 * Why: hyphen / en-dash / newline adversarial cases share one recipe.
 */

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function collapseForScan(text: string): string {
  return normalizeWhitespace(text).toLowerCase();
}
