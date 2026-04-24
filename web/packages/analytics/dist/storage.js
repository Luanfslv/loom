/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { COOKIE_SETTINGS, LOCALSTORAGE_KEY } from './types';
/**
 * Generate a UUIDv7 for distinct_id.
 *
 * UUIDv7 is time-ordered, which is useful for analytics.
 * Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx (8-4-4-4-12)
 */
export function generateDistinctId() {
    // Get current timestamp in milliseconds
    const timestamp = Date.now();
    // Convert to hex and pad to 12 characters (48 bits)
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    // Generate random bytes for the rest
    const randomBytes = new Uint8Array(10);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(randomBytes);
    }
    else {
        // Fallback for environments without crypto
        for (let i = 0; i < 10; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }
    // Convert random bytes to hex
    const randomHex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    // Build UUIDv7:
    // Format: 8-4-4-4-12 hex characters
    // - First 32 bits (8 hex): timestamp high
    // - Next 16 bits (4 hex): timestamp low
    // - Next 16 bits (4 hex): version (7) + random
    // - Next 16 bits (4 hex): variant (10) + random
    // - Last 48 bits (12 hex): random
    const uuid = [
        timestampHex.slice(0, 8), // 8 chars: time_high
        timestampHex.slice(8, 12), // 4 chars: time_low
        '7' + randomHex.slice(0, 3), // 4 chars: version (7) + 3 random nibbles
        ((parseInt(randomHex.slice(3, 4), 16) & 0x3) | 0x8).toString(16) + randomHex.slice(4, 7), // 4 chars: variant (10) + 3 random nibbles
        randomHex.slice(7, 19) // 12 chars: random
    ].join('-');
    return uuid;
}
/**
 * Validate a distinct_id format.
 */
export function isValidDistinctId(distinctId) {
    if (!distinctId || typeof distinctId !== 'string') {
        return false;
    }
    // Max 200 characters per spec
    if (distinctId.length > 200) {
        return false;
    }
    // Must not be empty
    if (distinctId.trim().length === 0) {
        return false;
    }
    return true;
}
/**
 * In-memory storage for distinct_id.
 */
export class MemoryStorage {
    distinctId = null;
    get() {
        return this.distinctId;
    }
    set(distinctId) {
        this.distinctId = distinctId;
    }
    clear() {
        this.distinctId = null;
    }
}
/**
 * Cookie-based storage for distinct_id.
 */
export class CookieStorage {
    cookieName;
    domain;
    constructor(cookieName = COOKIE_SETTINGS.defaultName, domain) {
        this.cookieName = cookieName;
        this.domain = domain;
    }
    get() {
        if (typeof document === 'undefined') {
            return null;
        }
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.cookieName && value) {
                try {
                    return decodeURIComponent(value);
                }
                catch {
                    return null;
                }
            }
        }
        return null;
    }
    set(distinctId) {
        if (typeof document === 'undefined') {
            return;
        }
        const parts = [
            `${this.cookieName}=${encodeURIComponent(distinctId)}`,
            `path=${COOKIE_SETTINGS.path}`,
            `max-age=${COOKIE_SETTINGS.maxAge}`,
            `SameSite=${COOKIE_SETTINGS.sameSite}`
        ];
        if (this.domain) {
            parts.push(`domain=${this.domain}`);
        }
        // Add Secure flag in production (HTTPS)
        if (typeof window !== 'undefined' && window.location?.protocol === 'https:') {
            parts.push('Secure');
        }
        document.cookie = parts.join('; ');
    }
    clear() {
        if (typeof document === 'undefined') {
            return;
        }
        const parts = [
            `${this.cookieName}=`,
            `path=${COOKIE_SETTINGS.path}`,
            'max-age=0'
        ];
        if (this.domain) {
            parts.push(`domain=${this.domain}`);
        }
        document.cookie = parts.join('; ');
    }
}
/**
 * LocalStorage-based storage for distinct_id.
 */
export class LocalStorageStorage {
    key;
    constructor(key = LOCALSTORAGE_KEY) {
        this.key = key;
    }
    get() {
        if (typeof localStorage === 'undefined') {
            return null;
        }
        try {
            return localStorage.getItem(this.key);
        }
        catch {
            // localStorage may be blocked or unavailable
            return null;
        }
    }
    set(distinctId) {
        if (typeof localStorage === 'undefined') {
            return;
        }
        try {
            localStorage.setItem(this.key, distinctId);
        }
        catch {
            // Ignore storage errors (quota exceeded, blocked, etc.)
        }
    }
    clear() {
        if (typeof localStorage === 'undefined') {
            return;
        }
        try {
            localStorage.removeItem(this.key);
        }
        catch {
            // Ignore storage errors
        }
    }
}
/**
 * Combined storage that writes to multiple backends.
 */
export class CombinedStorage {
    storages;
    constructor(storages) {
        this.storages = storages;
    }
    get() {
        // Try each storage in order, return first non-null value
        for (const storage of this.storages) {
            const value = storage.get();
            if (value !== null) {
                return value;
            }
        }
        return null;
    }
    set(distinctId) {
        // Write to all storages
        for (const storage of this.storages) {
            storage.set(distinctId);
        }
    }
    clear() {
        // Clear all storages
        for (const storage of this.storages) {
            storage.clear();
        }
    }
}
/**
 * Create a storage instance based on the persistence mode.
 */
export function createStorage(mode, cookieName, cookieDomain) {
    switch (mode) {
        case 'localStorage+cookie':
            return new CombinedStorage([
                new LocalStorageStorage(),
                new CookieStorage(cookieName, cookieDomain)
            ]);
        case 'localStorage':
            return new LocalStorageStorage();
        case 'cookie':
            return new CookieStorage(cookieName, cookieDomain);
        case 'memory':
            return new MemoryStorage();
    }
}
/**
 * Manager for distinct_id that handles generation and persistence.
 */
export class DistinctIdManager {
    storage;
    currentDistinctId = null;
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Initialize the manager, loading or generating the distinct_id.
     */
    initialize() {
        // Try to load from storage
        const stored = this.storage.get();
        if (stored && isValidDistinctId(stored)) {
            this.currentDistinctId = stored;
            return stored;
        }
        // Generate new distinct_id
        const newDistinctId = generateDistinctId();
        this.currentDistinctId = newDistinctId;
        this.storage.set(newDistinctId);
        return newDistinctId;
    }
    /**
     * Get the current distinct_id.
     */
    getDistinctId() {
        if (!this.currentDistinctId) {
            return this.initialize();
        }
        return this.currentDistinctId;
    }
    /**
     * Set a new distinct_id (e.g., after identify).
     */
    setDistinctId(distinctId) {
        if (!isValidDistinctId(distinctId)) {
            throw new Error('Invalid distinct_id');
        }
        this.currentDistinctId = distinctId;
        this.storage.set(distinctId);
    }
    /**
     * Reset the distinct_id (e.g., on logout).
     * Generates a new anonymous distinct_id.
     */
    reset() {
        this.storage.clear();
        const newDistinctId = generateDistinctId();
        this.currentDistinctId = newDistinctId;
        this.storage.set(newDistinctId);
        return newDistinctId;
    }
    /**
     * Check if the current distinct_id looks like an anonymous ID.
     * Anonymous IDs are UUIDs, identified IDs are typically user IDs or emails.
     */
    isAnonymous() {
        const id = this.currentDistinctId;
        if (!id)
            return true;
        // UUIDv7 pattern: 8-4-4-4-12 with version 7
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidPattern.test(id);
    }
}
//# sourceMappingURL=storage.js.map