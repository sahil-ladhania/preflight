/**
 * useLogin — Screen 0 mock sign-in and persona landing.
 * Why: credentials match locally; Meera resolves campaign before persist.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";

import {
  LOGIN_COPY,
  LOGIN_SIGN_OUT_INTENT,
  loginDestinationForPersona,
  matchMockCredentials,
} from "@/features/login/lib";
import { resolveWorkbenchCampaignHandoff } from "@/features/shell/campaign-nav.service";
import { sessionActorFromPersonaId } from "@/features/shell/persona";
import { usePersona } from "@/features/shell/PersonaProvider";
import type { PersonaId } from "@/features/shell/types";
import { ApiClientError } from "@/lib/api";

interface LoginLocationState {
  from?: Location;
  intent?: typeof LOGIN_SIGN_OUT_INTENT;
}

export interface UseLoginResult {
  userId: string;
  password: string;
  error: string | null;
  submitting: boolean;
  setUserId: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: () => Promise<void>;
}

function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.apiError ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return LOGIN_COPY.landingFailed;
}

export function useLogin(): UseLoginResult {
  const navigate = useNavigate();
  const location = useLocation();
  const { actor, hydrated, setActor, clearActor } = usePersona();
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const guardRef = useRef<boolean>(false);

  const navigateToPersonaLanding = useCallback(
    async (personaId: PersonaId): Promise<void> => {
      const state = location.state as LoginLocationState | null;
      const destination = loginDestinationForPersona(personaId, state?.from);

      if (destination !== "resolve-campaign") {
        void navigate(destination, { replace: true });
        return;
      }

      const controller = new AbortController();
      const campaignId = await resolveWorkbenchCampaignHandoff(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      void navigate(`/campaign/${campaignId}`, { replace: true });
    },
    [location.state, navigate],
  );

  useEffect(() => {
    const state = location.state as LoginLocationState | null;

    if (state?.intent === LOGIN_SIGN_OUT_INTENT) {
      clearActor();
      void navigate("/login", { replace: true, state: {} });
      return;
    }

    if (!hydrated || actor === null) {
      return;
    }

    if (state?.from !== undefined) {
      return;
    }

    void navigateToPersonaLanding(actor.id);
  }, [
    actor,
    clearActor,
    hydrated,
    location.state,
    navigate,
    navigateToPersonaLanding,
  ]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (submitting || guardRef.current) {
      return;
    }

    setError(null);
    const personaId = matchMockCredentials(userId, password);
    if (personaId === null) {
      setError(LOGIN_COPY.invalidCredentials);
      return;
    }

    guardRef.current = true;
    setSubmitting(true);
    const nextActor = sessionActorFromPersonaId(personaId);
    const controller = new AbortController();

    try {
      const state = location.state as LoginLocationState | null;
      const destination = loginDestinationForPersona(personaId, state?.from);

      if (destination !== "resolve-campaign") {
        setActor(nextActor);
        void navigate(destination, { replace: true });
        return;
      }

      const campaignId = await resolveWorkbenchCampaignHandoff(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setActor(nextActor);
      void navigate(`/campaign/${campaignId}`, { replace: true });
    } catch (submitError: unknown) {
      if (controller.signal.aborted) {
        return;
      }
      if (submitError instanceof ApiClientError && submitError.kind === "abort") {
        return;
      }
      setError(loginErrorMessage(submitError));
    } finally {
      guardRef.current = false;
      setSubmitting(false);
    }
  }, [location.state, navigate, password, setActor, submitting, userId]);

  return {
    userId,
    password,
    error,
    submitting,
    setUserId,
    setPassword,
    handleSubmit,
  };
}
