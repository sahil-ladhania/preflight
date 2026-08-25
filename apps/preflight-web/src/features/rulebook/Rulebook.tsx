/**
 * Rulebook — Screen 4 merged table orchestrator.
 * Why: sheet and delete modal wired from useRulebook in RulebookRoute.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { DeleteRuleModal } from "@/features/rulebook/DeleteRuleModal";
import { JudgementSheet } from "@/features/rulebook/JudgementSheet";
import { emptyJudgementForm } from "@/features/rulebook/lib";
import { RulebookPageHeader } from "@/features/rulebook/RulebookPageHeader";
import { RulebookTable } from "@/features/rulebook/RulebookTable";
import type {
  RulebookLoadingStateProps,
  RulebookProps,
} from "@/features/rulebook/types";
import { useRulebook } from "@/features/rulebook/useRulebook";

function LoadingState({ showSpinner }: RulebookLoadingStateProps): ReactElement {
  if (!showSpinner) {
    return <div className="min-h-[calc(100vh-3rem)] bg-canvas-subtle" />;
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
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
  onDeleteRequest,
  onFormChange,
  onSave,
  onCancel,
  onDeleteFromSheet,
  onCloseDelete,
  onConfirmDelete,
  onRetry,
}: RulebookProps): ReactElement {
  if (view === "loading") {
    return <LoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error") {
    return <ErrorState onRetry={onRetry} />;
  }

  const editingRule =
    editingRuleId === null
      ? null
      : (rules.find((rule) => rule.ruleId === editingRuleId) ?? null);

  const handleSave = (): void => {
    if (onSave !== undefined) {
      void onSave();
    }
  };

  const handleConfirmDelete = (): void => {
    if (onConfirmDelete !== undefined) {
      void onConfirmDelete();
    }
  };

  return (
    <div className="bg-canvas-subtle">
      <RulebookPageHeader
        onAdd={() => {
          onAdd?.();
        }}
        postSaveCaption={postSaveCaption}
      />
      <RulebookTable
        rules={rules}
        onEdit={(ruleId) => {
          onEdit?.(ruleId);
        }}
        onDelete={(ruleId) => {
          onDeleteRequest?.(ruleId);
        }}
      />
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
        ruleId={deleteRuleId}
        onClose={() => {
          onCloseDelete?.();
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
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
      onDeleteRequest={hook.onDeleteRequest}
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
