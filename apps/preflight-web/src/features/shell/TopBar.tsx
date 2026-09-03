/**
 * TopBar — R0 wordmark, nav links, and persona control.
 * Why: app shell chrome per 08 §5.1 and 09 Screen 6.
 */

import type { ReactElement } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { PersonaControl } from "@/features/shell/PersonaControl";
import { navLinkClass } from "@/features/shell/lib";
import { usePersona } from "@/features/shell/PersonaProvider";
import type { CampaignNavLinkProps } from "@/features/shell/types";
import { useCampaignNavTarget } from "@/features/shell/useCampaignNavTarget";
import { usePersonaHomeNavigation } from "@/features/shell/usePersonaHomeNavigation";
import { useQueueCount } from "@/features/shell/useQueueCount";
import { cn } from "@/lib/utils";

function CampaignNavLink({
  navigating,
  isActive,
  onNavigate,
}: CampaignNavLinkProps): ReactElement {
  return (
    <button
      type="button"
      className={cn(navLinkClass(isActive), "cursor-pointer border-0 bg-transparent p-0")}
      disabled={navigating}
      onClick={() => {
        void onNavigate();
      }}
    >
      Campaign
    </button>
  );
}

export function TopBar(): ReactElement {
  const location = useLocation();
  const { actor } = usePersona();
  const campaignActive = location.pathname.startsWith("/campaign/");
  const { navigating, navigateToCampaign } = useCampaignNavTarget();
  const { navigatingHome, goHome } = usePersonaHomeNavigation();
  const queueCountValue = useQueueCount();

  if (actor === null) {
    return (
      <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center border-b border-border bg-ground px-8" />
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center justify-between border-b border-border bg-ground px-8">
      <div className="flex items-center gap-10">
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 no-underline"
          aria-label="Preflight home"
          disabled={navigatingHome}
          onClick={() => {
            void goHome();
          }}
        >
          <span className="font-serif text-wordmark text-fg">Preflight</span>
        </button>
        <nav className="flex items-center gap-7">
          <NavLink
            to="/assets"
            end={false}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <span className="inline-flex items-baseline gap-1.5">
              Assets
              {queueCountValue !== null && queueCountValue > 0 ? (
                <span className="font-mono text-(length:--text-caption) leading-[1.4] text-fg-muted">
                  [{queueCountValue}]
                </span>
              ) : null}
            </span>
          </NavLink>
          <CampaignNavLink
            navigating={navigating}
            isActive={campaignActive}
            onNavigate={navigateToCampaign}
          />
          <NavLink
            to="/rulebook"
            end
            className={({ isActive }) => navLinkClass(isActive)}
          >
            Rulebook
          </NavLink>
          <NavLink
            to="/workbench"
            end
            className={({ isActive }) => navLinkClass(isActive)}
          >
            Workbench
          </NavLink>
        </nav>
      </div>
      <div className="flex shrink-0 items-center">
        <PersonaControl actor={actor} />
      </div>
    </header>
  );
}
