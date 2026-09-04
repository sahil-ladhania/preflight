/**
 * SidebarNavList — navigation links for AppSidebar.
 * Why: extracted to preserve <= 200 line constraint while styling for navy chrome.
 */

import type { ReactElement } from "react";
import { BookOpen, Layers, Sparkles, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface SidebarNavListProps {
  isCollapsed: boolean;
  queueCount: number | null;
  navigatingCampaign: boolean;
  onNavigateCampaign: () => void;
}

export function SidebarNavList({
  isCollapsed,
  queueCount,
  navigatingCampaign,
  onNavigateCampaign,
}: SidebarNavListProps): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const isAssetsActive = location.pathname.startsWith("/assets");
  const isCampaignActive = location.pathname.startsWith("/campaign");
  const isRulebookActive = location.pathname.startsWith("/rulebook");
  const isWorkbenchActive = location.pathname.startsWith("/workbench");

  return (
    <SidebarMenu className="gap-1">
      {/* Assets Link */}
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isAssetsActive}
          tooltip={
            queueCount !== null && queueCount > 0
              ? `Assets (${queueCount})`
              : "Assets"
          }
          className={cn(
            "h-9 cursor-pointer rounded-none border border-transparent font-sans text-xs text-[var(--color-chrome-fg-muted)] hover:bg-white/5 hover:text-[var(--color-chrome-fg)]",
            isAssetsActive &&
              "border-transparent border-l-2 border-l-[var(--color-chrome-fg)] bg-[var(--color-chrome-active)] font-semibold text-white shadow-none data-[active=true]:bg-[var(--color-chrome-active)] data-[active=true]:text-white",
          )}
          onClick={() => {
            void navigate("/assets");
          }}
        >
          <div className="relative flex items-center justify-center">
            <Layers className="size-4 shrink-0 text-current" />
            {isCollapsed && queueCount !== null && queueCount > 0 ? (
              <span className="absolute -top-1.5 -right-2 flex size-3.5 items-center justify-center rounded-none border border-[var(--color-chrome-fg)] bg-[var(--color-chrome-fg)] font-mono text-[9px] font-semibold text-[var(--color-chrome-bottom)] shadow-xs">
                {queueCount}
              </span>
            ) : null}
          </div>
          <span>Assets</span>
          {!isCollapsed && queueCount !== null && queueCount > 0 ? (
            <SidebarMenuBadge
              className={cn(
                "font-mono text-xs font-normal",
                isAssetsActive
                  ? "font-medium text-[var(--color-chrome-fg)]"
                  : "text-[var(--color-chrome-fg-muted)]",
              )}
            >
              [{queueCount}]
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
            "h-9 cursor-pointer rounded-none border border-transparent font-sans text-xs text-[var(--color-chrome-fg-muted)] hover:bg-white/5 hover:text-[var(--color-chrome-fg)]",
            isCampaignActive &&
              "border-transparent border-l-2 border-l-[var(--color-chrome-fg)] bg-[var(--color-chrome-active)] font-semibold text-white shadow-none data-[active=true]:bg-[var(--color-chrome-active)] data-[active=true]:text-white",
          )}
          onClick={() => {
            onNavigateCampaign();
          }}
        >
          <Target className="size-4 shrink-0 text-current" />
          <span>Campaign</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Rulebook Link */}
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isRulebookActive}
          tooltip="Rulebook"
          className={cn(
            "h-9 cursor-pointer rounded-none border border-transparent font-sans text-xs text-[var(--color-chrome-fg-muted)] hover:bg-white/5 hover:text-[var(--color-chrome-fg)]",
            isRulebookActive &&
              "border-transparent border-l-2 border-l-[var(--color-chrome-fg)] bg-[var(--color-chrome-active)] font-semibold text-white shadow-none data-[active=true]:bg-[var(--color-chrome-active)] data-[active=true]:text-white",
          )}
          onClick={() => {
            void navigate("/rulebook");
          }}
        >
          <BookOpen className="size-4 shrink-0 text-current" />
          <span>Rulebook</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Workbench Link */}
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isWorkbenchActive}
          tooltip="Workbench"
          className={cn(
            "h-9 cursor-pointer rounded-none border border-transparent font-sans text-xs text-[var(--color-chrome-fg-muted)] hover:bg-white/5 hover:text-[var(--color-chrome-fg)]",
            isWorkbenchActive &&
              "border-transparent border-l-2 border-l-[var(--color-chrome-fg)] bg-[var(--color-chrome-active)] font-semibold text-white shadow-none data-[active=true]:bg-[var(--color-chrome-active)] data-[active=true]:text-white",
          )}
          onClick={() => {
            void navigate("/workbench");
          }}
        >
          <Sparkles className="size-4 shrink-0 text-current" />
          <span>Workbench</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
