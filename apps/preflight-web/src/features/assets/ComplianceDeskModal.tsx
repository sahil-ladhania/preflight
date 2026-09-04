/**
 * ComplianceDeskModal — approval handoff confirmation (doc 19 §5.9).
 * Why: shape-only next step; no ship endpoint.
 */

import type { AssetStatus, ExceptionItemDTO } from "@preflight/schemas";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildComplianceDeskExceptionsLine,
  complianceDeskName,
} from "@/features/assets/lib";

export interface ComplianceDeskModalProps {
  open: boolean;
  clientName: string;
  status: AssetStatus;
  exceptions: ExceptionItemDTO[];
  onClose: () => void;
  onConfirm: () => void;
}

export function ComplianceDeskModal({
  open,
  clientName,
  status,
  exceptions,
  onClose,
  onConfirm,
}: ComplianceDeskModalProps): ReactElement {
  const deskName = complianceDeskName(clientName);
  const exceptionsLine = buildComplianceDeskExceptionsLine(status, exceptions);

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-full max-w-[480px] gap-5 rounded-none border border-fg bg-surface p-7 text-fg shadow-none ring-0 duration-0 data-open:animate-none data-closed:animate-none"
        overlayClassName="bg-[rgba(28,26,23,0.5)] backdrop-blur-none duration-0 data-open:animate-none data-closed:animate-none"
      >
        <DialogHeader className="gap-1">
          <DialogTitle className="font-serif text-sheet-title font-semibold text-fg">
            Ready for compliance desk
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-1">
          <p className="font-sans text-body leading-relaxed text-fg">
            This asset is ready to hand off to{" "}
            <span className="font-semibold text-fg">{deskName}</span>. Approval and
            publishing happen outside Preflight — this step only marks your intent
            to send the asset onward.
          </p>
          {exceptionsLine !== null ? (
            <div className="border-l-2 border-decision bg-decision-wash px-3 py-2">
              <p className="font-sans text-caption font-medium text-decision">
                {exceptionsLine}
              </p>
            </div>
          ) : null}
        </div>
        <DialogFooter className="mx-0 mb-0 mt-2 flex flex-row justify-end gap-2.5 border-0 bg-transparent p-0">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-none border-hairline bg-surface px-4 font-sans text-button font-medium text-fg hover:bg-hover cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-8 rounded-none border border-primary bg-primary px-4 font-sans text-button font-medium text-primary-foreground hover:bg-primary-hover cursor-pointer shadow-xs"
            onClick={onConfirm}
          >
            Confirm handoff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
