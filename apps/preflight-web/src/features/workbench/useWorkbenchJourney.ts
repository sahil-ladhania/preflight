/**
 * useWorkbenchJourney — stay-on-Workbench extract → save → freeze → generate.
 * Why: existing campaign HTTP; journeyCampaignId is React state only.
 */
// size: four campaign HTTP handlers share one journey lock; split would fork gates.

import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";

import {
  compileCampaignService,
  generateCampaignAssetsService,
  getCampaignService,
  updateCampaignBriefService,
} from "@/features/campaign/campaign.service";
import {
  campaignGateState,
  emptyBrief,
  hydrateFromCampaign,
  normalizeBrief,
} from "@/features/campaign/lib";
import { runWorkbenchExtractHandoff } from "@/features/workbench/handoff.service";
import {
  applyJourneyFromCampaign,
  buildJourneyView,
} from "@/features/workbench/journey";
import { handoffEnabled, nextMessageId } from "@/features/workbench/lib";
import type { WorkbenchJourneyView, WorkbenchMessage } from "@/features/workbench/types";

export function useWorkbenchJourney(input: {
  messages: WorkbenchMessage[];
  setMessages: Dispatch<SetStateAction<WorkbenchMessage[]>>;
  toastApiError: (error: unknown) => void;
}): {
  journeyCampaignId: string | null;
  handoffInFlight: boolean;
  startCampaignFromConversation: () => Promise<void>;
  view: WorkbenchJourneyView;
} {
  const { messages, setMessages, toastApiError } = input;
  const [journeyCampaignId, setJourneyCampaignId] = useState<string | null>(null);
  const [brief, setBrief] = useState<StructuredBriefInput>(emptyBrief);
  const [savedBrief, setSavedBrief] = useState<StructuredBriefInput>(emptyBrief);
  const [briefSaved, setBriefSaved] = useState<boolean>(false);
  const [compileResult, setCompileResult] = useState<CompileResponseDTO | null>(
    null,
  );
  const [emptySetAcknowledged, setEmptySetAcknowledged] = useState<boolean>(false);
  const [handoffInFlight, setHandoffInFlight] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);
  const [freezeInFlight, setFreezeInFlight] = useState<boolean>(false);
  const [generateInFlight, setGenerateInFlight] = useState<boolean>(false);
  const generateGuardRef = useRef<boolean>(false);

  const gate = campaignGateState({
    brief,
    savedBrief,
    briefSaved,
    compileResult,
    emptySetAcknowledged,
    generateInFlight,
  });

  const startCampaignFromConversation = useCallback(async (): Promise<void> => {
    if (handoffInFlight || !handoffEnabled(messages)) {
      return;
    }

    const controller = new AbortController();
    setHandoffInFlight(true);

    try {
      const extracted = await runWorkbenchExtractHandoff(messages, controller.signal);
      const campaign = await getCampaignService(extracted.campaignId, controller.signal);
      const applied = applyJourneyFromCampaign(campaign, extracted.proposal);
      setJourneyCampaignId(extracted.campaignId);
      setBrief(applied.brief);
      setSavedBrief(applied.savedBrief);
      setBriefSaved(applied.briefSaved);
      setCompileResult(applied.compileResult);
      setEmptySetAcknowledged(false);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId(),
          role: "journey_extract",
          proposal: extracted.proposal,
        },
      ]);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setHandoffInFlight(false);
    }
  }, [handoffInFlight, messages, setMessages, toastApiError]);

  const saveBrief = useCallback(async (): Promise<void> => {
    if (journeyCampaignId === null || gate.saveDisabled) {
      return;
    }

    const controller = new AbortController();
    setSaveInFlight(true);

    try {
      const updated = await updateCampaignBriefService(
        journeyCampaignId,
        { structuredBrief: normalizeBrief(brief) },
        controller.signal,
      );
      const hydrated = hydrateFromCampaign(updated);
      setBrief(hydrated.brief);
      setSavedBrief(hydrated.savedBrief);
      setBriefSaved(true);
      setCompileResult(hydrated.compileResult);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setSaveInFlight(false);
    }
  }, [brief, gate.saveDisabled, journeyCampaignId, toastApiError]);

  const freeze = useCallback(async (): Promise<void> => {
    if (journeyCampaignId === null || gate.s2Dimmed || gate.briefDirty) {
      return;
    }

    const controller = new AbortController();
    setFreezeInFlight(true);

    try {
      const result = await compileCampaignService(
        journeyCampaignId,
        controller.signal,
      );
      setCompileResult(result);
      setEmptySetAcknowledged(false);
      setMessages((current) => [
        ...current,
        { id: nextMessageId(), role: "journey_freeze", compile: result },
      ]);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setFreezeInFlight(false);
    }
  }, [
    gate.briefDirty,
    gate.s2Dimmed,
    journeyCampaignId,
    setMessages,
    toastApiError,
  ]);

  const generate = useCallback(async (): Promise<void> => {
    if (
      journeyCampaignId === null ||
      compileResult === null ||
      gate.generateDisabled ||
      generateGuardRef.current
    ) {
      return;
    }

    generateGuardRef.current = true;
    const controller = new AbortController();
    setGenerateInFlight(true);

    try {
      const response = await generateCampaignAssetsService(
        journeyCampaignId,
        {},
        controller.signal,
      );
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId(),
          role: "journey_generate",
          assets: response.assets,
          skillsRead: response.skillsRead,
        },
      ]);
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      generateGuardRef.current = false;
      setGenerateInFlight(false);
    }
  }, [
    compileResult,
    gate.generateDisabled,
    journeyCampaignId,
    setMessages,
    toastApiError,
  ]);

  const view = buildJourneyView({
    journeyCampaignId,
    compileResult,
    emptySetAcknowledged,
    saveInFlight,
    freezeInFlight,
    generateInFlight,
    gate,
    onSave: () => {
      void saveBrief();
    },
    onFreeze: () => {
      void freeze();
    },
    onGenerate: () => {
      void generate();
    },
    onEmptySetAckChange: setEmptySetAcknowledged,
  });

  return {
    journeyCampaignId,
    handoffInFlight,
    startCampaignFromConversation,
    view,
  };
}
