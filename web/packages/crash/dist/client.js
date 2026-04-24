/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { HttpClient } from '@loom/http';
import { DEFAULT_BATCH_CONFIG, SDK_NAME, SDK_VERSION } from './types';
import { ConfigurationError, InvalidBaseUrlError } from './errors';
import { BreadcrumbManager } from './breadcrumb';
import { parseStackTrace, getExceptionType, getExceptionValue } from './stacktrace';
import { installGlobalHandlers, uninstallGlobalHandlers } from './global-handler';
import { SessionTracker } from './session';
/**
 * Validate base URL format.
 */
function validateBaseUrl(baseUrl) {
    if (!baseUrl || typeof baseUrl !== 'string') {
        throw new InvalidBaseUrlError('Base URL is required');
    }
    try {
        new URL(baseUrl);
    }
    catch {
        throw new InvalidBaseUrlError(`Invalid base URL: ${baseUrl}`);
    }
}
/**
 * Generate a UUID v4.
 */
function generateEventId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Detect the current platform.
 */
function detectPlatform() {
    if (typeof window !== 'undefined') {
        return 'browser';
    }
    return 'node';
}
/**
 * Get browser context from the current environment.
 */
function getBrowserContext() {
    if (typeof navigator === 'undefined') {
        return undefined;
    }
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = '';
    // Chrome
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    if (chromeMatch) {
        name = 'Chrome';
        version = chromeMatch[1];
    }
    // Firefox
    const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
    if (firefoxMatch) {
        name = 'Firefox';
        version = firefoxMatch[1];
    }
    // Safari
    const safariMatch = userAgent.match(/Version\/(\d+).*Safari/);
    if (safariMatch) {
        name = 'Safari';
        version = safariMatch[1];
    }
    // Edge
    const edgeMatch = userAgent.match(/Edg\/(\d+)/);
    if (edgeMatch) {
        name = 'Edge';
        version = edgeMatch[1];
    }
    return { name, version };
}
/**
 * Get OS context from the current environment.
 */
function getOsContext() {
    if (typeof navigator === 'undefined') {
        return undefined;
    }
    const platform = navigator.platform || '';
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = '';
    if (platform.includes('Win') || userAgent.includes('Windows')) {
        name = 'Windows';
        const match = userAgent.match(/Windows NT (\d+\.\d+)/);
        if (match)
            version = match[1];
    }
    else if (platform.includes('Mac') || userAgent.includes('Macintosh')) {
        name = 'macOS';
        const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
        if (match)
            version = match[1].replace('_', '.');
    }
    else if (platform.includes('Linux') || userAgent.includes('Linux')) {
        name = 'Linux';
    }
    else if (/iPhone|iPad|iPod/.test(userAgent)) {
        name = 'iOS';
        const match = userAgent.match(/OS (\d+_\d+)/);
        if (match)
            version = match[1].replace('_', '.');
    }
    else if (/Android/.test(userAgent)) {
        name = 'Android';
        const match = userAgent.match(/Android (\d+\.\d+)/);
        if (match)
            version = match[1];
    }
    return { name, version };
}
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
export class CrashClient {
    httpClient;
    project;
    release;
    dist;
    environment;
    breadcrumbManager;
    batchConfig;
    debug;
    beforeSend;
    analytics;
    flags;
    sessionTracker;
    sessionTrackingEnabled;
    user;
    tags = {};
    extra = {};
    isClosed = false;
    globalHandlersInstalled = false;
    eventQueue = [];
    flushTimer;
    useSdkEndpoints;
    constructor(options) {
        validateBaseUrl(options.baseUrl);
        if (!options.project) {
            throw new ConfigurationError('Project ID is required');
        }
        this.project = options.project;
        this.release = options.release;
        this.dist = options.dist;
        this.environment = options.environment ?? 'production';
        this.debug = options.debug ?? false;
        this.beforeSend = options.beforeSend;
        this.analytics = options.analytics;
        this.flags = options.flags;
        this.sessionTrackingEnabled = options.sessionTracking ?? false;
        // Use SDK endpoints when API key auth is being used (not user auth token)
        this.useSdkEndpoints = !!options.apiKey && !options.authToken;
        // Create HTTP client
        const headers = {
            'Content-Type': 'application/json'
        };
        if (options.authToken) {
            headers['Authorization'] = `Bearer ${options.authToken}`;
        }
        else if (options.apiKey) {
            headers['X-Crash-Api-Key'] = options.apiKey;
        }
        this.httpClient = new HttpClient({
            baseUrl: options.baseUrl,
            timeoutMs: options.timeoutMs ?? 5000,
            userAgent: `${SDK_NAME}/${SDK_VERSION}`,
            defaultHeaders: headers
        });
        // Initialize breadcrumbs
        this.breadcrumbManager = new BreadcrumbManager(options.maxBreadcrumbs ?? 100);
        // Initialize batch config
        this.batchConfig = {
            ...DEFAULT_BATCH_CONFIG,
            ...options.batch
        };
        // Initialize session tracker if enabled
        if (this.sessionTrackingEnabled) {
            const sessionConfig = {
                projectId: options.project,
                distinctId: options.sessionDistinctId ??
                    options.analytics?.getDistinctId() ??
                    this.generateDistinctId(),
                personId: options.analytics?.getPersonId?.(),
                environment: this.environment,
                release: this.release,
                sampleRate: options.sessionSampleRate ?? 1.0,
                baseUrl: options.baseUrl,
                useSdkEndpoints: this.useSdkEndpoints
            };
            this.sessionTracker = new SessionTracker(this.httpClient, sessionConfig, {
                debug: this.debug
            });
            // Start session asynchronously (don't block construction)
            this.sessionTracker.start().catch((error) => {
                if (this.debug) {
                    console.error('[Crash] Failed to start session:', error);
                }
            });
        }
        // Start flush timer
        this.startFlushTimer();
    }
    /**
     * Generate a random distinct ID for anonymous session tracking.
     */
    generateDistinctId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
     * Start the periodic flush timer.
     */
    startFlushTimer() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flushTimer = setInterval(() => {
            this.flush().catch((error) => {
                if (this.debug) {
                    console.error('[Crash] Flush error:', error);
                }
            });
        }, this.batchConfig.flushIntervalMs);
    }
    /**
     * Stop the periodic flush timer.
     */
    stopFlushTimer() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = undefined;
        }
    }
    /**
     * Install global error handlers (window.onerror, unhandledrejection).
     * Call this once during application initialization.
     */
    installGlobalHandler() {
        if (this.globalHandlersInstalled) {
            return;
        }
        installGlobalHandlers(this);
        this.globalHandlersInstalled = true;
        if (this.debug) {
            console.log('[Crash] Global handlers installed');
        }
    }
    /**
     * Capture an exception and send it to the server.
     *
     * @param error - The error to capture
     * @param options - Additional options for the capture
     * @returns The event ID
     */
    captureException(error, options) {
        if (this.isClosed) {
            if (this.debug) {
                console.warn('[Crash] Client is closed, exception not captured');
            }
            return '';
        }
        // Record error in session tracker
        // If the mechanism indicates this was unhandled, record as crash; otherwise as error
        const isUnhandled = options?.mechanism?.handled === false;
        if (this.sessionTracker) {
            if (isUnhandled) {
                this.sessionTracker.recordCrash();
            }
            else {
                this.sessionTracker.recordError();
            }
        }
        const event = this.buildEvent(error, options);
        return this.enqueueEvent(event);
    }
    /**
     * Capture a message (without an error object).
     *
     * @param message - The message to capture
     * @param options - Additional options for the capture
     * @returns The event ID
     */
    captureMessage(message, options) {
        if (this.isClosed) {
            if (this.debug) {
                console.warn('[Crash] Client is closed, message not captured');
            }
            return '';
        }
        const event = {
            event_id: generateEventId(),
            exception_type: 'Message',
            exception_value: message,
            platform: detectPlatform(),
            level: options?.level ?? 'info',
            mechanism: options?.mechanism,
            timestamp: new Date().toISOString(),
            release: this.release,
            dist: this.dist,
            environment: this.environment,
            user: this.user,
            browser: getBrowserContext(),
            os: getOsContext(),
            tags: { ...this.tags, ...options?.tags },
            extra: { ...this.extra, ...options?.extra },
            breadcrumbs: this.breadcrumbManager.getAll(),
            distinct_id: this.analytics?.getDistinctId(),
            active_flags: this.flags?.getAllFlags(),
            sdk: {
                name: SDK_NAME,
                version: SDK_VERSION
            }
        };
        return this.enqueueEvent(event);
    }
    /**
     * Build a crash event from an error.
     */
    buildEvent(error, options) {
        const exceptionType = getExceptionType(error);
        const exceptionValue = getExceptionValue(error);
        const stacktrace = error instanceof Error ? parseStackTrace(error) : undefined;
        return {
            event_id: generateEventId(),
            exception_type: exceptionType,
            exception_value: exceptionValue,
            stacktrace,
            platform: detectPlatform(),
            level: options?.level ?? 'error',
            mechanism: options?.mechanism,
            timestamp: new Date().toISOString(),
            release: this.release,
            dist: this.dist,
            environment: this.environment,
            user: this.user,
            browser: getBrowserContext(),
            os: getOsContext(),
            tags: { ...this.tags, ...options?.tags },
            extra: { ...this.extra, ...options?.extra },
            breadcrumbs: this.breadcrumbManager.getAll(),
            distinct_id: this.analytics?.getDistinctId(),
            active_flags: this.flags?.getAllFlags(),
            sdk: {
                name: SDK_NAME,
                version: SDK_VERSION
            }
        };
    }
    /**
     * Add an event to the queue for batching.
     */
    enqueueEvent(event) {
        const eventId = event.event_id ?? generateEventId();
        event.event_id = eventId;
        // Apply beforeSend hook
        if (this.beforeSend) {
            const result = this.beforeSend(event);
            if (result === null) {
                if (this.debug) {
                    console.log('[Crash] Event dropped by beforeSend hook');
                }
                return eventId;
            }
            if (result instanceof Promise) {
                result.then((filteredEvent) => {
                    if (filteredEvent) {
                        this.addToQueue(filteredEvent);
                    }
                });
                return eventId;
            }
            event = result;
        }
        this.addToQueue(event);
        if (this.debug) {
            console.log('[Crash] Event captured:', event.exception_type, event.exception_value);
        }
        // Flush immediately if queue is full
        if (this.eventQueue.length >= this.batchConfig.maxBatchSize) {
            this.flush().catch((error) => {
                if (this.debug) {
                    console.error('[Crash] Flush error:', error);
                }
            });
        }
        return eventId;
    }
    /**
     * Add an event to the queue.
     */
    addToQueue(event) {
        this.eventQueue.push(event);
        // Drop oldest if over limit
        while (this.eventQueue.length > this.batchConfig.maxQueueSize) {
            const dropped = this.eventQueue.shift();
            if (this.debug && dropped) {
                console.warn('[Crash] Dropped oldest event due to queue overflow');
            }
        }
    }
    /**
     * Flush all queued events to the server.
     */
    async flush() {
        if (this.eventQueue.length === 0) {
            return;
        }
        const events = this.eventQueue.splice(0, this.batchConfig.maxBatchSize);
        try {
            // Send events one at a time for now
            // TODO: Implement batch endpoint when available
            for (const event of events) {
                await this.sendEvent(event);
            }
        }
        catch (error) {
            // Put events back on queue for retry
            this.eventQueue.unshift(...events);
            throw error;
        }
    }
    /**
     * Get the appropriate capture endpoint based on auth type.
     */
    getCaptureEndpoint() {
        return this.useSdkEndpoints ? '/api/crash/capture/sdk' : '/api/crash/capture';
    }
    /**
     * Send a single event to the server.
     */
    async sendEvent(event) {
        // Add project_id for SDK endpoints
        const payload = this.useSdkEndpoints ? { ...event, project_id: this.project } : event;
        const response = await this.httpClient.postJson(this.getCaptureEndpoint(), payload);
        if (this.debug) {
            console.log('[Crash] Event sent:', response.event_id);
        }
        return response;
    }
    /**
     * Add a breadcrumb.
     *
     * @param breadcrumb - The breadcrumb to add
     */
    addBreadcrumb(breadcrumb) {
        if (this.isClosed) {
            return;
        }
        this.breadcrumbManager.add(breadcrumb);
        if (this.debug) {
            console.log('[Crash] Breadcrumb added:', breadcrumb.category, breadcrumb.message);
        }
    }
    /**
     * Set user context.
     *
     * @param user - The user context to set
     */
    setUser(user) {
        this.user = user;
    }
    /**
     * Clear user context.
     */
    clearUser() {
        this.user = undefined;
    }
    /**
     * Set a tag.
     *
     * @param key - Tag key
     * @param value - Tag value
     */
    setTag(key, value) {
        this.tags[key] = value;
    }
    /**
     * Remove a tag.
     *
     * @param key - Tag key to remove
     */
    removeTag(key) {
        delete this.tags[key];
    }
    /**
     * Set extra data.
     *
     * @param key - Extra data key
     * @param value - Extra data value
     */
    setExtra(key, value) {
        this.extra[key] = value;
    }
    /**
     * Remove extra data.
     *
     * @param key - Extra data key to remove
     */
    removeExtra(key) {
        delete this.extra[key];
    }
    /**
     * Get all current tags.
     */
    getTags() {
        return { ...this.tags };
    }
    /**
     * Get all current extra data.
     */
    getExtra() {
        return { ...this.extra };
    }
    /**
     * Get the number of events in the queue.
     */
    getQueueSize() {
        return this.eventQueue.length;
    }
    /**
     * Check if the client is closed.
     */
    isClosed_() {
        return this.isClosed;
    }
    /**
     * Shutdown the client, flushing all pending events.
     */
    async shutdown() {
        if (this.isClosed) {
            return;
        }
        this.isClosed = true;
        this.stopFlushTimer();
        if (this.globalHandlersInstalled) {
            uninstallGlobalHandlers();
            this.globalHandlersInstalled = false;
        }
        // Flush remaining events
        try {
            await this.flush();
        }
        catch (error) {
            if (this.debug) {
                console.error('[Crash] Failed to flush on shutdown:', error);
            }
        }
        // End session
        if (this.sessionTracker) {
            try {
                await this.sessionTracker.endAsync();
            }
            catch (error) {
                if (this.debug) {
                    console.error('[Crash] Failed to end session on shutdown:', error);
                }
            }
        }
        if (this.debug) {
            console.log('[Crash] Client shutdown');
        }
    }
    /**
     * Get the current session ID if session tracking is enabled.
     */
    getSessionId() {
        return this.sessionTracker?.getSessionId();
    }
    /**
     * Check if session tracking is enabled and the session is being sampled.
     */
    isSessionSampled() {
        return this.sessionTracker?.isSampled() ?? false;
    }
    /**
     * Manually end the current session.
     * A new session will need to be started by creating a new CrashClient.
     */
    endSession() {
        this.sessionTracker?.end();
    }
}
//# sourceMappingURL=client.js.map