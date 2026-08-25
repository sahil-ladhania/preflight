/**
 * useCampaign — Campaign fetch and mutations.
 * Why: GET/PUT brief, extract, compile, generate orchestration.
 */
// size: load + gate state here; mutations in useCampaignMutations.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  CampaignDTO,
  CompileResponseDTO,
  StructuredBriefInput,
} from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import { getCampaignService } from "@/features/campaign/campaign.service";
import { activeCampaignStep } from "@/features/campaign/CampaignStepNav";
import type { CampaignStepId } from "@/features/campaign/CampaignStepNav";
import { briefFromCampaign, campaignGateState } from "@/features/campaign/lib";
import type { CampaignView } from "@/features/campaign/types";
import { useCampaignMutations } from "@/features/campaign/useCampaignMutations";
import { useDelayedLoading } from "@/features/shell/useDelayedLoading";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

function hydrateFromCampaign(data: CampaignDTO): {
  freeText: string;
  brief: StructuredBriefInput;
  savedBrief: StructuredBriefInput;
  briefSaved: boolean;
  compileResult: CompileResponseDTO | null;
} {
  const brief = briefFromCampaign(data.structuredBrief);
  return {
    freeText: data.freeText,
    brief,
    savedBrief: brief,
    briefSaved: data.structuredBrief !== null,
    compileResult: data.lastCompile,
  };
}

export function useCampaign(campaignId: string | undefined): {
  campaign: CampaignDTO | null;
  view: CampaignView;
  notFound: boolean;
  showLoadingSpinner: boolean;
  freeText: string;
  brief: StructuredBriefInput;
  proposedFieldKeys: ReadonlySet<BriefField>;
  compileResult: CompileResponseDTO | null;
  emptySetAcknowledged: boolean;
  extractInFlight: boolean;
  saveInFlight: boolean;
  compileInFlight: boolean;
  generateInFlight: boolean;
  saveDisabled: boolean;
  generateDisabled: boolean;
  generateCaption: string | null;
  staleBanner: boolean;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  briefDirty: boolean;
  activeStep: CampaignStepId;
  setFreeText: (value: string) => void;
  setBrief: (brief: StructuredBriefInput) => void;
  onFieldEdit: (field: BriefField) => void;
  onEmptySetAckChange: (checked: boolean) => void;
  extract: () => Promise<void>;
  save: () => Promise<void>;
  compile: () => Promise<void>;
  generate: () => Promise<void>;
  retryLoad: () => void;
} {
  const { enqueue } = useToastContext();
  const [campaign, setCampaign] = useState<CampaignDTO | null>(null);
  const [view, setView] = useState<CampaignView>("loading");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [freeText, setFreeText] = useState<string>("");
  const [brief, setBrief] = useState<StructuredBriefInput>(() =>
    briefFromCampaign(null),
  );
  const [savedBrief, setSavedBrief] = useState<StructuredBriefInput>(() =>
    briefFromCampaign(null),
  );
  const [briefSaved, setBriefSaved] = useState<boolean>(false);
  const [proposedFieldKeys, setProposedFieldKeys] = useState<Set<BriefField>>(
    () => new Set(),
  );
  const [compileResult, setCompileResult] = useState<CompileResponseDTO | null>(
    null,
  );
  const [emptySetAcknowledged, setEmptySetAcknowledged] =
    useState<boolean>(false);
  const [extractInFlight, setExtractInFlight] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);
  const [compileInFlight, setCompileInFlight] = useState<boolean>(false);
  const [generateInFlight, setGenerateInFlight] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const showLoadingSpinner = useDelayedLoading(view === "loading");

  const load = useCallback(async (): Promise<void> => {
    if (campaignId === undefined) {
      setNotFound(true);
      setCampaign(null);
      setView("error");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await getCampaignService(campaignId, controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      const hydrated = hydrateFromCampaign(data);
      setCampaign(data);
      setFreeText(hydrated.freeText);
      setBrief(hydrated.brief);
      setSavedBrief(hydrated.savedBrief);
      setBriefSaved(hydrated.briefSaved);
      setCompileResult(hydrated.compileResult);
      setProposedFieldKeys(new Set());
      setEmptySetAcknowledged(false);
      setNotFound(false);
      setView("loaded");
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "not_found") {
        setNotFound(true);
        setCampaign(null);
        setView("error");
        return;
      }
      setNotFound(false);
      setView("error");
    }
  }, [campaignId]);

  useEffect(() => {
    setView("loading");
    setNotFound(false);
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const toastApiError = useCallback(
    (error: unknown): void => {
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      if (error instanceof ApiClientError) {
        enqueue(error.apiError ?? error.message);
        return;
      }
      if (error instanceof Error) {
        enqueue(error.message);
      }
    },
    [enqueue],
  );

  const gate = useMemo(
    () =>
      campaignGateState({
        brief,
        savedBrief,
        briefSaved,
        compileResult,
        emptySetAcknowledged,
        generateInFlight,
      }),
    [
      brief,
      savedBrief,
      briefSaved,
      compileResult,
      emptySetAcknowledged,
      generateInFlight,
    ],
  );

  const { extract, save, compile, generate } = useCampaignMutations({
    campaignId,
    freeText,
    brief,
    briefSaved,
    briefDirty: gate.briefDirty,
    compileResult,
    generateDisabled: gate.generateDisabled,
    saveDisabled: gate.saveDisabled,
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
  });

  const onFieldEdit = useCallback((field: BriefField): void => {
    setProposedFieldKeys((current) => {
      if (!current.has(field)) {
        return current;
      }
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }, []);

  const retryLoad = useCallback((): void => {
    setView("loading");
    void load();
  }, [load]);

  return {
    campaign,
    view,
    notFound,
    showLoadingSpinner,
    freeText,
    brief,
    proposedFieldKeys,
    compileResult,
    emptySetAcknowledged,
    extractInFlight,
    saveInFlight,
    compileInFlight,
    generateInFlight,
    saveDisabled: gate.saveDisabled,
    generateDisabled: gate.generateDisabled,
    generateCaption: gate.generateCaption,
    staleBanner: gate.staleBanner,
    s2Dimmed: gate.s2Dimmed,
    s3Dimmed: gate.s3Dimmed,
    briefDirty: gate.briefDirty,
    activeStep: activeCampaignStep({
      briefSaved,
      compileDone: compileResult !== null,
    }),
    setFreeText,
    setBrief,
    onFieldEdit,
    onEmptySetAckChange: setEmptySetAcknowledged,
    extract,
    save,
    compile,
    generate,
    retryLoad,
  };
}
