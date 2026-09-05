/**
 * SidebarNavButton — shared chrome nav item styling for AppSidebar.
 * Why: extracted so Overview link fits within SidebarNavList line budget.
 */

import type { ReactElement, ReactNode } from "react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface SidebarNavButtonProps {
  label: string;
  tooltip: string;
  isActive: boolean;
  disabled?: boolean;
  pending?: boolean;
  onClick: () => void;
  icon: ReactNode;
  badge?: ReactNode;
  collapsedBadge?: ReactNode;
}

export function SidebarNavButton({
  label,
  tooltip,
  isActive,
  disabled = false,
  pending = false,
  onClick,
  icon,
  badge,
  collapsedBadge,
}: SidebarNavButtonProps): ReactElement {
  const pendingBadge = pending ? (
    <div
      className="size-2.5 animate-spin rounded-full border border-[var(--color-chrome-fg-muted)] border-t-[var(--color-chrome-fg)]"
      aria-label="Loading"
    />
  ) : null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={tooltip}
        disabled={disabled}
        className={cn(
          "h-9 cursor-pointer rounded-none border border-transparent font-sans text-xs text-[var(--color-chrome-fg-muted)] hover:bg-white/5 hover:text-[var(--color-chrome-fg)]",
          isActive &&
            "border-transparent border-l-2 border-l-[var(--color-chrome-fg)] bg-[var(--color-chrome-active)] font-semibold text-white shadow-none data-[active=true]:bg-[var(--color-chrome-active)] data-[active=true]:text-white",
          collapsedBadge !== undefined && "overflow-visible",
        )}
        onClick={onClick}
      >
        <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
          {icon}
          {collapsedBadge}
        </span>
        <span>{label}</span>
        {pendingBadge ?? badge}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
