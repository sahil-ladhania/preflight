/**
 * LoginForm — the sign-in instrument on the right panel.
 * Why: email-first tenant resolution; step replaces in place.
 */

import type { FormEvent, ReactElement } from "react";

import {
  LoginIdentityFields,
  LoginPasswordFields,
  loginSubmitLabel,
  plainLinkClass,
} from "@/features/login/LoginFields";
import { LoginNotice } from "@/features/login/LoginNotice";
import { LoginSsoButtons } from "@/features/login/LoginSsoButtons";
import {
  formatSsoRedirectingLine,
  LOGIN_COPY,
  LOGIN_HEADING,
  loginAccountabilityLine,
} from "@/features/login/lib";
import { useLogin } from "@/features/login/useLogin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginForm(): ReactElement {
  const login = useLogin();
  const {
    email,
    password,
    step,
    busy,
    notice,
    message,
    idpName,
    emailReady,
    locked,
  } = login;

  const submitDisabled =
    (step === "identity" && (!emailReady || busy === "resolving")) ||
    (step === "password" && (busy === "submitting" || locked)) ||
    (step === "sso" && busy === "redirecting");
  const showFilled =
    (step === "identity" && emailReady) ||
    (step === "password" && !locked) ||
    step === "sso";
  const showTryAgain =
    message !== null && message.startsWith("Sign-in didn't complete.");
  const showRing =
    busy === "resolving" || busy === "redirecting" || busy === "submitting";
  const disabledReason =
    step === "identity" && !emailReady && message === null
      ? LOGIN_COPY.continueReason
      : null;
  let ssoStatusLine: string | null = null;
  if (step === "sso" && busy === "redirecting" && idpName !== null) {
    ssoStatusLine = formatSsoRedirectingLine(idpName);
  } else if (step === "sso" && busy === "idle" && message === null) {
    ssoStatusLine = LOGIN_COPY.ssoHint;
  }
  const liveLine = disabledReason ?? ssoStatusLine ?? message;
  const hasLiveLine = liveLine !== null;

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (step === "identity") {
      void login.handleIdentityContinue();
      return;
    }
    if (step === "password") {
      void login.handlePasswordSignIn();
      return;
    }
    void login.handleSsoContinue();
  }

  return (
    <form
      className="flex w-full min-w-0 max-w-[360px] flex-col gap-5"
      onSubmit={onSubmit}
    >
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-[22px] font-semibold leading-[1.25] text-fg">
          {LOGIN_HEADING.title}
        </h2>
        <p className="font-sans text-(length:--text-ui) leading-[1.4] font-normal text-fg-muted">
          {LOGIN_HEADING.subtitle}
        </p>
      </div>

      {notice !== null ? <LoginNotice kind={notice} /> : null}

      {/* Step fields — stable min-height prevents button shift */}
      <div className="flex min-h-[96px] flex-col gap-4">
        {step === "identity" ? (
          <LoginIdentityFields
            email={email}
            disabled={busy === "resolving"}
            onEmailChange={login.setEmail}
          />
        ) : null}

        {step === "password" ? (
          <LoginPasswordFields
            email={email}
            password={password}
            disabled={busy === "submitting" || locked}
            onChangeEmail={login.handleChangeEmail}
            onPasswordChange={login.setPassword}
          />
        ) : null}

        {step === "sso" ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 truncate font-sans text-(length:--text-label) leading-[1.4] font-normal tracking-[0.04em] normal-case text-fg-muted">
                {email}
              </p>
              <button
                type="button"
                className={cn(plainLinkClass, "shrink-0")}
                onClick={login.handleChangeEmail}
              >
                {LOGIN_COPY.changeLabel}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Primary button + live line */}
      <div className="flex flex-col">
        <Button
          type="submit"
          disabled={submitDisabled}
          aria-busy={showRing}
          variant={showFilled ? "default" : "outline"}
          className={cn(
            "h-8 w-full rounded-none px-4 font-sans text-(length:--text-button) font-medium",
            !showFilled && "cursor-not-allowed border-hairline bg-surface text-fg-faint hover:bg-surface hover:text-fg-faint",
          )}
        >
          {showRing ? (
            <span className="pending-ring" aria-hidden="true" />
          ) : null}
          {loginSubmitLabel({ step, busy, idpName })}
        </Button>

        <div aria-live="polite" className={hasLiveLine ? "mt-2" : "sr-only"}>
          {hasLiveLine ? (
            <p className="font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted">
              {liveLine}
            </p>
          ) : null}
        </div>

        {step === "password" ? (
          <a href="#login-help" className={cn(plainLinkClass, "mt-2 self-start")}>
            {LOGIN_COPY.forgotPassword}
          </a>
        ) : null}

        {showTryAgain ? (
          <button
            type="button"
            className={cn(plainLinkClass, "mt-2 self-start")}
            onClick={login.handleTryAgain}
          >
            {LOGIN_COPY.tryAgain}
          </button>
        ) : null}
      </div>

      {/* Divider — "or" */}
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-hairline" />
        <span className="font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-faint">or</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <LoginSsoButtons />

      {/* Accountability */}
      <div className="flex flex-col gap-3">
        <span className="h-px w-full bg-hairline" />
        <p className="font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted">
          {loginAccountabilityLine(step)}
        </p>
      </div>
    </form>
  );
}
