/**
 * LoginSsoButtons — visual-only Microsoft and Okta sign-in buttons.
 * Why: two SSO IdPs an Indian AMC actually runs; bordered-quiet, never filled.
 */

import type { ReactElement } from "react";

import { LOGIN_SSO_LABELS } from "@/features/login/lib";

function MicrosoftGlyph(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <rect x="0" y="0" width="6.5" height="6.5" fill="#f25022" />
      <rect x="7.5" y="0" width="6.5" height="6.5" fill="#7fba00" />
      <rect x="0" y="7.5" width="6.5" height="6.5" fill="#00a4ef" />
      <rect x="7.5" y="7.5" width="6.5" height="6.5" fill="#ffb900" />
    </svg>
  );
}

function OktaGlyph(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="6" fill="none" stroke="#007dc1" strokeWidth="2" />
    </svg>
  );
}

const btnClass =
  "flex h-8 w-full items-center justify-center gap-2 rounded-none border border-hairline bg-transparent px-4 font-sans text-(length:--text-button) font-medium text-fg-muted cursor-default";

export function LoginSsoButtons(): ReactElement {
  return (
    <div className="flex flex-col gap-2.5">
      <button type="button" className={btnClass} tabIndex={-1}>
        <MicrosoftGlyph />
        {LOGIN_SSO_LABELS.microsoft}
      </button>
      <button type="button" className={btnClass} tabIndex={-1}>
        <OktaGlyph />
        {LOGIN_SSO_LABELS.okta}
      </button>
    </div>
  );
}
