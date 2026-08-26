/**
 * assets.service — assets and findings HTTP.
 * Why: hooks call services only, never lib/api directly.
 */

import {
  AssetDetailDTOSchema,
  AssetsListResponseSchema,
  ComplianceReportDTOSchema,
  FindingMutationResponseDTOSchema,
  RerunStripDTOSchema,
} from "@preflight/schemas";
import type {
  AssetDetailDTO,
  AssetsListResponse,
  ComplianceReportDTO,
  DecideRequest,
  FindingMutationResponseDTO,
  RerunStripDTO,
  WaiveRequest,
} from "@preflight/schemas";

import { ApiClientError, apiRequest } from "@/lib/api";

export async function getAssetsService(
  signal: AbortSignal,
): Promise<AssetsListResponse> {
  try {
    return await apiRequest("GET", "/assets", {
      signal,
      dataSchema: AssetsListResponseSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "getAssetsService failed";
    throw new Error(`getAssetsService: ${message}`, { cause: error });
  }
}

export async function getAssetDetailService(
  id: string,
  signal: AbortSignal,
): Promise<AssetDetailDTO> {
  try {
    return await apiRequest("GET", `/assets/${id}`, {
      signal,
      dataSchema: AssetDetailDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "getAssetDetailService failed";
    throw new Error(`getAssetDetailService(${id}): ${message}`, { cause: error });
  }
}

export async function getAssetReportService(
  id: string,
  signal: AbortSignal,
): Promise<ComplianceReportDTO> {
  try {
    return await apiRequest("GET", `/assets/${id}/report`, {
      signal,
      dataSchema: ComplianceReportDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "getAssetReportService failed";
    throw new Error(`getAssetReportService(${id}): ${message}`, { cause: error });
  }
}

export async function rerunAssetService(
  id: string,
  signal: AbortSignal,
): Promise<RerunStripDTO> {
  try {
    return await apiRequest("POST", `/assets/${id}/rerun`, {
      signal,
      dataSchema: RerunStripDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "rerunAssetService failed";
    throw new Error(`rerunAssetService(${id}): ${message}`, { cause: error });
  }
}

export async function waiveFindingService(
  id: string,
  body: WaiveRequest,
  signal: AbortSignal,
): Promise<FindingMutationResponseDTO> {
  try {
    return await apiRequest("POST", `/findings/${id}/waive`, {
      body,
      signal,
      dataSchema: FindingMutationResponseDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "waiveFindingService failed";
    throw new Error(`waiveFindingService(${id}): ${message}`, { cause: error });
  }
}

export async function decideFindingService(
  id: string,
  body: DecideRequest,
  signal: AbortSignal,
): Promise<FindingMutationResponseDTO> {
  try {
    return await apiRequest("POST", `/findings/${id}/decide`, {
      body,
      signal,
      dataSchema: FindingMutationResponseDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "decideFindingService failed";
    throw new Error(`decideFindingService(${id}): ${message}`, { cause: error });
  }
}

export async function retryFindingService(
  id: string,
  signal: AbortSignal,
): Promise<FindingMutationResponseDTO> {
  try {
    return await apiRequest("POST", `/findings/${id}/retry`, {
      body: {},
      signal,
      dataSchema: FindingMutationResponseDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "retryFindingService failed";
    throw new Error(`retryFindingService(${id}): ${message}`, { cause: error });
  }
}
