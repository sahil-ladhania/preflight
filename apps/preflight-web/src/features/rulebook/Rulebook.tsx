/**
 * Rulebook — Screen 4 merged table orchestrator.
 * Why: sheet and delete modal wired from useRulebook in RulebookRoute.
 */

import { useMemo, useState, type ReactElement } from "react";

import { SearchInput } from "@/components/ui/search-input";
import { DeleteRuleModal } from "@/features/rulebook/DeleteRuleModal";
import { JudgementSheet } from "@/features/rulebook/JudgementSheet";
import { emptyJudgementForm } from "@/features/rulebook/lib";
import { filterCatalogRules } from "@/features/rulebook/rule-search";
import { RulebookShell } from "@/features/rulebook/RulebookShell";
import { LoadingState, StageError } from "@/features/rulebook/RulebookStatus";
import { RulebookTable } from "@/features/rulebook/RulebookTable";
import type { RulebookProps } from "@/features/rulebook/types";
import { useRulebook } from "@/features/rulebook/useRulebook";

export function Rulebook({
  rules,
  view = "loaded",
  showLoadingSpinner = true,
  sheetMode = "closed",
  editingRuleId = null,
  form,
  deleteRuleId = null,
  postSaveCaption = false,
  saveInFlight = false,
  onAdd,
  onEdit,
  onFormChange,
  onSave,
  onCancel,
  onDeleteFromSheet,
  onCloseDelete,
  onConfirmDelete,
  onRetry,
}: RulebookProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");

  const safeRules = Array.isArray(rules) ? rules : [];

  const filteredRules = useMemo(
    () => filterCatalogRules(safeRules, searchQuery),
    [safeRules, searchQuery],
  );

  const editingRule =
    editingRuleId === null
      ? null
      : (safeRules.find((rule) => rule.ruleId === editingRuleId) ?? null);

  const deleteRule =
    deleteRuleId === null
      ? null
      : (safeRules.find((rule) => rule.ruleId === deleteRuleId) ?? null);

  if (view === "loading") {
    return <LoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error") {
    return (
      <RulebookShell
        postSaveCaption={false}
        onAdd={() => {
          onAdd?.();
        }}
      >
        <StageError onRetry={onRetry} />
      </RulebookShell>
    );
  }

  const handleSave = (): void => {
    if (onSave !== undefined) {
      void onSave();
    }
  };

  const handleConfirmDelete = (reason: string): void => {
    if (onConfirmDelete !== undefined) {
      void onConfirmDelete(reason);
    }
  };

  const handleAdd = (): void => {
    onAdd?.();
  };

  return (
    <>
      <RulebookShell
        postSaveCaption={postSaveCaption}
        search={
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search rules…"
            className="w-64"
          />
        }
        onAdd={handleAdd}
      >
        <RulebookTable
          rules={filteredRules}
          onEdit={(ruleId) => {
            onEdit?.(ruleId);
          }}
        />
      </RulebookShell>
      <JudgementSheet
        mode={sheetMode}
        rule={editingRule}
        form={form ?? emptyJudgementForm()}
        saveInFlight={saveInFlight}
        onFormChange={(nextForm) => {
          onFormChange?.(nextForm);
        }}
        onSave={handleSave}
        onCancel={() => {
          onCancel?.();
        }}
        onDelete={() => {
          onDeleteFromSheet?.();
        }}
      />
      <DeleteRuleModal
        rule={deleteRule}
        onClose={() => {
          onCloseDelete?.();
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function RulebookRoute(): ReactElement {
  const hook = useRulebook();

  const handleDeleteFromSheet = (): void => {
    if (hook.editingRuleId !== null) {
      hook.onDeleteRequest(hook.editingRuleId);
    }
  };

  return (
    <Rulebook
      rules={hook.rules}
      view={hook.view}
      showLoadingSpinner={hook.showLoadingSpinner}
      sheetMode={hook.sheetMode}
      editingRuleId={hook.editingRuleId}
      form={hook.form}
      deleteRuleId={hook.deleteRuleId}
      postSaveCaption={hook.postSaveCaption}
      saveInFlight={hook.saveInFlight}
      onAdd={hook.onAdd}
      onEdit={hook.onEdit}
      onFormChange={hook.onFormChange}
      onSave={hook.onSave}
      onCancel={hook.onCancel}
      onDeleteFromSheet={handleDeleteFromSheet}
      onCloseDelete={hook.onCloseDelete}
      onConfirmDelete={hook.onConfirmDelete}
      onRetry={hook.retryLoad}
    />
  );
}
