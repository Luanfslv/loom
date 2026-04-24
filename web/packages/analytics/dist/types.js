/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Default batch configuration values.
 */
export const DEFAULT_BATCH_CONFIG = {
    flushIntervalMs: 10000, // 10 seconds
    maxBatchSize: 10,
    maxQueueSize: 1000
};
/**
 * Default autocapture configuration values.
 */
export const DEFAULT_AUTOCAPTURE_CONFIG = {
    pageview: true,
    pageleave: true
};
/**
 * Cookie settings.
 */
export const COOKIE_SETTINGS = {
    defaultName: 'loom_analytics_distinct_id',
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    sameSite: 'Lax',
    path: '/'
};
/**
 * LocalStorage key for distinct_id.
 */
export const LOCALSTORAGE_KEY = 'loom_analytics_distinct_id';
/**
 * SDK version.
 */
export const SDK_VERSION = '0.1.0';
/**
 * SDK name.
 */
export const SDK_NAME = '@loom/analytics';
//# sourceMappingURL=types.js.map