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
}

export interface RulebookProps {
  rules: RuleCatalogRowDTO[];
  view?: RulebookView;
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
  onConfirm: () => void;
}

export interface RulebookPageHeaderProps {
  onAdd: () => void;
  postSaveCaption: boolean;
}

export interface SheetShellProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}
