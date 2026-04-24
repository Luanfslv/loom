/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */
export { CrashClient } from './client';
export type { Platform, BreadcrumbLevel, IssueLevel, Breadcrumb, UserContext, DeviceContext, BrowserContext, OsContext, RequestContext, StackFrame, Stacktrace, Mechanism, CrashEvent, CaptureResponse, CaptureOptions, BatchConfig, BeforeSendHook, CrashClientOptions, SessionStatus, SessionConfig, SessionStartResponse, SessionEndResponse } from './types';
export { SDK_NAME, SDK_VERSION, DEFAULT_BATCH_CONFIG } from './types';
export { SessionTracker } from './session';
export { CrashError, ConfigurationError, InvalidBaseUrlError, AuthenticationError, RateLimitedError, ClientClosedError, CaptureError, StackParseError, NetworkError, ServerError } from './errors';
export { BreadcrumbManager, httpBreadcrumb, navigationBreadcrumb, uiBreadcrumb, consoleBreadcrumb, userBreadcrumb, debugBreadcrumb } from './breadcrumb';
export { parseStackTrace, parseStackString, getExceptionType, getExceptionValue, findCulprit } from './stacktrace';
export { installGlobalErrorHandler, installUnhandledRejectionHandler, installGlobalHandlers, uninstallGlobalHandlers, wrapConsole } from './global-handler';
//# sourceMappingURL=index.d.ts.map