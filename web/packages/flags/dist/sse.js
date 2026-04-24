/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { SseConnectionError, SseStreamError } from './errors';
/**
 * Default SSE configuration.
 */
export const DEFAULT_SSE_CONFIG = {
    reconnectBaseDelayMs: 1000,
    reconnectMaxDelayMs: 30000,
    maxReconnectAttempts: 0, // Unlimited
    useExponentialBackoff: true
};
/**
 * Manages an SSE connection for real-time flag updates.
 */
export class SseConnection {
    eventSource = null;
    connected = false;
    reconnectAttempts = 0;
    eventsReceived = 0;
    cache = null;
    config = DEFAULT_SSE_CONFIG;
    streamUrl = '';
    sdkKey = '';
    reconnectTimeout = null;
    aborted = false;
    // Event handlers
    onEventHandlers = [];
    onErrorHandlers = [];
    onConnectedHandlers = [];
    onDisconnectedHandlers = [];
    /**
     * Returns true if the SSE connection is currently active.
     */
    isConnected() {
        return this.connected;
    }
    /**
     * Returns the number of reconnection attempts since the connection was started.
     */
    getReconnectAttempts() {
        return this.reconnectAttempts;
    }
    /**
     * Returns the number of events received since the connection was started.
     */
    getEventsReceived() {
        return this.eventsReceived;
    }
    /**
     * Register an event handler.
     */
    onEvent(handler) {
        this.onEventHandlers.push(handler);
    }
    /**
     * Register an error handler.
     */
    onError(handler) {
        this.onErrorHandlers.push(handler);
    }
    /**
     * Register a connected handler.
     */
    onConnected(handler) {
        this.onConnectedHandlers.push(handler);
    }
    /**
     * Register a disconnected handler.
     */
    onDisconnected(handler) {
        this.onDisconnectedHandlers.push(handler);
    }
    /**
     * Starts the SSE connection.
     *
     * The connection will automatically reconnect on failure with exponential backoff.
     */
    start(streamUrl, sdkKey, cache, config = {}) {
        this.streamUrl = streamUrl;
        this.sdkKey = sdkKey;
        this.cache = cache;
        this.config = { ...DEFAULT_SSE_CONFIG, ...config };
        this.aborted = false;
        this.connect();
    }
    /**
     * Stops the SSE connection.
     */
    stop() {
        this.aborted = true;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.connected = false;
    }
    connect() {
        if (this.aborted)
            return;
        // Note: EventSource doesn't support custom headers directly.
        // We need to pass the SDK key via query parameter or use a polyfill.
        // For browser compatibility, we'll use a query parameter approach.
        const url = new URL(this.streamUrl);
        url.searchParams.set('sdk_key', this.sdkKey);
        try {
            this.eventSource = new EventSource(url.toString());
            this.eventSource.onopen = () => {
                this.connected = true;
                this.reconnectAttempts = 0;
                this.onConnectedHandlers.forEach((h) => h());
            };
            this.eventSource.onmessage = (event) => {
                this.eventsReceived++;
                try {
                    this.processEvent(event.data);
                }
                catch (e) {
                    const error = e instanceof Error ? e : new Error(String(e));
                    this.onErrorHandlers.forEach((h) => h(error));
                }
            };
            this.eventSource.onerror = () => {
                this.connected = false;
                this.eventSource?.close();
                this.eventSource = null;
                this.onDisconnectedHandlers.forEach((h) => h());
                if (!this.aborted) {
                    this.scheduleReconnect();
                }
            };
        }
        catch (e) {
            const error = new SseConnectionError(e instanceof Error ? e.message : String(e));
            this.onErrorHandlers.forEach((h) => h(error));
            this.scheduleReconnect();
        }
    }
    scheduleReconnect() {
        if (this.aborted)
            return;
        // Check max reconnect attempts
        if (this.config.maxReconnectAttempts > 0 &&
            this.reconnectAttempts >= this.config.maxReconnectAttempts) {
            const error = new SseConnectionError('Max reconnection attempts reached');
            this.onErrorHandlers.forEach((h) => h(error));
            return;
        }
        // Calculate backoff delay
        let delay;
        if (this.config.useExponentialBackoff) {
            const factor = Math.pow(2, Math.min(this.reconnectAttempts, 10));
            delay = Math.min(this.config.reconnectBaseDelayMs * factor, this.config.reconnectMaxDelayMs);
        }
        else {
            delay = this.config.reconnectBaseDelayMs;
        }
        this.reconnectAttempts++;
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
        }, delay);
    }
    processEvent(data) {
        if (!data || !this.cache)
            return;
        let event;
        try {
            event = JSON.parse(data);
        }
        catch (e) {
            throw new SseStreamError(`Failed to parse SSE event: ${e}`);
        }
        // Notify handlers
        this.onEventHandlers.forEach((h) => h(event));
        // Update cache based on event type
        switch (event.event) {
            case 'init':
                this.cache.initialize(event.data.flags, event.data.killSwitches);
                break;
            case 'flag.updated':
                this.cache.updateFlagEnabled(event.data.flagKey, event.data.enabled);
                this.cache.updateFlagVariant(event.data.flagKey, event.data.defaultVariant, event.data.defaultValue);
                break;
            case 'flag.archived':
                this.cache.archiveFlag(event.data.flagKey);
                break;
            case 'flag.restored':
                this.cache.restoreFlag(event.data.flagKey, event.data.enabled);
                break;
            case 'killswitch.activated':
                this.cache.activateKillSwitch(event.data.killSwitchKey, event.data.reason);
                break;
            case 'killswitch.deactivated':
                this.cache.deactivateKillSwitch(event.data.killSwitchKey);
                break;
            case 'heartbeat':
                // Just acknowledge the heartbeat
                break;
        }
    }
}
//# sourceMappingURL=sse.js.map