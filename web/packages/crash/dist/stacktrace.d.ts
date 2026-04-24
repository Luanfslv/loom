/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
import type { Stacktrace } from './types';
/**
 * Parse a JavaScript error stack trace into frames.
 *
 * @param error - The error to parse
 * @returns Parsed stacktrace with frames
 */
export declare function parseStackTrace(error: Error): Stacktrace;
/**
 * Parse a stack trace string directly.
 *
 * @param stack - The stack trace string
 * @returns Parsed stacktrace with frames
 */
export declare function parseStackString(stack: string): Stacktrace;
/**
 * Extract the exception type from an error.
 */
export declare function getExceptionType(error: unknown): string;
/**
 * Extract the exception message from an error.
 */
export declare function getExceptionValue(error: unknown): string;
/**
 * Find the culprit frame (first in-app frame).
 */
export declare function findCulprit(stacktrace: Stacktrace): string | undefined;
//# sourceMappingURL=stacktrace.d.ts.map