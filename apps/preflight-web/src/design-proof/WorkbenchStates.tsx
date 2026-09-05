/**
 * WorkbenchStates — design-proof links for workbench variants.
 * Why: reach error fallback and prefetch fail without wiring.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Workbench } from "@/features/workbench/Workbench";
import { WORKBENCH_HANDOFF_BRIEF } from "@/fixtures/workbench";
import { RULES_CATALOG } from "@/fixtures/rules-catalog";

export function WorkbenchStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Workbench states</h1>
      <p className="text-caption text-fg-muted">
        Loaded thread lives at{" "}
        <Link to="/workbench" className="text-primary underline">
          /workbench
        </Link>
        . Type a message containing &quot;fail&quot; to trigger the error
        fallback, or &quot;campaign&quot; for handoff suggestion.
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to="/design-proof/workbench/prefetch-error"
          className="text-ui text-primary underline"
        >
          Prefetch rules error
        </Link>
        <Link
          to="/design-proof/workbench/error-fallback"
          className="text-ui text-primary underline"
        >
          Error fallback visible
        </Link>
        <Link
          to="/design-proof/workbench/handoff-suggested"
          className="text-ui text-primary underline"
        >
          Handoff suggested thread
        </Link>
      </nav>
      <Link to="/design-proof" className="text-caption text-fg-muted underline">
        Back to design proof
      </Link>
    </div>
  );
}

export function WorkbenchPrefetchErrorDemo(): ReactElement {
  return <Workbench rules={RULES_CATALOG} prefetchFailed />;
}

export function WorkbenchErrorFallbackDemo(): ReactElement {
  return <WorkbenchWithErrorFallback />;
}

export function WorkbenchHandoffSuggestedDemo(): ReactElement {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60_000).toISOString();
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

  return (
    <Workbench
      rules={RULES_CATALOG}
      initialMessages={[
        {
          id: "demo-user",
          role: "user",
          text: "I want a LinkedIn and email campaign for Bluepeak Flexi Cap.",
          createdAt: twoMinutesAgo,
        },
        {
          id: "demo-assistant",
          role: "assistant",
          text: "Your brief is complete. Start a campaign from this conversation to review structured fields on Campaign.",
          ruleIds: ["SEBI-02", "BRAND-02"],
          suggestedAction: "handoff_campaign",
          brief: WORKBENCH_HANDOFF_BRIEF,
          createdAt: oneMinuteAgo,
        },
      ]}
    />
  );
}

function WorkbenchWithErrorFallback(): ReactElement {
  const threeMinutesAgo = new Date(Date.now() - 3 * 60_000).toISOString();
  const twoMinutesAgo = new Date(Date.now() - 2 * 60_000).toISOString();

  return (
    <Workbench
      rules={RULES_CATALOG}
      initialMessages={[
        {
          id: "demo-user",
          role: "user",
          text: "What does SEBI-06 check?",
          createdAt: threeMinutesAgo,
        },
        {
          id: "demo-error",
          role: "error",
          text: "Explainer unavailable — try search below.",
          createdAt: twoMinutesAgo,
        },
      ]}
      initialShowSearchFallback
    />
  );
}
