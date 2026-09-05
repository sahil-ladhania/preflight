/**
 * RegisterLink — tertiary navigation to Asset Register.
 * Why: Overview queue is the top of the register, not a copy.
 */

import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export function RegisterLink({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <Link
      to="/assets"
      className={cn(
        "inline-flex items-center gap-1 font-sans text-micro font-normal normal-case tracking-normal text-fg underline underline-offset-2 hover:text-fg-muted",
        className,
      )}
    >
      View all in Asset Register
      <ArrowRight className="size-3 shrink-0" aria-hidden="true" />
    </Link>
  );
}
