/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Manages a circular buffer of breadcrumbs.
 */
export class BreadcrumbManager {
    breadcrumbs = [];
    maxBreadcrumbs;
    constructor(maxBreadcrumbs = 100) {
        this.maxBreadcrumbs = maxBreadcrumbs;
    }
    /**
     * Add a breadcrumb to the buffer.
     * If the buffer is full, the oldest breadcrumb is removed.
     */
    add(breadcrumb) {
        const crumb = {
            timestamp: new Date().toISOString(),
            ...breadcrumb
        };
        this.breadcrumbs.push(crumb);
        // Remove oldest if over limit
        while (this.breadcrumbs.length > this.maxBreadcrumbs) {
            this.breadcrumbs.shift();
        }
    }
    /**
     * Get all breadcrumbs in chronological order.
     */
    getAll() {
        return [...this.breadcrumbs];
    }
    /**
     * Clear all breadcrumbs.
     */
    clear() {
        this.breadcrumbs = [];
    }
    /**
     * Get the number of breadcrumbs.
     */
    get count() {
        return this.breadcrumbs.length;
    }
}
/**
 * Create a breadcrumb for an HTTP request.
 */
export function httpBreadcrumb(method, url, statusCode, data) {
    return {
        type: 'http',
        category: 'http',
        message: `${method} ${url}`,
        level: statusCode && statusCode >= 400 ? 'error' : 'info',
        data: {
            method,
            url,
            status_code: statusCode,
            ...data
        }
    };
}
/**
 * Create a breadcrumb for navigation.
 */
export function navigationBreadcrumb(from, to) {
    return {
        type: 'navigation',
        category: 'navigation',
        message: `Navigated from ${from} to ${to}`,
        level: 'info',
        data: {
            from,
            to
        }
    };
}
/**
 * Create a breadcrumb for a UI interaction.
 */
export function uiBreadcrumb(element, action = 'click', data) {
    return {
        type: 'ui',
        category: 'ui.' + action,
        message: `${action} on ${element}`,
        level: 'info',
        data
    };
}
/**
 * Create a breadcrumb for a console message.
 */
export function consoleBreadcrumb(level, message, args) {
    return {
        type: 'console',
        category: 'console',
        message,
        level: level === 'error' ? 'error' : level === 'warn' ? 'warning' : 'info',
        data: args ? { arguments: args } : undefined
    };
}
/**
 * Create a breadcrumb for a user action.
 */
export function userBreadcrumb(action, message, data) {
    return {
        type: 'user',
        category: action,
        message,
        level: 'info',
        data
    };
}
/**
 * Create a debug breadcrumb.
 */
export function debugBreadcrumb(message, data) {
    return {
        type: 'debug',
        category: 'debug',
        message,
        level: 'debug',
        data
    };
}
//# sourceMappingURL=breadcrumb.js.map