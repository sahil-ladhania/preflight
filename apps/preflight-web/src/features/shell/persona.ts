/**
 * persona — demo session actor catalog and sessionStorage helpers.
 * Why: Screen 0 sets client actor; Screen 6 displays it without backend auth.
 */

import type { PersonaId, SessionActor } from "@/features/shell/types";

export const SESSION_ACTOR_STORAGE_KEY = "preflight.sessionActor";

export const PERSONA_HOME_PATH = "/overview";

const PERSONA_CATALOG: Record<
  PersonaId,
  { name: string; role: SessionActor["role"] }
> = {
  meera: { name: "Meera Menon", role: "CAMPAIGN OWNER" },
  arjun: { name: "Arjun Legha", role: "COMPLIANCE REVIEWER" },
};

export function sessionActorFromPersonaId(id: PersonaId): SessionActor {
  const entry = PERSONA_CATALOG[id];
  return { id, name: entry.name, role: entry.role };
}

function isPersonaId(value: unknown): value is PersonaId {
  return value === "meera" || value === "arjun";
}

function isSessionActor(value: unknown): value is SessionActor {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    isPersonaId(record.id) &&
    typeof record.name === "string" &&
    (record.role === "CAMPAIGN OWNER" ||
      record.role === "COMPLIANCE REVIEWER")
  );
}

export function readStoredSessionActor(): SessionActor | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_ACTOR_STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isSessionActor(parsed)) {
      window.sessionStorage.removeItem(SESSION_ACTOR_STORAGE_KEY);
      return null;
    }

    return sessionActorFromPersonaId(parsed.id);
  } catch {
    window.sessionStorage.removeItem(SESSION_ACTOR_STORAGE_KEY);
    return null;
  }
}

export function writeStoredSessionActor(actor: SessionActor): void {
  window.sessionStorage.setItem(
    SESSION_ACTOR_STORAGE_KEY,
    JSON.stringify(actor),
  );
}

export function clearStoredSessionActor(): void {
  window.sessionStorage.removeItem(SESSION_ACTOR_STORAGE_KEY);
}
