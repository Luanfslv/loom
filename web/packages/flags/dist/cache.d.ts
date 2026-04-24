/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Local in-memory cache for feature flag states.
 *
 * The cache stores the current state of all flags and kill switches,
 * enabling fast local evaluation and offline mode support.
 */
import type { FlagState, KillSwitchState, VariantValue } from './types';
/**
 * In-memory cache for feature flag states.
 */
export declare class FlagCache {
    private flags;
    private killSwitches;
    private lastUpdated;
    private _initialized;
    /**
     * Returns true if the cache has been initialized with data.
     */
    isInitialized(): boolean;
    /**
     * Returns the timestamp of the last cache update.
     */
    getLastUpdated(): Date | null;
    /**
     * Initializes the cache with a full set of flags and kill switches.
     *
     * This is typically called when receiving an `init` event from SSE.
     */
    initialize(flags: FlagState[], killSwitches: KillSwitchState[]): void;
    /**
     * Gets a flag state by key.
     */
    getFlag(key: string): FlagState | undefined;
    /**
     * Gets all cached flag states.
     */
    getAllFlags(): FlagState[];
    /**
     * Updates a single flag state.
     */
    updateFlag(flag: FlagState): void;
    /**
     * Marks a flag as archived.
     */
    archiveFlag(key: string): void;
    /**
     * Marks a flag as restored (unarchived) with updated enabled status.
     */
    restoreFlag(key: string, enabled: boolean): void;
    /**
     * Updates the enabled status of a flag.
     */
    updateFlagEnabled(key: string, enabled: boolean): void;
    /**
     * Updates a flag with new variant information.
     */
    updateFlagVariant(key: string, defaultVariant: string, defaultValue: VariantValue): void;
    /**
     * Gets a kill switch state by key.
     */
    getKillSwitch(key: string): KillSwitchState | undefined;
    /**
     * Gets all cached kill switch states.
     */
    getAllKillSwitches(): KillSwitchState[];
    /**
     * Activates a kill switch.
     */
    activateKillSwitch(key: string, reason: string): void;
    /**
     * Deactivates a kill switch.
     */
    deactivateKillSwitch(key: string): void;
    /**
     * Checks if any active kill switch affects the given flag.
     * Returns the kill switch key if found, undefined otherwise.
     */
    isFlagKilled(flagKey: string): string | undefined;
    /**
     * Returns the number of cached flags.
     */
    flagCount(): number;
    /**
     * Returns the number of cached kill switches.
     */
    killSwitchCount(): number;
    /**
     * Clears all cached data.
     */
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map