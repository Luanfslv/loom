/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { HttpClient } from '@loom/http';
import type { SessionConfig } from './types';
/**
 * Browser session tracker for tracking user engagement periods.
 *
 * Sessions are used to calculate release health metrics like crash-free rate.
 * The tracker automatically handles:
 * - Session start on initialization
 * - Session end on page unload (beforeunload, pagehide)
 * - Visibility change handling (30 minute timeout)
 * - Error and crash counting
 * - Deterministic sampling based on session ID
 */
export declare class SessionTracker {
    private readonly sessionId;
    private readonly startedAt;
    private readonly config;
    private readonly httpClient;
    private readonly debug;
    private errorCount;
    private crashCount;
    private ended;
    private sampled;
    private endTimeout?;
    private readonly visibilityTimeoutMs;
    private readonly boundBeforeUnload;
    private readonly boundPageHide;
    private readonly boundVisibilityChange;
    constructor(httpClient: HttpClient, config: SessionConfig, options?: {
        debug?: boolean;
    });
    /**
     * Get the session ID.
     */
    getSessionId(): string;
    /**
     * Check if this session is being sampled.
     */
    isSampled(): boolean;
    /**
     * Check if the session has ended.
     */
    isEnded(): boolean;
    /**
     * Get the current error count.
     */
    getErrorCount(): number;
    /**
     * Get the current crash count.
     */
    getCrashCount(): number;
    /**
     * Get the appropriate endpoint path based on config.
     */
    private getStartEndpoint;
    /**
     * Get the appropriate end endpoint path based on config.
     */
    private getEndEndpoint;
    /**
     * Start the session and register event handlers.
     */
    start(): Promise<void>;
    /**
     * Install browser event handlers for automatic session ending.
     */
    private installEventHandlers;
    /**
     * Uninstall browser event handlers.
     */
    private uninstallEventHandlers;
    /**
     * Handle visibility change events.
     * When the page becomes hidden, schedule session end after 30 minutes.
     * When the page becomes visible again, cancel the scheduled end.
     */
    private handleVisibilityChange;
    /**
     * Record a handled error in this session.
     */
    recordError(): void;
    /**
     * Record an unhandled crash in this session.
     */
    recordCrash(): void;
    /**
     * Get the session status based on error/crash counts.
     */
    private getStatus;
    /**
     * End the session.
     *
     * This method is called automatically on page unload, but can also be called manually.
     * Uses sendBeacon for reliability on page unload.
     */
    end(): void;
    /**
     * Build the full URL for the end session endpoint.
     */
    private buildEndSessionUrl;
    /**
     * End the session asynchronously (for use when you can wait for the response).
     */
    endAsync(): Promise<void>;
}
//# sourceMappingURL=session.d.ts.map