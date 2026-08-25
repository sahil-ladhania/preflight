/**
 * api — axios instance with baseURL '/api'.
 * Why: single client parse point for ApiResponse from schemas.
 */

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  apiErrorSchema,
  parseApiResponse,
} from "@preflight/schemas";

type ApiDataSchema = Parameters<typeof parseApiResponse>[0];

export type ApiErrorKind =
  | "validation"
  | "not_found"
  | "server"
  | "network"
  | "abort";

export class ApiClientError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly apiError: string | null;

  constructor(
    message: string,
    kind: ApiErrorKind,
    status: number | null,
    apiError: string | null,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.kind = kind;
    this.status = status;
    this.apiError = apiError;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (import.meta.env.DEV) {
    const method = config.method?.toUpperCase() ?? "GET";
    console.info(`${method} ${config.url ?? ""}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (import.meta.env.DEV && error instanceof AxiosError && error.response) {
      console.error(`HTTP ${error.response.status} ${error.config?.url ?? ""}`);
    }
    throw error;
  },
);

function parseEnvelopeError(data: unknown): string | null {
  const parsed = apiErrorSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data.error;
  }
  return null;
}

function mapAxiosError(
  error: AxiosError,
  method: string,
  path: string,
): ApiClientError {
  const operation = `Failed to request ${method} ${path}`;

  if (!error.response) {
    return new ApiClientError(operation, "network", null, null);
  }

  const status = error.response.status;
  const apiError = parseEnvelopeError(error.response.data);

  if (status === 400) {
    return new ApiClientError(
      apiError ?? operation,
      "validation",
      400,
      apiError,
    );
  }

  if (status === 404) {
    return new ApiClientError(
      apiError ?? operation,
      "not_found",
      404,
      apiError,
    );
  }

  if (status >= 500) {
    return new ApiClientError(
      apiError ?? operation,
      "server",
      status,
      apiError,
    );
  }

  return new ApiClientError(
    apiError ?? operation,
    "server",
    status,
    apiError,
  );
}

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  options: {
    body?: unknown;
    signal?: AbortSignal;
    dataSchema: ApiDataSchema;
  },
): Promise<T> {
  const operation = `Failed to request ${method} ${path}`;

  try {
    const response = await apiClient.request({
      method,
      url: path,
      data: options.body,
      signal: options.signal,
    });

    const envelope = parseApiResponse(options.dataSchema).safeParse(
      response.data,
    );

    if (!envelope.success) {
      throw new ApiClientError(operation, "server", response.status, null);
    }

    if (!envelope.data.success) {
      throw new ApiClientError(
        envelope.data.error,
        "server",
        response.status,
        envelope.data.error,
      );
    }

    return envelope.data.data;
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (axios.isCancel(error)) {
      throw new ApiClientError(operation, "abort", null, null);
    }

    if (error instanceof AxiosError) {
      throw mapAxiosError(error, method, path);
    }

    throw new ApiClientError(operation, "server", null, null);
  }
}
