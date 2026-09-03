/**
 * Login — Screen 0 production email-first sign-in.
 * Why: a tenant's IdP is resolved from work email, not chosen from a list.
 */

import type { FormEvent, ReactElement } from "react";

import { LoginBrandPanel } from "@/features/login/LoginBrandPanel";
import {
  LoginIdentityFields,
  LoginPasswordFields,
  LoginSsoFields,
  loginSubmitLabel,
  plainLinkClass,
} from "@/features/login/LoginFields";
import { LoginFooter } from "@/features/login/LoginFooter";
import { LoginNotice } from "@/features/login/LoginNotice";
import {
  formatSsoRedirectingLine,
  LOGIN_COPY,
  loginAccountabilityLine,
} from "@/features/login/lib";
import { useLogin } from "@/features/login/useLogin";
import { cn } from "@/lib/utils";

const filledButtonClass = cn(
  "flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-none",
  "border border-solid border-fg bg-fg px-4 font-sans text-(length:--text-button) leading-none font-medium text-surface shadow-none",
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision",
  "disabled:cursor-not-allowed",
);

const disabledButtonClass = cn(
  "flex h-8 w-full cursor-not-allowed items-center justify-center gap-2 rounded-none",
  "border border-solid border-hairline bg-surface px-4 font-sans text-(length:--text-button) leading-none font-medium text-fg-faint shadow-none",
);

function LoginForm(): ReactElement {
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
      className="flex w-full min-w-0 max-w-[360px] flex-col gap-4 rounded-none border border-fg-muted bg-surface p-7 shadow-none"
      onSubmit={onSubmit}
    >
      {notice !== null ? <LoginNotice kind={notice} /> : null}

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
        <LoginSsoFields email={email} onChangeEmail={login.handleChangeEmail} />
      ) : null}

      <div className="flex flex-col">
        <button
          type="submit"
          disabled={submitDisabled}
          aria-busy={showRing}
          className={showFilled ? filledButtonClass : disabledButtonClass}
        >
          {showRing ? (
            <span className="pending-ring" aria-hidden="true" />
          ) : null}
          {loginSubmitLabel({ step, busy, idpName })}
        </button>

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

        <div className="mt-4 h-px w-full bg-hairline" aria-hidden="true" />

        <p className="mt-3 font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted">
          {loginAccountabilityLine(step)}
        </p>
      </div>
    </form>
  );
}

export function LoginRoute(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <LoginBrandPanel className="md:w-[55%]" />

      <div className="flex min-w-0 flex-1 items-center justify-center border-hairline bg-ground px-4 py-10 md:w-[45%] md:border-l md:py-0">
        <div className="-translate-y-[6vh] flex w-full min-w-0 max-w-[360px] flex-col items-center">
          <LoginForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
