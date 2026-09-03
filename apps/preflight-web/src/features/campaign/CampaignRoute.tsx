/**
 * CampaignRoute — production /campaign/:id route wiring.
 * Why: extracted from Campaign.tsx for file size limit.
 */

import type { ReactElement } from "react";
import { useParams } from "react-router-dom";

import { Campaign } from "@/features/campaign/Campaign";
import { CampaignNotFoundState } from "@/features/campaign/CampaignStates";
import { useCampaign } from "@/features/campaign/useCampaign";

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
      compileResult={hook.compileResult}
      emptySetAcknowledged={hook.emptySetAcknowledged}
      staleBanner={hook.staleBanner}
      s2Dimmed={hook.s2Dimmed}
      s3Dimmed={hook.s3Dimmed}
      briefDirty={hook.briefDirty}
      briefSaved={hook.briefSaved}
      campaignAssets={hook.campaignAssets}
      onFreeTextChange={hook.setFreeText}
      onBriefChange={hook.setBrief}
      onFieldEdit={hook.onFieldEdit}
      onEmptySetAckChange={hook.onEmptySetAckChange}
      onCompile={() => {
        void hook.compile();
      }}
      onGenerate={() => {
        void hook.generate();
      }}
      buildPhase={hook.buildPhase}
      buildInFlight={hook.buildInFlight}
      runningStep={hook.runningStep}
      missingFields={hook.missingFields}
      onRunBuild={() => {
        void hook.runBuild();
      }}
    />
  );
}
