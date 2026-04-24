/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { type PersistenceMode } from './types';
/**
 * Generate a UUIDv7 for distinct_id.
 *
 * UUIDv7 is time-ordered, which is useful for analytics.
 * Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx (8-4-4-4-12)
 */
export declare function generateDistinctId(): string;
/**
 * Validate a distinct_id format.
 */
export declare function isValidDistinctId(distinctId: string): boolean;
/**
 * Storage interface for distinct_id persistence.
 */
export interface DistinctIdStorage {
    /**
     * Get the stored distinct_id, or null if not set.
     */
    get(): string | null;
    /**
     * Set the distinct_id.
     */
    set(distinctId: string): void;
    /**
     * Clear the stored distinct_id.
     */
    clear(): void;
}
/**
 * In-memory storage for distinct_id.
 */
export declare class MemoryStorage implements DistinctIdStorage {
    private distinctId;
    get(): string | null;
    set(distinctId: string): void;
    clear(): void;
}
/**
 * Cookie-based storage for distinct_id.
 */
export declare class CookieStorage implements DistinctIdStorage {
    private readonly cookieName;
    private readonly domain?;
    constructor(cookieName?: string, domain?: string);
    get(): string | null;
    set(distinctId: string): void;
    clear(): void;
}
/**
 * LocalStorage-based storage for distinct_id.
 */
export declare class LocalStorageStorage implements DistinctIdStorage {
    private readonly key;
    constructor(key?: string);
    get(): string | null;
    set(distinctId: string): void;
    clear(): void;
}
/**
 * Combined storage that writes to multiple backends.
 */
export declare class CombinedStorage implements DistinctIdStorage {
    private readonly storages;
    constructor(storages: DistinctIdStorage[]);
    get(): string | null;
    set(distinctId: string): void;
    clear(): void;
}
/**
 * Create a storage instance based on the persistence mode.
 */
export declare function createStorage(mode: PersistenceMode, cookieName?: string, cookieDomain?: string): DistinctIdStorage;
/**
 * Manager for distinct_id that handles generation and persistence.
 */
export declare class DistinctIdManager {
    private readonly storage;
    private currentDistinctId;
    constructor(storage: DistinctIdStorage);
    /**
     * Initialize the manager, loading or generating the distinct_id.
     */
    initialize(): string;
    /**
     * Get the current distinct_id.
     */
    getDistinctId(): string;
    /**
     * Set a new distinct_id (e.g., after identify).
     */
    setDistinctId(distinctId: string): void;
    /**
     * Reset the distinct_id (e.g., on logout).
     * Generates a new anonymous distinct_id.
     */
    reset(): string;
    /**
     * Check if the current distinct_id looks like an anonymous ID.
     * Anonymous IDs are UUIDs, identified IDs are typically user IDs or emails.
     */
    isAnonymous(): boolean;
}
//# sourceMappingURL=storage.d.ts.map