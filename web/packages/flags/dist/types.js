/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
/**
 * Helper functions for working with types.
 */
export function createEvaluationContext(environment, options) {
    return {
        environment,
        attributes: {},
        ...options
    };
}
/**
 * Get boolean value from VariantValue.
 */
export function getVariantBool(value, defaultValue) {
    if (value.type === 'boolean') {
        return value.value;
    }
    return defaultValue;
}
/**
 * Get string value from VariantValue.
 */
export function getVariantString(value, defaultValue) {
    if (value.type === 'string') {
        return value.value;
    }
    return defaultValue;
}
/**
 * Get JSON value from VariantValue.
 */
export function getVariantJson(value, defaultValue) {
    if (value.type === 'json') {
        return value.value;
    }
    return defaultValue;
}
//# sourceMappingURL=types.js.map