/**
 * login-session — persist actor and open the persona landing.
 * Why: password submit and an already-signed-in visit share the same destination.
 */

import type { Location, NavigateFunction } from "react-router-dom";

import { LOGIN_COPY, loginDestinationForPersona } from "@/features/login/lib";
import { sessionActorFromPersonaId } from "@/features/shell/persona";
import type { PersonaId, SessionActor } from "@/features/shell/types";
import { ApiClientError } from "@/lib/api";

export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.apiError ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return LOGIN_COPY.landingFailed;
}

export function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(() => resolve(), ms);
    const onAbort = (): void => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export async function openPersonaLanding(
  personaId: PersonaId,
  from: Location | undefined,
  navigate: NavigateFunction,
  persist?: (actor: SessionActor) => void,
): Promise<void> {
  const destination = loginDestinationForPersona(personaId, from);
  persist?.(sessionActorFromPersonaId(personaId));
  void navigate(destination, { replace: true });
}
