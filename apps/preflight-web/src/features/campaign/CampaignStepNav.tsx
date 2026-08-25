/**
 * CampaignStepNav — sticky Brief · Freeze · Generate rail.
 * Why: scroll-to-section without route wizard (09 lock).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "campaign-brief",
    label: "Brief",
    subtitle: "GitAgent extractor",
  },
  {
    id: "campaign-constraints",
    label: "Freeze",
    subtitle: "Server compile",
  },
  {
    id: "campaign-generate",
    label: "Generate",
    subtitle: "GitAgent generator",
  },
] as const;

export type CampaignStepId = (typeof STEPS)[number]["id"];

export function CampaignStepNav({
  activeStep,
}: {
  activeStep: CampaignStepId;
}): ReactElement {
  const scrollTo = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Campaign steps"
      className="sticky top-0 z-10 flex gap-8 border-b border-border bg-canvas px-4 py-2"
    >
      {STEPS.map((step) => (
        <button
          key={step.id}
          type="button"
          onClick={() => scrollTo(step.id)}
          className={cn(
            "flex flex-col items-start gap-0.5 text-left text-ui no-underline",
            activeStep === step.id
              ? "font-semibold text-fg"
              : "font-normal text-fg-muted hover:text-fg",
          )}
        >
          <span>{step.label}</span>
          <span className="text-caption font-normal">{step.subtitle}</span>
        </button>
      ))}
    </nav>
  );
}

export function activeCampaignStep(input: {
  briefSaved: boolean;
  compileDone: boolean;
}): CampaignStepId {
  if (!input.briefSaved) {
    return "campaign-brief";
  }
  if (!input.compileDone) {
    return "campaign-constraints";
  }
  return "campaign-generate";
}
