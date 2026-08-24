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
    <div className="border-b border-border bg-canvas-subtle px-4 py-2">
      <p className="text-caption text-fg-muted">
        Regenerated from{" "}
        <Link
          to={`/assets/${lineage.parentId}`}
          className="text-mono text-fg underline"
        >
          {shortId(lineage.parentId)}
        </Link>{" "}
        <span className="text-mono">v{lineage.parentGenerationIndex}</span>
        {suffix}
      </p>
    </div>
  );
}
