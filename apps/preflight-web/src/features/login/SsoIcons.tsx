/**
 * SsoIcons — IdP marks for the login screen.
 * Why: enterprise SSO buttons need recognizable provider identity at 16px.
 */

import type { ReactElement } from "react";

import type { SsoProviderId } from "@/features/login/lib";

interface SsoIconProps {
  id: SsoProviderId;
}

function MicrosoftIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 21"
      width={16}
      height={16}
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

function OktaIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" fill="#007dc1" />
      <circle cx="12" cy="12" r="4" fill="#fffdf9" />
    </svg>
  );
}

function PingIdentityIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="2" y="2" width="20" height="20" fill="#b4282d" />
      <path
        d="M8 7h3.5c2.2 0 3.5 1.2 3.5 3.1 0 1.5-.8 2.6-2.1 3l2.6 3.9h-2.4l-2.3-3.6H10v3.6H8V7zm2 2v2.2h1.4c.9 0 1.4-.4 1.4-1.1s-.5-1.1-1.4-1.1H10z"
        fill="#fffdf9"
      />
    </svg>
  );
}

export function SsoIcon({ id }: SsoIconProps): ReactElement {
  switch (id) {
    case "microsoft":
      return <MicrosoftIcon />;
    case "okta":
      return <OktaIcon />;
    case "ping":
      return <PingIdentityIcon />;
  }
}
