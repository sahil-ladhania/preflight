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
    <div className="border-l-[3px] border-hairline py-1 pl-3">
      <p className="font-sans text-caption text-fg-muted">
        Written by{" "}
        <span className="font-mono text-mono-meta">
          {agentRunCaption("generator", skillsRead)}
        </span>
      </p>
      {narration !== null ? (
        <p className="mt-2 whitespace-pre-line font-serif text-copy text-fg">
          {narration}
        </p>
      ) : null}
    </div>
  );
}
