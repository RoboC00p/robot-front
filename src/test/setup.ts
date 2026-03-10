/**
 * Vitest setup: ensure browser globals exist so modules that guard on `window` (e.g. ws.client) run in tests.
 */
if (globalThis.window === undefined) {
  (globalThis as unknown as { window: Window }).window =
    globalThis as unknown as Window;
}
