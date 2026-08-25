/**
 * useWorkbench — Workbench chat state.
 * Why: POST /workbench/chat; prefetch GET /rules for cards.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import { sortCatalogRules } from "@/features/rulebook/lib";
import { getRulesService } from "@/features/rulebook/rulebook.service";
import { resolveCampaignNavService } from "@/features/shell/campaign-nav.service";
import { useToastContext } from "@/features/shell/ToastHost";
import { nextMessageId } from "@/features/workbench/lib";
import { sendWorkbenchChatService } from "@/features/workbench/workbench.service";
import type { WorkbenchMessage } from "@/features/workbench/types";
import { ApiClientError } from "@/lib/api";

const PREFETCH_FAIL_TOAST = "Could not load rules catalog.";

export function useWorkbench(): {
  rules: RuleCatalogRowDTO[];
  prefetchFailed: boolean;
  messages: WorkbenchMessage[];
  composerText: string;
  sendInFlight: boolean;
  showSearchFallback: boolean;
  searchQuery: string;
  setComposerText: (value: string) => void;
  setSearchQuery: (value: string) => void;
  send: () => Promise<void>;
  goToCampaign: () => Promise<void>;
} {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [rules, setRules] = useState<RuleCatalogRowDTO[]>([]);
  const [prefetchFailed, setPrefetchFailed] = useState<boolean>(false);
  const [messages, setMessages] = useState<WorkbenchMessage[]>([]);
  const [composerText, setComposerText] = useState<string>("");
  const [sendInFlight, setSendInFlight] = useState<boolean>(false);
  const [showSearchFallback, setShowSearchFallback] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const prefetchToastShown = useRef<boolean>(false);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    prefetchToastShown.current = false;

    void (async (): Promise<void> => {
      try {
        const data = await getRulesService(controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        setRules(sortCatalogRules(data.rules));
        setPrefetchFailed(false);
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        if (error instanceof ApiClientError && error.kind === "abort") {
          return;
        }
        setRules([]);
        setPrefetchFailed(true);
        if (!prefetchToastShown.current) {
          prefetchToastShown.current = true;
          enqueue(PREFETCH_FAIL_TOAST);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [enqueue]);

  const toastApiError = useCallback(
    (error: unknown): void => {
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      if (error instanceof ApiClientError) {
        enqueue(error.apiError ?? error.message);
        return;
      }
      if (error instanceof Error) {
        enqueue(error.message);
      }
    },
    [enqueue],
  );

  const send = useCallback(async (): Promise<void> => {
    const text = composerText.trim();
    if (text.length === 0 || sendInFlight) {
      return;
    }

    const controller = new AbortController();
    setSendInFlight(true);

    const userMessage: WorkbenchMessage = {
      id: nextMessageId(),
      role: "user",
      text,
    };
    setMessages((current) => [...current, userMessage]);
    setComposerText("");

    try {
      const response = await sendWorkbenchChatService(
        { message: text },
        controller.signal,
      );
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId(),
          role: "assistant",
          text: response.message,
          ruleIds: response.ruleIds,
        },
      ]);
    } catch (error: unknown) {
      const errorText =
        error instanceof ApiClientError
          ? (error.apiError ?? error.message)
          : error instanceof Error
            ? error.message
            : "Explainer unavailable — try search below.";
      setMessages((current) => [
        ...current,
        { id: nextMessageId(), role: "error", text: errorText },
      ]);
      setShowSearchFallback(true);
      toastApiError(error);
    } finally {
      setSendInFlight(false);
    }
  }, [composerText, sendInFlight, toastApiError]);

  const goToCampaign = useCallback(async (): Promise<void> => {
    const controller = new AbortController();

    try {
      const campaignId = await resolveCampaignNavService(controller.signal);
      void navigate(`/campaign/${campaignId}`);
    } catch (error: unknown) {
      toastApiError(error);
    }
  }, [navigate, toastApiError]);

  return {
    rules,
    prefetchFailed,
    messages,
    composerText,
    sendInFlight,
    showSearchFallback,
    searchQuery,
    setComposerText,
    setSearchQuery,
    send,
    goToCampaign,
  };
}
