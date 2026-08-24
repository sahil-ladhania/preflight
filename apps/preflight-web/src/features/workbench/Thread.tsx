/**
 * Thread — bordered comment sheets.
 * Why: GitHub conversation register; no bubbles.
 */

import { useEffect, useRef, type ReactElement } from "react";

import { CommentSheet } from "@/features/workbench/CommentSheet";
import { RuleCards } from "@/features/workbench/RuleCards";
import { SearchFallback } from "@/features/workbench/SearchFallback";
import type { ThreadProps, WorkbenchMessage } from "@/features/workbench/types";
import { WORKBENCH_EMPTY_PROMPT } from "@/fixtures/workbench";

function MessageBlock({
  message,
  rules,
  onGoToCampaign,
}: {
  message: WorkbenchMessage;
  rules: ThreadProps["rules"];
  onGoToCampaign: () => void;
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
        <RuleCards
          ruleIds={message.ruleIds}
          rules={rules}
          onGoToCampaign={onGoToCampaign}
        />
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
  onGoToCampaign,
}: ThreadProps): ReactElement {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="py-8 text-center text-caption text-fg-muted">
          {WORKBENCH_EMPTY_PROMPT}
        </p>
      ) : (
        messages.map((message) => (
          <MessageBlock
            key={message.id}
            message={message}
            rules={rules}
            onGoToCampaign={onGoToCampaign}
          />
        ))
      )}
      {showSearchFallback ? (
        <SearchFallback
          rules={rules}
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
          onGoToCampaign={onGoToCampaign}
        />
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
