/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { type RetryConfig } from './retry';
/**
 * Options for creating an HttpClient.
 */
export interface HttpClientOptions {
    /** Base URL for all requests */
    baseUrl?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeoutMs?: number;
    /** Custom User-Agent string (default: loom-sdk/{version}) */
    userAgent?: string;
    /** Retry configuration */
    retryConfig?: Partial<RetryConfig>;
    /** Default headers to include in all requests */
    defaultHeaders?: Record<string, string>;
}
/**
 * Options for individual requests.
 */
export interface RequestOptions {
    /** Request headers */
    headers?: Record<string, string>;
    /** Request timeout in milliseconds */
    timeoutMs?: number;
    /** Whether to retry on failure (default: true) */
    retry?: boolean;
    /** Retry configuration for this request */
    retryConfig?: Partial<RetryConfig>;
    /** AbortSignal for cancellation */
    signal?: AbortSignal;
}
/**
 * HTTP client with retry, timeout, and User-Agent support.
 *
 * @example
 * ```typescript
 * const client = new HttpClient({
 *   baseUrl: 'https://api.example.com',
 *   timeoutMs: 5000,
 * });
 *
 * const response = await client.get('/users');
 * const user = await client.post('/users', { name: 'Alice' });
 * ```
 */
export declare class HttpClient {
    private readonly baseUrl;
    private readonly timeoutMs;
    private readonly userAgent;
    private readonly retryConfig;
    private readonly defaultHeaders;
    constructor(options?: HttpClientOptions);
    private getVersion;
    /**
     * Build full URL from path.
     */
    private buildUrl;
    /**
     * Build headers for a request.
     */
    private buildHeaders;
    /**
     * Execute a fetch request with timeout.
     */
    private fetchWithTimeout;
    /**
     * Process response and throw appropriate errors.
     */
    private processResponse;
    /**
     * Execute a request with optional retry.
     */
    private request;
    /**
     * Make a GET request.
     */
    get(path: string, options?: RequestOptions): Promise<Response>;
    /**
     * Make a POST request.
     */
    post(path: string, body?: unknown, options?: RequestOptions): Promise<Response>;
    /**
     * Make a PUT request.
     */
    put(path: string, body?: unknown, options?: RequestOptions): Promise<Response>;
    /**
     * Make a PATCH request.
     */
    patch(path: string, body?: unknown, options?: RequestOptions): Promise<Response>;
    /**
     * Make a DELETE request.
     */
    delete(path: string, options?: RequestOptions): Promise<Response>;
    /**
     * Make a GET request and parse JSON response.
     */
    getJson<T>(path: string, options?: RequestOptions): Promise<T>;
    /**
     * Make a POST request and parse JSON response.
     */
    postJson<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    /**
     * Make a PUT request and parse JSON response.
     */
    putJson<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    /**
     * Make a PATCH request and parse JSON response.
     */
    patchJson<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    /**
     * Make a DELETE request and parse JSON response.
     */
    deleteJson<T>(path: string, options?: RequestOptions): Promise<T>;
}
//# sourceMappingURL=client.d.ts.map