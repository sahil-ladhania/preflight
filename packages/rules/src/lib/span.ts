/**
 * span — build Span triples from canonicalText offsets.
 * Why: matchers must emit slice-consistent spans (04-data-model.md).
 */
import type { Span } from "../span.js";

export function spanAt(canonicalText: string, start: number, length: number): Span {
  const end = start + length;
  return {
    start,
    end,
    text: canonicalText.slice(start, end),
  };
}

export function spanForMatch(
  canonicalText: string,
  needle: string,
  fromIndex = 0,
): Span | null {
  const index = canonicalText.indexOf(needle, fromIndex);
  if (index === -1) {
    return null;
  }
  return spanAt(canonicalText, index, needle.length);
}
