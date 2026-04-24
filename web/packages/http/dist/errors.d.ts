/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Base error for HTTP-related errors.
 */
export declare class HttpError extends Error {
    readonly statusCode?: number;
    readonly statusText?: string;
    readonly body?: string;
    constructor(message: string, options?: {
        statusCode?: number;
        statusText?: string;
        body?: string;
        cause?: unknown;
    });
    /**
     * Returns true if the error is retryable based on status code.
     */
    isRetryable(): boolean;
}
/**
 * Error thrown when a request times out.
 */
export declare class TimeoutError extends Error {
    readonly timeoutMs: number;
    constructor(message: string, timeoutMs: number);
    isRetryable(): boolean;
}
/**
 * Error thrown when a network error occurs.
 */
export declare class NetworkError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when rate limited (429).
 */
export declare class RateLimitError extends HttpError {
    readonly retryAfterSecs?: number;
    constructor(message: string, options?: {
        retryAfterSecs?: number;
        body?: string;
    });
}
//# sourceMappingURL=errors.d.ts.map