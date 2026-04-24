/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Error types for the feature flags SDK.
 */
/**
 * Base error for flags SDK errors.
 */
export declare class FlagsError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    /**
     * Returns true if this error is retryable.
     */
    isRetryable(): boolean;
    /**
     * Returns true if the client should use cached values for this error.
     */
    shouldUseCache(): boolean;
}
/**
 * SDK key is missing or invalid.
 */
export declare class InvalidSdkKeyError extends FlagsError {
    constructor();
}
/**
 * Base URL is missing or invalid.
 */
export declare class InvalidBaseUrlError extends FlagsError {
    constructor();
}
/**
 * Failed to connect to the server.
 */
export declare class ConnectionError extends FlagsError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
    shouldUseCache(): boolean;
}
/**
 * SDK key authentication failed.
 */
export declare class AuthenticationError extends FlagsError {
    constructor();
}
/**
 * Rate limited error.
 */
export declare class RateLimitedError extends FlagsError {
    readonly retryAfterSecs?: number;
    constructor(retryAfterSecs?: number);
    isRetryable(): boolean;
    shouldUseCache(): boolean;
}
/**
 * Client initialization timed out.
 */
export declare class InitializationTimeoutError extends FlagsError {
    constructor();
}
/**
 * Client has been closed.
 */
export declare class ClientClosedError extends FlagsError {
    constructor();
}
/**
 * Flag not found.
 */
export declare class FlagNotFoundError extends FlagsError {
    readonly flagKey: string;
    constructor(flagKey: string);
}
/**
 * Server returned an error response.
 */
export declare class ServerError extends FlagsError {
    readonly statusCode: number;
    readonly body?: string;
    constructor(statusCode: number, message: string, body?: string);
    isRetryable(): boolean;
    shouldUseCache(): boolean;
}
/**
 * SSE connection error.
 */
export declare class SseConnectionError extends FlagsError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * SSE stream error.
 */
export declare class SseStreamError extends FlagsError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Client is offline and no cached data available.
 */
export declare class OfflineNoCacheError extends FlagsError {
    constructor();
}
//# sourceMappingURL=errors.d.ts.map