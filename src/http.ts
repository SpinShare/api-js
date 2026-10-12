import axios from "axios";
import type { ApiResponse } from "./types.js";
import {
    ApiMismatchError,
    ApiStatusError,
    NotFoundError,
    ServerError,
    UnauthenticatedError,
    ValidationError,
} from "./errors.js";

type Params = Record<string, unknown>;

// Every status is handled by checkResponse, so axios must not throw on non-2xx responses.
export const validateStatus = () => true;

export async function getOpen<T>(endpoint: string, params?: Params): Promise<ApiResponse<T>> {
    const response = await axios.get<ApiResponse<T>>(endpoint, {
        params,
        validateStatus,
    });
    checkResponse(response);
    normalizeResponse(response.data.data);

    return response.data;
}

export async function postOpen<T>(endpoint: string, body: Params): Promise<ApiResponse<T>> {
    const response = await axios.post<ApiResponse<T>>(endpoint, body, {
        validateStatus,
    });
    checkResponse(response);
    normalizeResponse(response.data.data);

    return response.data;
}

export async function getConnect<T>(endpoint: string, token: string, params?: Params): Promise<ApiResponse<T>> {
    return getOpen<T>(endpoint, {
        connectToken: token,
        ...params,
    });
}

export async function postConnect<T>(endpoint: string, token: string, body: Params): Promise<ApiResponse<T>> {
    const response = await axios.post<ApiResponse<T>>(endpoint, body, {
        params: {
            connectToken: token,
        },
        validateStatus,
    });
    checkResponse(response);
    normalizeResponse(response.data.data);

    return response.data;
}

/**
 * Renames the legacy `hasExtremeDifficulty` flag of all charts in a response to `hasExpertDifficulty`, since some endpoints only return the legacy name.
 */
export function normalizeResponse(value: unknown): void {
    if (Array.isArray(value)) {
        for (const item of value) normalizeResponse(item);
        return;
    }
    if (typeof value !== "object" || value === null) return;

    const record = value as Record<string, unknown>;
    if ("hasExtremeDifficulty" in record) {
        record.hasExpertDifficulty ??= record.hasExtremeDifficulty;
        delete record.hasExtremeDifficulty;
    }
    for (const child of Object.values(record)) normalizeResponse(child);
}

/**
 * Throws the matching error for a response. The API reports most errors in the `status` field of the body, some (e.g. crashes) only through the HTTP status.
 */
export function checkResponse(response: { status?: number; data: unknown }): void {
    const body = isApiResponse(response.data) ? response.data : undefined;
    const status = body?.status ?? response.status;
    const errorMessage = getErrorMessage(body);

    if(status === 200 || status === 201) {
        if (body?.version !== 1) throw new ApiMismatchError(
            `Unsupported Version: ${body?.version}`
        )
        return;
    }
    if(status === 404) throw new NotFoundError(
        errorMessage ?? `Not Found`
    )
    if(status === 401 || status === 403) throw new UnauthenticatedError(
        errorMessage ?? `Access denied: missing or invalid connect token, API key or DLC hash`
    )
    if(status === 400 || status === 422) throw new ValidationError(
        errorMessage ?? `Invalid request or missing parameter`
    )
    if(status !== undefined && status >= 500) throw new ServerError(
        errorMessage ?? `Internal server error`
    )
    throw new ApiStatusError(
        errorMessage ?? `Unexpected status code: ${status}, expected 200`
    )
}

function isApiResponse(data: unknown): data is Partial<ApiResponse<unknown>> {
    return typeof data === "object" && data !== null && "status" in data;
}

function getErrorMessage(body: Partial<ApiResponse<unknown>> | undefined): string | undefined {
    const data = body?.data;
    if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
        return data.error;
    }
    return undefined;
}
