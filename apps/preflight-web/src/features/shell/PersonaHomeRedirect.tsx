/**
 * PersonaHomeRedirect — index route sends each persona to their job.
 * Why: Workbench is never a landing route (09 Screen 0).
 */

import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { landingKind } from "@/features/shell/persona";
import { usePersona } from "@/features/shell/PersonaProvider";
import { usePersonaHomeNavigation } from "@/features/shell/usePersonaHomeNavigation";

export function PersonaHomeRedirect(): ReactElement | null {
  const { actor } = usePersona();
  const navigate = useNavigate();
  const { goHome } = usePersonaHomeNavigation();

  useEffect(() => {
    if (actor === null) {
      return;
    }

    if (landingKind(actor.id) === "assets") {
      void navigate("/assets", { replace: true });
      return;
    }

    void goHome();
  }, [actor, goHome, navigate]);

  return null;
}
