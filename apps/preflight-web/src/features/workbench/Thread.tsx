/**
 * Thread — scrollable message cards inside the stage.
 * Why: no empty prompt; cards only when messages exist.
 */

import { useCallback, useEffect, useRef, type ReactElement, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { PendingRing } from "@/features/assets/PendingRing";
import { CommentSheet } from "@/features/workbench/CommentSheet";
import { RuleCards } from "@/features/workbench/RuleCards";
import { ThreadMessageMeta } from "@/features/workbench/ThreadMessageMeta";
import type { ThreadProps, WorkbenchMessage } from "@/features/workbench/types";
import { useRelativeNow } from "@/features/workbench/useRelativeNow";
import { useTypewriterReveal } from "@/features/workbench/useTypewriterReveal";

function renderProseWithRuleReferences(text: string): ReactNode {
  const parts = text.split(/(\[[A-Z0-9_-]+\])/g);
  if (parts.length === 1) {
    return text;
  }
  return parts.map((part, index) => {
    if (/^\[[A-Z0-9_-]+\]$/.test(part)) {
      return (
        <Link
          key={index}
          to="/rulebook"
          className="font-mono text-decision underline hover:text-decision/80 cursor-pointer"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

function AssistantMessageBlock({
  message,
  rules,
  now,
  onRevealProgress,
}: {
  message: Extract<WorkbenchMessage, { role: "assistant" }>;
  rules: ThreadProps["rules"];
  now: Date;
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

  const displayedText = shouldReveal ? visibleText : message.text;
  const showMeta = !shouldReveal || isComplete;

  return (
    <div className="flex w-full flex-col items-start">
      <CommentSheet label="Preflight" variant="assistant">
        <p className="whitespace-pre-wrap font-serif text-prose text-fg">
          {renderProseWithRuleReferences(displayedText)}
        </p>
        <RuleCards ruleIds={message.ruleIds} rules={rules} />
      </CommentSheet>
      {showMeta ? (
        <ThreadMessageMeta
          variant="assistant"
          text={message.text}
          createdAt={message.createdAt}
          now={now}
        />
      ) : null}
    </div>
  );
}

function MessageBlock({
  message,
  rules,
  now,
  onRevealProgress,
}: {
  message: WorkbenchMessage;
  rules: ThreadProps["rules"];
  now: Date;
  onRevealProgress: () => void;
}): ReactElement {
  if (message.role === "user") {
    return (
      <div className="flex w-full flex-col items-end">
        <CommentSheet variant="user">
          <p className="whitespace-pre-wrap font-serif text-copy text-fg">
            {message.text}
          </p>
        </CommentSheet>
        <ThreadMessageMeta
          variant="user"
          text={message.text}
          createdAt={message.createdAt}
          now={now}
        />
      </div>
    );
  }

  if (message.role === "pending") {
    return (
      <div className="flex flex-col items-start w-full">
        <span className="font-sans text-caption text-fg-muted mb-1 text-left">
          Preflight
        </span>
        <div className="w-full max-w-measure-thread flex items-center gap-2">
          <PendingRing active />
          <span className="font-serif text-prose text-fg-muted">
            Thinking…
          </span>
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <AssistantMessageBlock
        message={message}
        rules={rules}
        now={now}
        onRevealProgress={onRevealProgress}
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-start">
      <CommentSheet label="Preflight" variant="error">
        <p className="whitespace-pre-wrap font-serif text-prose text-fg-muted">
          {message.text}
        </p>
      </CommentSheet>
      <ThreadMessageMeta
        variant="error"
        text={message.text}
        createdAt={message.createdAt}
        now={now}
      />
    </div>
  );
}

export function Thread({
  messages,
  rules,
  onScrollToEnd,
}: ThreadProps): ReactElement {
  const endRef = useRef<HTMLDivElement>(null);
  const now = useRelativeNow();

  const scrollToEnd = useCallback((): void => {
    if (onScrollToEnd !== undefined) {
      onScrollToEnd();
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [onScrollToEnd]);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  if (messages.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {messages.map((message) => (
        <MessageBlock
          key={message.id}
          message={message}
          rules={rules}
          now={now}
          onRevealProgress={scrollToEnd}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
