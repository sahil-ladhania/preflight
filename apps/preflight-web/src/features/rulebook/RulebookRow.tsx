import type { ReactElement } from "react";
import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appliesLabel } from "@/features/rulebook/lib";
import type { RulebookRowProps } from "@/features/rulebook/types";

export function RulebookRow({ rule, onEdit }: RulebookRowProps): ReactElement {
  return (
    <TableRow className="border-b border-hairline py-1.5 hover:bg-hover">
      <TableCell className="w-[100px] font-mono text-mono-meta text-fg py-1.5 px-2 align-middle truncate">
        {rule.ruleId}
      </TableCell>
      <TableCell className="w-[60px] py-1.5 px-2 align-middle">
        <Badge
          variant="outline"
          className="border-0 p-0 font-mono text-kind-badge font-normal uppercase text-fg-muted"
        >
          {rule.kind === "deterministic" ? "DET" : "JDG"}
        </Badge>
      </TableCell>
      <TableCell
        className="max-w-0 font-serif text-serif-row text-fg py-1.5 px-2 align-middle truncate"
        title={rule.wording}
      >
        {rule.wording}
      </TableCell>
      <TableCell
        className="w-[220px] max-w-[220px] text-ui text-fg-muted py-1.5 px-2 align-middle truncate"
        title={appliesLabel(rule)}
      >
        {appliesLabel(rule)}
      </TableCell>
      <TableCell className="w-[40px] text-right py-1.5 px-2 align-middle">
        {rule.kind === "deterministic" ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  className="inline-flex cursor-default items-center justify-center text-fg-faint"
                  title="Defined in code"
                >
                  <Lock className="size-[13px] shrink-0" aria-label="Defined in code" />
                </span>
              }
            />
            <TooltipContent>Defined in code — cannot be edited</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            type="button"
            variant="link"
            className="h-auto cursor-pointer p-0 font-sans text-caption text-decision underline hover:text-decision/80"
            onClick={() => onEdit(rule.ruleId)}
          >
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
