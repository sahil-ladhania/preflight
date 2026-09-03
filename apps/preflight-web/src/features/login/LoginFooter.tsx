/**
 * LoginFooter — support and legal links beneath the card.
 * Why: provisioning is IdP-side; the only path off a failed sign-in is an administrator.
 */

import type { ReactElement } from "react";

import { LOGIN_COPY } from "@/features/login/lib";
import { cn } from "@/lib/utils";

const faintCopyClass =
  "font-sans text-(length:--text-label) leading-[1.4] font-normal tracking-normal text-fg-faint";

const faintLinkClass = cn(
  faintCopyClass,
  "underline underline-offset-4",
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision",
);

export function LoginFooter(): ReactElement {
  return (
    <div className="mt-5 flex w-full max-w-[360px] min-w-0 flex-col gap-2">
      <p id="login-help" className={faintCopyClass}>
        {LOGIN_COPY.supportLine}
      </p>
      <p className={faintCopyClass}>
        <a href="#privacy" className={faintLinkClass}>
          {LOGIN_COPY.privacyLabel}
        </a>
        {" · "}
        <a href="#terms" className={faintLinkClass}>
          {LOGIN_COPY.termsLabel}
        </a>
      </p>
    </div>
  );
}
