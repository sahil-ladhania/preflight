/**
 * PrimaryButton — canonical primary button control for Preflight.
 * Why: single implementation for primary actions across routes (08 §5.9 / Phase 1a).
 * Navy fill, cream text, inverting hover, hairline disabled, icon + label.
 */

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export function PrimaryButton({
  icon,
  loading = false,
  children,
  disabled,
  className,
  ...props
}: PrimaryButtonProps): ReactElement {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        "flex h-9 shrink-0 items-center justify-center gap-2 rounded-none border border-primary bg-primary px-4 font-sans text-button font-medium text-primary-foreground select-none cursor-pointer shadow-none",
        "hover:border-primary hover:bg-[#f2efe7] hover:text-primary",
        "disabled:border-hairline disabled:bg-transparent disabled:text-fg-faint disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        icon ?? null
      )}
      <span>{children}</span>
    </button>
  );
}
