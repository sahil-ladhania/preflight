/**
 * usePersonaHomeNavigation — wordmark and 404 home open Overview.
 * Why: both personas land on the same operation-wide register first.
 */

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PERSONA_HOME_PATH } from "@/features/shell/persona";
import { usePersona } from "@/features/shell/PersonaProvider";
import type { PersonaHomeNavigation } from "@/features/shell/types";

export function usePersonaHomeNavigation(): PersonaHomeNavigation {
  const navigate = useNavigate();
  const { actor } = usePersona();
  const [navigatingHome, setNavigatingHome] = useState<boolean>(false);
  const guardRef = useRef<boolean>(false);

  const goHome = useCallback(async (): Promise<void> => {
    if (actor === null || navigatingHome || guardRef.current) {
      return;
    }

    guardRef.current = true;
    setNavigatingHome(true);
    try {
      void navigate(PERSONA_HOME_PATH);
    } finally {
      guardRef.current = false;
      setNavigatingHome(false);
    }
  }, [actor, navigate, navigatingHome]);

  return { navigatingHome, goHome };
}
