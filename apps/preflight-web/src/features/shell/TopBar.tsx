/**
 * TopBar — R0 logo and four nav links.
 * Why: app shell top bar with active route weight.
 */

import type { ReactElement } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useCampaignNavTarget } from "@/features/shell/useCampaignNavTarget";
import type { CampaignNavLinkProps } from "@/features/shell/types";
import { cn } from "@/lib/utils";

function LogoMark(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      role="img"
      aria-hidden="true"
      className="shrink-0 text-fg"
    >
      <rect x="6" y="4" width="2" height="16" fill="currentColor" />
      <rect x="6" y="14" width="12" height="2" fill="currentColor" />
    </svg>
  );
}

function navLinkClass(isActive: boolean): string {
  return cn(
    "text-ui no-underline",
    isActive ? "font-semibold text-fg" : "font-medium text-fg",
  );
}

function CampaignNavLink({
  navigating,
  isActive,
  onNavigate,
}: CampaignNavLinkProps): ReactElement {
  const className = navLinkClass(isActive);

  return (
    <button
      type="button"
      className={cn(className, "cursor-pointer border-0 bg-transparent p-0")}
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
  const campaignActive = location.pathname.startsWith("/campaign/");
  const { navigating, navigateToCampaign } = useCampaignNavTarget();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-canvas-subtle px-4">
      <Link
        to="/workbench"
        className="flex items-center gap-2 no-underline"
        aria-label="Preflight home"
      >
        <LogoMark />
        <span className="text-ui font-semibold text-fg">Preflight</span>
      </Link>
      <nav className="flex items-center gap-8">
        <NavLink
          to="/workbench"
          end
          className={({ isActive }) => navLinkClass(isActive)}
        >
          Workbench
        </NavLink>
        <CampaignNavLink
          navigating={navigating}
          isActive={campaignActive}
          onNavigate={navigateToCampaign}
        />
        <NavLink
          to="/assets"
          end={false}
          className={({ isActive }) => navLinkClass(isActive)}
        >
          Assets
        </NavLink>
        <NavLink
          to="/rulebook"
          end
          className={({ isActive }) => navLinkClass(isActive)}
        >
          Rulebook
        </NavLink>
      </nav>
    </header>
  );
}
