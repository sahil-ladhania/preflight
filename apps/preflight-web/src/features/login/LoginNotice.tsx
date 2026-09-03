/**
 * LoginNotice — signed-out / resume line above the card fields.
 * Why: lineage geometry (08 §5.13), not a boxed alert.
 */

import type { ReactElement } from "react";

import { LOGIN_NOTICE_COPY, type LoginNoticeKind } from "@/features/login/lib";

export interface LoginNoticeProps {
  kind: LoginNoticeKind;
}

export function LoginNotice({ kind }: LoginNoticeProps): ReactElement {
  return (
    <div className="border-l-[3px] border-hairline py-1 pl-3">
      <p className="font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted">
        {LOGIN_NOTICE_COPY[kind]}
      </p>
    </div>
  );
}
