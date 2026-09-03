/**
 * useQueueCount — assets awaiting human decision for nav bracket.
 * Why: R0c count is derived from GET /assets, not a separate endpoint.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { getAssetsService } from "@/features/assets/assets.service";
import { queueCount } from "@/features/shell/lib";
import { ApiClientError } from "@/lib/api";

export function useQueueCount(): number | null {
  const [count, setCount] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await getAssetsService(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setCount(queueCount(data.assets));
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      setCount(null);
    }
  }, []);

  useEffect(() => {
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  return count;
}
