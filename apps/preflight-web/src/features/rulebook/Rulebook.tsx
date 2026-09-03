/**
 * Rulebook — Screen 4 merged table orchestrator.
 * Why: sheet and delete modal wired from useRulebook in RulebookRoute.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { DeleteRuleModal } from "@/features/rulebook/DeleteRuleModal";
import { JudgementSheet } from "@/features/rulebook/JudgementSheet";
import { catalogCounts, emptyJudgementForm } from "@/features/rulebook/lib";
import { RulebookShell } from "@/features/rulebook/RulebookShell";
import { RulebookTable } from "@/features/rulebook/RulebookTable";
import type {
  RulebookLoadingStateProps,
  RulebookProps,
} from "@/features/rulebook/types";
import { useRulebook } from "@/features/rulebook/useRulebook";

function StageSpinner(): ReactElement {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function StageError({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load rules.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

function LoadingState({ showSpinner }: RulebookLoadingStateProps): ReactElement {
  if (!showSpinner) {
    return (
      <RulebookShell postSaveCaption={false} onAdd={() => {}}>
        <div className="min-h-48" />
      </RulebookShell>
    );
  }

  return (
    <RulebookShell postSaveCaption={false} onAdd={() => {}}>
      <StageSpinner />
    </RulebookShell>
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

  const editingRule =
    editingRuleId === null
      ? null
      : (rules.find((rule) => rule.ruleId === editingRuleId) ?? null);

  const counts = catalogCounts(rules);

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
        bindingCount={counts.binding}
        advisoryCount={counts.advisory}
        totalCount={counts.total}
        showEndLine
        onAdd={handleAdd}
      >
        <RulebookTable
          rules={rules}
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
        ruleId={deleteRuleId}
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
