/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Base error class for all crons SDK errors.
 */
export declare class CronsError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    /**
     * Returns true if the error is retryable.
     */
    isRetryable(): boolean;
}
/**
 * Error thrown when required configuration is missing.
 */
export declare class ConfigurationError extends CronsError {
    constructor(message: string);
}
/**
 * Error thrown when the base URL is invalid.
 */
export declare class InvalidBaseUrlError extends CronsError {
    constructor(message?: string);
}
/**
 * Error thrown when authentication fails.
 */
export declare class AuthenticationError extends CronsError {
    constructor(message?: string);
}
/**
 * Error thrown when rate limited.
 */
export declare class RateLimitedError extends CronsError {
    readonly retryAfterSecs?: number;
    constructor(message?: string, retryAfterSecs?: number);
    isRetryable(): boolean;
}
/**
 * Error thrown when the client is closed.
 */
export declare class ClientClosedError extends CronsError {
    constructor(message?: string);
}
/**
 * Error thrown when a check-in operation fails.
 */
export declare class CheckInError extends CronsError {
    readonly monitorSlug: string;
    constructor(monitorSlug: string, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when a monitor is not found.
 */
export declare class MonitorNotFoundError extends CronsError {
    readonly monitorSlug: string;
    constructor(monitorSlug: string, message?: string);
}
/**
 * Error thrown when a network operation fails.
 */
export declare class NetworkError extends CronsError {
    constructor(message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when a server returns an error.
 */
export declare class ServerError extends CronsError {
    readonly statusCode: number;
    constructor(statusCode: number, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when a job execution fails within withMonitor.
 */
export declare class JobFailedError extends CronsError {
    readonly monitorSlug: string;
    readonly originalError: unknown;
    constructor(monitorSlug: string, originalError: unknown);
}
//# sourceMappingURL=errors.d.ts.map