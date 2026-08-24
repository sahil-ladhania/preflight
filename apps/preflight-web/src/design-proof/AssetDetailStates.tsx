/**
 * AssetDetailStates — design-proof links for detail view variants.
 * Why: reach loading, error, 404, and engine-mismatch rerun without GET.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { ASSET_ID_A, ASSET_ID_D, ASSET_ID_E } from "@/fixtures/assets-list";

export function AssetDetailStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Assets detail states</h1>
      <p className="text-caption text-fg-muted">
        Loaded fixtures A–H live at{" "}
        <Link to={`/assets/${ASSET_ID_A}`} className="text-fg underline">
          /assets/:id
        </Link>
        .
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to="/design-proof/assets-detail/loading"
          className="text-ui text-fg underline"
        >
          Loading
        </Link>
        <Link
          to="/design-proof/assets-detail/error"
          className="text-ui text-fg underline"
        >
          Error
        </Link>
        <Link
          to="/design-proof/assets-detail/not-found"
          className="text-ui text-fg underline"
        >
          Not found
        </Link>
        <Link
          to={`/assets/${ASSET_ID_E}`}
          className="text-ui text-fg underline"
        >
          Re-run hash match (asset E)
        </Link>
        <Link
          to={`/assets/${ASSET_ID_D}`}
          className="text-ui text-fg underline"
        >
          Re-run with drift (asset D)
        </Link>
        <Link
          to="/design-proof/assets-detail/engine-mismatch"
          className="text-ui text-fg underline"
        >
          Engine mismatch rerun strip
        </Link>
      </nav>
      <Link to="/design-proof" className="text-caption text-fg-muted underline">
        Back to design proof
      </Link>
    </div>
  );
}
