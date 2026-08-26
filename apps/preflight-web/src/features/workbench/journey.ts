/**
 * journey — Workbench Save → Freeze → Generate helpers.
 * Why: keep chat lib under size; reuse campaign hydrate/gates.
 */

import type {
  CampaignDTO,
  CompileResponseDTO,
  StructuredBriefInput,
} from "@preflight/schemas";

import {
  BRIEF_SCALAR_FIELDS,
  campaignGateState,
  hydrateFromCampaign,
  mergeExtractProposal,
} from "@/features/campaign/lib";
import type { WorkbenchJourneyView } from "@/features/workbench/types";

export function applyJourneyFromCampaign(
  campaign: CampaignDTO,
  proposal: Partial<StructuredBriefInput>,
): {
  brief: StructuredBriefInput;
  savedBrief: StructuredBriefInput;
  briefSaved: boolean;
  compileResult: CompileResponseDTO | null;
} {
  const hydrated = hydrateFromCampaign(campaign);
  return {
    brief: mergeExtractProposal(hydrated.brief, proposal),
    savedBrief: hydrated.savedBrief,
    briefSaved: hydrated.briefSaved,
    compileResult: hydrated.compileResult,
  };
}

export function proposalSummaryLines(
  proposal: Partial<StructuredBriefInput>,
): Array<{ label: string; value: string }> {
  const lines: Array<{ label: string; value: string }> = [];

  for (const field of BRIEF_SCALAR_FIELDS) {
    const value = proposal[field.key];
    if (typeof value === "string" && value.trim().length > 0) {
      lines.push({ label: field.label, value });
    }
  }

  if (proposal.channels !== undefined && proposal.channels.length > 0) {
    lines.push({ label: "Channels", value: proposal.channels.join(", ") });
  }

  if (proposal.performanceFigures !== undefined) {
    const figures = proposal.performanceFigures
      .map((row) => `${row.value} ${row.period}`.trim())
      .filter((text) => text.length > 0);
    lines.push({
      label: "Performance",
      value: figures.length > 0 ? figures.join("; ") : "none",
    });
  }

  if (proposal.claims !== undefined) {
    lines.push({
      label: "Claims",
      value: proposal.claims.length > 0 ? proposal.claims.join("; ") : "none",
    });
  }

  return lines;
}

export function skillsReadCaption(skillsRead: string[]): string {
  if (skillsRead.length === 0) {
    return "no skill read";
  }
  return skillsRead.join(" · ");
}

export function freezeDisabledCaption(input: {
  s2Dimmed: boolean;
  briefDirty: boolean;
  freezeInFlight: boolean;
}): string | null {
  if (input.freezeInFlight) {
    return null;
  }
  if (input.s2Dimmed) {
    return "Save brief first.";
  }
  if (input.briefDirty) {
    return "Save brief before freezing.";
  }
  return null;
}

export function buildJourneyView(input: {
  journeyCampaignId: string | null;
  compileResult: CompileResponseDTO | null;
  emptySetAcknowledged: boolean;
  saveInFlight: boolean;
  freezeInFlight: boolean;
  generateInFlight: boolean;
  gate: ReturnType<typeof campaignGateState>;
  onSave: () => void;
  onFreeze: () => void;
  onGenerate: () => void;
  onEmptySetAckChange: (checked: boolean) => void;
}): WorkbenchJourneyView {
  return {
    active: input.journeyCampaignId !== null,
    saveDisabled: input.gate.saveDisabled,
    saveCaption: input.gate.saveDisabledCaption,
    freezeDisabled: input.gate.s2Dimmed || input.gate.briefDirty,
    freezeCaption: freezeDisabledCaption({
      s2Dimmed: input.gate.s2Dimmed,
      briefDirty: input.gate.briefDirty,
      freezeInFlight: input.freezeInFlight,
    }),
    generateDisabled: input.gate.generateDisabled,
    generateCaption: input.gate.generateCaption,
    emptySetVisible:
      input.compileResult !== null && input.compileResult.ruleIds.length === 0,
    emptySetAcknowledged: input.emptySetAcknowledged,
    saveInFlight: input.saveInFlight,
    freezeInFlight: input.freezeInFlight,
    generateInFlight: input.generateInFlight,
    onSave: input.onSave,
    onFreeze: input.onFreeze,
    onGenerate: input.onGenerate,
    onEmptySetAckChange: input.onEmptySetAckChange,
  };
}
