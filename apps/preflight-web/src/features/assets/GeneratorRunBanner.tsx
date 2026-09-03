/**
 * GeneratorRunBanner — which GitAgent skills shaped this copy.
 * Why: doc 19 §G5 scaling story needs to be visible in the product, not only in the repo.
 */

import type { ReactElement } from "react";

import type { GeneratorRunBannerProps } from "@/features/assets/types";
import { agentRunCaption } from "@/lib/agent-provenance";

export function GeneratorRunBanner({
  skillsRead,
  narration = null,
}: GeneratorRunBannerProps): ReactElement {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface px-4 py-2">
      <p className="text-caption text-fg-muted">
        Written by{" "}
        <span className="text-mono">
          {agentRunCaption("generator", skillsRead)}
        </span>
      </p>
      {narration !== null ? (
        <p className="whitespace-pre-line text-body text-fg">{narration}</p>
      ) : null}
    </div>
  );
}
