/**
 * RegisterLink — tertiary navigation to Asset Register.
 * Why: Overview queue is the top of the register, not a copy.
 */

import type { ReactElement } from "react";
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
        "font-sans text-micro font-normal normal-case tracking-normal text-fg underline underline-offset-2 hover:text-fg-muted",
        className,
      )}
    >
      View all in Asset Register →
    </Link>
  );
}
