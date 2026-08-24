/**
 * AssetsListStates — design-proof links for list view variants.
 * Why: reach empty, loading, and error without wiring GET /assets.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export function AssetsListStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Assets list states</h1>
      <p className="text-caption text-fg-muted">
        Loaded list with eight rows (including pending) lives at{" "}
        <Link to="/assets" className="text-fg underline">
          /assets
        </Link>
        .
      </p>
      <nav className="flex flex-col gap-2">
        <Link to="/design-proof/assets-list/empty" className="text-ui text-fg underline">
          Empty
        </Link>
        <Link
          to="/design-proof/assets-list/loading"
          className="text-ui text-fg underline"
        >
          Loading
        </Link>
        <Link to="/design-proof/assets-list/error" className="text-ui text-fg underline">
          Error
        </Link>
      </nav>
      <Link to="/design-proof" className="text-caption text-fg-muted underline">
        Back to design proof
      </Link>
    </div>
  );
}
