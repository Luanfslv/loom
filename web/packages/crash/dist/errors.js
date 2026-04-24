/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Base error class for all crash SDK errors.
 */
export class CrashError extends Error {
    constructor(message, options) {
        super(message, { cause: options?.cause });
        this.name = 'CrashError';
    }
    /**
     * Returns true if the error is retryable.
     */
    isRetryable() {
        return false;
    }
}
/**
 * Error thrown when required configuration is missing.
 */
export class ConfigurationError extends CrashError {
    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }
}
/**
 * Error thrown when the base URL is invalid.
 */
export class InvalidBaseUrlError extends CrashError {
    constructor(message = 'Invalid base URL') {
        super(message);
        this.name = 'InvalidBaseUrlError';
    }
}
/**
 * Error thrown when authentication fails.
 */
export class AuthenticationError extends CrashError {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
/**
 * Error thrown when rate limited.
 */
export class RateLimitedError extends CrashError {
    retryAfterSecs;
    constructor(message = 'Rate limited', retryAfterSecs) {
        super(message);
        this.name = 'RateLimitedError';
        this.retryAfterSecs = retryAfterSecs;
    }
    isRetryable() {
        return true;
    }
}
/**
 * Error thrown when the client is closed.
 */
export class ClientClosedError extends CrashError {
    constructor(message = 'Crash client has been closed') {
        super(message);
        this.name = 'ClientClosedError';
    }
}
/**
 * Error thrown when a capture operation fails.
 */
export class CaptureError extends CrashError {
    exceptionType;
    constructor(exceptionType, message, options) {
        super(message ?? `Failed to capture crash: ${exceptionType}`, options);
        this.name = 'CaptureError';
        this.exceptionType = exceptionType;
    }
    isRetryable() {
        return true;
    }
}
/**
 * Error thrown when stack trace parsing fails.
 */
export class StackParseError extends CrashError {
    constructor(message, options) {
        super(message, options);
        this.name = 'StackParseError';
    }
}
/**
 * Error thrown when a network operation fails.
 */
export class NetworkError extends CrashError {
    constructor(message = 'Network request failed', options) {
        super(message, options);
        this.name = 'NetworkError';
    }
    isRetryable() {
        return true;
    }
}
/**
 * Error thrown when a server returns an error.
 */
export class ServerError extends CrashError {
    statusCode;
    constructor(statusCode, message, options) {
        super(message ?? `Server error: ${statusCode}`, options);
        this.name = 'ServerError';
        this.statusCode = statusCode;
    }
    isRetryable() {
        return this.statusCode >= 500 && this.statusCode < 600;
    }
}
//# sourceMappingURL=errors.js.map