/**
 * types — rulebook feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ReactNode } from "react";

import type { PredicateSpec, RuleCatalogRowDTO } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

export type RulebookView = "loaded" | "loading" | "error";
export type SheetMode = "closed" | "add" | "edit";

export interface JudgementFormState {
  wording: string;
  field: BriefField;
  op: PredicateSpec["op"];
  valueText: string;
  changeReason: string;
}

export interface RulebookLoadingStateProps {
  showSpinner: boolean;
}

export interface RulebookProps {
  rules: RuleCatalogRowDTO[];
  view?: RulebookView;
  showLoadingSpinner?: boolean;
  sheetMode?: SheetMode;
  editingRuleId?: string | null;
  form?: JudgementFormState;
  deleteRuleId?: string | null;
  postSaveCaption?: boolean;
  saveInFlight?: boolean;
  onAdd?: () => void;
  onEdit?: (ruleId: string) => void;
  onDeleteRequest?: (ruleId: string) => void;
  onFormChange?: (form: JudgementFormState) => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onDeleteFromSheet?: () => void;
  onCloseDelete?: () => void;
  onConfirmDelete?: (reason: string) => Promise<void>;
  onRetry?: () => void;
}

export interface RulebookTableProps {
  rules: RuleCatalogRowDTO[];
  onEdit: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
}

export interface RulebookRowProps {
  rule: RuleCatalogRowDTO;
  onEdit: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
}

export interface JudgementSheetProps {
  mode: SheetMode;
  rule: RuleCatalogRowDTO | null;
  form: JudgementFormState;
  saveInFlight: boolean;
  onFormChange: (form: JudgementFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export interface DeleteRuleModalProps {
  ruleId: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export interface SheetShellProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}
