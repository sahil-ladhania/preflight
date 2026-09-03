/**
 * LoginBrandPanel — pattern side with wordmark and tagline.
 * Why: the 40×1px rule is the whole logo; the tagline is the only argument.
 */

import type { ReactElement } from "react";

import { LOGIN_COPY } from "@/features/login/lib";
import { LoginPattern, LoginPatternGhost } from "@/features/login/LoginPattern";
import { cn } from "@/lib/utils";

export interface LoginBrandPanelProps {
  className?: string;
}

export function LoginBrandPanel({ className }: LoginBrandPanelProps): ReactElement {
  return (
    <section
      className={cn(
        "relative flex min-h-[200px] flex-col items-start justify-center overflow-hidden md:min-h-screen",
        className,
      )}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <LoginPattern className="absolute inset-0" />
        <LoginPatternGhost />
      </div>

      <div className="relative z-10 flex w-full flex-1 items-center px-8 py-8 md:px-14 md:py-0">
        <div className="-translate-y-[6vh] flex flex-col items-start">
          <h1 className="font-serif text-display text-fg">{LOGIN_COPY.wordmark}</h1>
          <span className="my-2.5 h-px w-10 bg-fg" aria-hidden="true" />
          <p className="font-serif text-tagline italic text-fg">
            {LOGIN_COPY.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
