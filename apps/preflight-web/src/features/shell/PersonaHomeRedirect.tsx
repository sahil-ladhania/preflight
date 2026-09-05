/**
 * PersonaHomeRedirect — index route sends both personas to Overview.
 * Why: landing shows what is unresolved before role-specific work.
 */

import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { PERSONA_HOME_PATH } from "@/features/shell/persona";
import { usePersona } from "@/features/shell/PersonaProvider";

export function PersonaHomeRedirect(): ReactElement | null {
  const { actor } = usePersona();
  const navigate = useNavigate();

  useEffect(() => {
    if (actor === null) {
      return;
    }

    void navigate(PERSONA_HOME_PATH, { replace: true });
  }, [actor, navigate]);

  return null;
}
