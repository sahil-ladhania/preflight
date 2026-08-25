/**
 * CampaignPageHeader — R1 full-bleed title row.
 * Why: matches Assets/Rulebook header band (09 Screen 3).
 */

import type { ReactElement } from "react";

export function CampaignPageHeader(): ReactElement {
  return (
    <div className="border-b border-border bg-canvas px-4 py-3">
      <h1 className="text-title text-fg">Campaign</h1>
      <p className="text-caption text-fg-muted">
        Paste a brief, structure it, compile rules, generate assets.
      </p>
    </div>
  );
}
