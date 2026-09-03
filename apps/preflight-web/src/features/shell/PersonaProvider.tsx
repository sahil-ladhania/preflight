/**
 * PersonaProvider — client session actor for demo personas.
 * Why: login sets actor; shell chrome reads it for the tab session.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  clearStoredSessionActor,
  readStoredSessionActor,
  writeStoredSessionActor,
} from "@/features/shell/persona";
import type { SessionActor } from "@/features/shell/types";

export interface PersonaContextValue {
  actor: SessionActor | null;
  hydrated: boolean;
  setActor: (actor: SessionActor) => void;
  clearActor: () => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [actor, setActorState] = useState<SessionActor | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setActorState(readStoredSessionActor());
    setHydrated(true);
  }, []);

  const setActor = useCallback((next: SessionActor): void => {
    writeStoredSessionActor(next);
    setActorState(next);
  }, []);

  const clearActor = useCallback((): void => {
    clearStoredSessionActor();
    setActorState(null);
  }, []);

  const value = useMemo(
    (): PersonaContextValue => ({
      actor,
      hydrated,
      setActor,
      clearActor,
    }),
    [actor, clearActor, hydrated, setActor],
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona(): PersonaContextValue {
  const context = useContext(PersonaContext);
  if (context === null) {
    throw new Error("usePersona must be used within PersonaProvider");
  }
  return context;
}
