/**
 * AppSidebar — product sidebar navigation for Preflight.
 * Why: enterprise workspace shell in crafted navy chrome per 08 §3.6 / Phase 1.
 */

import type { ReactElement } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { RegisterGrid } from "@/features/shell/RegisterGrid";
import { SidebarNavList } from "@/features/shell/SidebarNavList";
import { SidebarUserMenu } from "@/features/shell/SidebarUserMenu";
import { useCampaignNavTarget } from "@/features/shell/useCampaignNavTarget";
import { usePersonaHomeNavigation } from "@/features/shell/usePersonaHomeNavigation";
import { useQueueCount } from "@/features/shell/useQueueCount";

export function AppSidebar(): ReactElement {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const queueCountValue = useQueueCount();
  const { navigatingHome, goHome } = usePersonaHomeNavigation();
  const { navigating: navigatingCampaign, navigateToCampaign } =
    useCampaignNavTarget();

  return (
    <Sidebar
      collapsible="icon"
      className="relative border-r border-[var(--color-chrome-edge)] text-[var(--color-chrome-fg)] [&_[data-slot=sidebar-inner]]:bg-transparent"
      style={
        {
          background:
            "linear-gradient(180deg, var(--color-chrome-top) 0%, #253648 45%, var(--color-chrome-bottom) 68%, var(--color-chrome-bottom) 100%)",
          "--sidebar-accent": "var(--color-chrome-active)",
          "--sidebar-accent-foreground": "var(--color-chrome-fg)",
        } as React.CSSProperties
      }
    >
      {/* 1px lighter top highlight line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[#416283]"
        aria-hidden="true"
      />

      {/* Ledger grid at low opacity with bottom fade */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      >
        <RegisterGrid
          stroke="#ffffff"
          strokeOpacity={0.05}
          vStrokeOpacity={0.04}
          fill="#ffffff"
          fillOpacity={0.04}
          className="h-full w-full object-cover"
        />
      </div>

      <SidebarHeader className="relative z-10 flex flex-row items-center justify-between border-b border-white/5 p-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:p-2">
        {!isCollapsed ? (
          <>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left no-underline outline-none"
              aria-label="Preflight home"
              disabled={navigatingHome}
              onClick={() => {
                void goHome();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                role="img"
                aria-hidden="true"
                className="shrink-0 text-[var(--color-chrome-fg)]"
              >
                <rect x="6" y="4" width="2.5" height="16" fill="currentColor" />
                <rect x="6" y="14" width="12" height="2.5" fill="currentColor" />
              </svg>
              <span className="font-serif text-lg font-semibold tracking-tight text-[var(--color-chrome-fg)]">
                Preflight
              </span>
            </button>
            <SidebarTrigger className="size-7 cursor-pointer border-0 bg-transparent text-[var(--color-chrome-fg-muted)] shadow-none hover:bg-white/10 hover:text-[var(--color-chrome-fg)]" />
          </>
        ) : (
          <>
            <button
              type="button"
              className="flex size-7 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none"
              aria-label="Preflight home"
              disabled={navigatingHome}
              onClick={() => {
                void goHome();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                role="img"
                aria-label="Preflight logo"
                className="shrink-0 text-[var(--color-chrome-fg)]"
              >
                <rect x="6" y="4" width="2.5" height="16" fill="currentColor" />
                <rect x="6" y="14" width="12" height="2.5" fill="currentColor" />
              </svg>
            </button>
            <SidebarTrigger className="size-7 cursor-pointer border-0 bg-transparent text-[var(--color-chrome-fg-muted)] shadow-none hover:bg-white/10 hover:text-[var(--color-chrome-fg)]" />
          </>
        )}
      </SidebarHeader>

      <SidebarContent className="relative z-10 p-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarNavList
              isCollapsed={isCollapsed}
              queueCount={queueCountValue}
              navigatingCampaign={navigatingCampaign}
              onNavigateCampaign={() => {
                void navigateToCampaign();
              }}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative z-10 border-t border-white/10 p-2">
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
