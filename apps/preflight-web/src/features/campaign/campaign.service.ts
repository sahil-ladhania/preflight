/**
 * campaign.service — campaign CRUD and extract/compile/generate HTTP.
 * Why: hooks call services only, never lib/api directly.
 */

import {
  CampaignDTOSchema,
  CompileResponseDTOSchema,
  ExtractorOutputSchema,
  GenerateResponseDTOSchema,
  LatestCampaignResponseSchema,
} from "@preflight/schemas";
import type {
  CampaignDTO,
  CompileResponseDTO,
  CreateCampaignRequest,
  ExtractRequest,
  ExtractorOutput,
  GenerateRequest,
  GenerateResponseDTO,
  LatestCampaignResponse,
  PutBriefRequest,
} from "@preflight/schemas";

import { ApiClientError, apiRequest } from "@/lib/api";

export async function createCampaignService(
  body: CreateCampaignRequest,
  signal: AbortSignal,
): Promise<CampaignDTO> {
  try {
    return await apiRequest("POST", "/campaigns", {
      body,
      signal,
      dataSchema: CampaignDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "createCampaignService failed";
    throw new Error(`createCampaignService: ${message}`, { cause: error });
  }
}

export async function getLatestCampaignIdService(
  signal: AbortSignal,
): Promise<LatestCampaignResponse> {
  try {
    return await apiRequest("GET", "/campaigns/latest", {
      signal,
      dataSchema: LatestCampaignResponseSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "getLatestCampaignIdService failed";
    throw new Error(`getLatestCampaignIdService: ${message}`, { cause: error });
  }
}

export async function getCampaignService(
  id: string,
  signal: AbortSignal,
): Promise<CampaignDTO> {
  try {
    return await apiRequest("GET", `/campaigns/${id}`, {
      signal,
      dataSchema: CampaignDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "getCampaignService failed";
    throw new Error(`getCampaignService(${id}): ${message}`, { cause: error });
  }
}

export async function updateCampaignBriefService(
  id: string,
  body: PutBriefRequest,
  signal: AbortSignal,
): Promise<CampaignDTO> {
  try {
    return await apiRequest("PUT", `/campaigns/${id}/brief`, {
      body,
      signal,
      dataSchema: CampaignDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "updateCampaignBriefService failed";
    throw new Error(`updateCampaignBriefService(${id}): ${message}`, {
      cause: error,
    });
  }
}

export async function extractCampaignBriefService(
  id: string,
  body: ExtractRequest,
  signal: AbortSignal,
): Promise<ExtractorOutput> {
  try {
    return await apiRequest("POST", `/campaigns/${id}/extract`, {
      body,
      signal,
      dataSchema: ExtractorOutputSchema,
      agent: true,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "extractCampaignBriefService failed";
    throw new Error(`extractCampaignBriefService(${id}): ${message}`, {
      cause: error,
    });
  }
}

export async function compileCampaignService(
  id: string,
  signal: AbortSignal,
): Promise<CompileResponseDTO> {
  try {
    return await apiRequest("POST", `/campaigns/${id}/compile`, {
      body: {},
      signal,
      dataSchema: CompileResponseDTOSchema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "compileCampaignService failed";
    throw new Error(`compileCampaignService(${id}): ${message}`, { cause: error });
  }
}

export async function generateCampaignAssetsService(
  id: string,
  body: GenerateRequest,
  signal: AbortSignal,
): Promise<GenerateResponseDTO> {
  try {
    return await apiRequest("POST", `/campaigns/${id}/generate`, {
      body,
      signal,
      dataSchema: GenerateResponseDTOSchema,
      agent: true,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "generateCampaignAssetsService failed";
    throw new Error(`generateCampaignAssetsService(${id}): ${message}`, {
      cause: error,
    });
  }
}
