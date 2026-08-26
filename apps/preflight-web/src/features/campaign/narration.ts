/**
 * narration — client-side agent voice after each build step.
 * Why: phases stay code-driven; narration explains what ran and what is next.
 */

import type { CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";
import { briefFieldLabel } from "@preflight/schemas";

import { skillsReadCaption } from "@/lib/agent-provenance";

export { missingBriefFields } from "@preflight/schemas";

function fieldLabels(fields: BriefField[]): string {
  return fields.map((field) => briefFieldLabel(field)).join(", ");
}

export function buildExtractNarration(
  proposal: Partial<StructuredBriefInput>,
  skillsRead: string[],
): string {
  const channels =
    proposal.channels !== undefined && proposal.channels.length > 0
      ? proposal.channels.join(", ")
      : null;
  const objective =
    proposal.objective !== undefined && proposal.objective.trim().length > 0
      ? proposal.objective.trim()
      : null;

  const lines = [
    "GitAgent extractor structured your brief from the conversation.",
  ];
  if (objective !== null) {
    lines.push(`Objective: ${objective}.`);
  }
  if (channels !== null) {
    lines.push(`Channels: ${channels}.`);
  }
  lines.push(`Skills read: ${skillsReadCaption(skillsRead)}.`);
  lines.push("Review the fields below — edit anything, then click Build it.");
  return lines.join("\n");
}

export function buildSaveNarration(brief: StructuredBriefInput): string {
  const channelText =
    brief.channels.length === 1
      ? brief.channels[0]
      : `${brief.channels.length} channels (${brief.channels.join(", ")})`;
  return [
    "Brief saved.",
    `${channelText}, ${brief.performanceFigures.length} performance figure(s), ${brief.claims.length} claim(s).`,
    "Freeze runs next to freeze which rules apply.",
  ].join("\n");
}

export function buildCompileNarration(result: CompileResponseDTO): string {
  const count = result.ruleIds.length;
  const ruleWord = count === 1 ? "rule" : "rules";
  return [
    `Freeze ran in code, not a model — ${count} ${ruleWord} frozen.`,
    "Frozen wordings stay locked for this campaign.",
    count === 0
      ? "Acknowledge the empty set or edit the brief, then continue."
      : "GitAgent generator creates channel copy under these constraints next.",
  ].join("\n");
}

export function buildGenerateNarration(
  assetCount: number,
  channels: string[],
  skillsRead: string[],
): string {
  const channelText = channels.join(", ");
  return [
    `GitAgent generator created ${assetCount} asset(s) (${channelText}).`,
    `Skills read: ${skillsReadCaption(skillsRead)}.`,
    "Opening the conformance ledger for your review.",
  ].join("\n");
}

export function buildNeedsInputNarration(
  missing: BriefField[],
  options?: { agentRan?: boolean },
): string {
  if (missing.length === 0) {
    return "Complete the required brief fields below, then click Build it again.";
  }
  const fieldList = fieldLabels(missing);
  if (options?.agentRan === false) {
    return [
      "Add your campaign details below to continue.",
      `Still needed: ${fieldList}.`,
      "Paste or type a brief, or open Edit fields manually.",
    ].join("\n");
  }
  return [
    "A few required fields are still empty.",
    `Fill in: ${fieldList}.`,
    "Then click Build it again.",
  ].join("\n");
}

export function buildNeedsAckNarration(): string {
  return [
    "Freeze ran in code — no compliance rules apply to this brief.",
    "Acknowledge the empty constraint set below, then click Build it again to generate.",
  ].join("\n");
}

export function buildExtractEmptyNarration(): string {
  return [
    "Paste or describe your campaign brief above first.",
    "Then click Build it to structure, freeze rules, and generate copy.",
  ].join("\n");
}
