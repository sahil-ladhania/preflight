/**
 * Thread — scrollable message cards inside the stage.
 * Why: no empty prompt; cards only when messages exist.
 */

import { useCallback, useEffect, useRef, type ReactElement } from "react";

import { PendingRing } from "@/features/assets/PendingRing";
import { CommentSheet } from "@/features/workbench/CommentSheet";
import { RuleCards } from "@/features/workbench/RuleCards";
import { SearchFallback } from "@/features/workbench/SearchFallback";
import { useTypewriterReveal } from "@/features/workbench/useTypewriterReveal";
import type { ThreadProps, WorkbenchMessage } from "@/features/workbench/types";

function AssistantMessageBlock({
  message,
  rules,
  onRevealProgress,
}: {
  message: Extract<WorkbenchMessage, { role: "assistant" }>;
  rules: ThreadProps["rules"];
  onRevealProgress: () => void;
}): ReactElement {
  const shouldReveal = message.reveal === true;
  const { visibleText, isComplete } = useTypewriterReveal(
    message.text,
    shouldReveal,
  );

  useEffect(() => {
    if (shouldReveal) {
      onRevealProgress();
    }
  }, [visibleText, shouldReveal, isComplete, onRevealProgress]);

  return (
    <CommentSheet label="Preflight" variant="assistant">
      <p className="whitespace-pre-wrap text-body-airy text-fg">
        {shouldReveal ? visibleText : message.text}
      </p>
      <RuleCards ruleIds={message.ruleIds} rules={rules} />
    </CommentSheet>
  );
}

function MessageBlock({
  message,
  rules,
  onRevealProgress,
}: {
  message: WorkbenchMessage;
  rules: ThreadProps["rules"];
  onRevealProgress: () => void;
}): ReactElement {
  if (message.role === "user") {
    return (
      <CommentSheet variant="user">
        <p className="whitespace-pre-wrap text-body-airy text-fg">
          {message.text}
        </p>
      </CommentSheet>
    );
  }

  if (message.role === "pending") {
    return (
      <CommentSheet label="Preflight" variant="assistant">
        <div className="flex items-center gap-2">
          <PendingRing active />
          <p className="text-body-airy text-fg-muted">Thinking…</p>
        </div>
      </CommentSheet>
    );
  }

  if (message.role === "assistant") {
    return (
      <AssistantMessageBlock
        message={message}
        rules={rules}
        onRevealProgress={onRevealProgress}
      />
    );
  }

  return (
    <CommentSheet label="Preflight" variant="error">
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

  const scrollToEnd = useCallback((): void => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  if (messages.length === 0) {
    return <></>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6">
      {messages.map((message) => (
        <MessageBlock
          key={message.id}
          message={message}
          rules={rules}
          onRevealProgress={scrollToEnd}
        />
      ))}
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
