/**
 * LineageBanner — R1 one-hop parent link.
 * Why: regenerated asset context above the split.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { lineageVersionLabel } from "@/features/assets/ledger-lib";
import type { LineageBannerProps } from "@/features/assets/types";
import { shortId } from "@/features/assets/lib";

export function LineageBanner({
  lineage,
  generationIndex,
  onOpenLineage,
}: LineageBannerProps): ReactElement {
  const versionLabel = lineageVersionLabel(generationIndex);

  return (
    <div className="border-l-[3px] border-hairline py-1 pl-3">
      <p className="font-sans text-caption text-fg-muted">
        Regenerated from{" "}
        <Link
          to={`/assets/${lineage.parentId}`}
          className="font-mono text-mono-meta text-decision underline underline-offset-4"
        >
          {shortId(lineage.parentId)}
        </Link>
        {versionLabel !== null ? (
          <>
            {" "}
            <span className="font-mono text-mono-meta">· {versionLabel}</span>
          </>
        ) : null}
        {onOpenLineage !== undefined ? (
          <>
            {" "}
            <button
              type="button"
              onClick={onOpenLineage}
              className="cursor-pointer font-sans text-caption text-decision underline underline-offset-4 hover:text-fg"
            >
              · View lineage →
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
