/**
 * Campaign — Screen 3 three-step orchestrator.
 * Why: brief → compile → generate on one scroll page.
 */
// size: controlled + fixture modes share one tree; fixture hook extracted

import type { ReactElement } from "react";
import { useParams } from "react-router-dom";

import { BriefForm } from "@/features/campaign/BriefForm";
import { CampaignPageShell } from "@/features/campaign/CampaignPageShell";
import { CampaignStep } from "@/features/campaign/CampaignStep";
import { activeCampaignStep } from "@/features/campaign/CampaignStepNav";
import {
  CampaignErrorState,
  CampaignLoadingState,
  CampaignNotFoundState,
} from "@/features/campaign/CampaignStates";
import { ConstraintCards } from "@/features/campaign/ConstraintCards";
import { GenerateBlock } from "@/features/campaign/GenerateBlock";
import { briefFromCampaign, campaignGateState } from "@/features/campaign/lib";
import type { CampaignProps } from "@/features/campaign/types";
import { useCampaign } from "@/features/campaign/useCampaign";
import { useCampaignFixture } from "@/features/campaign/useCampaignFixture";

export function Campaign({
  campaign,
  view = "loaded",
  showLoadingSpinner = true,
  freeText: freeTextProp,
  brief: briefProp,
  proposedFieldKeys: proposedFieldKeysProp,
  compileResult: compileResultProp,
  emptySetAcknowledged: emptySetAcknowledgedProp,
  extractInFlight: extractInFlightProp,
  saveInFlight: saveInFlightProp,
  compileInFlight: compileInFlightProp,
  generateInFlight: generateInFlightProp,
  saveDisabled: saveDisabledProp,
  generateDisabled: generateDisabledProp,
  generateCaption: generateCaptionProp,
  staleBanner: staleBannerProp,
  s2Dimmed: s2DimmedProp,
  s3Dimmed: s3DimmedProp,
  briefDirty: briefDirtyProp,
  activeStep: activeStepProp,
  initialCompileResult = null,
  zeroRulesCompile = false,
  onFreeTextChange,
  onBriefChange,
  onFieldEdit,
  onEmptySetAckChange,
  onExtract,
  onSave,
  onCompile,
  onGenerate,
  onRetry,
}: CampaignProps): ReactElement {
  const fixture = useCampaignFixture(
    campaign,
    initialCompileResult,
    zeroRulesCompile,
  );
  const controlled = onSave !== undefined;

  if (view === "loading") {
    return <CampaignLoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error") {
    return <CampaignErrorState onRetry={onRetry} />;
  }

  const freeText = controlled ? (freeTextProp ?? "") : fixture.freeText;
  const brief = controlled
    ? (briefProp ?? briefFromCampaign(null))
    : fixture.brief;
  const proposedFieldKeys = controlled
    ? (proposedFieldKeysProp ?? new Set())
    : fixture.proposedFieldKeys;
  const compileResult = controlled
    ? (compileResultProp ?? null)
    : fixture.compileResult;
  const emptySetAcknowledged = controlled
    ? (emptySetAcknowledgedProp ?? false)
    : fixture.emptySetAcknowledged;
  const extractInFlight = controlled
    ? (extractInFlightProp ?? false)
    : fixture.extractInFlight;
  const saveInFlight = controlled
    ? (saveInFlightProp ?? false)
    : fixture.saveInFlight;
  const compileInFlight = controlled
    ? (compileInFlightProp ?? false)
    : fixture.compileInFlight;
  const generateInFlight = controlled
    ? (generateInFlightProp ?? false)
    : fixture.generateInFlight;

  const fixtureGate = campaignGateState({
    brief: fixture.brief,
    savedBrief: fixture.savedBrief,
    briefSaved: fixture.briefSaved,
    compileResult: fixture.compileResult,
    emptySetAcknowledged: fixture.emptySetAcknowledged,
    generateInFlight: fixture.generateInFlight,
  });

  const saveDisabled = controlled
    ? (saveDisabledProp ?? true)
    : fixtureGate.saveDisabled;
  const generateCaption = controlled
    ? (generateCaptionProp ?? null)
    : fixtureGate.generateCaption;
  const generateDisabled = controlled
    ? (generateDisabledProp ?? true)
    : fixtureGate.generateDisabled;
  const staleBanner = controlled
    ? (staleBannerProp ?? false)
    : fixtureGate.staleBanner;
  const s2Dimmed = controlled ? (s2DimmedProp ?? true) : fixtureGate.s2Dimmed;
  const s3Dimmed = controlled ? (s3DimmedProp ?? true) : fixtureGate.s3Dimmed;
  const briefDirty = controlled
    ? (briefDirtyProp ?? false)
    : fixtureGate.briefDirty;
  const activeStep =
    activeStepProp ??
    activeCampaignStep({
      briefSaved: controlled ? !s2Dimmed : fixture.briefSaved,
      compileDone: compileResult !== null,
    });

  const handleExtract = (): void => {
    if (onExtract !== undefined) {
      void onExtract();
      return;
    }
    fixture.handleExtract();
  };

  const handleSave = (): void => {
    if (onSave !== undefined) {
      void onSave();
      return;
    }
    fixture.handleSave();
  };

  const handleCompile = (): void => {
    if (onCompile !== undefined) {
      void onCompile();
      return;
    }
    fixture.handleCompile();
  };

  const handleGenerate = (): void => {
    if (onGenerate !== undefined) {
      void onGenerate();
      return;
    }
    fixture.handleGenerate();
  };

  return (
    <CampaignPageShell
      activeStep={activeStep}
      generateFooter={
        !s3Dimmed ? (
          <div className="sticky bottom-0 border-t border-border bg-canvas">
            <div className="mx-auto max-w-[720px] px-8 py-4">
              <GenerateBlock
                compileResult={compileResult}
                dimmed={s3Dimmed}
                disabled={generateDisabled}
                disabledCaption={generateCaption}
                generateInFlight={generateInFlight}
                onGenerate={handleGenerate}
              />
            </div>
          </div>
        ) : null
      }
    >
      <CampaignStep
        title="Brief"
        subtitle="Phase 1 — GitAgent extractor structures the brief from free text."
        sectionId="campaign-brief"
      >
        <BriefForm
          freeText={freeText}
          brief={brief}
          proposedFieldKeys={proposedFieldKeys}
          saveDisabled={saveDisabled}
          saveInFlight={saveInFlight}
          extractInFlight={extractInFlight}
          onFreeTextChange={onFreeTextChange ?? fixture.setFreeText}
          onBriefChange={onBriefChange ?? fixture.setBrief}
          onFieldEdit={onFieldEdit ?? fixture.handleFieldEdit}
          onExtract={handleExtract}
          onSave={handleSave}
        />
      </CampaignStep>
      <CampaignStep
        title="Freeze"
        subtitle="Phase 2 — server compile freezes predicates and constraint cards."
        dimmed={s2Dimmed}
        collapsed={s2Dimmed}
        sectionId="campaign-constraints"
      >
        <ConstraintCards
          compileResult={compileResult}
          compileInFlight={compileInFlight}
          compileDisabled={s2Dimmed || briefDirty}
          emptySetAcknowledged={emptySetAcknowledged}
          staleBanner={staleBanner}
          onCompile={handleCompile}
          onEmptySetAckChange={
            onEmptySetAckChange ?? fixture.setEmptySetAcknowledged
          }
        />
      </CampaignStep>
      <CampaignStep
        title="Generate"
        subtitle="Phase 3 — GitAgent generator creates channel assets."
        dimmed={s3Dimmed}
        collapsed={s3Dimmed}
        sectionId="campaign-generate"
      />
    </CampaignPageShell>
  );
}

export function CampaignRoute(): ReactElement {
  const { campaignId } = useParams<{ campaignId: string }>();
  const hook = useCampaign(campaignId);

  if (hook.notFound) {
    return <CampaignNotFoundState />;
  }

  if (hook.view !== "loaded" || hook.campaign === null) {
    return (
      <Campaign
        campaign={{
          id: campaignId ?? "",
          freeText: "",
          structuredBrief: null,
          currentConstraintSetId: null,
          updatedAt: new Date(0).toISOString(),
          lastCompile: null,
        }}
        view={hook.view}
        showLoadingSpinner={hook.showLoadingSpinner}
        onRetry={hook.retryLoad}
      />
    );
  }

  return (
    <Campaign
      campaign={hook.campaign}
      view={hook.view}
      freeText={hook.freeText}
      brief={hook.brief}
      proposedFieldKeys={hook.proposedFieldKeys}
      compileResult={hook.compileResult}
      emptySetAcknowledged={hook.emptySetAcknowledged}
      extractInFlight={hook.extractInFlight}
      saveInFlight={hook.saveInFlight}
      compileInFlight={hook.compileInFlight}
      generateInFlight={hook.generateInFlight}
      saveDisabled={hook.saveDisabled}
      generateDisabled={hook.generateDisabled}
      generateCaption={hook.generateCaption}
      staleBanner={hook.staleBanner}
      s2Dimmed={hook.s2Dimmed}
      s3Dimmed={hook.s3Dimmed}
      briefDirty={hook.briefDirty}
      activeStep={hook.activeStep}
      onFreeTextChange={hook.setFreeText}
      onBriefChange={hook.setBrief}
      onFieldEdit={hook.onFieldEdit}
      onEmptySetAckChange={hook.onEmptySetAckChange}
      onExtract={() => {
        void hook.extract();
      }}
      onSave={() => {
        void hook.save();
      }}
      onCompile={() => {
        void hook.compile();
      }}
      onGenerate={() => {
        void hook.generate();
      }}
    />
  );
}
