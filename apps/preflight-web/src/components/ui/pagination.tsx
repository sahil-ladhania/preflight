/**
 * pagination — shadcn Pagination component styled to Preflight design system.
 * Why: presentation-only pagination pattern per 08 §4.1 / Phase 3d.
 * Squared, no border-radius, hairline borders, muted typography.
 */

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

export function Pagination({
  className,
  ...props
}: ComponentProps<"nav">): ReactElement {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full justify-start py-3", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: ComponentProps<"ul">): ReactElement {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1 text-xs", className)}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ...props
}: ComponentProps<"li">): ReactElement {
  return <li className={cn("", className)} {...props} />;
}

export interface PaginationLinkProps extends ComponentProps<"button"> {
  isActive?: boolean;
}

export function PaginationLink({
  className,
  isActive = false,
  ...props
}: PaginationLinkProps): ReactElement {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-none px-2 font-sans text-xs font-normal transition-none select-none",
        isActive
          ? "border border-fg bg-surface font-semibold text-fg"
          : "border border-hairline bg-transparent text-fg-muted hover:bg-hover hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>): ReactElement {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("gap-1 pl-2 pr-2.5", className)}
      {...props}
    >
      <ChevronLeft className="size-3.5 shrink-0" aria-hidden="true" />
      <span>Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>): ReactElement {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("gap-1 pl-2.5 pr-2", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: ComponentProps<"span">): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn("flex size-7 items-center justify-center text-fg-muted", className)}
      {...props}
    >
      <MoreHorizontal className="size-3.5" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
