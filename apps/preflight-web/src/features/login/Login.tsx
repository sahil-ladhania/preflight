/**
 * Login — Screen 0 route. Two panels, full viewport, no top bar.
 * Why: the pitch on the left, the instrument on the right.
 */

import type { ReactElement } from "react";

import { LoginBrandPanel } from "@/features/login/LoginBrandPanel";
import { LoginFooter } from "@/features/login/LoginFooter";
import { LoginForm } from "@/features/login/LoginForm";

export function LoginRoute(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <LoginBrandPanel className="md:w-[55%]" />

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center bg-ground px-6 py-10 md:w-[45%] md:py-0">
        <div className="-translate-y-[8vh] flex w-full min-w-0 max-w-[360px] flex-col items-center gap-0">
          <LoginForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
