/**
 * useCampaignNavTarget — Campaign nav href and create-on-click resolver.
 * Why: TopBar must not use fixture CAMPAIGN_ID (15 §4.8).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  prefetchCampaignNavHref,
  resolveCampaignNavService,
} from "@/features/shell/campaign-nav.service";
import type { CampaignNavTarget } from "@/features/shell/types";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useCampaignNavTarget(): CampaignNavTarget {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [campaignHref, setCampaignHref] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [navigating, setNavigating] = useState<boolean>(false);
  const navigateGuardRef = useRef<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const prefetch = async (): Promise<void> => {
      try {
        const href = await prefetchCampaignNavHref(controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        setCampaignHref(href);
        setDisabled(false);
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        if (error instanceof ApiClientError && error.kind === "abort") {
          return;
        }
        setDisabled(true);
        if (error instanceof ApiClientError) {
          enqueue(error.apiError ?? error.message);
          return;
        }
        if (error instanceof Error) {
          enqueue(error.message);
        }
      }
    };

    void prefetch();

    return () => {
      controller.abort();
    };
  }, [enqueue]);

  const navigateToCampaign = useCallback(async (): Promise<void> => {
    if (disabled || navigating || navigateGuardRef.current) {
      return;
    }

    if (campaignHref !== null) {
      void navigate(campaignHref);
      return;
    }

    navigateGuardRef.current = true;
    setNavigating(true);
    const controller = new AbortController();

    try {
      const id = await resolveCampaignNavService(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      const href = `/campaign/${id}`;
      setCampaignHref(href);
      void navigate(href);
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
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
    } finally {
      navigateGuardRef.current = false;
      setNavigating(false);
    }
  }, [campaignHref, disabled, enqueue, navigate, navigating]);

  return { campaignHref, disabled, navigating, navigateToCampaign };
}
