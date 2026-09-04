/**
 * useSessionTransition — local component state machine for workbench session start.
 * Why: 3s holding composer -> ~2s blurred interstitial -> thread; respects reduced motion.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type TransitionState =
  | "idle"
  | "holding_composer"
  | "interstitial"
  | "fading_out"
  | "thread";

const HOLD_COMPOSER_MS = 3000;
const INTERSTITIAL_MIN_MS = 2000;
const FADE_OUT_MS = 200;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface UseSessionTransitionOptions {
  hasMessages: boolean;
  sendInFlight: boolean;
  onSend: () => void | Promise<void>;
}

export function useSessionTransition({
  hasMessages,
  sendInFlight,
  onSend,
}: UseSessionTransitionOptions): {
  transitionState: TransitionState;
  handleSessionSend: () => void;
  isHoldingComposer: boolean;
  showInterstitial: boolean;
  isFadingOut: boolean;
} {
  const [hasStartedSession, setHasStartedSession] = useState<boolean>(hasMessages);
  const [transitionState, setTransitionState] = useState<TransitionState>(
    hasMessages ? "thread" : "idle",
  );

  const replyArrivedRef = useRef<boolean>(false);
  const minHoldElapsedRef = useRef<boolean>(false);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback((): void => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // If messages appear outside transition (e.g. fixture/prop change), sync to thread.
  useEffect(() => {
    if (hasMessages && !hasStartedSession && transitionState === "idle") {
      setHasStartedSession(true);
      setTransitionState("thread");
    }
  }, [hasMessages, hasStartedSession, transitionState]);

  const triggerFadeOut = useCallback((): void => {
    setTransitionState("fading_out");
    const fadeTimer = window.setTimeout(() => {
      setTransitionState("thread");
      setHasStartedSession(true);
    }, FADE_OUT_MS);
    timersRef.current.push(fadeTimer);
  }, []);

  // Track reply arrival while in transition
  useEffect(() => {
    if (transitionState === "holding_composer" || transitionState === "interstitial") {
      if (!sendInFlight && replyArrivedRef.current === false) {
        replyArrivedRef.current = true;
        if (transitionState === "interstitial" && minHoldElapsedRef.current) {
          triggerFadeOut();
        }
      }
    }
  }, [sendInFlight, transitionState, triggerFadeOut]);

  const startInterstitial = useCallback((): void => {
    setTransitionState("interstitial");
    minHoldElapsedRef.current = false;

    const minTimer = window.setTimeout(() => {
      minHoldElapsedRef.current = true;
      // Dismiss only if reply has already arrived; otherwise wait for reply
      if (replyArrivedRef.current) {
        triggerFadeOut();
      }
    }, INTERSTITIAL_MIN_MS);
    timersRef.current.push(minTimer);
  }, [triggerFadeOut]);

  const handleSessionSend = useCallback((): void => {
    // If session has already started or not in idle, trigger normal send
    if (hasStartedSession || transitionState !== "idle") {
      void onSend();
      return;
    }

    // First submit of session
    if (prefersReducedMotion()) {
      // Reduced motion: skip 3s hold and blur fade
      setHasStartedSession(true);
      setTransitionState("thread");
      void onSend();
      return;
    }

    replyArrivedRef.current = false;
    minHoldElapsedRef.current = false;
    setTransitionState("holding_composer");

    // Execute send and track promise settlement
    try {
      const result = onSend();
      if (result && typeof (result as Promise<void>).then === "function") {
        (result as Promise<void>).finally(() => {
          replyArrivedRef.current = true;
          if (minHoldElapsedRef.current) {
            triggerFadeOut();
          }
        });
      }
    } catch {
      replyArrivedRef.current = true;
    }

    // Hold composer in place for ~3s
    const holdTimer = window.setTimeout(() => {
      startInterstitial();
    }, HOLD_COMPOSER_MS);
    timersRef.current.push(holdTimer);
  }, [hasStartedSession, transitionState, onSend, startInterstitial, triggerFadeOut]);

  return {
    transitionState,
    handleSessionSend,
    isHoldingComposer: transitionState === "holding_composer",
    showInterstitial:
      transitionState === "interstitial" || transitionState === "fading_out",
    isFadingOut: transitionState === "fading_out",
  };
}
