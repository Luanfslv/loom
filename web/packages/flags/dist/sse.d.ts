/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * SSE (Server-Sent Events) connection for real-time flag updates.
 *
 * This module manages the SSE connection to the server for receiving
 * real-time updates to flag configurations and kill switch states.
 */
import type { FlagCache } from './cache';
import type { FlagStreamEvent } from './types';
/**
 * Configuration for SSE connection behavior.
 */
export interface SseConfig {
    /** Base delay for reconnection attempts in ms (default: 1000) */
    reconnectBaseDelayMs: number;
    /** Maximum delay for reconnection attempts in ms (default: 30000) */
    reconnectMaxDelayMs: number;
    /** Maximum number of reconnection attempts (0 = unlimited) */
    maxReconnectAttempts: number;
    /** Whether to use exponential backoff for reconnection (default: true) */
    useExponentialBackoff: boolean;
}
/**
 * Default SSE configuration.
 */
export declare const DEFAULT_SSE_CONFIG: SseConfig;
/**
 * Event handler types.
 */
export type SseEventHandler = (event: FlagStreamEvent) => void;
export type SseErrorHandler = (error: Error) => void;
export type SseConnectedHandler = () => void;
export type SseDisconnectedHandler = () => void;
/**
 * Manages an SSE connection for real-time flag updates.
 */
export declare class SseConnection {
    private eventSource;
    private connected;
    private reconnectAttempts;
    private eventsReceived;
    private cache;
    private config;
    private streamUrl;
    private sdkKey;
    private reconnectTimeout;
    private aborted;
    private onEventHandlers;
    private onErrorHandlers;
    private onConnectedHandlers;
    private onDisconnectedHandlers;
    /**
     * Returns true if the SSE connection is currently active.
     */
    isConnected(): boolean;
    /**
     * Returns the number of reconnection attempts since the connection was started.
     */
    getReconnectAttempts(): number;
    /**
     * Returns the number of events received since the connection was started.
     */
    getEventsReceived(): number;
    /**
     * Register an event handler.
     */
    onEvent(handler: SseEventHandler): void;
    /**
     * Register an error handler.
     */
    onError(handler: SseErrorHandler): void;
    /**
     * Register a connected handler.
     */
    onConnected(handler: SseConnectedHandler): void;
    /**
     * Register a disconnected handler.
     */
    onDisconnected(handler: SseDisconnectedHandler): void;
    /**
     * Starts the SSE connection.
     *
     * The connection will automatically reconnect on failure with exponential backoff.
     */
    start(streamUrl: string, sdkKey: string, cache: FlagCache, config?: Partial<SseConfig>): void;
    /**
     * Stops the SSE connection.
     */
    stop(): void;
    private connect;
    private scheduleReconnect;
    private processEvent;
}
//# sourceMappingURL=sse.d.ts.map