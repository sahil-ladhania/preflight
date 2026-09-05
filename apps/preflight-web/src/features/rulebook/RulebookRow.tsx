import type { ReactElement } from "react";
import { Lock, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { appliesLabel } from "@/features/rulebook/lib";
import type { RulebookRowProps } from "@/features/rulebook/types";

export function RulebookRow({ rule, onEdit }: RulebookRowProps): ReactElement {
  return (
    <TableRow className="border-b border-hairline hover:bg-hover">
      <TableCell className="w-[100px] truncate px-3 py-3 align-middle font-mono text-mono-meta text-fg">
        {rule.ruleId}
      </TableCell>
      <TableCell className="w-[60px] px-3 py-3 align-middle">
        <Badge
          variant="outline"
          className="border-0 p-0 font-mono text-kind-badge font-normal uppercase text-fg-muted"
        >
          {rule.kind === "deterministic" ? "DET" : "JDG"}
        </Badge>
      </TableCell>
      <TableCell
        className="max-w-0 truncate px-3 py-3 align-middle font-serif text-serif-row text-fg"
        title={rule.wording}
      >
        {rule.wording}
      </TableCell>
      <TableCell
        className="w-[260px] whitespace-normal px-3 py-3 align-middle"
        title={appliesLabel(rule)}
      >
        <span className="line-clamp-2 text-ui leading-snug text-fg-muted">
          {appliesLabel(rule)}
        </span>
      </TableCell>
      <TableCell className="w-[56px] px-3 py-3 text-right align-middle">
        {rule.kind === "deterministic" ? (
          <span
            className="inline-flex cursor-default items-center justify-center text-fg-faint"
            title="Defined in code — cannot be edited"
          >
            <Lock className="size-[13px] shrink-0" aria-label="Defined in code" />
          </span>
        ) : (
          <Button
            type="button"
            variant="link"
            className="inline-flex h-auto cursor-pointer items-center gap-1 p-0 font-sans text-caption text-decision underline hover:text-decision/80"
            onClick={() => onEdit(rule.ruleId)}
          >
            <Pencil className="size-3 shrink-0" aria-hidden="true" />
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
