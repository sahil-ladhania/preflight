/**
 * LoginBrandPanel — dark gradient pitch panel with wordmark and journey carousel.
 * Why: sanctioned containment (08 §3.6); gradient and motion live here only.
 */

import type { ReactElement } from "react";

import { LOGIN_COPY } from "@/features/login/lib";
import { LoginCarousel } from "@/features/login/LoginCarousel";
import { LoginPattern } from "@/features/login/LoginPattern";
import { PreflightMark } from "@/features/shell/PreflightMark";
import { cn } from "@/lib/utils";

export interface LoginBrandPanelProps {
  className?: string;
}

export function LoginBrandPanel({ className }: LoginBrandPanelProps): ReactElement {
  return (
    <section
      className={cn(
        "relative flex min-h-[200px] flex-col overflow-hidden md:min-h-screen",
        className,
      )}
      style={{
        background: "linear-gradient(to bottom, #2c4257 0%, #1c1a17 100%)",
      }}
    >
      {/* Ledger grid at low opacity over the gradient */}
      <div className="absolute inset-0 opacity-100" aria-hidden="true">
        <LoginPattern className="absolute inset-0" />
      </div>

      {/* Top-left: mark + wordmark + rule + tagline */}
      <div className="relative z-10 flex flex-col items-start px-8 pt-10 md:px-14 md:pt-14">
        <div className="flex items-center gap-3">
          <PreflightMark size={28} className="text-[#fffdf9]" />
          <h1 className="font-serif text-display text-[#fffdf9]">
            {LOGIN_COPY.wordmark}
          </h1>
        </div>
        <span className="mt-3 h-px w-10 bg-[#fffdf9]/60" aria-hidden="true" />
        <p className="mt-3 font-serif text-tagline italic text-[#fffdf9]/80">
          {LOGIN_COPY.tagline}
        </p>
      </div>

      {/* Bottom-left: journey carousel */}
      <div className="relative z-10 mt-auto px-8 pb-10 md:px-14 md:pb-14">
        <LoginCarousel />
      </div>
    </section>
  );
}
