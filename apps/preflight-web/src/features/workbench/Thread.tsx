/**
 * Thread — bordered comment sheets.
 * Why: GitHub conversation register; no bubbles.
 */

import { useEffect, useRef, type ReactElement } from "react";

import { CommentSheet } from "@/features/workbench/CommentSheet";
import { RuleCards } from "@/features/workbench/RuleCards";
import { SearchFallback } from "@/features/workbench/SearchFallback";
import type { ThreadProps, WorkbenchMessage } from "@/features/workbench/types";
import { WORKBENCH_EMPTY_PROMPT } from "@/features/workbench/lib";

function EmptyPrompt(): ReactElement {
  return (
    <CommentSheet label="Preflight">
      <p className="text-body-airy text-fg-muted">{WORKBENCH_EMPTY_PROMPT}</p>
    </CommentSheet>
  );
}

function MessageBlock({
  message,
  rules,
}: {
  message: WorkbenchMessage;
  rules: ThreadProps["rules"];
}): ReactElement {
  if (message.role === "user") {
    return (
      <CommentSheet label="You">
        <p className="whitespace-pre-wrap text-body-airy text-fg">
          {message.text}
        </p>
      </CommentSheet>
    );
  }

  if (message.role === "assistant") {
    return (
      <CommentSheet label="Preflight">
        <p className="whitespace-pre-wrap text-body-airy text-fg">
          {message.text}
        </p>
        <RuleCards ruleIds={message.ruleIds} rules={rules} />
      </CommentSheet>
    );
  }

  return (
    <CommentSheet label="Preflight">
      <p className="whitespace-pre-wrap text-body-airy text-fg-muted">
        {message.text}
      </p>
    </CommentSheet>
  );
}

export function Thread({
  messages,
  rules,
  showSearchFallback,
  searchQuery,
  onSearchQueryChange,
}: ThreadProps): ReactElement {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-4">
      {messages.length === 0 ? (
        <EmptyPrompt />
      ) : (
        messages.map((message) => (
          <MessageBlock key={message.id} message={message} rules={rules} />
        ))
      )}
      {showSearchFallback ? (
        <SearchFallback
          rules={rules}
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
        />
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
