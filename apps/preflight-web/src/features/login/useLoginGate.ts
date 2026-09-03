/**
 * useLoginGate — sign-out rewrite and signed-in bounce off /login.
 * Why: the card must not render while a session is still live.
 */

import { useEffect } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";

import {
  LOGIN_INACTIVITY_INTENT,
  LOGIN_SIGN_OUT_INTENT,
  loginNoticeFromLocation,
  type LoginNoticeKind,
} from "@/features/login/lib";
import { openPersonaLanding } from "@/features/login/login-session";
import { usePersona } from "@/features/shell/PersonaProvider";

interface LoginLocationState {
  from?: Location;
  intent?: typeof LOGIN_SIGN_OUT_INTENT | typeof LOGIN_INACTIVITY_INTENT;
  notice?: LoginNoticeKind;
}

export function useLoginGate(): LoginLocationState | null {
  const navigate = useNavigate();
  const location = useLocation();
  const { actor, hydrated, clearActor } = usePersona();
  const locationState = location.state as LoginLocationState | null;

  useEffect(() => {
    const intent = locationState?.intent;
    if (
      intent === LOGIN_SIGN_OUT_INTENT ||
      intent === LOGIN_INACTIVITY_INTENT
    ) {
      clearActor();
      const nextNotice = loginNoticeFromLocation({ intent });
      void navigate("/login", { replace: true, state: { notice: nextNotice } });
      return;
    }
    if (!hydrated || actor === null) {
      return;
    }
    void openPersonaLanding(actor.id, locationState?.from, navigate);
  }, [
    actor,
    clearActor,
    hydrated,
    locationState?.from,
    locationState?.intent,
    navigate,
  ]);

  return locationState;
}
