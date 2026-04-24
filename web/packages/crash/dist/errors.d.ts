/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Base error class for all crash SDK errors.
 */
export declare class CrashError extends Error {
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
export declare class ConfigurationError extends CrashError {
    constructor(message: string);
}
/**
 * Error thrown when the base URL is invalid.
 */
export declare class InvalidBaseUrlError extends CrashError {
    constructor(message?: string);
}
/**
 * Error thrown when authentication fails.
 */
export declare class AuthenticationError extends CrashError {
    constructor(message?: string);
}
/**
 * Error thrown when rate limited.
 */
export declare class RateLimitedError extends CrashError {
    readonly retryAfterSecs?: number;
    constructor(message?: string, retryAfterSecs?: number);
    isRetryable(): boolean;
}
/**
 * Error thrown when the client is closed.
 */
export declare class ClientClosedError extends CrashError {
    constructor(message?: string);
}
/**
 * Error thrown when a capture operation fails.
 */
export declare class CaptureError extends CrashError {
    readonly exceptionType: string;
    constructor(exceptionType: string, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when stack trace parsing fails.
 */
export declare class StackParseError extends CrashError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/**
 * Error thrown when a network operation fails.
 */
export declare class NetworkError extends CrashError {
    constructor(message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
/**
 * Error thrown when a server returns an error.
 */
export declare class ServerError extends CrashError {
    readonly statusCode: number;
    constructor(statusCode: number, message?: string, options?: {
        cause?: unknown;
    });
    isRetryable(): boolean;
}
//# sourceMappingURL=errors.d.ts.map