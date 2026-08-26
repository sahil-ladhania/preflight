/**
 * useWorkbenchHandoff — extract from the conversation, then open Campaign.
 * Why: doc 19 §9.3 hands off to /campaign/:id; phases live on that screen.
 */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { runWorkbenchExtractHandoff } from "@/features/workbench/handoff.service";
import { handoffEnabled } from "@/features/workbench/lib";
import type { WorkbenchMessage } from "@/features/workbench/types";

export function useWorkbenchHandoff(input: {
  messages: WorkbenchMessage[];
  toastApiError: (error: unknown) => void;
}): {
  handoffInFlight: boolean;
  startCampaignFromConversation: () => Promise<void>;
} {
  const { messages, toastApiError } = input;
  const navigate = useNavigate();
  const [handoffInFlight, setHandoffInFlight] = useState<boolean>(false);

  const startCampaignFromConversation = useCallback(async (): Promise<void> => {
    if (handoffInFlight || !handoffEnabled(messages)) {
      return;
    }

    const controller = new AbortController();
    setHandoffInFlight(true);

    try {
      const extracted = await runWorkbenchExtractHandoff(
        messages,
        controller.signal,
      );
      void navigate(`/campaign/${extracted.campaignId}`, {
        state: {
          handoff: {
            proposal: extracted.proposal,
            freeText: extracted.freeText,
            skillsRead: extracted.skillsRead,
          },
        },
      });
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setHandoffInFlight(false);
    }
  }, [handoffInFlight, messages, navigate, toastApiError]);

  return { handoffInFlight, startCampaignFromConversation };
}
