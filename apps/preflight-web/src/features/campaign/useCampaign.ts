/**
 * useCampaign — Campaign fetch and mutations.
 * Why: GET/PUT brief, extract, compile, generate orchestration.
 */
// size: load in useCampaignLoad; mutations in useCampaignMutations.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { StructuredBriefInput } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import { activeCampaignStep } from "@/features/campaign/CampaignStepNav";
import type { CampaignStepId } from "@/features/campaign/CampaignStepNav";
import {
  campaignGateState,
  mergeExtractProposal,
  proposedKeysFromPartial,
} from "@/features/campaign/lib";
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
  compileResult: ReturnType<typeof useCampaignLoad>["compileResult"];
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
  const [proposedFieldKeys, setProposedFieldKeys] = useState<Set<BriefField>>(
    () => new Set(),
  );
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
    setEmptySetAcknowledged(false);
    handoffAppliedRef.current = false;
  }, []);

  const load = useCampaignLoad(campaignId, onHydrated);

  useEffect(() => {
    if (
      load.view !== "loaded" ||
      pendingHandoff === null ||
      handoffAppliedRef.current
    ) {
      return;
    }

    handoffAppliedRef.current = true;
    load.setFreeText(pendingHandoff.freeText);
    load.setBrief((current) =>
      mergeExtractProposal(current, pendingHandoff.proposal),
    );
    setProposedFieldKeys(proposedKeysFromPartial(pendingHandoff.proposal));
    clearHandoff();
  }, [load.view, pendingHandoff, load.setFreeText, load.setBrief, clearHandoff]);

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
    setCompileResult: load.setCompileResult,
    setEmptySetAcknowledged,
    setExtractInFlight,
    setSaveInFlight,
    setCompileInFlight,
    setGenerateInFlight,
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

  return {
    campaign: load.campaign,
    view: load.view,
    notFound: load.notFound,
    showLoadingSpinner: load.showLoadingSpinner,
    freeText: load.freeText,
    brief: load.brief,
    proposedFieldKeys,
    compileResult: load.compileResult,
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
      briefSaved: load.briefSaved,
      compileDone: load.compileResult !== null,
    }),
    setFreeText: load.setFreeText,
    setBrief: load.setBrief,
    onFieldEdit,
    onEmptySetAckChange: setEmptySetAcknowledged,
    extract,
    save,
    compile,
    generate,
    retryLoad: load.retryLoad,
  };
}
