/**
 * rulebook.service — rules catalog CRUD HTTP.
 * Why: hooks call services only, never lib/api directly.
 */

import {
  RetryRequestSchema,
  RuleCatalogRowDTOSchema,
  RulesListResponseSchema,
} from "@preflight/schemas";
import type {
  CreateJudgementRuleRequest,
  DeleteJudgementRuleRequest,
  RuleCatalogRowDTO,
  RulesListResponse,
  UpdateJudgementRuleRequest,
} from "@preflight/schemas";

import { ApiClientError, apiRequest } from "@/lib/api";

export async function getRulesService(
  signal: AbortSignal,
): Promise<RulesListResponse> {
  try {
    return await apiRequest("GET", "/rules", {
      signal,
      dataSchema: RulesListResponseSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "getRulesService failed";
    throw new Error(`getRulesService: ${message}`, { cause: error });
  }
}

export async function createJudgementRuleService(
  body: CreateJudgementRuleRequest,
  signal: AbortSignal,
): Promise<RuleCatalogRowDTO> {
  try {
    return await apiRequest("POST", "/rules", {
      body,
      signal,
      dataSchema: RuleCatalogRowDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "createJudgementRuleService failed";
    throw new Error(`createJudgementRuleService: ${message}`, { cause: error });
  }
}

export async function updateJudgementRuleService(
  id: string,
  body: UpdateJudgementRuleRequest,
  signal: AbortSignal,
): Promise<RuleCatalogRowDTO> {
  try {
    return await apiRequest("PATCH", `/rules/${id}`, {
      body,
      signal,
      dataSchema: RuleCatalogRowDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "updateJudgementRuleService failed";
    throw new Error(`updateJudgementRuleService(${id}): ${message}`, {
      cause: error,
    });
  }
}

export async function deleteJudgementRuleService(
  id: string,
  body: DeleteJudgementRuleRequest,
  signal: AbortSignal,
): Promise<Record<string, never>> {
  try {
    return await apiRequest("DELETE", `/rules/${id}`, {
      body,
      signal,
      dataSchema: RetryRequestSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "deleteJudgementRuleService failed";
    throw new Error(`deleteJudgementRuleService(${id}): ${message}`, {
      cause: error,
    });
  }
}
