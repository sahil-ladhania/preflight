/**
 * RulebookStates — design-proof links for rulebook view variants.
 * Why: reach loading and error without GET /rules.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Rulebook } from "@/features/rulebook/Rulebook";
import { RULES_CATALOG } from "@/fixtures/rules-catalog";

export function RulebookStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Rulebook states</h1>
      <p className="text-caption text-fg-muted">
        Loaded catalog lives at{" "}
        <Link to="/rulebook" className="text-primary underline">
          /rulebook
        </Link>
        .
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to="/design-proof/rulebook/loading"
          className="text-ui text-primary underline"
        >
          Loading
        </Link>
        <Link
          to="/design-proof/rulebook/error"
          className="text-ui text-primary underline"
        >
          Error
        </Link>
      </nav>
      <Link to="/design-proof" className="text-caption text-fg-muted underline">
        Back to design proof
      </Link>
    </div>
  );
}

export function RulebookLoadingDemo(): ReactElement {
  return <Rulebook rules={RULES_CATALOG} view="loading" />;
}

export function RulebookErrorDemo(): ReactElement {
  return <Rulebook rules={RULES_CATALOG} view="error" />;
}
