/**
 * Vitest setup: ensure browser globals exist so modules that guard on `window` (e.g. ws.client) run in tests.
 */
if (typeof globalThis.window === 'undefined') {
  (globalThis as unknown as { window: typeof globalThis }).window =
    globalThis as unknown as Window;
}
