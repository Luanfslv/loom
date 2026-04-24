/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { type SseConfig } from './sse';
import type { EvaluationContext, BulkEvaluationResult } from './types';
/**
 * Options for creating a FlagsClient.
 */
export interface FlagsClientOptions {
    /** SDK key for authentication (required) */
    sdkKey: string;
    /** Base URL for the Loom server (required) */
    baseUrl: string;
    /** Timeout for initialization in ms (default: 10000) */
    initTimeoutMs?: number;
    /** Timeout for individual requests in ms (default: 5000) */
    requestTimeoutMs?: number;
    /** Whether to enable SSE streaming (default: true) */
    enableStreaming?: boolean;
    /** SSE configuration */
    sseConfig?: Partial<SseConfig>;
    /** Whether to use offline mode when disconnected (default: true) */
    offlineMode?: boolean;
}
/**
 * Event types emitted by the FlagsClient.
 */
export type FlagsClientEventType = 'flag.updated' | 'flag.archived' | 'flag.restored' | 'killswitch.activated' | 'killswitch.deactivated' | 'connected' | 'disconnected' | 'error';
/**
 * Event handler for FlagsClient events.
 */
export type FlagsClientEventHandler<T = unknown> = (data: T) => void;
/**
 * Client for evaluating feature flags against the Loom server.
 *
 * The client maintains a local cache of flag states and can optionally
 * receive real-time updates via SSE streaming.
 *
 * @example
 * ```typescript
 * const client = new FlagsClient({
 *   sdkKey: 'loom_sdk_client_prod_xxx',
 *   baseUrl: 'https://loom.example.com',
 * });
 *
 * await client.initialize();
 *
 * const enabled = await client.getBool('feature.new_flow', context, false);
 * ```
 */
export declare class FlagsClient {
    private readonly sdkKey;
    private readonly baseUrl;
    private readonly initTimeoutMs;
    private readonly requestTimeoutMs;
    private readonly enableStreaming;
    private readonly sseConfig;
    private readonly offlineMode;
    private readonly httpClient;
    private readonly cache;
    private readonly sseConnection;
    private closed;
    private eventHandlers;
    constructor(options: FlagsClientOptions);
    /**
     * Register an event handler.
     */
    on<T = unknown>(event: FlagsClientEventType, handler: FlagsClientEventHandler<T>): void;
    /**
     * Unregister an event handler.
     */
    off<T = unknown>(event: FlagsClientEventType, handler: FlagsClientEventHandler<T>): void;
    private emit;
    private handleSseEvent;
    /**
     * Initializes the client by fetching current flag states.
     *
     * This must be called before using the client.
     */
    initialize(): Promise<void>;
    /**
     * Evaluates a boolean flag.
     *
     * @param flagKey - The flag key to evaluate
     * @param context - The evaluation context
     * @param defaultValue - Default value if flag is not found or evaluation fails
     * @returns The boolean value of the flag, or the default if not found
     */
    getBool(flagKey: string, context: EvaluationContext, defaultValue: boolean): Promise<boolean>;
    /**
     * Evaluates a string flag.
     *
     * @param flagKey - The flag key to evaluate
     * @param context - The evaluation context
     * @param defaultValue - Default value if flag is not found or evaluation fails
     * @returns The string value of the flag, or the default if not found
     */
    getString(flagKey: string, context: EvaluationContext, defaultValue: string): Promise<string>;
    /**
     * Evaluates a JSON flag.
     *
     * @param flagKey - The flag key to evaluate
     * @param context - The evaluation context
     * @param defaultValue - Default value if flag is not found or evaluation fails
     * @returns The JSON value of the flag, or the default if not found
     */
    getJson<T>(flagKey: string, context: EvaluationContext, defaultValue: T): Promise<T>;
    /**
     * Evaluates all flags for the given context.
     *
     * @param context - The evaluation context
     * @returns A bulk result containing all flag evaluations
     */
    getAll(context: EvaluationContext): Promise<BulkEvaluationResult>;
    /**
     * Returns true if the SSE connection is currently active.
     */
    isStreaming(): boolean;
    /**
     * Returns true if the cache has been initialized.
     */
    isInitialized(): boolean;
    /**
     * Returns the number of cached flags.
     */
    cachedFlagCount(): number;
    /**
     * Closes the client and stops any background tasks.
     */
    close(): void;
    private checkClosed;
    private shouldUseCache;
    private evaluateFlag;
    private evaluateFlagServer;
    private evaluateFlagCached;
    private evaluateAllServer;
    private evaluateAllCached;
}
//# sourceMappingURL=client.d.ts.map