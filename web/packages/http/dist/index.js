/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Shared HTTP utilities for Loom TypeScript SDKs.
 *
 * This package provides:
 * - A pre-configured HTTP client with consistent User-Agent header
 * - Retry logic with exponential backoff for transient failures
 */
export { HttpClient } from './client';
export { retry, isRetryableError } from './retry';
export { HttpError, TimeoutError, NetworkError, RateLimitError } from './errors';
//# sourceMappingURL=index.js.map