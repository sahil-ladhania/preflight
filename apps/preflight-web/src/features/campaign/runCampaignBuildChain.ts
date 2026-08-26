/**
 * runCampaignBuildChain — plain async extract → save → compile → generate.
 * Why: keep useCampaignBuild hook under file line limit.
 */

import type {
  CampaignDTO,
  CompileResponseDTO,
  StructuredBriefInput,
} from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import {
  compileCampaignService,
  extractCampaignBriefService,
  generateCampaignAssetsService,
  updateCampaignBriefService,
} from "@/features/campaign/campaign.service";
import {
  briefFromCampaign,
  briefIsValid,
  mergeExtractProposal,
  normalizeBrief,
  proposedKeysFromPartial,
} from "@/features/campaign/lib";
import {
  buildCompileNarration,
  buildExtractEmptyNarration,
  buildExtractNarration,
  buildGenerateNarration,
  buildNeedsAckNarration,
  buildNeedsInputNarration,
  buildSaveNarration,
} from "@/features/campaign/narration";
import {
  missingBriefFields,
} from "@preflight/schemas";
import type { BuildPhase } from "@/features/campaign/types";
import type { CampaignNarrations } from "@/features/campaign/types";

export type BuildNavigateTarget = {
  path: string;
  state: { generatorSkillsRead: string[]; buildNarration: string };
};

export type BuildChainResult = {
  phase: BuildPhase;
  narrations: CampaignNarrations;
  missingFields: BriefField[];
  navigate?: BuildNavigateTarget;
};

function narrationPatch(
  current: CampaignNarrations,
  slot: keyof CampaignNarrations,
  text: string,
): CampaignNarrations {
  return { ...current, [slot]: text };
}

export async function runCampaignBuildChain(input: {
  campaignId: string;
  freeText: string;
  brief: StructuredBriefInput;
  signal: AbortSignal;
  setCampaign: (campaign: CampaignDTO) => void;
  setBrief: (brief: StructuredBriefInput) => void;
  setSavedBrief: (brief: StructuredBriefInput) => void;
  setBriefSaved: (saved: boolean) => void;
  setProposedFieldKeys: (keys: Set<BriefField>) => void;
  setExtractSkillsRead: (skillsRead: string[] | null) => void;
  setCompileResult: (result: CompileResponseDTO | null) => void;
  setEmptySetAcknowledged: (checked: boolean) => void;
  onPhase: (phase: BuildPhase) => void;
}): Promise<BuildChainResult> {
  let narrations: CampaignNarrations = {
    brief: null,
    freeze: null,
    generate: null,
  };
  let workingBrief = input.brief;

  let extractRan = false;

  if (
    input.freeText.trim().length > 0 &&
    !briefIsValid(normalizeBrief(workingBrief))
  ) {
    input.onPhase("extract");
    extractRan = true;
    const extracted = await extractCampaignBriefService(
      input.campaignId,
      { freeText: input.freeText },
      input.signal,
    );
    if (Object.keys(extracted.proposal).length === 0) {
      narrations = narrationPatch(
        narrations,
        "brief",
        buildExtractEmptyNarration(),
      );
      return {
        phase: "needs_input",
        narrations,
        missingFields: missingBriefFields(workingBrief),
      };
    }
    workingBrief = mergeExtractProposal(workingBrief, extracted.proposal);
    input.setBrief(workingBrief);
    input.setProposedFieldKeys(proposedKeysFromPartial(extracted.proposal));
    input.setExtractSkillsRead(extracted.skillsRead);
    narrations = narrationPatch(
      narrations,
      "brief",
      buildExtractNarration(extracted.proposal, extracted.skillsRead),
    );
  }

  const normalized = normalizeBrief(workingBrief);
  const missing = missingBriefFields(normalized);
  if (missing.length > 0) {
    narrations = narrationPatch(
      narrations,
      "brief",
      buildNeedsInputNarration(missing, { agentRan: extractRan }),
    );
    return { phase: "needs_input", narrations, missingFields: missing };
  }

  input.onPhase("save");
  const updated = await updateCampaignBriefService(
    input.campaignId,
    { structuredBrief: normalized },
    input.signal,
  );
  const saved = briefFromCampaign(updated.structuredBrief);
  input.setCampaign(updated);
  input.setBrief(saved);
  input.setSavedBrief(saved);
  input.setBriefSaved(true);
  input.setProposedFieldKeys(new Set());
  input.setExtractSkillsRead(null);
  narrations = narrationPatch(narrations, "brief", buildSaveNarration(normalized));

  input.onPhase("compile");
  const compiled = await compileCampaignService(input.campaignId, input.signal);
  input.setCompileResult(compiled);
  input.setEmptySetAcknowledged(false);
  narrations = narrationPatch(
    narrations,
    "freeze",
    buildCompileNarration(compiled),
  );

  if (compiled.ruleIds.length === 0) {
    narrations = narrationPatch(
      narrations,
      "freeze",
      buildNeedsAckNarration(),
    );
    return { phase: "needs_ack", narrations, missingFields: [] };
  }

  input.onPhase("generate");
  const response = await generateCampaignAssetsService(
    input.campaignId,
    {},
    input.signal,
  );
  const generateNarration = buildGenerateNarration(
    response.assets.length,
    response.assets.map((asset) => asset.channel),
    response.skillsRead,
  );
  narrations = narrationPatch(narrations, "generate", generateNarration);

  const firstAsset = response.assets[0];
  const navigate =
    response.assets.length === 1 && firstAsset !== undefined
      ? {
          path: `/assets/${firstAsset.id}`,
          state: {
            generatorSkillsRead: response.skillsRead,
            buildNarration: generateNarration,
          },
        }
      : { path: "/assets", state: { generatorSkillsRead: response.skillsRead, buildNarration: generateNarration } };

  return { phase: "idle", narrations, missingFields: [], navigate };
}

export async function runGenerateOnly(input: {
  campaignId: string;
  signal: AbortSignal;
  onPhase: (phase: BuildPhase) => void;
}): Promise<BuildChainResult> {
  input.onPhase("generate");
  const response = await generateCampaignAssetsService(
    input.campaignId,
    {},
    input.signal,
  );
  const generateNarration = buildGenerateNarration(
    response.assets.length,
    response.assets.map((asset) => asset.channel),
    response.skillsRead,
  );
  const narrations: CampaignNarrations = {
    brief: null,
    freeze: null,
    generate: generateNarration,
  };
  const firstAsset = response.assets[0];
  const navigate =
    response.assets.length === 1 && firstAsset !== undefined
      ? {
          path: `/assets/${firstAsset.id}`,
          state: {
            generatorSkillsRead: response.skillsRead,
            buildNarration: generateNarration,
          },
        }
      : { path: "/assets", state: { generatorSkillsRead: response.skillsRead, buildNarration: generateNarration } };

  return { phase: "idle", narrations, missingFields: [], navigate };
}
