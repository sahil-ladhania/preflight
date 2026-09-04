/**
 * SearchInput — canonical search control for Rulebook and Asset Register.
 * Why: consistent search input with search glyph, styled to design system.
 */

import { Search, X } from "lucide-react";
import type { InputHTMLAttributes, ReactElement } from "react";

import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onValueChange,
  onClear,
  placeholder = "Search…",
  className,
  ...props
}: SearchInputProps): ReactElement {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        className="pointer-events-none absolute left-2.5 size-3.5 text-fg-muted shrink-0"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-9 w-56 sm:w-64 rounded-none border border-hairline bg-surface pl-8 pr-7 font-sans text-ui text-fg placeholder:text-fg-faint shadow-none focus-visible:border-decision focus-visible:outline-none select-none transition-none"
        {...props}
      />
      {value.length > 0 ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onValueChange("");
            onClear?.();
          }}
          className="absolute right-2 flex size-4 cursor-pointer items-center justify-center text-fg-muted hover:text-fg"
        >
          <X className="size-3 shrink-0" />
        </button>
      ) : null}
    </div>
  );
}
