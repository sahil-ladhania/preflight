/**
 * RegisterLink — tertiary navigation from an Overview region.
 * Why: Overview is a summary; each region exits to the full register or rulebook.
 */

import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export function RegisterLink({
  to = "/assets",
  children = "View all in Asset Register",
  className,
}: {
  to?: string;
  children?: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1 font-sans text-[11px] leading-[16px] text-fg-muted underline underline-offset-2 hover:text-fg",
        className,
      )}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
