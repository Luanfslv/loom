/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Retry logic with exponential backoff for HTTP requests.
 */
import { HttpError, TimeoutError, NetworkError, RateLimitError } from './errors';
/**
 * Default retry configuration.
 */
export const DEFAULT_RETRY_CONFIG = {
    maxAttempts: 3,
    baseDelayMs: 200,
    maxDelayMs: 5000,
    backoffFactor: 2.0,
    jitter: true
};
/**
 * Type guard to check if an error is retryable.
 */
export function isRetryableError(error) {
    if (error instanceof HttpError) {
        return error.isRetryable();
    }
    if (error instanceof TimeoutError) {
        return true;
    }
    if (error instanceof NetworkError) {
        return true;
    }
    if (error instanceof RateLimitError) {
        return true;
    }
    if (error && typeof error === 'object' && 'isRetryable' in error) {
        return error.isRetryable();
    }
    return false;
}
/**
 * Calculate delay for a retry attempt.
 */
export function calculateDelay(config, attempt) {
    const exponentialDelay = config.baseDelayMs * Math.pow(config.backoffFactor, attempt);
    const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
    if (config.jitter) {
        // Add jitter: multiply by random factor between 0.5 and 1.5
        const jitterFactor = 0.5 + Math.random();
        return cappedDelay * jitterFactor;
    }
    return cappedDelay;
}
/**
 * Sleep for a specified number of milliseconds.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retry an async operation with exponential backoff.
 *
 * @param fn - The async function to retry
 * @param config - Retry configuration (uses defaults if not provided)
 * @returns The result of the function
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * const result = await retry(
 *   () => fetch('https://api.example.com/data'),
 *   { maxAttempts: 5 }
 * );
 * ```
 */
export async function retry(fn, config = {}) {
    const cfg = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError;
    for (let attempt = 0; attempt < cfg.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            // Don't retry non-retryable errors
            if (!isRetryableError(error)) {
                throw error;
            }
            // Don't retry if we've exhausted attempts
            if (attempt >= cfg.maxAttempts - 1) {
                throw error;
            }
            // Calculate and wait for delay
            const delay = calculateDelay(cfg, attempt);
            await sleep(delay);
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry.js.map