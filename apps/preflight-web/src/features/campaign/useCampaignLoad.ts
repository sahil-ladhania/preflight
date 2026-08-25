/**
 * useCampaignLoad — GET /campaigns/:id fetch and hydrate.
 * Why: extracted from useCampaign to stay under file limit.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  CampaignDTO,
  CompileResponseDTO,
  StructuredBriefInput,
} from "@preflight/schemas";

import { getCampaignService } from "@/features/campaign/campaign.service";
import {
  briefFromCampaign,
  hydrateFromCampaign,
} from "@/features/campaign/lib";
import type { CampaignView } from "@/features/campaign/types";
import { useDelayedLoading } from "@/features/shell/useDelayedLoading";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useCampaignLoad(
  campaignId: string | undefined,
  onHydrated: () => void,
): {
  campaign: CampaignDTO | null;
  view: CampaignView;
  notFound: boolean;
  showLoadingSpinner: boolean;
  freeText: string;
  brief: StructuredBriefInput;
  savedBrief: StructuredBriefInput;
  briefSaved: boolean;
  compileResult: CompileResponseDTO | null;
  setCampaign: (campaign: CampaignDTO) => void;
  setFreeText: (value: string) => void;
  setBrief: Dispatch<SetStateAction<StructuredBriefInput>>;
  setSavedBrief: (brief: StructuredBriefInput) => void;
  setBriefSaved: (saved: boolean) => void;
  setCompileResult: (result: CompileResponseDTO | null) => void;
  retryLoad: () => void;
  toastApiError: (error: unknown) => void;
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
  const [compileResult, setCompileResult] = useState<CompileResponseDTO | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);
  const showLoadingSpinner = useDelayedLoading(view === "loading");

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
      onHydrated();
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
  }, [campaignId, onHydrated]);

  useEffect(() => {
    setView("loading");
    setNotFound(false);
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

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
    savedBrief,
    briefSaved,
    compileResult,
    setCampaign,
    setFreeText,
    setBrief,
    setSavedBrief,
    setBriefSaved,
    setCompileResult,
    retryLoad,
    toastApiError,
  };
}
