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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ready for compliance desk</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p className="text-body text-fg">
            This asset is ready to hand off to {deskName}. Approval and publishing
            happen outside Preflight — this step only marks your intent to send
            the asset onward.
          </p>
          {exceptionsLine !== null ? (
            <p className="text-caption text-fg-muted">{exceptionsLine}</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm handoff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
