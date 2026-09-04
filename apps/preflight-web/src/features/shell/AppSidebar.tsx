/**
 * AppSidebar — product sidebar navigation for Preflight.
 * Why: enterprise workspace shell replacing top navbar per user decision.
 */

import type { ReactElement } from "react";
import { BookOpen, Layers, Sparkles, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarUserMenu } from "@/features/shell/SidebarUserMenu";
import { useCampaignNavTarget } from "@/features/shell/useCampaignNavTarget";
import { usePersonaHomeNavigation } from "@/features/shell/usePersonaHomeNavigation";
import { useQueueCount } from "@/features/shell/useQueueCount";
import { cn } from "@/lib/utils";

export function AppSidebar(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const queueCountValue = useQueueCount();
  const { navigatingHome, goHome } = usePersonaHomeNavigation();
  const { navigating: navigatingCampaign, navigateToCampaign } =
    useCampaignNavTarget();

  const isAssetsActive = location.pathname.startsWith("/assets");
  const isCampaignActive = location.pathname.startsWith("/campaign");
  const isRulebookActive = location.pathname.startsWith("/rulebook");
  const isWorkbenchActive = location.pathname.startsWith("/workbench");

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-ground text-fg"
    >
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-border p-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:p-2">
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
                className="shrink-0 text-fg"
              >
                <rect x="6" y="4" width="2.5" height="16" fill="currentColor" />
                <rect x="6" y="14" width="12" height="2.5" fill="currentColor" />
              </svg>
              <span className="font-serif text-lg font-semibold tracking-tight text-fg">
                Preflight
              </span>
            </button>
            <SidebarTrigger className="size-7 border-0 bg-transparent text-fg shadow-none hover:bg-hover cursor-pointer" />
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
                className="shrink-0 text-fg"
              >
                <rect x="6" y="4" width="2.5" height="16" fill="currentColor" />
                <rect x="6" y="14" width="12" height="2.5" fill="currentColor" />
              </svg>
            </button>
            <SidebarTrigger className="size-7 border-0 bg-transparent text-fg shadow-none hover:bg-hover cursor-pointer" />
          </>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {/* Assets Link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isAssetsActive}
                  tooltip={
                    queueCountValue !== null && queueCountValue > 0
                      ? `Assets (${queueCountValue})`
                      : "Assets"
                  }
                  className={cn(
                    "h-9 rounded-none border border-transparent font-sans text-xs text-fg hover:bg-hover",
                    isAssetsActive &&
                      "border-border bg-surface font-medium text-fg shadow-none",
                  )}
                  onClick={() => {
                    void navigate("/assets");
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <Layers className="size-4 shrink-0" />
                    {isCollapsed &&
                    queueCountValue !== null &&
                    queueCountValue > 0 ? (
                      <span className="absolute -top-1.5 -right-2 flex size-3.5 items-center justify-center rounded-none border border-border bg-fg font-mono text-[9px] font-semibold text-surface shadow-xs">
                        {queueCountValue}
                      </span>
                    ) : null}
                  </div>
                  <span>Assets</span>
                  {!isCollapsed &&
                  queueCountValue !== null &&
                  queueCountValue > 0 ? (
                    <SidebarMenuBadge className="font-mono text-xs font-normal text-fg-muted">
                      [{queueCountValue}]
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Campaign Link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isCampaignActive}
                  tooltip="Campaign"
                  disabled={navigatingCampaign}
                  className={cn(
                    "h-9 rounded-none border border-transparent font-sans text-xs text-fg hover:bg-hover",
                    isCampaignActive &&
                      "border-border bg-surface font-medium text-fg shadow-none",
                  )}
                  onClick={() => {
                    void navigateToCampaign();
                  }}
                >
                  <Target className="size-4 shrink-0" />
                  <span>Campaign</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Rulebook Link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isRulebookActive}
                  tooltip="Rulebook"
                  className={cn(
                    "h-9 rounded-none border border-transparent font-sans text-xs text-fg hover:bg-hover",
                    isRulebookActive &&
                      "border-border bg-surface font-medium text-fg shadow-none",
                  )}
                  onClick={() => {
                    void navigate("/rulebook");
                  }}
                >
                  <BookOpen className="size-4 shrink-0" />
                  <span>Rulebook</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Workbench Link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isWorkbenchActive}
                  tooltip="Workbench"
                  className={cn(
                    "h-9 rounded-none border border-transparent font-sans text-xs text-fg hover:bg-hover",
                    isWorkbenchActive &&
                      "border-border bg-surface font-medium text-fg shadow-none",
                  )}
                  onClick={() => {
                    void navigate("/workbench");
                  }}
                >
                  <Sparkles className="size-4 shrink-0" />
                  <span>Workbench</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
