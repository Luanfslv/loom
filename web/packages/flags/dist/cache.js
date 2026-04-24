/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * In-memory cache for feature flag states.
 */
export class FlagCache {
    flags = new Map();
    killSwitches = new Map();
    lastUpdated = null;
    _initialized = false;
    /**
     * Returns true if the cache has been initialized with data.
     */
    isInitialized() {
        return this._initialized;
    }
    /**
     * Returns the timestamp of the last cache update.
     */
    getLastUpdated() {
        return this.lastUpdated;
    }
    /**
     * Initializes the cache with a full set of flags and kill switches.
     *
     * This is typically called when receiving an `init` event from SSE.
     */
    initialize(flags, killSwitches) {
        this.flags.clear();
        for (const flag of flags) {
            this.flags.set(flag.key, flag);
        }
        this.killSwitches.clear();
        for (const ks of killSwitches) {
            this.killSwitches.set(ks.key, ks);
        }
        this.lastUpdated = new Date();
        this._initialized = true;
    }
    /**
     * Gets a flag state by key.
     */
    getFlag(key) {
        return this.flags.get(key);
    }
    /**
     * Gets all cached flag states.
     */
    getAllFlags() {
        return Array.from(this.flags.values());
    }
    /**
     * Updates a single flag state.
     */
    updateFlag(flag) {
        this.flags.set(flag.key, flag);
        this.lastUpdated = new Date();
    }
    /**
     * Marks a flag as archived.
     */
    archiveFlag(key) {
        const flag = this.flags.get(key);
        if (flag) {
            this.flags.set(key, { ...flag, archived: true });
            this.lastUpdated = new Date();
        }
    }
    /**
     * Marks a flag as restored (unarchived) with updated enabled status.
     */
    restoreFlag(key, enabled) {
        const flag = this.flags.get(key);
        if (flag) {
            this.flags.set(key, { ...flag, archived: false, enabled });
            this.lastUpdated = new Date();
        }
    }
    /**
     * Updates the enabled status of a flag.
     */
    updateFlagEnabled(key, enabled) {
        const flag = this.flags.get(key);
        if (flag) {
            this.flags.set(key, { ...flag, enabled });
            this.lastUpdated = new Date();
        }
    }
    /**
     * Updates a flag with new variant information.
     */
    updateFlagVariant(key, defaultVariant, defaultValue) {
        const flag = this.flags.get(key);
        if (flag) {
            this.flags.set(key, { ...flag, defaultVariant, defaultValue });
            this.lastUpdated = new Date();
        }
    }
    /**
     * Gets a kill switch state by key.
     */
    getKillSwitch(key) {
        return this.killSwitches.get(key);
    }
    /**
     * Gets all cached kill switch states.
     */
    getAllKillSwitches() {
        return Array.from(this.killSwitches.values());
    }
    /**
     * Activates a kill switch.
     */
    activateKillSwitch(key, reason) {
        const ks = this.killSwitches.get(key);
        if (ks) {
            this.killSwitches.set(key, { ...ks, isActive: true, activationReason: reason });
            this.lastUpdated = new Date();
        }
    }
    /**
     * Deactivates a kill switch.
     */
    deactivateKillSwitch(key) {
        const ks = this.killSwitches.get(key);
        if (ks) {
            this.killSwitches.set(key, { ...ks, isActive: false, activationReason: undefined });
            this.lastUpdated = new Date();
        }
    }
    /**
     * Checks if any active kill switch affects the given flag.
     * Returns the kill switch key if found, undefined otherwise.
     */
    isFlagKilled(flagKey) {
        for (const ks of this.killSwitches.values()) {
            if (ks.isActive && ks.linkedFlagKeys.includes(flagKey)) {
                return ks.key;
            }
        }
        return undefined;
    }
    /**
     * Returns the number of cached flags.
     */
    flagCount() {
        return this.flags.size;
    }
    /**
     * Returns the number of cached kill switches.
     */
    killSwitchCount() {
        return this.killSwitches.size;
    }
    /**
     * Clears all cached data.
     */
    clear() {
        this.flags.clear();
        this.killSwitches.clear();
        this.lastUpdated = null;
        this._initialized = false;
    }
}
//# sourceMappingURL=cache.js.map