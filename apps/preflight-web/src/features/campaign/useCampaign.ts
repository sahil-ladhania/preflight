/**
 * useCampaign — Campaign fetch and mutations.
 * Why: GET/PUT brief, extract, compile, generate orchestration.
 */
// size: build chain in useCampaignBuild.ts; mutations in useCampaignMutations.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { StructuredBriefInput } from "@preflight/schemas";
import type { BriefField, InjectionDetection } from "@preflight/schemas";

import { activeCampaignStep } from "@/features/campaign/CampaignStepRail";
import type { CampaignStepId } from "@/features/campaign/CampaignStepRail";
import {
  campaignGateState,
  mergeExtractProposal,
  proposedKeysFromPartial,
} from "@/features/campaign/lib";
import { buildExtractNarration } from "@/features/campaign/narration";
import type { BuildPhase, CampaignNarrations } from "@/features/campaign/types";
import { useCampaignBuild } from "@/features/campaign/useCampaignBuild";
import { useCampaignAssets } from "@/features/campaign/useCampaignAssets";
import { useCampaignHandoff } from "@/features/campaign/useCampaignHandoff";
import { useCampaignLoad } from "@/features/campaign/useCampaignLoad";
import { useCampaignMutations } from "@/features/campaign/useCampaignMutations";

export function useCampaign(campaignId: string | undefined): {
  campaign: ReturnType<typeof useCampaignLoad>["campaign"];
  view: ReturnType<typeof useCampaignLoad>["view"];
  notFound: boolean;
  showLoadingSpinner: boolean;
  freeText: string;
  brief: StructuredBriefInput;
  proposedFieldKeys: ReadonlySet<BriefField>;
  extractSkillsRead: string[] | null;
  extractInjection: InjectionDetection | null;
  compileResult: ReturnType<typeof useCampaignLoad>["compileResult"];
  emptySetAcknowledged: boolean;
  extractInFlight: boolean;
  saveInFlight: boolean;
  compileInFlight: boolean;
  generateInFlight: boolean;
  saveDisabled: boolean;
  saveDisabledCaption: string | null;
  generateDisabled: boolean;
  generateCaption: string | null;
  staleBanner: boolean;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  briefDirty: boolean;
  briefSaved: boolean;
  activeStep: CampaignStepId;
  buildPhase: BuildPhase;
  buildInFlight: boolean;
  runningStep: CampaignStepId | undefined;
  narrations: CampaignNarrations;
  missingFields: BriefField[];
  campaignAssets: ReturnType<typeof useCampaignAssets>["assets"];
  setFreeText: (value: string) => void;
  setBrief: (brief: StructuredBriefInput) => void;
  onFieldEdit: (field: BriefField) => void;
  onEmptySetAckChange: (checked: boolean) => void;
  extract: () => Promise<void>;
  save: () => Promise<void>;
  compile: () => Promise<void>;
  generate: () => Promise<void>;
  runBuild: () => Promise<void>;
  retryLoad: () => void;
} {
  const [proposedFieldKeys, setProposedFieldKeys] = useState<Set<BriefField>>(
    () => new Set(),
  );
  const [extractSkillsRead, setExtractSkillsRead] = useState<string[] | null>(
    null,
  );
  const [extractInjection, setExtractInjection] =
    useState<InjectionDetection | null>(null);
  const [emptySetAcknowledged, setEmptySetAcknowledged] =
    useState<boolean>(false);
  const [extractInFlight, setExtractInFlight] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);
  const [compileInFlight, setCompileInFlight] = useState<boolean>(false);
  const [generateInFlight, setGenerateInFlight] = useState<boolean>(false);
  const handoffAppliedRef = useRef<boolean>(false);
  const { pendingHandoff, clearHandoff } = useCampaignHandoff();

  const onHydrated = useCallback((): void => {
    setProposedFieldKeys(new Set());
    setExtractSkillsRead(null);
    setExtractInjection(null);
    setEmptySetAcknowledged(false);
    handoffAppliedRef.current = false;
  }, []);

  const load = useCampaignLoad(campaignId, onHydrated);
  const assetsHook = useCampaignAssets(
    load.view === "loaded" ? campaignId : undefined,
  );

  const build = useCampaignBuild({
    campaignId,
    freeText: load.freeText,
    brief: load.brief,
    compileResult: load.compileResult,
    emptySetAcknowledged,
    setCampaign: load.setCampaign,
    setBrief: load.setBrief,
    setSavedBrief: load.setSavedBrief,
    setBriefSaved: load.setBriefSaved,
    setProposedFieldKeys,
    setExtractSkillsRead,
    setExtractInjection,
    setCompileResult: load.setCompileResult,
    setEmptySetAcknowledged,
    reloadCampaignAssets: assetsHook.reload,
    toastApiError: load.toastApiError,
  });

  useEffect(() => {
    if (
      load.view !== "loaded" ||
      pendingHandoff === null ||
      handoffAppliedRef.current
    ) {
      return;
    }

    handoffAppliedRef.current = true;
    if (pendingHandoff.freeText !== undefined) {
      load.setFreeText(pendingHandoff.freeText);
    }
    load.setBrief((current) =>
      mergeExtractProposal(current, pendingHandoff.proposal),
    );
    setProposedFieldKeys(proposedKeysFromPartial(pendingHandoff.proposal));
    setExtractSkillsRead(pendingHandoff.skillsRead ?? null);
    setExtractInjection(pendingHandoff.injection ?? null);
    build.setBriefNarration(
      buildExtractNarration(
        pendingHandoff.proposal,
        pendingHandoff.skillsRead ?? [],
      ),
    );
    clearHandoff();
    // handoff runs once per campaign load; build/load objects are stable enough here
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional single-fire handoff
  }, [load.view, pendingHandoff, clearHandoff]);

  const gate = useMemo(
    () =>
      campaignGateState({
        brief: load.brief,
        savedBrief: load.savedBrief,
        briefSaved: load.briefSaved,
        compileResult: load.compileResult,
        emptySetAcknowledged,
        generateInFlight,
      }),
    [
      load.brief,
      load.savedBrief,
      load.briefSaved,
      load.compileResult,
      emptySetAcknowledged,
      generateInFlight,
    ],
  );

  const { extract, save, compile, generate } = useCampaignMutations({
    campaignId,
    freeText: load.freeText,
    brief: load.brief,
    briefSaved: load.briefSaved,
    briefDirty: gate.briefDirty,
    compileResult: load.compileResult,
    generateDisabled: gate.generateDisabled,
    saveDisabled: gate.saveDisabled,
    setCampaign: load.setCampaign,
    setBrief: load.setBrief,
    setSavedBrief: load.setSavedBrief,
    setBriefSaved: load.setBriefSaved,
    setProposedFieldKeys,
    setExtractSkillsRead,
    setExtractInjection,
    setCompileResult: load.setCompileResult,
    setEmptySetAcknowledged,
    setExtractInFlight,
    setSaveInFlight,
    setCompileInFlight,
    setGenerateInFlight,
    reloadCampaignAssets: assetsHook.reload,
    toastApiError: load.toastApiError,
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

  const buildActiveStep =
    build.runningStep ??
    activeCampaignStep({
      briefSaved: load.briefSaved,
      compileDone: load.compileResult !== null,
    });

  return {
    campaign: load.campaign,
    view: load.view,
    notFound: load.notFound,
    showLoadingSpinner: load.showLoadingSpinner,
    freeText: load.freeText,
    brief: load.brief,
    proposedFieldKeys,
    extractSkillsRead,
    extractInjection,
    compileResult: load.compileResult,
    emptySetAcknowledged,
    extractInFlight,
    saveInFlight,
    compileInFlight,
    generateInFlight,
    saveDisabled: gate.saveDisabled,
    saveDisabledCaption: gate.saveDisabledCaption,
    generateDisabled: gate.generateDisabled,
    generateCaption: gate.generateCaption,
    staleBanner: gate.staleBanner,
    s2Dimmed: gate.s2Dimmed,
    s3Dimmed: gate.s3Dimmed,
    briefDirty: gate.briefDirty,
    briefSaved: load.briefSaved,
    activeStep: buildActiveStep,
    buildPhase: build.buildPhase,
    buildInFlight: build.buildInFlight,
    runningStep: build.runningStep,
    narrations: build.narrations,
    missingFields: build.missingFields,
    campaignAssets: assetsHook.assets,
    setFreeText: load.setFreeText,
    setBrief: load.setBrief,
    onFieldEdit,
    onEmptySetAckChange: setEmptySetAcknowledged,
    extract,
    save,
    compile,
    generate,
    runBuild: build.runBuild,
    retryLoad: load.retryLoad,
  };
}
