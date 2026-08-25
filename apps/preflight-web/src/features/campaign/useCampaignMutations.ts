/**
 * useCampaignMutations — extract, save, compile, generate handlers.
 * Why: split from useCampaign to stay under file line limit.
 */

import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

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
  mergeExtractProposal,
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
  setCompileResult: (result: CompileResponseDTO | null) => void;
  setEmptySetAcknowledged: (checked: boolean) => void;
  setExtractInFlight: (inFlight: boolean) => void;
  setSaveInFlight: (inFlight: boolean) => void;
  setCompileInFlight: (inFlight: boolean) => void;
  setGenerateInFlight: (inFlight: boolean) => void;
  toastApiError: (error: unknown) => void;
}): {
  extract: () => Promise<void>;
  save: () => Promise<void>;
  compile: () => Promise<void>;
  generate: () => Promise<void>;
} {
  const navigate = useNavigate();
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
    setCompileResult,
    setEmptySetAcknowledged,
    setExtractInFlight,
    setSaveInFlight,
    setCompileInFlight,
    setGenerateInFlight,
    toastApiError,
  } = input;

  const extract = useCallback(async (): Promise<void> => {
    if (campaignId === undefined) {
      return;
    }

    const controller = new AbortController();
    setExtractInFlight(true);

    try {
      const proposal = await extractCampaignBriefService(
        campaignId,
        { freeText },
        controller.signal,
      );
      setBrief((current) => mergeExtractProposal(current, proposal));
      setProposedFieldKeys(proposedKeysFromPartial(proposal));
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
      const updated = await updateCampaignBriefService(
        campaignId,
        { structuredBrief: brief },
        controller.signal,
      );
      const hydrated = hydrateFromCampaign(updated);
      setCampaign(updated);
      setBrief(hydrated.brief);
      setSavedBrief(hydrated.savedBrief);
      setBriefSaved(true);
      setProposedFieldKeys(new Set());
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
    if (campaignId === undefined || compileResult === null || generateDisabled) {
      return;
    }

    const controller = new AbortController();
    setGenerateInFlight(true);

    try {
      const response = await generateCampaignAssetsService(
        campaignId,
        {},
        controller.signal,
      );
      const firstAsset = response.assets[0];
      if (response.assets.length === 1 && firstAsset !== undefined) {
        void navigate(`/assets/${firstAsset.id}`);
      } else {
        void navigate("/assets");
      }
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setGenerateInFlight(false);
    }
  }, [
    campaignId,
    compileResult,
    generateDisabled,
    navigate,
    setGenerateInFlight,
    toastApiError,
  ]);

  return { extract, save, compile, generate };
}
