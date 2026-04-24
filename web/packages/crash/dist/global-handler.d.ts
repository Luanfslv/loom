/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { CrashClient } from './client';
/**
 * Install the global error handler (window.onerror).
 * Captures uncaught errors and sends them to the crash client.
 */
export declare function installGlobalErrorHandler(client: CrashClient): void;
/**
 * Install the unhandled rejection handler (window.onunhandledrejection).
 * Captures unhandled promise rejections and sends them to the crash client.
 */
export declare function installUnhandledRejectionHandler(client: CrashClient): void;
/**
 * Options for console wrapping.
 */
export interface ConsoleWrapOptions {
    /** Wrap console.error (default: true) */
    error?: boolean;
    /** Wrap console.warn (default: false) */
    warn?: boolean;
    /** Add breadcrumbs for console messages (default: true) */
    breadcrumbs?: boolean;
}
/**
 * Wrap console methods to capture breadcrumbs.
 */
export declare function wrapConsole(client: CrashClient, options?: ConsoleWrapOptions): void;
/**
 * Install all global handlers.
 */
export declare function installGlobalHandlers(client: CrashClient): void;
/**
 * Uninstall all global handlers.
 */
export declare function uninstallGlobalHandlers(): void;
//# sourceMappingURL=global-handler.d.ts.map