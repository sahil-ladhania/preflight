/**
 * SidebarNavList — navigation links for AppSidebar.
 * Why: extracted to preserve <= 200 line constraint while styling for navy chrome.
 */

import type { ReactElement } from "react";
import {
  BookOpen,
  ClipboardList,
  LayoutGrid,
  Layers,
  MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { SidebarMenu, SidebarMenuBadge } from "@/components/ui/sidebar";
import { SidebarNavButton } from "@/features/shell/SidebarNavButton";
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

  const isOverviewActive =
    location.pathname === "/overview" || location.pathname === "/";
  const isAssetsActive = location.pathname.startsWith("/assets");
  const isCampaignActive = location.pathname.startsWith("/campaign");
  const isRulebookActive = location.pathname.startsWith("/rulebook");
  const isWorkbenchActive = location.pathname.startsWith("/workbench");

  const assetsCollapsedBadge =
    isCollapsed && queueCount !== null && queueCount > 0 ? (
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-1 -right-1.5 z-10 font-mono text-[9px] leading-none tabular-nums",
          isAssetsActive
            ? "font-semibold text-[var(--color-chrome-fg)]"
            : "text-[var(--color-chrome-fg-muted)]",
        )}
      >
        {queueCount}
      </span>
    ) : null;

  const assetsExpandedBadge =
    !isCollapsed && queueCount !== null && queueCount > 0 ? (
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
    ) : null;

  return (
    <SidebarMenu className="gap-1">
      <SidebarNavButton
        label="Overview"
        tooltip="Overview"
        isActive={isOverviewActive}
        onClick={() => {
          void navigate("/overview");
        }}
        icon={<LayoutGrid className="size-4 text-current" />}
      />
      <SidebarNavButton
        label="Assets"
        tooltip={
          queueCount !== null && queueCount > 0
            ? `Assets (${queueCount})`
            : "Assets"
        }
        isActive={isAssetsActive}
        onClick={() => {
          void navigate("/assets");
        }}
        icon={<Layers className="size-4 text-current" />}
        badge={assetsExpandedBadge}
        collapsedBadge={assetsCollapsedBadge}
      />
      <SidebarNavButton
        label="Campaign"
        tooltip="Campaign"
        isActive={isCampaignActive}
        disabled={navigatingCampaign}
        onClick={onNavigateCampaign}
        icon={<ClipboardList className="size-4 shrink-0 text-current" />}
      />
      <SidebarNavButton
        label="Rulebook"
        tooltip="Rulebook"
        isActive={isRulebookActive}
        onClick={() => {
          void navigate("/rulebook");
        }}
        icon={<BookOpen className="size-4 shrink-0 text-current" />}
      />
      <SidebarNavButton
        label="Workbench"
        tooltip="Workbench"
        isActive={isWorkbenchActive}
        onClick={() => {
          void navigate("/workbench");
        }}
        icon={<MessageSquare className="size-4 shrink-0 text-current" />}
      />
    </SidebarMenu>
  );
}
