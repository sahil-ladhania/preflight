/**
 * brief-adapter — Zod Json → StructuredBrief.
 * Why: adapter for @preflight/rules compile input.
 */
import type { StructuredBrief } from "@preflight/rules";
import {
  StructuredBriefSchema,
  type StructuredBriefInput,
} from "@preflight/schemas";

export function toStructuredBrief(input: StructuredBriefInput): StructuredBrief {
  return StructuredBriefSchema.parse(input);
}
