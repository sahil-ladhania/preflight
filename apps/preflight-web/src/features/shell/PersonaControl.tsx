/**
 * PersonaControl — signed-in trigger and accountability menu.
 * Why: 09 Screen 6 R0b stamps the actor visible at the moment of deciding.
 */

import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LOGIN_SIGN_OUT_INTENT } from "@/features/login/lib";
import { PERSONA_MENU_COPY } from "@/features/shell/lib";
import type { PersonaControlProps } from "@/features/shell/types";
import { cn } from "@/lib/utils";

function ChevronDownIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      aria-hidden="true"
      className="size-2.5 shrink-0 text-fg-muted"
    >
      <path
        d="M1.5 3.5 5 7 8.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function PersonaControl({ actor }: PersonaControlProps): ReactElement {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: globalThis.MouseEvent): void {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      close();
    }

    function handleKeyDown(event: globalThis.KeyboardEvent): void {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  function handleSignOut(): void {
    close();
    void navigate("/login", {
      replace: true,
      state: { intent: LOGIN_SIGN_OUT_INTENT },
    });
  }

  return (
    <div ref={rootRef} className="relative flex items-center">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <span className="text-caption text-fg-muted">
          {PERSONA_MENU_COPY.signedInPrefix}
        </span>
        <span className="text-ui-strong text-fg">{actor.name}</span>
        <ChevronDownIcon />
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-full right-0 z-10 mt-2 flex w-60 flex-col gap-2.5",
            "border border-fg bg-surface p-4",
          )}
        >
          <p className="font-serif text-menu-name text-fg">{actor.name}</p>
          <p className="text-role uppercase text-fg-muted">{actor.role}</p>
          <div className="h-px bg-border" aria-hidden="true" />
          <p className="text-caption text-fg-muted">
            {PERSONA_MENU_COPY.accountabilityLine}
          </p>
          <div className="h-px bg-border" aria-hidden="true" />
          <button
            type="button"
            role="menuitem"
            className="cursor-pointer border-0 bg-transparent p-0 text-left text-ui text-fg"
            onClick={handleSignOut}
          >
            {PERSONA_MENU_COPY.signOutLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
