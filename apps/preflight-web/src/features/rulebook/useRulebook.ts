/**
 * useRulebook — Rulebook fetch and writes.
 * Why: GET /rules; POST/PATCH/DELETE judgement.
 */
// size: full CRUD + load/retry in one hook; split would duplicate sheet state wiring

import { useCallback, useEffect, useRef, useState } from "react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import {
  createRequestFromForm,
  emptyJudgementForm,
  formFromRule,
  sortCatalogRules,
  updateRequestFromForm,
} from "@/features/rulebook/lib";
import {
  createJudgementRuleService,
  deleteJudgementRuleService,
  getRulesService,
  updateJudgementRuleService,
} from "@/features/rulebook/rulebook.service";
import type {
  JudgementFormState,
  RulebookView,
  SheetMode,
} from "@/features/rulebook/types";
import { useDelayedLoading } from "@/features/shell/useDelayedLoading";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useRulebook(): {
  rules: RuleCatalogRowDTO[];
  view: RulebookView;
  showLoadingSpinner: boolean;
  sheetMode: SheetMode;
  editingRuleId: string | null;
  form: JudgementFormState;
  deleteRuleId: string | null;
  postSaveCaption: boolean;
  saveInFlight: boolean;
  onAdd: () => void;
  onEdit: (ruleId: string) => void;
  onDeleteRequest: (ruleId: string) => void;
  onFormChange: (form: JudgementFormState) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onConfirmDelete: () => Promise<void>;
  onCloseDelete: () => void;
  retryLoad: () => void;
} {
  const { enqueue } = useToastContext();
  const [rules, setRules] = useState<RuleCatalogRowDTO[]>([]);
  const [view, setView] = useState<RulebookView>("loading");
  const [sheetMode, setSheetMode] = useState<SheetMode>("closed");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [form, setForm] = useState<JudgementFormState>(emptyJudgementForm);
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);
  const [postSaveCaption, setPostSaveCaption] = useState<boolean>(false);
  const [saveInFlight, setSaveInFlight] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const showLoadingSpinner = useDelayedLoading(view === "loading");

  const load = useCallback(async (): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await getRulesService(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setRules(sortCatalogRules(data.rules));
      setView("loaded");
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      setView("error");
    }
  }, []);

  useEffect(() => {
    setView("loading");
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const closeSheet = useCallback((): void => {
    setSheetMode("closed");
    setEditingRuleId(null);
    setForm(emptyJudgementForm());
  }, []);

  const toastApiError = useCallback(
    (error: unknown): void => {
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      if (error instanceof ApiClientError) {
        enqueue(error.apiError ?? error.message);
        return;
      }
      if (error instanceof Error) {
        enqueue(error.message);
      }
    },
    [enqueue],
  );

  const onAdd = useCallback((): void => {
    setSheetMode("add");
    setEditingRuleId(null);
    setForm(emptyJudgementForm());
  }, []);

  const onEdit = useCallback(
    (ruleId: string): void => {
      const rule = rules.find((item) => item.ruleId === ruleId);
      if (rule === undefined || rule.kind !== "judgement") {
        return;
      }
      setSheetMode("edit");
      setEditingRuleId(ruleId);
      setForm(formFromRule(rule));
    },
    [rules],
  );

  const onDeleteRequest = useCallback((ruleId: string): void => {
    setDeleteRuleId(ruleId);
  }, []);

  const onFormChange = useCallback((nextForm: JudgementFormState): void => {
    setForm(nextForm);
  }, []);

  const onCancel = closeSheet;

  const onCloseDelete = useCallback((): void => {
    setDeleteRuleId(null);
  }, []);

  const onSave = useCallback(async (): Promise<void> => {
    const controller = new AbortController();
    setSaveInFlight(true);

    try {
      if (sheetMode === "add") {
        const body = createRequestFromForm(form);
        if (body === null) {
          return;
        }
        const row = await createJudgementRuleService(body, controller.signal);
        setRules((current) => sortCatalogRules([...current, row]));
        setPostSaveCaption(true);
        closeSheet();
        return;
      }

      if (sheetMode === "edit" && editingRuleId !== null) {
        const body = updateRequestFromForm(form);
        if (body === null) {
          return;
        }
        const row = await updateJudgementRuleService(
          editingRuleId,
          body,
          controller.signal,
        );
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
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setSaveInFlight(false);
    }
  }, [closeSheet, editingRuleId, form, sheetMode, toastApiError]);

  const onConfirmDelete = useCallback(async (): Promise<void> => {
    if (deleteRuleId === null) {
      return;
    }

    const controller = new AbortController();

    try {
      await deleteJudgementRuleService(deleteRuleId, controller.signal);
      setRules((current) =>
        sortCatalogRules(
          current.filter((rule) => rule.ruleId !== deleteRuleId),
        ),
      );
      setPostSaveCaption(true);
      closeSheet();
      setDeleteRuleId(null);
    } catch (error: unknown) {
      toastApiError(error);
    }
  }, [closeSheet, deleteRuleId, toastApiError]);

  const retryLoad = useCallback((): void => {
    setView("loading");
    void load();
  }, [load]);

  return {
    rules,
    view,
    showLoadingSpinner,
    sheetMode,
    editingRuleId,
    form,
    deleteRuleId,
    postSaveCaption,
    saveInFlight,
    onAdd,
    onEdit,
    onDeleteRequest,
    onFormChange,
    onSave,
    onCancel,
    onConfirmDelete,
    onCloseDelete,
    retryLoad,
  };
}
