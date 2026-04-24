/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { Breadcrumb } from './types';
/**
 * Manages a circular buffer of breadcrumbs.
 */
export declare class BreadcrumbManager {
    private breadcrumbs;
    private readonly maxBreadcrumbs;
    constructor(maxBreadcrumbs?: number);
    /**
     * Add a breadcrumb to the buffer.
     * If the buffer is full, the oldest breadcrumb is removed.
     */
    add(breadcrumb: Breadcrumb): void;
    /**
     * Get all breadcrumbs in chronological order.
     */
    getAll(): Breadcrumb[];
    /**
     * Clear all breadcrumbs.
     */
    clear(): void;
    /**
     * Get the number of breadcrumbs.
     */
    get count(): number;
}
/**
 * Create a breadcrumb for an HTTP request.
 */
export declare function httpBreadcrumb(method: string, url: string, statusCode?: number, data?: Record<string, unknown>): Breadcrumb;
/**
 * Create a breadcrumb for navigation.
 */
export declare function navigationBreadcrumb(from: string, to: string): Breadcrumb;
/**
 * Create a breadcrumb for a UI interaction.
 */
export declare function uiBreadcrumb(element: string, action?: string, data?: Record<string, unknown>): Breadcrumb;
/**
 * Create a breadcrumb for a console message.
 */
export declare function consoleBreadcrumb(level: 'log' | 'info' | 'warn' | 'error' | 'debug', message: string, args?: unknown[]): Breadcrumb;
/**
 * Create a breadcrumb for a user action.
 */
export declare function userBreadcrumb(action: string, message: string, data?: Record<string, unknown>): Breadcrumb;
/**
 * Create a debug breadcrumb.
 */
export declare function debugBreadcrumb(message: string, data?: Record<string, unknown>): Breadcrumb;
//# sourceMappingURL=breadcrumb.d.ts.map