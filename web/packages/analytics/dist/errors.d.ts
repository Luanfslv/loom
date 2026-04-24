/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Base error class for all analytics SDK errors.
 */
export declare class AnalyticsError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
    /**
     * Returns true if the error is retryable.
     */
    isRetryable(): boolean;
}
/**
 * Error thrown when the API key is invalid.
 */
export declare class InvalidApiKeyError extends AnalyticsError {
    constructor(message?: string);
}
/**
 * Error thrown when the base URL is invalid.
 */
export declare class InvalidBaseUrlError extends AnalyticsError {
    constructor(message?: string);
}
/**
 * Error thrown when authentication fails.
 */
export declare class AuthenticationError extends AnalyticsError {
    constructor(message?: string);
}
/**
 * Error thrown when rate limited.
 */
export declare class RateLimitedError extends AnalyticsError {
    readonly retryAfterSecs?: number;
    constructor(message?: string, retryAfterSecs?: number);
    isRetryable(): boolean;
}
/**
 * Error thrown when the client is closed.
 */
export declare class ClientClosedError extends AnalyticsError {
    constructor(message?: string);
}
/**
 * Error thrown when a capture operation fails.
 */
export declare class CaptureError extends AnalyticsError {
    readonly eventName: string;
    constructor(eventName: string, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when an identify operation fails.
 */
export declare class IdentifyError extends AnalyticsError {
    readonly distinctId: string;
    readonly userId: string;
    constructor(distinctId: string, userId: string, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when storage operations fail.
 */
export declare class StorageError extends AnalyticsError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/**
 * Error thrown when event validation fails.
 */
export declare class ValidationError extends AnalyticsError {
    readonly field: string;
    constructor(field: string, message: string);
}
/**
 * Error thrown when a network operation fails.
 */
export declare class NetworkError extends AnalyticsError {
    constructor(message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when a server returns an error.
 */
export declare class ServerError extends AnalyticsError {
    readonly statusCode: number;
    constructor(statusCode: number, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
//# sourceMappingURL=errors.d.ts.map