/**
 * Campaign — Screen 3 three-step orchestrator.
 * Why: brief → compile → generate in a single active pane.
 */
// size: controlled + fixture modes share one tree; BriefPhase owns brief/build UI

import type { ReactElement } from "react";

import { BriefPhase } from "@/features/campaign/BriefPhase";
import { CampaignPageShell } from "@/features/campaign/CampaignPageShell";
import { CampaignStep } from "@/features/campaign/CampaignStep";
import { activeCampaignStep } from "@/features/campaign/CampaignStepRail";
import {
  CampaignErrorState,
  CampaignLoadingState,
} from "@/features/campaign/CampaignStates";
import { ConstraintCards } from "@/features/campaign/ConstraintCards";
import { GenerateBlock } from "@/features/campaign/GenerateBlock";
import { briefFromCampaign, briefPhaseSubtitle, campaignGateState } from "@/features/campaign/lib";
import type { CampaignProps } from "@/features/campaign/types";
import { useCampaignFixture } from "@/features/campaign/useCampaignFixture";

export function Campaign({
  campaign,
  view = "loaded",
  showLoadingSpinner = true,
  freeText: freeTextProp,
  brief: briefProp,
  proposedFieldKeys: proposedFieldKeysProp,
  extractSkillsRead: extractSkillsReadProp,
  extractInjection: extractInjectionProp,
  compileResult: compileResultProp,
  emptySetAcknowledged: emptySetAcknowledgedProp,
  extractInFlight: extractInFlightProp,
  saveInFlight: saveInFlightProp,
  compileInFlight: compileInFlightProp,
  generateInFlight: generateInFlightProp,
  saveDisabled: saveDisabledProp,
  saveDisabledCaption: saveDisabledCaptionProp,
  generateDisabled: generateDisabledProp,
  generateCaption: generateCaptionProp,
  staleBanner: staleBannerProp,
  s2Dimmed: s2DimmedProp,
  s3Dimmed: s3DimmedProp,
  briefDirty: briefDirtyProp,
  briefSaved: briefSavedProp,
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
  buildPhase = "idle",
  buildInFlight = false,
  runningStep,
  narrations = { brief: null, freeze: null, generate: null },
  missingFields = [],
  onRunBuild,
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
  const extractSkillsRead = controlled
    ? (extractSkillsReadProp ?? null)
    : fixture.extractSkillsRead;
  const extractInjection = controlled
    ? (extractInjectionProp ?? null)
    : null;
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
  const saveDisabledCaption = controlled
    ? (saveDisabledCaptionProp ?? null)
    : fixtureGate.saveDisabledCaption;
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
  const briefSaved = controlled
    ? (briefSavedProp ?? false)
    : fixture.briefSaved;
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
      runningStep={runningStep}
      s2Dimmed={s2Dimmed}
      s3Dimmed={s3Dimmed}
      briefAgentRan={extractSkillsRead !== null}
      compileRan={compileResult !== null}
      generateRan={narrations.generate !== null}
    >
      {(viewStep) => {
        const narration =
          viewStep === "campaign-brief"
            ? narrations.brief
            : viewStep === "campaign-constraints"
              ? narrations.freeze
              : narrations.generate;

        if (viewStep === "campaign-brief") {
          return (
            <CampaignStep
              subtitle={briefPhaseSubtitle({
                freeText,
                brief,
                briefSaved,
                buildPhase,
              })}
              narration={narration}
            >
              <BriefPhase
                freeText={freeText}
                brief={brief}
                proposedFieldKeys={proposedFieldKeys}
                extractSkillsRead={extractSkillsRead}
                extractInjection={extractInjection}
                saveDisabled={saveDisabled}
                saveDisabledCaption={saveDisabledCaption}
                saveInFlight={saveInFlight}
                extractInFlight={extractInFlight}
                briefSaved={briefSaved}
                briefDirty={briefDirty}
                buildPhase={buildPhase}
                buildInFlight={buildInFlight}
                missingFieldsBuild={missingFields}
                emptySetAcknowledged={emptySetAcknowledged}
                onRunBuild={
                  controlled && onRunBuild !== undefined ? onRunBuild : undefined
                }
                onEmptySetAckChange={
                  onEmptySetAckChange ?? fixture.setEmptySetAcknowledged
                }
                onFreeTextChange={onFreeTextChange ?? fixture.setFreeText}
                onBriefChange={onBriefChange ?? fixture.setBrief}
                onFieldEdit={onFieldEdit ?? fixture.handleFieldEdit}
                onExtract={handleExtract}
                onSave={handleSave}
              />
            </CampaignStep>
          );
        }

        if (viewStep === "campaign-constraints") {
          return (
            <CampaignStep
              subtitle="Freeze your saved brief to see which compliance rules apply."
              narration={narration}
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
          );
        }

        return (
          <CampaignStep
            subtitle="Generate marketing copy for your selected channels under those rules."
            narration={narration}
          >
            <GenerateBlock
              compileResult={compileResult}
              dimmed={s3Dimmed}
              disabled={generateDisabled}
              disabledCaption={generateCaption}
              generateInFlight={generateInFlight}
              onGenerate={handleGenerate}
            />
          </CampaignStep>
        );
      }}
    </CampaignPageShell>
  );
}
