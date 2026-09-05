/**
 * CampaignStates — design-proof links for campaign view variants.
 * Why: reach loading, error, 404, fresh, zero-rules, and states 1–7 without GET.
 */

import type { ReactElement } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  CAMPAIGN_ID,
  CAMPAIGN_FRESH,
  CAMPAIGN_SEED,
  COMPILE_RESULT,
  SEED_BRIEF,
} from "@/fixtures/campaign";
import { ASSETS_LIST_FIXTURE } from "@/fixtures/assets-list";
import { WORKBENCH_HANDOFF_BRIEF } from "@/fixtures/workbench";
import { Campaign } from "@/features/campaign/Campaign";
import { mergeExtractProposal, briefFromCampaign } from "@/features/campaign/lib";

const ASSETS_ALL_CLEAR = ASSETS_LIST_FIXTURE.map((a) => ({
  ...a, status: "clear" as const, pendingCount: 0, statusDetail: "All rules passed",
}));

export function CampaignZeroRulesDemo(): ReactElement {
  return <Campaign campaign={{ ...CAMPAIGN_SEED, lastCompile: null, currentConstraintSetId: null }} zeroRulesCompile />;
}

export function CampaignHandoffDemo(): ReactElement {
  return <Campaign campaign={CAMPAIGN_FRESH} brief={mergeExtractProposal(briefFromCampaign(null), WORKBENCH_HANDOFF_BRIEF)} />;
}

export function CampaignBuiltDemo(): ReactElement {
  return <Campaign campaign={CAMPAIGN_SEED} brief={SEED_BRIEF} briefSaved compileResult={COMPILE_RESULT} campaignAssets={ASSETS_LIST_FIXTURE} />;
}

export function CampaignStates(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get("state");

  const navBar = (
    <div className="flex flex-wrap items-center gap-2 border-b border-hairline bg-surface px-4 py-2 text-caption">
      <span className="font-sans font-medium uppercase text-fg-muted">State:</span>
      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => setSearchParams({ state: String(num) })}
          className={`cursor-pointer px-2 py-0.5 ${state === String(num) ? "bg-fg text-surface" : "text-fg hover:underline"}`}
        >
          {num}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setSearchParams({})}
        className="ml-auto cursor-pointer text-fg-muted underline"
      >
        Menu
      </button>
    </div>
  );

  const stateContent = {
    "1": <Campaign campaign={CAMPAIGN_FRESH} brief={briefFromCampaign(null)} />,
    "2": (
      <Campaign
        campaign={CAMPAIGN_FRESH}
        brief={{
          ...briefFromCampaign(null),
          channels: ["email", "linkedin"],
          schemeName: "Draft scheme",
        }}
      />
    ),
    "3": (
      <Campaign
        campaign={CAMPAIGN_FRESH}
        freeText="Launch a new multi-channel fund campaign"
        brief={{
          ...briefFromCampaign(null),
          objective: "Drive awareness for new flexi cap fund",
          schemeName: "Bluepeak Flexi Cap Fund",
          schemeCategory: "Flexi Cap",
          audience: "Retail investors",
          channels: ["email", "linkedin"],
          market: "Pan-India",
        }}
      />
    ),
    "4": (
      <Campaign
        campaign={CAMPAIGN_FRESH}
        freeText="Launch a new flexi cap fund campaign"
        buildInFlight
        buildPhase="extract"
        onRunBuild={() => {}}
      />
    ),
    "5": (
      <Campaign
        campaign={CAMPAIGN_SEED}
        brief={SEED_BRIEF}
        compileResult={COMPILE_RESULT}
        buildInFlight
        buildPhase="generate"
        onRunBuild={() => {}}
      />
    ),
    "6": (
      <Campaign
        campaign={CAMPAIGN_SEED}
        brief={SEED_BRIEF}
        briefSaved
        compileResult={COMPILE_RESULT}
        campaignAssets={ASSETS_LIST_FIXTURE}
      />
    ),
    "7": (
      <Campaign
        campaign={CAMPAIGN_SEED}
        brief={SEED_BRIEF}
        briefSaved
        compileResult={COMPILE_RESULT}
        campaignAssets={ASSETS_ALL_CLEAR}
      />
    ),
  }[state ?? ""];

  if (stateContent) {
    return (
      <div className="flex flex-col">
        {navBar}
        {stateContent}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Campaign states</h1>
      <p className="text-caption text-fg-muted">
        Select a canonical state to preview:
      </p>
      <nav className="flex flex-col gap-2">
        <Link to="/design-proof/campaign?state=1" className="text-ui text-primary underline">
          1. Empty brief (Build disabled, DRAFT status)
        </Link>
        <Link to="/design-proof/campaign?state=2" className="text-ui text-primary underline">
          2. Field review (Structured scalar & array fields)
        </Link>
        <Link to="/design-proof/campaign?state=3" className="text-ui text-primary underline">
          3. Brief typed (Build enabled, DRAFT status)
        </Link>
        <Link to="/design-proof/campaign?state=4" className="text-ui text-primary underline">
          4. Extracting (In-flight narration & Structuring… button)
        </Link>
        <Link to="/design-proof/campaign?state=5" className="text-ui text-primary underline">
          5. Freeze table & generating (Proportional columns, 10px kind badge)
        </Link>
        <Link to="/design-proof/campaign?state=6" className="text-ui text-primary underline">
          6. Built, evaluating (Clean pluralization, channel glyphs)
        </Link>
        <Link to="/design-proof/campaign?state=7" className="text-ui text-primary underline">
          7. Built, all clear (Resolution row & end line)
        </Link>
      </nav>
      <hr className="border-hairline" />
      <nav className="flex flex-col gap-2">
        <Link to={`/campaign/${CAMPAIGN_ID}`} className="text-ui text-fg-muted underline">
          Seed campaign route (/campaign/:id)
        </Link>
        <Link to="/design-proof" className="text-caption text-fg-muted underline">
          Back to design proof
        </Link>
      </nav>
    </div>
  );
}

export function CampaignLoadingDemo(): ReactElement {
  return <Campaign campaign={CAMPAIGN_FRESH} view="loading" />;
}

export function CampaignErrorDemo(): ReactElement {
  return <Campaign campaign={CAMPAIGN_FRESH} view="error" />;
}
