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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    <Card className="w-full min-w-0 max-w-[360px] rounded-none border border-border bg-surface p-7 shadow-none">
      <form
        className="flex w-full min-w-0 flex-col gap-4"
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
          <Button
            type="submit"
            disabled={submitDisabled}
            aria-busy={showRing}
            variant={showFilled ? "default" : "outline"}
            className={cn(
              "h-8 w-full rounded-none px-4 font-sans text-(length:--text-button) font-medium",
              !showFilled && "cursor-not-allowed border-hairline bg-surface text-fg-faint hover:bg-surface hover:text-fg-faint"
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

          <Separator className="mt-4 bg-hairline" />

          <p className="mt-3 font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted">
            {loginAccountabilityLine(step)}
          </p>
        </div>
      </form>
    </Card>
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
