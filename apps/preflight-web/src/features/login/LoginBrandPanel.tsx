/**
 * LoginBrandPanel — pattern side with logo, wordmark, and tagline.
 * Why: split login gives institutional body without marketing chrome.
 */

import type { ReactElement } from "react";

import { LOGIN_COPY } from "@/features/login/lib";
import { LoginPattern, LoginPatternGhost } from "@/features/login/LoginPattern";
import { WorkbenchLogoMark } from "@/features/workbench/WorkbenchLogoMark";
import { cn } from "@/lib/utils";

export interface LoginBrandPanelProps {
  className?: string;
}

export function LoginBrandPanel({ className }: LoginBrandPanelProps): ReactElement {
  return (
    <section
      className={cn(
        "relative flex min-h-[200px] flex-col justify-end overflow-hidden md:min-h-screen md:justify-center",
        className,
      )}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <LoginPattern className="absolute inset-0" />
        <LoginPatternGhost />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-decision-wash/30 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ground/52 via-ground/38 to-ground/16 md:from-ground/48 md:via-ground/32 md:to-ground/14"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-2.5 px-8 py-8 md:max-w-lg md:gap-3 md:px-14 md:py-0">
        <div className="flex items-center gap-3 md:gap-3.5">
          <WorkbenchLogoMark size={40} className="shrink-0 md:hidden" />
          <WorkbenchLogoMark size={48} className="hidden shrink-0 md:block" />
          <h1 className="font-serif text-display tracking-[0.01em] text-primary">
            {LOGIN_COPY.wordmark}
          </h1>
        </div>
        <span className="h-px w-10 bg-primary" aria-hidden="true" />
        <p className="font-serif text-tagline italic text-primary">
          {LOGIN_COPY.tagline}
        </p>
      </div>
    </section>
  );
}
