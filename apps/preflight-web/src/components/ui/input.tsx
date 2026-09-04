import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "box-border h-9 w-full min-w-0 rounded-none border border-solid border-hairline bg-transparent px-3 py-2",
        "font-sans text-(length:--text-ui) leading-[1.4] font-normal text-fg shadow-none outline-none",
        "placeholder:font-sans placeholder:text-(length:--text-ui) placeholder:leading-[1.4] placeholder:font-normal placeholder:not-italic placeholder:text-fg-faint",
        "focus-visible:border-decision focus-visible:ring-1 focus-visible:ring-decision disabled:cursor-not-allowed disabled:text-fg-faint",
        "aria-invalid:border-fail aria-invalid:ring-1 aria-invalid:ring-fail",
        "appearance-none [&::-ms-reveal]:hidden [&::-webkit-caps-lock-indicator]:hidden",
        "[&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
        className
      )}
      {...props}
    />
  )
}

export { Input }
