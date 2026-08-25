/**
 * ComplianceDeskModal — approval handoff confirmation (doc 19 §5.9).
 * Why: shape-only next step; no ship endpoint.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ComplianceDeskModalProps {
  open: boolean;
  clientName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ComplianceDeskModal({
  open,
  clientName,
  onClose,
  onConfirm,
}: ComplianceDeskModalProps): ReactElement {
  const deskName = `${clientName} Compliance`;

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
        <p className="text-body text-fg">
          This asset is ready to hand off to {deskName}. Approval and publishing
          happen outside Preflight — this step only marks your intent to send
          the asset onward.
        </p>
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
