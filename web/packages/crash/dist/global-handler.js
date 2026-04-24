/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import { consoleBreadcrumb } from './breadcrumb';
const state = {
    onerrorInstalled: false,
    onunhandledrejectionInstalled: false,
    consoleWrapped: false,
    originalOnerror: null,
    originalOnunhandledrejection: null,
    originalConsoleError: null,
    originalConsoleWarn: null
};
/**
 * Install the global error handler (window.onerror).
 * Captures uncaught errors and sends them to the crash client.
 */
export function installGlobalErrorHandler(client) {
    if (typeof window === 'undefined') {
        return;
    }
    if (state.onerrorInstalled) {
        return;
    }
    state.originalOnerror = window.onerror;
    state.onerrorInstalled = true;
    window.onerror = (message, source, lineno, colno, error) => {
        // Try to capture the error
        if (error) {
            client.captureException(error, {
                mechanism: {
                    type: 'onerror',
                    handled: false
                }
            });
        }
        else {
            // Fallback when no error object is available
            const errorMessage = typeof message === 'string' ? message : 'Unknown error';
            client.captureMessage(errorMessage, {
                level: 'error',
                tags: {
                    source: source ?? 'unknown',
                    line: lineno?.toString() ?? 'unknown',
                    column: colno?.toString() ?? 'unknown'
                },
                mechanism: {
                    type: 'onerror',
                    handled: false
                }
            });
        }
        // Call original handler if it exists
        if (state.originalOnerror) {
            return state.originalOnerror(message, source, lineno, colno, error);
        }
        return false;
    };
}
/**
 * Install the unhandled rejection handler (window.onunhandledrejection).
 * Captures unhandled promise rejections and sends them to the crash client.
 */
export function installUnhandledRejectionHandler(client) {
    if (typeof window === 'undefined') {
        return;
    }
    if (state.onunhandledrejectionInstalled) {
        return;
    }
    state.onunhandledrejectionInstalled = true;
    const handler = (event) => {
        const reason = event.reason;
        if (reason instanceof Error) {
            client.captureException(reason, {
                mechanism: {
                    type: 'onunhandledrejection',
                    handled: false
                }
            });
        }
        else {
            // Non-Error rejection
            const message = reason ? String(reason) : 'Unhandled Promise rejection';
            client.captureMessage(message, {
                level: 'error',
                mechanism: {
                    type: 'onunhandledrejection',
                    handled: false
                },
                extra: {
                    reason: reason
                }
            });
        }
    };
    // Store for cleanup
    state.originalOnunhandledrejection = window.onunhandledrejection;
    window.addEventListener('unhandledrejection', handler);
}
/**
 * Wrap console methods to capture breadcrumbs.
 */
export function wrapConsole(client, options = {}) {
    if (typeof console === 'undefined') {
        return;
    }
    if (state.consoleWrapped) {
        return;
    }
    const { error = true, warn = false, breadcrumbs = true } = options;
    state.consoleWrapped = true;
    if (error) {
        state.originalConsoleError = console.error;
        console.error = (...args) => {
            if (breadcrumbs) {
                client.addBreadcrumb(consoleBreadcrumb('error', args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '), args));
            }
            if (state.originalConsoleError) {
                state.originalConsoleError.apply(console, args);
            }
        };
    }
    if (warn) {
        state.originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            if (breadcrumbs) {
                client.addBreadcrumb(consoleBreadcrumb('warn', args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '), args));
            }
            if (state.originalConsoleWarn) {
                state.originalConsoleWarn.apply(console, args);
            }
        };
    }
}
/**
 * Install all global handlers.
 */
export function installGlobalHandlers(client) {
    installGlobalErrorHandler(client);
    installUnhandledRejectionHandler(client);
    wrapConsole(client);
}
/**
 * Uninstall all global handlers.
 */
export function uninstallGlobalHandlers() {
    if (typeof window !== 'undefined') {
        if (state.originalOnerror !== null) {
            window.onerror = state.originalOnerror;
        }
        state.onerrorInstalled = false;
        state.onunhandledrejectionInstalled = false;
    }
    if (typeof console !== 'undefined') {
        if (state.originalConsoleError) {
            console.error = state.originalConsoleError;
        }
        if (state.originalConsoleWarn) {
            console.warn = state.originalConsoleWarn;
        }
        state.consoleWrapped = false;
    }
}
//# sourceMappingURL=global-handler.js.map