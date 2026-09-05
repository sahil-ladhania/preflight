/**
 * brief-readiness-lib — field labels and value formatting for the brief rail.
 * Why: shared between BriefReadiness and BriefFieldRow without bloating the component.
 */

import type { StructuredBriefInput } from "@preflight/schemas";

export const REQUIRED_BRIEF_FIELDS = [
  { key: "objective", label: "OBJECTIVE" },
  { key: "schemeName", label: "SCHEME NAME" },
  { key: "schemeCategory", label: "SCHEME CATEGORY" },
  { key: "audience", label: "AUDIENCE" },
  { key: "market", label: "MARKET" },
  { key: "channels", label: "CHANNELS" },
] as const;

export const OPTIONAL_BRIEF_FIELDS = [
  { key: "performanceFigures", label: "PERFORMANCE FIGURES" },
  { key: "claims", label: "CLAIMS" },
] as const;

export function formatBriefFieldValue(
  key: string,
  captured?: Partial<StructuredBriefInput>,
): string | null {
  if (!captured) return null;
  const val = captured[key as keyof StructuredBriefInput];
  if (val === undefined || val === null) return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    if (key === "performanceFigures") {
      return (val as Array<{ value: string; period: string }>)
        .map((item) => `${item.value} (${item.period})`)
        .join(", ");
    }
    return (val as string[]).join(", ");
  }
  return null;
}
