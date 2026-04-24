/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { AnalyticsClientOptions, CapturePayload, EventProperties, PersonProperties } from './types';
import { type BatchSender } from './batch';
/**
 * Analytics client for tracking events, identifying users, and managing identity.
 *
 * @example
 * ```typescript
 * const analytics = new AnalyticsClient({
 *   apiKey: 'loom_analytics_write_xxx',
 *   baseUrl: 'https://loom.example.com',
 * });
 *
 * // Track an event
 * analytics.capture('button_clicked', { button_name: 'checkout' });
 *
 * // Identify a user
 * analytics.identify('user@example.com', { plan: 'pro' });
 *
 * // On logout
 * analytics.reset();
 * ```
 */
export declare class AnalyticsClient implements BatchSender {
    private readonly apiKey;
    private readonly httpClient;
    private readonly distinctIdManager;
    private readonly batchProcessor;
    private readonly autocaptureConfig;
    private readonly debug;
    private isClosed;
    private pageviewHandler?;
    private pageleaveHandler?;
    constructor(options: AnalyticsClientOptions);
    /**
     * Setup autocapture event handlers.
     */
    private setupAutocapture;
    /**
     * Capture a $pageview event.
     */
    private capturePageview;
    /**
     * Remove autocapture event handlers.
     */
    private teardownAutocapture;
    /**
     * Capture an event.
     *
     * @param event - The event name (e.g., "button_clicked")
     * @param properties - Optional event properties
     */
    capture(event: string, properties?: EventProperties): void;
    /**
     * Identify a user, linking the current anonymous distinct_id to a user ID.
     *
     * @param userId - The user's real identifier (email, user_id, etc.)
     * @param properties - Optional person properties to set
     */
    identify(userId: string, properties?: PersonProperties): Promise<void>;
    /**
     * Alias two distinct_ids together.
     *
     * @param alias - The secondary identity to link to the current distinct_id
     */
    alias(alias: string): Promise<void>;
    /**
     * Set person properties.
     *
     * @param properties - Properties to set on the person
     */
    set(properties: PersonProperties): Promise<void>;
    /**
     * Reset the identity, generating a new anonymous distinct_id.
     * Use this when a user logs out.
     */
    reset(): void;
    /**
     * Get the current distinct_id.
     */
    getDistinctId(): string;
    /**
     * Manually flush all queued events.
     */
    flush(): Promise<void>;
    /**
     * Shutdown the client, flushing all pending events.
     */
    shutdown(): Promise<void>;
    /**
     * Check if the client has been closed.
     */
    isClosed_(): boolean;
    /**
     * Get the number of events in the queue.
     */
    getQueueSize(): number;
    /**
     * Send a batch of events to the server.
     * Implements the BatchSender interface.
     */
    sendBatch(events: CapturePayload[]): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map