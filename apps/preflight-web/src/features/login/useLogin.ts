/**
 * useLogin — email-first mock sign-in and persona landing.
 * Why: domain resolution is client-side; credentials never enumerate users.
 */
// size: three auth methods share one hook so abort, lockout, and landing stay one flow.

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  formatLockoutMessage,
  formatSsoError,
  isParseableEmail,
  LOGIN_COPY,
  LOGIN_LOCKOUT_AFTER,
  LOGIN_LOCKOUT_MINUTES,
  LOGIN_REDIRECT_MS,
  LOGIN_RESOLVE_MS,
  loginNoticeFromLocation,
  matchMockCredentials,
  resolveTenant,
  ssoErrorFromSearch,
  type LoginBusy,
  type LoginNoticeKind,
  type LoginStep,
} from "@/features/login/lib";
import {
  loginErrorMessage,
  openPersonaLanding,
  wait,
} from "@/features/login/login-session";
import { useLoginGate } from "@/features/login/useLoginGate";
import { usePersona } from "@/features/shell/PersonaProvider";
import { ApiClientError } from "@/lib/api";

export interface UseLoginResult {
  email: string;
  password: string;
  step: LoginStep;
  busy: LoginBusy;
  notice: LoginNoticeKind | null;
  message: string | null;
  idpName: string | null;
  emailReady: boolean;
  locked: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleIdentityContinue: () => Promise<void>;
  handlePasswordSignIn: () => Promise<void>;
  handleSsoContinue: () => Promise<void>;
  handleChangeEmail: () => void;
  handleTryAgain: () => void;
}

export function useLogin(): UseLoginResult {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActor } = usePersona();
  const locationState = useLoginGate();
  const [email, setEmailState] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [step, setStep] = useState<LoginStep>("identity");
  const [busy, setBusy] = useState<LoginBusy>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [idpName, setIdpName] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const guardRef = useRef<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const notice = loginNoticeFromLocation({
    intent: locationState?.intent,
    notice: locationState?.notice,
    from: locationState?.from,
  });
  const locked = failedAttempts >= LOGIN_LOCKOUT_AFTER;
  const emailReady = isParseableEmail(email);

  useEffect(() => {
    const reason = ssoErrorFromSearch(location.search);
    if (reason === null) {
      return;
    }
    setMessage(formatSsoError(reason));
  }, [location.search]);

  const abortPending = useCallback((): void => {
    abortRef.current?.abort();
    abortRef.current = null;
    guardRef.current = false;
    setBusy("idle");
  }, []);

  const setEmail = useCallback((value: string): void => {
    setEmailState(value);
    setMessage(null);
  }, []);

  const handleChangeEmail = useCallback((): void => {
    abortPending();
    setStep("identity");
    setPassword("");
    setIdpName(null);
    if (failedAttempts < LOGIN_LOCKOUT_AFTER) {
      setMessage(null);
    }
  }, [abortPending, failedAttempts]);

  const handleTryAgain = useCallback((): void => {
    abortPending();
    setMessage(null);
    if (location.search.length > 0) {
      void navigate("/login", { replace: true, state: location.state });
    }
  }, [abortPending, location.search, location.state, navigate]);

  const handleIdentityContinue = useCallback(async (): Promise<void> => {
    if (!emailReady || busy !== "idle" || guardRef.current) {
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    guardRef.current = true;
    setBusy("resolving");
    setMessage(null);
    try {
      await wait(LOGIN_RESOLVE_MS, controller.signal);
      const tenant = resolveTenant(email);
      if (tenant.method === "unknown") {
        setMessage(LOGIN_COPY.unknownDomain);
        return;
      }
      if (tenant.method === "sso") {
        setIdpName(tenant.idpName);
        setStep("sso");
        return;
      }
      setIdpName(null);
      setStep("password");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setMessage(loginErrorMessage(error));
    } finally {
      guardRef.current = false;
      setBusy("idle");
    }
  }, [busy, email, emailReady]);

  const handlePasswordSignIn = useCallback(async (): Promise<void> => {
    if (busy !== "idle" || guardRef.current) {
      return;
    }
    if (failedAttempts >= LOGIN_LOCKOUT_AFTER) {
      setMessage(formatLockoutMessage(LOGIN_LOCKOUT_MINUTES));
      return;
    }
    guardRef.current = true;
    setBusy("submitting");
    setMessage(null);
    const personaId = matchMockCredentials(email, password);
    if (personaId === null) {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      setMessage(
        next >= LOGIN_LOCKOUT_AFTER
          ? formatLockoutMessage(LOGIN_LOCKOUT_MINUTES)
          : LOGIN_COPY.invalidCredentials,
      );
      guardRef.current = false;
      setBusy("idle");
      return;
    }
    try {
      await openPersonaLanding(personaId, locationState?.from, navigate, setActor);
    } catch (submitError: unknown) {
      if (submitError instanceof ApiClientError && submitError.kind === "abort") {
        return;
      }
      setMessage(loginErrorMessage(submitError));
    } finally {
      guardRef.current = false;
      setBusy("idle");
    }
  }, [busy, email, failedAttempts, locationState?.from, navigate, password, setActor]);

  const handleSsoContinue = useCallback(async (): Promise<void> => {
    if (busy !== "idle" || idpName === null || guardRef.current) {
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    guardRef.current = true;
    setBusy("redirecting");
    setMessage(null);
    try {
      await wait(LOGIN_REDIRECT_MS, controller.signal);
      setMessage(formatSsoError(LOGIN_COPY.defaultSsoError));
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setMessage(loginErrorMessage(error));
    } finally {
      guardRef.current = false;
      setBusy("idle");
    }
  }, [busy, idpName]);

  return {
    email,
    password,
    step,
    busy,
    notice,
    message,
    idpName,
    emailReady,
    locked,
    setEmail,
    setPassword,
    handleIdentityContinue,
    handlePasswordSignIn,
    handleSsoContinue,
    handleChangeEmail,
    handleTryAgain,
  };
}
