/**
 * LineageBanner — R1 one-hop parent link.
 * Why: regenerated asset context above the split.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { LineageBannerProps } from "@/features/assets/types";
import { shortId } from "@/features/assets/lib";

export function LineageBanner({ lineage }: LineageBannerProps): ReactElement {
  const suffix =
    lineage.parentStatus === "needs_regen" && lineage.ruleIds.length > 0
      ? ` · confirmed: ${lineage.ruleIds.join(", ")}`
      : lineage.ruleIds.length > 0
        ? ` · blocked on: ${lineage.ruleIds.join(", ")}`
        : "";

  return (
    <div className="border-l-[3px] border-hairline py-1 pl-3">
      <p className="font-sans text-caption text-fg-muted">
        Regenerated from{" "}
        <Link
          to={`/assets/${lineage.parentId}`}
          className="font-mono text-mono-meta text-decision underline underline-offset-4"
        >
          {shortId(lineage.parentId)}
        </Link>{" "}
        <span className="font-mono text-mono-meta">v{lineage.parentGenerationIndex}</span>
        {suffix}
      </p>
    </div>
  );
}
