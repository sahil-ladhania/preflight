/**
 * SidebarUserMenu — profile card and persona switcher for the sidebar footer.
 * Why: accountability dock in sidebar per 08 §5.1 / 09 Screen 6.
 */

import type { ReactElement } from "react";
import { ChevronsUpDown, LogOut, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LOGIN_SIGN_OUT_INTENT } from "@/features/login/lib";
import {
  PERSONA_MENU_COPY,
} from "@/features/shell/lib";
import { sessionActorFromPersonaId } from "@/features/shell/persona";
import { usePersona } from "@/features/shell/PersonaProvider";
import { useCampaignNavTarget } from "@/features/shell/useCampaignNavTarget";

export function SidebarUserMenu(): ReactElement {
  const navigate = useNavigate();
  const { actor, setActor } = usePersona();
  const { isMobile, state } = useSidebar();
  const { navigateToCampaign } = useCampaignNavTarget();

  if (actor === null) {
    return <></>;
  }

  const isCollapsed = state === "collapsed" && !isMobile;
  const initial = actor.name.charAt(0).toUpperCase();
  const otherPersonaId = actor.id === "meera" ? "arjun" : "meera";
  const otherActor = sessionActorFromPersonaId(otherPersonaId);

  const handleSignOut = (): void => {
    void navigate("/login", {
      replace: true,
      state: { intent: LOGIN_SIGN_OUT_INTENT },
    });
  };

  const handleSwitchPersona = (): void => {
    setActor(otherActor);
    if (otherPersonaId === "arjun") {
      void navigate("/assets");
    } else {
      void navigateToCampaign();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "h-12 w-full rounded-none border border-border bg-surface px-2.5 py-2 hover:bg-hover data-popup-open:bg-hover shadow-none cursor-pointer",
                  isCollapsed && "size-9 p-0 justify-center"
                )}
                tooltip={isCollapsed ? `${actor.name} (${actor.role})` : undefined}
              />
            }
          >
            <div className="flex size-7 shrink-0 items-center justify-center border border-fg bg-fg font-mono text-xs font-semibold text-surface">
              {initial}
            </div>
            {!isCollapsed ? (
              <>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-sans font-medium text-fg">
                    {actor.name}
                  </span>
                  <span className="truncate font-mono text-[10px] uppercase text-fg-muted">
                    {actor.role}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-fg-muted shrink-0" />
              </>
            ) : null}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align={isCollapsed ? "end" : "end"}
            sideOffset={8}
            className="w-64 rounded-none border border-fg bg-surface p-2 shadow-none"
          >
            <div className="p-2">
              <div className="flex flex-col gap-0.5">
                <p className="font-serif text-sm font-semibold text-fg">
                  {actor.name}
                </p>
                <p className="font-mono text-[10px] uppercase text-fg-muted">
                  {actor.role}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-border my-1" />
            <div className="px-2 py-1.5">
              <p className="font-sans text-caption text-fg-muted leading-relaxed">
                {PERSONA_MENU_COPY.accountabilityLine}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-border my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2 p-2 font-sans text-xs text-fg hover:bg-hover"
                onClick={handleSwitchPersona}
              >
                <UserCheck className="size-3.5 text-decision shrink-0" />
                <div className="flex flex-col">
                  <span>Switch to {otherActor.name}</span>
                  <span className="font-mono text-[10px] uppercase text-fg-muted">
                    {otherActor.role}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2 p-2 font-sans text-xs text-fail hover:bg-fail-wash"
                onClick={handleSignOut}
              >
                <LogOut className="size-3.5 text-fail shrink-0" />
                <span>{PERSONA_MENU_COPY.signOutLabel}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
