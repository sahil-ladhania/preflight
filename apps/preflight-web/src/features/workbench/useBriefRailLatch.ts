/**
 * useBriefRailLatch — show brief rail once eligible; preserve scroll on reveal.
 * Why: rail must not disappear after capture; no scroll jump when it appears.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { isBriefRailEligible } from "@/features/workbench/brief-rail-lib";
import type { WorkbenchMessage } from "@/features/workbench/types";

export function useBriefRailLatch(
  messages: WorkbenchMessage[],
  capturedCount: number,
  scrollRef: RefObject<HTMLDivElement | null>,
): boolean {
  const eligible = isBriefRailEligible(messages, capturedCount);
  const [latched, setLatched] = useState<boolean>(() => eligible);
  const savedScrollTopRef = useRef<number>(0);
  const didRestoreScrollRef = useRef<boolean>(latched);

  useEffect(() => {
    if (latched || !eligible) {
      return;
    }
    const el = scrollRef.current;
    if (el) {
      savedScrollTopRef.current = el.scrollTop;
    }
    setLatched(true);
  }, [latched, eligible, scrollRef]);

  useLayoutEffect(() => {
    if (!latched || didRestoreScrollRef.current) {
      return;
    }
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = savedScrollTopRef.current;
    }
    didRestoreScrollRef.current = true;
  }, [latched, scrollRef]);

  return latched;
}
