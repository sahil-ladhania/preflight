/**
 * Campaign — Screen 3 four-pane orchestrator.
 * Why: brief → building → freeze → built per 09; logic stays in hooks.
 */
// size: pane switch + controlled/fixture modes share one tree; bodies are sibling components

import { useEffect, useMemo, useState, type ReactElement } from "react";

import { BuiltSummary } from "@/features/campaign/BuiltSummary";
import { BriefPhase } from "@/features/campaign/BriefPhase";
import {
  activeCampaignPane,
  campaignEndLine,
  railStepForPane,
  type PaneOverride,
} from "@/features/campaign/campaign-pane";
import { CampaignPageShell } from "@/features/campaign/CampaignPageShell";
import { type CampaignStepId } from "@/features/campaign/CampaignStepRail";
import {
  CampaignErrorState,
  CampaignLoadingState,
} from "@/features/campaign/CampaignStates";
import { FreezeTable } from "@/features/campaign/FreezeTable";
import { briefFromCampaign, campaignGateState } from "@/features/campaign/lib";
import type { CampaignProps } from "@/features/campaign/types";
import { useCampaignFixture } from "@/features/campaign/useCampaignFixture";

function CampaignLoaded(props: CampaignProps): ReactElement {
  const {
    campaign,
    freeText: freeTextProp,
    brief: briefProp,
    compileResult: compileResultProp,
    emptySetAcknowledged: emptySetAcknowledgedProp,
    buildPhase = "idle",
    buildInFlight = false,
    missingFields = [],
    campaignAssets = [],
    staleBanner: staleBannerProp,
    s2Dimmed: s2DimmedProp,
    s3Dimmed: s3DimmedProp,
    runningStep: runningStepProp,
    initialCompileResult = null,
    zeroRulesCompile = false,
    onFreeTextChange,
    onBriefChange,
    onFieldEdit,
    onEmptySetAckChange,
    onCompile,
    onGenerate,
    onRunBuild,
  } = props;

  const fixture = useCampaignFixture(
    campaign,
    initialCompileResult,
    zeroRulesCompile,
  );
  const controlled = onRunBuild !== undefined;

  const [railView, setRailView] = useState<CampaignStepId>("campaign-brief");
  const [paneOverride, setPaneOverride] = useState<PaneOverride>(null);

  const freeText = controlled ? (freeTextProp ?? "") : fixture.freeText;
  const brief = controlled
    ? (briefProp ?? briefFromCampaign(null))
    : fixture.brief;
  const compileResult = controlled
    ? (compileResultProp ?? null)
    : fixture.compileResult;
  const emptySetAcknowledged = controlled
    ? (emptySetAcknowledgedProp ?? false)
    : fixture.emptySetAcknowledged;

  const fixtureGate = campaignGateState({
    brief: fixture.brief,
    savedBrief: fixture.savedBrief,
    briefSaved: fixture.briefSaved,
    compileResult: fixture.compileResult,
    emptySetAcknowledged: fixture.emptySetAcknowledged,
    generateInFlight: false,
  });

  const staleBanner = controlled
    ? (staleBannerProp ?? false)
    : fixtureGate.staleBanner;
  const s2Dimmed = controlled ? (s2DimmedProp ?? true) : fixtureGate.s2Dimmed;
  const s3Dimmed = controlled ? (s3DimmedProp ?? true) : fixtureGate.s3Dimmed;

  const hasAssets = campaignAssets.length > 0;
  const compiling = buildInFlight && buildPhase === "compile";

  const pane = useMemo(
    () =>
      activeCampaignPane({
        hasAssets,
        buildInFlight,
        buildPhase,
        paneOverride,
        railView,
      }),
    [hasAssets, buildInFlight, buildPhase, paneOverride, railView],
  );

  const activeStep = runningStepProp ?? railStepForPane(pane);
  const showBack =
    paneOverride !== null && (pane === "brief" || pane === "freeze");

  useEffect(() => {
    if (hasAssets && paneOverride === null && !buildInFlight) {
      setRailView("campaign-generate");
    }
  }, [hasAssets, paneOverride, buildInFlight]);

  const sharedBriefProps = {
    freeText,
    brief,
    onFreeTextChange: onFreeTextChange ?? fixture.setFreeText,
    onBriefChange: onBriefChange ?? fixture.setBrief,
    onFieldEdit: onFieldEdit ?? fixture.handleFieldEdit,
    buildPhase,
    buildInFlight,
    missingFieldsBuild: missingFields,
    emptySetAcknowledged,
    onRunBuild: controlled ? onRunBuild : undefined,
    onEmptySetAckChange:
      onEmptySetAckChange ?? fixture.setEmptySetAcknowledged,
    missingFields,
  };

  let paneContent: ReactElement;
  if (pane === "building") {
    paneContent = <BriefPhase {...sharedBriefProps} building />;
  } else if (pane === "freeze") {
    paneContent = (
      <FreezeTable
        compileResult={compileResult}
        emptySetAcknowledged={emptySetAcknowledged}
        staleBanner={staleBanner}
        showAcknowledgement={
          compileResult !== null && compileResult.ruleIds.length === 0
        }
        onEmptySetAckChange={
          onEmptySetAckChange ?? fixture.setEmptySetAcknowledged
        }
      />
    );
  } else if (pane === "built") {
    paneContent = (
      <BuiltSummary
        brief={brief}
        compileResult={compileResult}
        assets={campaignAssets}
        onEditBrief={() => setPaneOverride("brief-edit")}
        onViewFreeze={() => setPaneOverride("freeze")}
      />
    );
  } else {
    paneContent = <BriefPhase {...sharedBriefProps} building={false} />;
  }

  return (
    <CampaignPageShell
      activeStep={activeStep}
      compiling={compiling}
      identity={brief.schemeName.trim()}
      s2Dimmed={s2Dimmed}
      s3Dimmed={s3Dimmed}
      backToSummary={showBack}
      endLine={campaignEndLine(campaignAssets)}
      onBackToSummary={() => {
        setPaneOverride(null);
        setRailView("campaign-generate");
      }}
      onRailStepChange={(stepId) => {
        setPaneOverride(null);
        setRailView(stepId);
        if (
          stepId === "campaign-constraints" &&
          !s2Dimmed &&
          compileResult === null &&
          onCompile !== undefined
        ) {
          onCompile();
        }
        if (
          stepId === "campaign-generate" &&
          !s3Dimmed &&
          !hasAssets &&
          onGenerate !== undefined
        ) {
          onGenerate();
        }
      }}
    >
      {paneContent}
    </CampaignPageShell>
  );
}

export function Campaign(props: CampaignProps): ReactElement {
  const { view = "loaded", showLoadingSpinner = true, onRetry } = props;

  if (view === "loading") {
    return <CampaignLoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error") {
    return <CampaignErrorState onRetry={onRetry} />;
  }

  return <CampaignLoaded {...props} />;
}
