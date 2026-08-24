/**
 * WorkbenchStates — design-proof links for workbench variants.
 * Why: reach error fallback and prefetch fail without wiring.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Workbench } from "@/features/workbench/Workbench";
import { RULES_CATALOG } from "@/fixtures/rules-catalog";

export function WorkbenchStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Workbench states</h1>
      <p className="text-caption text-fg-muted">
        Loaded thread lives at{" "}
        <Link to="/workbench" className="text-fg underline">
          /workbench
        </Link>
        . Type a message containing &quot;fail&quot; to trigger the error
        fallback.
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to="/design-proof/workbench/prefetch-error"
          className="text-ui text-fg underline"
        >
          Prefetch rules error
        </Link>
        <Link
          to="/design-proof/workbench/error-fallback"
          className="text-ui text-fg underline"
        >
          Error fallback visible
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

function WorkbenchWithErrorFallback(): ReactElement {
  return (
    <Workbench
      rules={RULES_CATALOG}
      initialMessages={[
        {
          id: "demo-user",
          role: "user",
          text: "What does SEBI-06 check?",
        },
        {
          id: "demo-error",
          role: "error",
          text: "Explainer unavailable — try search below.",
        },
      ]}
      initialShowSearchFallback
    />
  );
}
