/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Feature Flags SDK for Loom.
 *
 * This package provides a client library for evaluating feature flags against the
 * Loom server. It supports real-time updates via SSE, local caching, and offline mode.
 *
 * @example
 * ```typescript
 * import { FlagsClient } from '@loom/flags';
 *
 * const client = new FlagsClient({
 *   sdkKey: 'loom_sdk_client_prod_xxx',
 *   baseUrl: 'https://loom.example.com',
 * });
 *
 * await client.initialize();
 *
 * // Evaluate flag
 * const enabled = await client.getBool('checkout.new_flow', context, false);
 *
 * // React to updates
 * client.on('flag.updated', (event) => {
 *   console.log(`Flag ${event.flagKey} updated`);
 * });
 * ```
 */
export { FlagsClient } from './client';
export { FlagCache } from './cache';
export { SseConnection } from './sse';
export { FlagsError, InvalidSdkKeyError, InvalidBaseUrlError, ConnectionError, AuthenticationError, RateLimitedError, InitializationTimeoutError, ClientClosedError, FlagNotFoundError } from './errors';
//# sourceMappingURL=index.js.map