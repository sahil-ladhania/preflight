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
  EXTRACT_PROPOSAL,
} from "@/fixtures/campaign";
import { Campaign } from "@/features/campaign/Campaign";
import {
  mergeExtractProposal,
  proposedKeysFromPartial,
  briefFromCampaign,
} from "@/features/campaign/lib";

export function CampaignZeroRulesDemo(): ReactElement {
  return (
    <Campaign
      campaign={{ ...CAMPAIGN_SEED, lastCompile: null, currentConstraintSetId: null }}
      zeroRulesCompile
    />
  );
}

export function CampaignHandoffDemo(): ReactElement {
  const brief = mergeExtractProposal(briefFromCampaign(null), EXTRACT_PROPOSAL);
  return (
    <Campaign
      campaign={CAMPAIGN_FRESH}
      freeText="LinkedIn and email for Bluepeak Flexi Cap with professional tone."
      brief={brief}
      proposedFieldKeys={proposedKeysFromPartial(EXTRACT_PROPOSAL)}
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
        . Phase rail: Brief · Freeze · Generate.
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to={`/campaign/${CAMPAIGN_ID_FRESH}`}
          className="text-ui text-primary underline"
        >
          Fresh campaign
        </Link>
        <Link
          to="/design-proof/campaign/handoff"
          className="text-ui text-primary underline"
        >
          Workbench handoff (dashed fields)
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
