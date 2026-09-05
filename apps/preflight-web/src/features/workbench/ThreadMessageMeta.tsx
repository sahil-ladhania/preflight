/**
 * ThreadMessageMeta — timestamp and evaluation controls under a turn.
 * Why: copy + thumbs for local evaluation before backend wiring exists.
 */

import { useCallback, useState, type ReactElement } from "react";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatMessageAge } from "@/features/workbench/lib";
import { cn } from "@/lib/utils";

export type ThreadMessageMetaVariant = "user" | "assistant" | "error";

export interface ThreadMessageMetaProps {
  variant: ThreadMessageMetaVariant;
  text: string;
  createdAt?: string;
  now: Date;
}

function MetaIconButton({
  label,
  pressed = false,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactElement;
}): ReactElement {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "cursor-pointer border-0 bg-transparent p-0 text-fg-faint hover:text-fg",
        pressed && "text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function ThreadMessageMeta({
  variant,
  text,
  createdAt,
  now,
}: ThreadMessageMetaProps): ReactElement | null {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const isUser = variant === "user";

  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    });
  }, [text]);

  if (createdAt === undefined) {
    return null;
  }

  const ageLabel = formatMessageAge(createdAt, now);

  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-2",
        isUser ? "max-w-measure-thread justify-end self-end" : "justify-start",
      )}
    >
      <span className="font-sans text-caption text-fg-faint">{ageLabel}</span>
      <div className="flex items-center gap-1.5">
        <MetaIconButton label="Copy message" onClick={handleCopy}>
          <Copy className="size-3.5" aria-hidden />
        </MetaIconButton>
        {variant === "assistant" ? (
          <>
            <MetaIconButton
              label="Like response"
              pressed={feedback === "up"}
              onClick={() => {
                setFeedback((current) => (current === "up" ? null : "up"));
              }}
            >
              <ThumbsUp className="size-3.5" aria-hidden />
            </MetaIconButton>
            <MetaIconButton
              label="Dislike response"
              pressed={feedback === "down"}
              onClick={() => {
                setFeedback((current) => (current === "down" ? null : "down"));
              }}
            >
              <ThumbsDown className="size-3.5" aria-hidden />
            </MetaIconButton>
          </>
        ) : null}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}
