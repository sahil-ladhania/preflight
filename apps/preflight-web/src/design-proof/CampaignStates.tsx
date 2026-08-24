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
} from "@/fixtures/campaign";
import { Campaign } from "@/features/campaign/Campaign";

export function CampaignZeroRulesDemo(): ReactElement {
  return (
    <Campaign
      campaign={{ ...CAMPAIGN_SEED, lastCompile: null, currentConstraintSetId: null }}
      zeroRulesCompile
    />
  );
}

export function CampaignStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Campaign states</h1>
      <p className="text-caption text-fg-muted">
        Seed campaign (saved + compiled) lives at{" "}
        <Link to={`/campaign/${CAMPAIGN_ID}`} className="text-fg underline">
          /campaign/:campaignId
        </Link>
        .
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to={`/campaign/${CAMPAIGN_ID_FRESH}`}
          className="text-ui text-fg underline"
        >
          Fresh campaign
        </Link>
        <Link
          to="/design-proof/campaign/loading"
          className="text-ui text-fg underline"
        >
          Loading
        </Link>
        <Link
          to="/design-proof/campaign/error"
          className="text-ui text-fg underline"
        >
          Error
        </Link>
        <Link
          to="/design-proof/campaign/not-found"
          className="text-ui text-fg underline"
        >
          Not found
        </Link>
        <Link
          to="/design-proof/campaign/zero-rules"
          className="text-ui text-fg underline"
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
