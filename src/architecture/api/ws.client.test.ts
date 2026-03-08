import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { WebSocketClient } from './ws.client';

type MockWsInstance = {
  readyState: number;
  send: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  onopen: (() => void) | null;
  onmessage: ((e: MessageEvent) => void) | null;
  onclose: ((e: CloseEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
};

let WebSocketCtor: ReturnType<typeof vi.fn>;
let capturedUrl: string;
let mockWsInstance: MockWsInstance;

beforeAll(() => {
  WebSocketCtor = vi.fn();
  (
    WebSocketCtor as unknown as {
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    }
  ).CONNECTING = 0;
  (
    WebSocketCtor as unknown as {
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    }
  ).OPEN = 1;
  (
    WebSocketCtor as unknown as {
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    }
  ).CLOSING = 2;
  (
    WebSocketCtor as unknown as {
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    }
  ).CLOSED = 3;
  vi.stubGlobal('WebSocket', WebSocketCtor);
  if (typeof window !== 'undefined')
    (window as unknown as { WebSocket: typeof WebSocketCtor }).WebSocket =
      WebSocketCtor;
});

beforeEach(() => {
  vi.useFakeTimers();
  WebSocketCtor.mockClear();
  capturedUrl = '';
  mockWsInstance = {
    readyState: 0,
    send: vi.fn(),
    close: vi.fn(),
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null,
  };
  WebSocketCtor.mockImplementation((url: string) => {
    capturedUrl = url;
    return mockWsInstance;
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('WebSocketClient', () => {
  describe('constructor and URL', () => {
    it('builds ws URL from http base', () => {
      const client = new WebSocketClient({ path: 'robot/status' });
      client.connect();
      expect(capturedUrl).toMatch(/^ws:\/\//);
      expect(capturedUrl).toContain('robot/status');
    });

    it('strips leading slash from path', () => {
      const client = new WebSocketClient({ path: '/robot/status' });
      client.connect();
      expect(capturedUrl).not.toContain('//robot');
      expect(capturedUrl).toContain('/robot/status');
    });
  });

  describe('connectionState', () => {
    it('returns closed when no socket', () => {
      const client = new WebSocketClient({ path: 'test' });
      expect(client.connectionState).toBe('closed');
    });

    it('returns connecting when socket is CONNECTING', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.connect();
      expect(client.connectionState).toBe('connecting');
    });

    it('returns open when socket is OPEN', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.connect();
      mockWsInstance.readyState = 1;
      expect(client.connectionState).toBe('open');
    });
  });

  describe('setCallbacks and connect', () => {
    it('calls onOpen when socket opens', () => {
      const onOpen = vi.fn();
      const client = new WebSocketClient({ path: 'test' });
      client.setCallbacks({ onOpen });
      client.connect();
      mockWsInstance.onopen?.();
      expect(onOpen).toHaveBeenCalled();
    });

    it('parses JSON and calls onMessage', () => {
      const onMessage = vi.fn();
      const client = new WebSocketClient<{ value: number }>({ path: 'test' });
      client.setCallbacks({ onMessage });
      client.connect();
      mockWsInstance.onmessage?.({
        data: JSON.stringify({ value: 42 }),
      } as MessageEvent);
      expect(onMessage).toHaveBeenCalledWith({ value: 42 });
    });

    it('calls onMessage with raw data when JSON parse fails', () => {
      const onMessage = vi.fn();
      const client = new WebSocketClient({ path: 'test' });
      client.setCallbacks({ onMessage });
      client.connect();
      mockWsInstance.onmessage?.({ data: 'plain text' } as MessageEvent);
      expect(onMessage).toHaveBeenCalledWith('plain text');
    });

    it('calls onClose when socket closes', () => {
      const onClose = vi.fn();
      const client = new WebSocketClient({ path: 'test' });
      client.setCallbacks({ onClose });
      client.connect();
      const closeEvent = { wasClean: true } as CloseEvent;
      mockWsInstance.onclose?.(closeEvent);
      expect(onClose).toHaveBeenCalledWith(closeEvent);
    });

    it('calls onError when socket errors', () => {
      const onError = vi.fn();
      const client = new WebSocketClient({ path: 'test' });
      client.setCallbacks({ onError });
      client.connect();
      const errEvent = new Event('error');
      mockWsInstance.onerror?.(errEvent);
      expect(onError).toHaveBeenCalledWith(errEvent);
    });
  });

  describe('reconnect', () => {
    it('reconnects after delay when close was not clean', () => {
      const client = new WebSocketClient({
        path: 'test',
        reconnectDelayMs: 1000,
      });
      client.setCallbacks({});
      client.connect();
      expect(WebSocketCtor).toHaveBeenCalledTimes(1);
      mockWsInstance.onclose?.({ wasClean: false } as CloseEvent);
      expect(WebSocketCtor).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(1000);
      expect(WebSocketCtor).toHaveBeenCalledTimes(2);
    });

    it('does not reconnect when close was clean', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.setCallbacks({});
      client.connect();
      mockWsInstance.onclose?.({ wasClean: true } as CloseEvent);
      vi.advanceTimersByTime(10000);
      expect(WebSocketCtor).toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnect', () => {
    it('closes socket and clears timeout', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.connect();
      client.disconnect();
      vi.advanceTimersByTime(10000);
      expect(mockWsInstance.close).toHaveBeenCalledWith(
        1000,
        'Client disconnect'
      );
      expect(WebSocketCtor).toHaveBeenCalledTimes(1);
    });

    it('does not throw when no socket', () => {
      const client = new WebSocketClient({ path: 'test' });
      expect(() => client.disconnect()).not.toThrow();
    });
  });

  describe('send', () => {
    it('does nothing when socket is not open', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.connect();
      mockWsInstance.readyState = 0;
      client.send({ data: 1 });
      expect(mockWsInstance.send).not.toHaveBeenCalled();
    });

    it('sends JSON string when socket is open', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.connect();
      mockWsInstance.readyState = 1;
      client.send({ data: 1 });
      expect(mockWsInstance.send).toHaveBeenCalledWith('{"data":1}');
    });

    it('sends string as-is when data is string', () => {
      const client = new WebSocketClient({ path: 'test' });
      client.connect();
      mockWsInstance.readyState = 1;
      client.send('hello');
      expect(mockWsInstance.send).toHaveBeenCalledWith('hello');
    });
  });
});
