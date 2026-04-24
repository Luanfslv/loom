/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { CrashClientOptions, CaptureOptions, Breadcrumb, UserContext, Mechanism, IssueLevel } from './types';
/**
 * Crash analytics client for capturing and reporting errors.
 *
 * @example
 * ```typescript
 * const crash = new CrashClient({
 *   baseUrl: 'https://loom.example.com',
 *   project: 'my-app',
 *   release: '1.0.0',
 * });
 *
 * // Install global error handlers
 * crash.installGlobalHandler();
 *
 * // Capture exceptions manually
 * try {
 *   riskyOperation();
 * } catch (error) {
 *   crash.captureException(error);
 * }
 *
 * // Shutdown when done
 * await crash.shutdown();
 * ```
 */
export declare class CrashClient {
    private readonly httpClient;
    private readonly project;
    private readonly release?;
    private readonly dist?;
    private readonly environment;
    private readonly breadcrumbManager;
    private readonly batchConfig;
    private readonly debug;
    private readonly beforeSend?;
    private readonly analytics?;
    private readonly flags?;
    private readonly sessionTracker?;
    private readonly sessionTrackingEnabled;
    private user?;
    private tags;
    private extra;
    private isClosed;
    private globalHandlersInstalled;
    private eventQueue;
    private flushTimer?;
    private readonly useSdkEndpoints;
    constructor(options: CrashClientOptions);
    /**
     * Generate a random distinct ID for anonymous session tracking.
     */
    private generateDistinctId;
    /**
     * Start the periodic flush timer.
     */
    private startFlushTimer;
    /**
     * Stop the periodic flush timer.
     */
    private stopFlushTimer;
    /**
     * Install global error handlers (window.onerror, unhandledrejection).
     * Call this once during application initialization.
     */
    installGlobalHandler(): void;
    /**
     * Capture an exception and send it to the server.
     *
     * @param error - The error to capture
     * @param options - Additional options for the capture
     * @returns The event ID
     */
    captureException(error: unknown, options?: CaptureOptions): string;
    /**
     * Capture a message (without an error object).
     *
     * @param message - The message to capture
     * @param options - Additional options for the capture
     * @returns The event ID
     */
    captureMessage(message: string, options?: CaptureOptions & {
        level?: IssueLevel;
        mechanism?: Mechanism;
    }): string;
    /**
     * Build a crash event from an error.
     */
    private buildEvent;
    /**
     * Add an event to the queue for batching.
     */
    private enqueueEvent;
    /**
     * Add an event to the queue.
     */
    private addToQueue;
    /**
     * Flush all queued events to the server.
     */
    flush(): Promise<void>;
    /**
     * Get the appropriate capture endpoint based on auth type.
     */
    private getCaptureEndpoint;
    /**
     * Send a single event to the server.
     */
    private sendEvent;
    /**
     * Add a breadcrumb.
     *
     * @param breadcrumb - The breadcrumb to add
     */
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    /**
     * Set user context.
     *
     * @param user - The user context to set
     */
    setUser(user: UserContext): void;
    /**
     * Clear user context.
     */
    clearUser(): void;
    /**
     * Set a tag.
     *
     * @param key - Tag key
     * @param value - Tag value
     */
    setTag(key: string, value: string): void;
    /**
     * Remove a tag.
     *
     * @param key - Tag key to remove
     */
    removeTag(key: string): void;
    /**
     * Set extra data.
     *
     * @param key - Extra data key
     * @param value - Extra data value
     */
    setExtra(key: string, value: unknown): void;
    /**
     * Remove extra data.
     *
     * @param key - Extra data key to remove
     */
    removeExtra(key: string): void;
    /**
     * Get all current tags.
     */
    getTags(): Record<string, string>;
    /**
     * Get all current extra data.
     */
    getExtra(): Record<string, unknown>;
    /**
     * Get the number of events in the queue.
     */
    getQueueSize(): number;
    /**
     * Check if the client is closed.
     */
    isClosed_(): boolean;
    /**
     * Shutdown the client, flushing all pending events.
     */
    shutdown(): Promise<void>;
    /**
     * Get the current session ID if session tracking is enabled.
     */
    getSessionId(): string | undefined;
    /**
     * Check if session tracking is enabled and the session is being sampled.
     */
    isSessionSampled(): boolean;
    /**
     * Manually end the current session.
     * A new session will need to be started by creating a new CrashClient.
     */
    endSession(): void;
}
//# sourceMappingURL=client.d.ts.map