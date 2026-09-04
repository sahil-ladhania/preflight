/**
 * useCampaignMutations — extract, save, compile, generate handlers.
 * Why: split from useCampaign to stay under file line limit.
 */
// size: four handlers share the same setter bundle; splitting duplicates the input type.

import { useCallback, useRef, type Dispatch, type SetStateAction } from "react";

import type {
  CampaignDTO,
  CompileResponseDTO,
  InjectionDetection,
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
  mergeExtractProposal,
  normalizeBrief,
  proposedKeysFromPartial,
} from "@/features/campaign/lib";

function hydrateFromCampaign(data: CampaignDTO): {
  brief: StructuredBriefInput;
  savedBrief: StructuredBriefInput;
} {
  const brief = briefFromCampaign(data.structuredBrief);
  return { brief, savedBrief: brief };
}

export function useCampaignMutations(input: {
  campaignId: string | undefined;
  freeText: string;
  brief: StructuredBriefInput;
  briefSaved: boolean;
  briefDirty: boolean;
  compileResult: CompileResponseDTO | null;
  generateDisabled: boolean;
  saveDisabled: boolean;
  setCampaign: (campaign: CampaignDTO) => void;
  setBrief: Dispatch<SetStateAction<StructuredBriefInput>>;
  setSavedBrief: (brief: StructuredBriefInput) => void;
  setBriefSaved: (saved: boolean) => void;
  setProposedFieldKeys: Dispatch<SetStateAction<Set<BriefField>>>;
  setExtractSkillsRead: (skillsRead: string[] | null) => void;
  setExtractInjection: (injection: InjectionDetection | null) => void;
  setCompileResult: (result: CompileResponseDTO | null) => void;
  setEmptySetAcknowledged: (checked: boolean) => void;
  setExtractInFlight: (inFlight: boolean) => void;
  setSaveInFlight: (inFlight: boolean) => void;
  setCompileInFlight: (inFlight: boolean) => void;
  setGenerateInFlight: (inFlight: boolean) => void;
  reloadCampaignAssets: () => Promise<void>;
  toastApiError: (error: unknown) => void;
}): {
  extract: () => Promise<void>;
  save: () => Promise<void>;
  compile: () => Promise<void>;
  generate: () => Promise<void>;
} {
  const {
    campaignId,
    freeText,
    brief,
    briefSaved,
    briefDirty,
    compileResult,
    generateDisabled,
    saveDisabled,
    setCampaign,
    setBrief,
    setSavedBrief,
    setBriefSaved,
    setProposedFieldKeys,
    setExtractSkillsRead,
    setExtractInjection,
    setCompileResult,
    setEmptySetAcknowledged,
    setExtractInFlight,
    setSaveInFlight,
    setCompileInFlight,
    setGenerateInFlight,
    reloadCampaignAssets,
    toastApiError,
  } = input;

  const generateGuardRef = useRef<boolean>(false);

  const extract = useCallback(async (): Promise<void> => {
    if (campaignId === undefined) {
      return;
    }

    const controller = new AbortController();
    setExtractInFlight(true);

    try {
      const response = await extractCampaignBriefService(
        campaignId,
        { freeText },
        controller.signal,
      );
      setBrief((current) => mergeExtractProposal(current, response.proposal));
      setProposedFieldKeys(proposedKeysFromPartial(response.proposal));
      setExtractSkillsRead(response.skillsRead);
      setExtractInjection(response.injection);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setExtractInFlight(false);
    }
  }, [
    campaignId,
    freeText,
    setBrief,
    setExtractInFlight,
    setExtractSkillsRead,
    setExtractInjection,
    setProposedFieldKeys,
    toastApiError,
  ]);

  const save = useCallback(async (): Promise<void> => {
    if (campaignId === undefined || saveDisabled) {
      return;
    }

    const controller = new AbortController();
    setSaveInFlight(true);

    try {
      const normalized = normalizeBrief(brief);
      const updated = await updateCampaignBriefService(
        campaignId,
        { structuredBrief: normalized },
        controller.signal,
      );
      const hydrated = hydrateFromCampaign(updated);
      setCampaign(updated);
      setBrief(hydrated.brief);
      setSavedBrief(hydrated.savedBrief);
      setBriefSaved(true);
      setProposedFieldKeys(new Set());
      setExtractSkillsRead(null);
      setExtractInjection(null);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setSaveInFlight(false);
    }
  }, [
    brief,
    campaignId,
    saveDisabled,
    setBrief,
    setSavedBrief,
    setBriefSaved,
    setCampaign,
    setExtractSkillsRead,
    setExtractInjection,
    setProposedFieldKeys,
    setSaveInFlight,
    toastApiError,
  ]);

  const compile = useCallback(async (): Promise<void> => {
    if (campaignId === undefined || !briefSaved || briefDirty) {
      return;
    }

    const controller = new AbortController();
    setCompileInFlight(true);

    try {
      const result = await compileCampaignService(campaignId, controller.signal);
      setCompileResult(result);
      setEmptySetAcknowledged(false);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setCompileInFlight(false);
    }
  }, [
    briefDirty,
    briefSaved,
    campaignId,
    setCompileInFlight,
    setCompileResult,
    setEmptySetAcknowledged,
    toastApiError,
  ]);

  const generate = useCallback(async (): Promise<void> => {
    if (
      campaignId === undefined ||
      compileResult === null ||
      generateDisabled ||
      generateGuardRef.current
    ) {
      return;
    }

    generateGuardRef.current = true;
    const controller = new AbortController();
    setGenerateInFlight(true);

    try {
      await generateCampaignAssetsService(campaignId, {}, controller.signal);
      // Stay on Campaign; refreshed assets land the pane on S4 Built.
      await reloadCampaignAssets();
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      generateGuardRef.current = false;
      setGenerateInFlight(false);
    }
  }, [
    campaignId,
    compileResult,
    generateDisabled,
    reloadCampaignAssets,
    setGenerateInFlight,
    toastApiError,
  ]);

  return { extract, save, compile, generate };
}
