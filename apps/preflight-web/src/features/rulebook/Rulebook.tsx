/**
 * Rulebook — Screen 4 merged table orchestrator.
 * Why: sheet and delete modal state co-located here.
 */

import { useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { DeleteRuleModal } from "@/features/rulebook/DeleteRuleModal";
import { JudgementSheet } from "@/features/rulebook/JudgementSheet";
import {
  emptyJudgementForm,
  formFromRule,
  rowFromForm,
  sortCatalogRules,
} from "@/features/rulebook/lib";
import { RulebookPageHeader } from "@/features/rulebook/RulebookPageHeader";
import { RulebookTable } from "@/features/rulebook/RulebookTable";
import type {
  JudgementFormState,
  RulebookProps,
  SheetMode,
} from "@/features/rulebook/types";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

function LoadingState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function ErrorState(): ReactElement {
  const handleRetry = (): void => {
    // Will re-GET /rules.
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load rules.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

export function Rulebook({
  rules: initialRules,
  view = "loaded",
}: RulebookProps): ReactElement {
  const [rules, setRules] = useState<RuleCatalogRowDTO[]>(() =>
    sortCatalogRules(initialRules),
  );
  const [sheetMode, setSheetMode] = useState<SheetMode>("closed");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [form, setForm] = useState<JudgementFormState>(emptyJudgementForm);
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);
  const [postSaveCaption, setPostSaveCaption] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);

  if (view === "loading") {
    return <LoadingState />;
  }

  if (view === "error") {
    return <ErrorState />;
  }

  const editingRule =
    editingRuleId === null
      ? null
      : (rules.find((rule) => rule.ruleId === editingRuleId) ?? null);

  const closeSheet = (): void => {
    setSheetMode("closed");
    setEditingRuleId(null);
    setForm(emptyJudgementForm());
  };

  const handleAdd = (): void => {
    setSheetMode("add");
    setEditingRuleId(null);
    setForm(emptyJudgementForm());
  };

  const handleEdit = (ruleId: string): void => {
    const rule = rules.find((item) => item.ruleId === ruleId);
    if (rule === undefined || rule.kind !== "judgement") {
      return;
    }
    setSheetMode("edit");
    setEditingRuleId(ruleId);
    setForm(formFromRule(rule));
  };

  const handleDeleteRequest = (ruleId: string): void => {
    setDeleteRuleId(ruleId);
  };

  const handleDeleteFromSheet = (): void => {
    if (editingRuleId !== null) {
      setDeleteRuleId(editingRuleId);
    }
  };

  const removeRule = (ruleId: string): void => {
    setRules((current) =>
      sortCatalogRules(current.filter((rule) => rule.ruleId !== ruleId)),
    );
    setPostSaveCaption(true);
    closeSheet();
    setDeleteRuleId(null);
  };

  const handleConfirmDelete = (): void => {
    if (deleteRuleId === null) {
      return;
    }
    // Will DELETE /rules/:id.
    removeRule(deleteRuleId);
  };

  const handleSave = (): void => {
    setSaveInFlight(true);
    if (sheetMode === "add") {
      const ruleId = crypto.randomUUID();
      const row = rowFromForm(ruleId, form);
      if (row === null) {
        setSaveInFlight(false);
        return;
      }
      // Will POST /rules.
      setRules((current) => sortCatalogRules([...current, row]));
      setPostSaveCaption(true);
      closeSheet();
    } else if (sheetMode === "edit" && editingRuleId !== null) {
      const row = rowFromForm(editingRuleId, form);
      if (row === null) {
        setSaveInFlight(false);
        return;
      }
      // Will PATCH /rules/:id.
      setRules((current) =>
        sortCatalogRules(
          current.map((rule) =>
            rule.ruleId === editingRuleId ? row : rule,
          ),
        ),
      );
      setPostSaveCaption(true);
      closeSheet();
    }
    setSaveInFlight(false);
  };

  return (
    <div className="bg-canvas">
      <RulebookPageHeader onAdd={handleAdd} postSaveCaption={postSaveCaption} />
      <RulebookTable
        rules={rules}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />
      <JudgementSheet
        mode={sheetMode}
        rule={editingRule}
        form={form}
        saveInFlight={saveInFlight}
        onFormChange={setForm}
        onSave={handleSave}
        onCancel={closeSheet}
        onDelete={handleDeleteFromSheet}
      />
      <DeleteRuleModal
        ruleId={deleteRuleId}
        onClose={() => setDeleteRuleId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
