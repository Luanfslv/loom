/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { BatchConfig, CapturePayload, QueuedEvent } from './types';
/**
 * Interface for sending batches to the server.
 */
export interface BatchSender {
    /**
     * Send a batch of events to the server.
     * Returns true if successful, false otherwise.
     */
    sendBatch(events: CapturePayload[]): Promise<boolean>;
}
/**
 * Event listener for batch processor events.
 */
export type BatchEventListener = {
    /** Called when events are flushed */
    onFlush?: (events: CapturePayload[], success: boolean) => void;
    /** Called when events are dropped due to queue overflow */
    onDrop?: (events: QueuedEvent[]) => void;
    /** Called when an error occurs */
    onError?: (error: Error) => void;
};
/**
 * Batch processor for queuing and flushing events.
 *
 * Events are queued in memory and flushed either:
 * - When the queue reaches maxBatchSize
 * - On a timer interval (flushIntervalMs)
 * - When flush() is called manually
 * - When shutdown() is called
 */
export declare class BatchProcessor {
    private readonly config;
    private readonly sender;
    private readonly listener?;
    private queue;
    private flushTimer;
    private isFlushing;
    private isShutdown;
    constructor(sender: BatchSender, config?: Partial<BatchConfig>, listener?: BatchEventListener);
    /**
     * Start the background flush timer.
     */
    start(): void;
    /**
     * Stop the background flush timer.
     */
    stop(): void;
    /**
     * Add an event to the queue.
     */
    enqueue(payload: CapturePayload): void;
    /**
     * Flush all queued events to the server.
     */
    flush(): Promise<void>;
    /**
     * Shutdown the processor, flushing all remaining events.
     */
    shutdown(): Promise<void>;
    /**
     * Get the number of events currently in the queue.
     */
    getQueueSize(): number;
    /**
     * Check if the processor is running.
     */
    isRunning(): boolean;
    /**
     * Check if the processor has been shutdown.
     */
    hasShutdown(): boolean;
    /**
     * Clear all queued events without sending them.
     */
    clear(): void;
}
//# sourceMappingURL=batch.d.ts.map