/**
 * overview-copy — composed Overview strings with correct grammar at every count.
 * Why: fragmented noun + phrase helpers duplicated words and broke singular/plural.
 */

import type { PersonaId } from "@/features/shell/types";

function pluralNoun(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function needsYouSectionTitle(personaId: PersonaId): string {
  return personaId === "meera" ? "Held for compliance" : "Needs you";
}

export function stateLineNeedHuman(count: number): string {
  if (count === 1) {
    return "asset needs a human";
  }
  return "assets need a human";
}

export function stateLineNeedHumanForPersona(
  count: number,
  personaId: PersonaId,
): string {
  if (personaId === "meera") {
    return count === 1
      ? "asset waiting on compliance"
      : "assets waiting on compliance";
  }
  return stateLineNeedHuman(count);
}

export function stateLineShippedException(count: number): string {
  return count === 1 ? "shipped with exception" : "shipped with exceptions";
}

export function stateLineCampaignsInProgress(count: number): string {
  return count === 1 ? "campaign in progress" : "campaigns in progress";
}

export function rulePressureCountLabel(
  eventCount: number,
  assetCount: number,
  kind: "failed" | "waived",
): string {
  const eventWord =
    kind === "failed"
      ? pluralNoun(eventCount, "failure", "failures")
      : pluralNoun(eventCount, "waiver", "waivers");
  const assetWord = pluralNoun(assetCount, "asset", "assets");
  return `${eventCount} ${eventWord} across ${assetCount} ${assetWord}`;
}

export function driftAssetNoun(count: number): string {
  return pluralNoun(count, "asset", "assets");
}

export function driftCountLabel(count: number): string {
  return `${count} ${driftAssetNoun(count)}`;
}
