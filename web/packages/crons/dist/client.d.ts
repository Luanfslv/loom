/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { CronsClientOptions, CheckInOk, CheckInError } from './types';
/**
 * Cron monitoring client for tracking scheduled job execution.
 *
 * @example
 * ```typescript
 * const crons = new CronsClient({
 *   baseUrl: 'https://loom.example.com',
 *   orgId: 'my-org-id',
 *   authToken: 'lt_xxx',
 * });
 *
 * // Manual check-in pattern
 * const checkinId = await crons.checkinStart('email-digest');
 * try {
 *   await sendEmailDigest();
 *   await crons.checkinOk(checkinId, { output: 'Sent 150 emails' });
 * } catch (error) {
 *   await crons.checkinError(checkinId, { output: error.message });
 * }
 *
 * // Or use the convenience wrapper
 * await crons.withMonitor('email-digest', async () => {
 *   await sendEmailDigest();
 * });
 *
 * // Shutdown when done
 * crons.close();
 * ```
 */
export declare class CronsClient {
    private readonly httpClient;
    private readonly orgId;
    private readonly environment?;
    private readonly release?;
    private readonly debug;
    private readonly crashClient?;
    private isClosed;
    constructor(options: CronsClientOptions);
    /**
     * Start a check-in (job starting).
     *
     * @param monitorSlug - The monitor slug
     * @returns The check-in ID
     */
    checkinStart(monitorSlug: string): Promise<string>;
    /**
     * Complete a check-in successfully.
     *
     * @param checkinId - The check-in ID from checkinStart
     * @param details - Optional details about the successful run
     */
    checkinOk(checkinId: string, details?: CheckInOk): Promise<void>;
    /**
     * Complete a check-in with error.
     *
     * @param checkinId - The check-in ID from checkinStart
     * @param details - Details about the failed run
     */
    checkinError(checkinId: string, details?: CheckInError): Promise<void>;
    /**
     * Convenience wrapper that handles check-in lifecycle.
     *
     * @param monitorSlug - The monitor slug
     * @param fn - The async function to execute
     * @returns The result of the function
     * @throws JobFailedError if the function throws
     *
     * @example
     * ```typescript
     * const result = await crons.withMonitor('email-digest', async () => {
     *   await sendEmailDigest();
     *   return { sent: 150 };
     * });
     * ```
     */
    withMonitor<T>(monitorSlug: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Check if the client is closed.
     */
    isClosed_(): boolean;
    /**
     * Close the client.
     * After closing, no more check-ins can be made.
     */
    close(): void;
}
//# sourceMappingURL=client.d.ts.map