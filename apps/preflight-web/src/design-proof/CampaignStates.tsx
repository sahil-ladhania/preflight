/**
 * CampaignStates — design-proof links for campaign view variants.
 * Why: reach loading, error, 404, fresh, zero-rules without GET.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import {
  CAMPAIGN_ID,
  CAMPAIGN_ID_FRESH,
  CAMPAIGN_FRESH,
  CAMPAIGN_SEED,
  COMPILE_RESULT,
  SEED_BRIEF,
} from "@/fixtures/campaign";
import { ASSETS_LIST_FIXTURE } from "@/fixtures/assets-list";
import { WORKBENCH_HANDOFF_BRIEF } from "@/fixtures/workbench";
import { Campaign } from "@/features/campaign/Campaign";
import { mergeExtractProposal, briefFromCampaign } from "@/features/campaign/lib";

export function CampaignZeroRulesDemo(): ReactElement {
  return (
    <Campaign
      campaign={{ ...CAMPAIGN_SEED, lastCompile: null, currentConstraintSetId: null }}
      zeroRulesCompile
    />
  );
}

export function CampaignHandoffDemo(): ReactElement {
  const brief = mergeExtractProposal(briefFromCampaign(null), WORKBENCH_HANDOFF_BRIEF);
  return (
    <Campaign
      campaign={CAMPAIGN_FRESH}
      brief={brief}
    />
  );
}

export function CampaignBuiltDemo(): ReactElement {
  return (
    <Campaign
      campaign={CAMPAIGN_SEED}
      brief={SEED_BRIEF}
      briefSaved
      compileResult={COMPILE_RESULT}
      campaignAssets={ASSETS_LIST_FIXTURE}
    />
  );
}

export function CampaignStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Campaign states</h1>
      <p className="text-caption text-fg-muted">
        Seed campaign (saved + compiled) lives at{" "}
        <Link to={`/campaign/${CAMPAIGN_ID}`} className="text-primary underline">
          /campaign/:campaignId
        </Link>
        . Four panes: Brief · Building · Freeze · Built.
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to={`/campaign/${CAMPAIGN_ID_FRESH}`}
          className="text-ui text-primary underline"
        >
          Fresh campaign
        </Link>
        <Link
          to="/design-proof/campaign/built"
          className="text-ui text-primary underline"
        >
          Built summary (return visit)
        </Link>
        <Link
          to="/design-proof/campaign/handoff"
          className="text-ui text-primary underline"
        >
          Workbench handoff
        </Link>
        <Link
          to="/design-proof/campaign/loading"
          className="text-ui text-primary underline"
        >
          Loading
        </Link>
        <Link
          to="/design-proof/campaign/error"
          className="text-ui text-primary underline"
        >
          Error
        </Link>
        <Link
          to="/design-proof/campaign/not-found"
          className="text-ui text-primary underline"
        >
          Not found
        </Link>
        <Link
          to="/design-proof/campaign/zero-rules"
          className="text-ui text-primary underline"
        >
          Zero-rules compile
        </Link>
      </nav>
      <Link to="/design-proof" className="text-caption text-fg-muted underline">
        Back to design proof
      </Link>
    </div>
  );
}

export function CampaignLoadingDemo(): ReactElement {
  return <Campaign campaign={CAMPAIGN_FRESH} view="loading" />;
}

export function CampaignErrorDemo(): ReactElement {
  return <Campaign campaign={CAMPAIGN_FRESH} view="error" />;
}
