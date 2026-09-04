/**
 * useCampaignBuild — client-side extract → save → compile → generate chain.
 * Why: one Build it click; agents stay narrow, orchestration stays code (doc 06).
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  CampaignDTO,
  CompileResponseDTO,
  InjectionDetection,
  StructuredBriefInput,
} from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import type { CampaignStepId } from "@/features/campaign/CampaignStepRail";
import {
  runCampaignBuildChain,
  runGenerateOnly,
  type BuildChainResult,
} from "@/features/campaign/runCampaignBuildChain";
import type { BuildPhase, CampaignNarrations } from "@/features/campaign/types";
import { ApiClientError } from "@/lib/api";

export type { BuildPhase } from "@/features/campaign/types";

function buildStepFailureLabel(phase: BuildPhase): string | null {
  const labels: Partial<Record<BuildPhase, string>> = {
    extract: "Brief extraction",
    save: "Saving brief",
    compile: "Rule freeze",
    generate: "Copy generation",
  };
  return labels[phase] ?? null;
}

function isBuildAbortError(error: unknown): boolean {
  if (error instanceof Error && error.name === "AbortError") {
    return true;
  }
  return error instanceof ApiClientError && error.kind === "abort";
}

function buildPhaseToStep(phase: BuildPhase): CampaignStepId | undefined {
  if (phase === "extract" || phase === "save" || phase === "needs_input") {
    return "campaign-brief";
  }
  if (phase === "compile" || phase === "needs_ack") {
    return "campaign-constraints";
  }
  if (phase === "generate") {
    return "campaign-generate";
  }
  return undefined;
}

export function useCampaignBuild(input: {
  campaignId: string | undefined;
  freeText: string;
  brief: StructuredBriefInput;
  compileResult: CompileResponseDTO | null;
  emptySetAcknowledged: boolean;
  setCampaign: (campaign: CampaignDTO) => void;
  setBrief: (brief: StructuredBriefInput) => void;
  setSavedBrief: (brief: StructuredBriefInput) => void;
  setBriefSaved: (saved: boolean) => void;
  setProposedFieldKeys: (keys: Set<BriefField>) => void;
  setExtractSkillsRead: (skillsRead: string[] | null) => void;
  setExtractInjection: (injection: InjectionDetection | null) => void;
  setCompileResult: (result: CompileResponseDTO | null) => void;
  setEmptySetAcknowledged: (checked: boolean) => void;
  reloadCampaignAssets: () => Promise<void>;
  toastApiError: (error: unknown) => void;
}): {
  buildPhase: BuildPhase;
  buildInFlight: boolean;
  runningStep: CampaignStepId | undefined;
  narrations: CampaignNarrations;
  missingFields: BriefField[];
  setBriefNarration: (text: string) => void;
  runBuild: () => Promise<void>;
} {
  const abortRef = useRef<AbortController | null>(null);
  const phaseRef = useRef<BuildPhase>("idle");
  const [buildPhase, setBuildPhase] = useState<BuildPhase>("idle");
  const [buildInFlight, setBuildInFlight] = useState<boolean>(false);
  const [narrations, setNarrations] = useState<CampaignNarrations>({
    brief: null,
    freeze: null,
    generate: null,
  });
  const [missingFields, setMissingFields] = useState<BriefField[]>([]);

  useEffect(() => {
    phaseRef.current = buildPhase;
  }, [buildPhase]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    setBuildPhase("idle");
    setMissingFields([]);
    setNarrations({ brief: null, freeze: null, generate: null });
  }, [input.campaignId]);

  const setBriefNarration = useCallback((text: string): void => {
    setNarrations((current) => ({ ...current, brief: text }));
  }, []);

  const applyResult = useCallback(
    (result: Awaited<ReturnType<typeof runCampaignBuildChain>>): void => {
      setBuildPhase(result.phase);
      setNarrations(result.narrations);
      setMissingFields(result.missingFields);
    },
    [],
  );

  // Assets are refreshed before the spinner clears, so the pane goes straight
  // from `building` to S4 Built without a flash of the empty brief.
  const settleAssets = useCallback(
    async (result: BuildChainResult): Promise<void> => {
      if (result.assetsGenerated !== true) {
        return;
      }
      await input.reloadCampaignAssets();
    },
    [input],
  );

  const runBuild = useCallback(async (): Promise<void> => {
    if (input.campaignId === undefined || buildInFlight) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBuildInFlight(true);
    setBuildPhase("idle");

    try {
      if (
        buildPhase === "needs_ack" &&
        input.emptySetAcknowledged &&
        input.compileResult !== null &&
        input.compileResult.ruleIds.length === 0
      ) {
        const result = await runGenerateOnly({
          campaignId: input.campaignId,
          signal: controller.signal,
          onPhase: setBuildPhase,
        });
        applyResult(result);
        await settleAssets(result);
        return;
      }

      setMissingFields([]);
      const result = await runCampaignBuildChain({
        campaignId: input.campaignId,
        freeText: input.freeText,
        brief: input.brief,
        signal: controller.signal,
        setCampaign: input.setCampaign,
        setBrief: input.setBrief,
        setSavedBrief: input.setSavedBrief,
        setBriefSaved: input.setBriefSaved,
        setProposedFieldKeys: input.setProposedFieldKeys,
        setExtractSkillsRead: input.setExtractSkillsRead,
        setExtractInjection: input.setExtractInjection,
        setCompileResult: input.setCompileResult,
        setEmptySetAcknowledged: input.setEmptySetAcknowledged,
        onPhase: setBuildPhase,
      });
      applyResult(result);
      await settleAssets(result);
    } catch (error: unknown) {
      if (isBuildAbortError(error)) {
        return;
      }
      setBuildPhase("failed");
      const stepLabel = buildStepFailureLabel(phaseRef.current);
      if (error instanceof ApiClientError && stepLabel !== null) {
        input.toastApiError(
          new ApiClientError(
            `${stepLabel} failed — ${error.apiError ?? error.message}`,
            error.kind,
            error.status,
            error.apiError,
          ),
        );
      } else {
        input.toastApiError(error);
      }
    } finally {
      setBuildInFlight(false);
    }
  }, [applyResult, buildInFlight, buildPhase, input, settleAssets]);

  return {
    buildPhase,
    buildInFlight,
    runningStep: buildInFlight ? buildPhaseToStep(buildPhase) : undefined,
    narrations,
    missingFields,
    setBriefNarration,
    runBuild,
  };
}
