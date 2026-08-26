/**
 * useCampaignFixture — local state for design-proof Campaign demos.
 * Why: production route uses useCampaign; fixtures stay interactive offline.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CampaignDTO, CompileResponseDTO } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import {
  briefFromCampaign,
  mergeExtractProposal,
  proposedKeysFromPartial,
} from "@/features/campaign/lib";
import {
  COMPILE_RESULT,
  COMPILE_ZERO_RULES,
  EXTRACT_PROPOSAL,
  EXTRACT_SKILLS_READ,
  GENERATE_ASSET_ID,
  GENERATE_SKILLS_READ,
} from "@/fixtures/campaign";

export function useCampaignFixture(
  campaign: CampaignDTO,
  initialCompileResult: CompileResponseDTO | null,
  zeroRulesCompile: boolean,
): {
  freeText: string;
  setFreeText: (value: string) => void;
  brief: ReturnType<typeof briefFromCampaign>;
  setBrief: (brief: ReturnType<typeof briefFromCampaign>) => void;
  savedBrief: ReturnType<typeof briefFromCampaign>;
  briefSaved: boolean;
  proposedFieldKeys: Set<BriefField>;
  extractSkillsRead: string[] | null;
  compileResult: CompileResponseDTO | null;
  emptySetAcknowledged: boolean;
  extractInFlight: boolean;
  saveInFlight: boolean;
  compileInFlight: boolean;
  generateInFlight: boolean;
  handleExtract: () => void;
  handleFieldEdit: (field: BriefField) => void;
  handleSave: () => void;
  handleCompile: () => void;
  handleGenerate: () => void;
  setEmptySetAcknowledged: (checked: boolean) => void;
} {
  const navigate = useNavigate();
  const [freeText, setFreeText] = useState<string>(campaign.freeText);
  const [brief, setBrief] = useState(() =>
    briefFromCampaign(campaign.structuredBrief),
  );
  const [savedBrief, setSavedBrief] = useState(() =>
    briefFromCampaign(campaign.structuredBrief),
  );
  const [briefSaved, setBriefSaved] = useState<boolean>(
    campaign.structuredBrief !== null,
  );
  const [proposedFieldKeys, setProposedFieldKeys] = useState<Set<BriefField>>(
    () => new Set(),
  );
  const [extractSkillsRead, setExtractSkillsRead] = useState<string[] | null>(
    null,
  );
  const [compileResult, setCompileResult] = useState<CompileResponseDTO | null>(
    () => initialCompileResult ?? campaign.lastCompile,
  );
  const [emptySetAcknowledged, setEmptySetAcknowledged] =
    useState<boolean>(false);
  const [extractInFlight, setExtractInFlight] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);
  const [compileInFlight, setCompileInFlight] = useState<boolean>(false);
  const [generateInFlight, setGenerateInFlight] = useState<boolean>(false);

  const handleExtract = (): void => {
    setExtractInFlight(true);
    setBrief(mergeExtractProposal(brief, EXTRACT_PROPOSAL));
    setProposedFieldKeys(proposedKeysFromPartial(EXTRACT_PROPOSAL));
    setExtractSkillsRead(EXTRACT_SKILLS_READ);
    setExtractInFlight(false);
  };

  const handleFieldEdit = (field: BriefField): void => {
    setProposedFieldKeys((current) => {
      if (!current.has(field)) {
        return current;
      }
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  };

  const handleSave = (): void => {
    setSaveInFlight(true);
    setSavedBrief(brief);
    setBriefSaved(true);
    setProposedFieldKeys(new Set());
    setExtractSkillsRead(null);
    setSaveInFlight(false);
  };

  const handleCompile = (): void => {
    setCompileInFlight(true);
    const result = zeroRulesCompile ? COMPILE_ZERO_RULES : COMPILE_RESULT;
    setCompileResult(result);
    setEmptySetAcknowledged(false);
    setCompileInFlight(false);
  };

  const handleGenerate = (): void => {
    setGenerateInFlight(true);
    setGenerateInFlight(false);
    void navigate(`/assets/${GENERATE_ASSET_ID}`, {
      state: { generatorSkillsRead: GENERATE_SKILLS_READ },
    });
  };

  return {
    freeText,
    setFreeText,
    brief,
    setBrief,
    savedBrief,
    briefSaved,
    proposedFieldKeys,
    extractSkillsRead,
    compileResult,
    emptySetAcknowledged,
    extractInFlight,
    saveInFlight,
    compileInFlight,
    generateInFlight,
    handleExtract,
    handleFieldEdit,
    handleSave,
    handleCompile,
    handleGenerate,
    setEmptySetAcknowledged,
  };
}
