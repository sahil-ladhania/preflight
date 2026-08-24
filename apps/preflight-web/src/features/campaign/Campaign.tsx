/**
 * Campaign — Screen 3 three-step orchestrator.
 * Why: brief → compile → generate on one scroll page.
 * size: three step regions extracted; orchestrator holds gate state only.
 */

import { useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BriefForm } from "@/features/campaign/BriefForm";
import { CampaignStep } from "@/features/campaign/CampaignStep";
import { ConstraintCards } from "@/features/campaign/ConstraintCards";
import { GenerateBlock } from "@/features/campaign/GenerateBlock";
import {
  briefEquals,
  briefFromCampaign,
  briefIsValid,
  generateDisabledCaption,
  mergeExtractProposal,
  proposedKeysFromPartial,
} from "@/features/campaign/lib";
import type { CampaignProps } from "@/features/campaign/types";
import {
  CAMPAIGNS,
  COMPILE_RESULT,
  COMPILE_ZERO_RULES,
  EXTRACT_PROPOSAL,
  GENERATE_ASSET_ID,
} from "@/fixtures/campaign";
import type { BriefField, CompileResponseDTO } from "@preflight/schemas";

function LoadingState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function ErrorState(): ReactElement {
  const handleRetry = (): void => {
    // Will re-GET /campaigns/:id.
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load campaign.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

function NotFoundState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <p className="text-caption text-fg-muted">Campaign not found</p>
    </div>
  );
}

export function Campaign({
  campaign,
  view = "loaded",
  initialCompileResult = null,
  zeroRulesCompile = false,
}: CampaignProps & {
  initialCompileResult?: CompileResponseDTO | null;
  zeroRulesCompile?: boolean;
}): ReactElement {
  const navigate = useNavigate();
  const [freeText, setFreeText] = useState<string>(campaign.freeText);
  const [brief, setBrief] = useState(() => briefFromCampaign(campaign.structuredBrief));
  const [savedBrief, setSavedBrief] = useState(() =>
    briefFromCampaign(campaign.structuredBrief),
  );
  const [briefSaved, setBriefSaved] = useState<boolean>(
    campaign.structuredBrief !== null,
  );
  const [proposedFieldKeys, setProposedFieldKeys] = useState<Set<BriefField>>(
    () => new Set(),
  );
  const [compileResult, setCompileResult] = useState<CompileResponseDTO | null>(
    () => initialCompileResult ?? campaign.lastCompile,
  );
  const [emptySetAcknowledged, setEmptySetAcknowledged] =
    useState<boolean>(false);
  const [extractInFlight, setExtractInFlight] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);
  const [compileInFlight, setCompileInFlight] = useState<boolean>(false);
  const [generateInFlight, setGenerateInFlight] = useState<boolean>(false);

  if (view === "loading") {
    return <LoadingState />;
  }

  if (view === "error") {
    return <ErrorState />;
  }

  const briefDirty = !briefEquals(brief, savedBrief);
  const s2Dimmed = !briefSaved;
  const s3Dimmed = compileResult === null;
  const staleBanner = compileResult !== null && briefDirty;
  const saveDisabled =
    !briefIsValid(brief) || (!briefDirty && briefSaved);
  const generateCaption = generateDisabledCaption({
    s3Dimmed,
    ruleCount: compileResult?.ruleIds.length ?? 0,
    emptySetAcknowledged,
    briefDirty,
    generateInFlight,
  });
  const generateDisabled = generateCaption !== null;

  const handleExtract = (): void => {
    setExtractInFlight(true);
    // Will POST /campaigns/:id/extract.
    setBrief(mergeExtractProposal(brief, EXTRACT_PROPOSAL));
    setProposedFieldKeys(proposedKeysFromPartial(EXTRACT_PROPOSAL));
    setExtractInFlight(false);
  };

  const handleFieldEdit = (field: BriefField): void => {
    setProposedFieldKeys((current) => {
      if (!current.has(field)) {
        return current;
      }
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  };

  const handleSave = (): void => {
    if (!briefIsValid(brief)) {
      return;
    }
    setSaveInFlight(true);
    // Will PUT /campaigns/:id/brief.
    setSavedBrief(brief);
    setBriefSaved(true);
    setProposedFieldKeys(new Set());
    setSaveInFlight(false);
  };

  const handleCompile = (): void => {
    setCompileInFlight(true);
    // Will POST /campaigns/:id/compile.
    const result = zeroRulesCompile ? COMPILE_ZERO_RULES : COMPILE_RESULT;
    setCompileResult(result);
    setEmptySetAcknowledged(false);
    setCompileInFlight(false);
  };

  const handleGenerate = (): void => {
    setGenerateInFlight(true);
    // Will POST /campaigns/:id/generate.
    setGenerateInFlight(false);
    void navigate(`/assets/${GENERATE_ASSET_ID}`);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[720px] flex-col gap-6 px-8 py-6">
      <h1 className="text-title text-fg">Campaign</h1>
      <CampaignStep title="Brief" subtitle="Step 1 — paste and structure the brief.">
        <BriefForm
          freeText={freeText}
          brief={brief}
          proposedFieldKeys={proposedFieldKeys}
          saveDisabled={saveDisabled}
          saveInFlight={saveInFlight}
          extractInFlight={extractInFlight}
          onFreeTextChange={setFreeText}
          onBriefChange={setBrief}
          onFieldEdit={handleFieldEdit}
          onExtract={handleExtract}
          onSave={handleSave}
        />
      </CampaignStep>
      <CampaignStep
        title="Constraint set"
        subtitle="Step 2 — compile predicates against the saved brief."
        dimmed={s2Dimmed}
      >
        <ConstraintCards
          compileResult={compileResult}
          compileInFlight={compileInFlight}
          compileDisabled={s2Dimmed || briefDirty}
          emptySetAcknowledged={emptySetAcknowledged}
          staleBanner={staleBanner}
          onCompile={handleCompile}
          onEmptySetAckChange={setEmptySetAcknowledged}
        />
      </CampaignStep>
      <CampaignStep
        title="Generate"
        subtitle="Step 3 — freeze and create assets."
        dimmed={s3Dimmed}
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
    </div>
  );
}

export function CampaignRoute(): ReactElement {
  const { campaignId } = useParams<{ campaignId: string }>();
  if (campaignId === undefined) {
    return <NotFoundState />;
  }
  const campaign = CAMPAIGNS[campaignId];
  if (campaign === undefined) {
    return <NotFoundState />;
  }
  return <Campaign campaign={campaign} />;
}
