/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Configuration for retry behavior.
 */
export interface RetryConfig {
    /** Maximum number of retry attempts (default: 3) */
    maxAttempts: number;
    /** Base delay in milliseconds (default: 200) */
    baseDelayMs: number;
    /** Maximum delay in milliseconds (default: 5000) */
    maxDelayMs: number;
    /** Backoff multiplier (default: 2.0) */
    backoffFactor: number;
    /** Whether to add jitter to delays (default: true) */
    jitter: boolean;
}
/**
 * Default retry configuration.
 */
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
/**
 * Interface for errors that can be retried.
 */
export interface RetryableError {
    isRetryable(): boolean;
}
/**
 * Type guard to check if an error is retryable.
 */
export declare function isRetryableError(error: unknown): boolean;
/**
 * Calculate delay for a retry attempt.
 */
export declare function calculateDelay(config: RetryConfig, attempt: number): number;
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
export declare function retry<T>(fn: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
//# sourceMappingURL=retry.d.ts.map