import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-none border border-border bg-surface px-3 py-2 text-ui text-fg placeholder:text-fg-faint transition-colors outline-none focus-visible:border-decision focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
