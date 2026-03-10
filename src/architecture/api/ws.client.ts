import {
  WebSocketClientConfig,
  WebSocketConnectionState,
  WebSocketClientCallbacks,
} from './types';

/**
 * Generic WebSocket client for real-time communication (e.g. robot status, battery, alerts).
 * Connection lifecycle, optional reconnect, typed message handling.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/';

/** Builds WebSocket URL from HTTP base (http(s) -> ws(s)). */
function getWsBaseUrl(): string {
  const url = API_BASE_URL.trim().replace(/\/$/, '');
  if (url.startsWith('https://')) return url.replace('https://', 'wss://');
  if (url.startsWith('http://')) return url.replace('http://', 'ws://');
  return `ws://${url}`;
}

export class WebSocketClient<TMessage = unknown> {
  private readonly baseUrl: string;
  private readonly config: Required<
    Pick<
      WebSocketClientConfig,
      'reconnect' | 'maxReconnectAttempts' | 'reconnectDelayMs'
    >
  > &
    Pick<WebSocketClientConfig, 'path'>;
  private callbacks: WebSocketClientCallbacks<TMessage> = {};
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(config: WebSocketClientConfig) {
    this.baseUrl = getWsBaseUrl();
    this.config = {
      path: config.path,
      reconnect: config.reconnect ?? true,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
      reconnectDelayMs: config.reconnectDelayMs ?? 2000,
    };
  }

  get connectionState(): WebSocketConnectionState {
    if (!this.socket) return 'closed';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting';
      case WebSocket.OPEN:
        return 'open';
      default:
        return 'closed';
    }
  }

  setCallbacks(callbacks: WebSocketClientCallbacks<TMessage>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  connect(): void {
    if (globalThis.window === undefined) return;
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    )
      return;

    const url = `${this.baseUrl}/${this.config.path.replace(/^\//, '')}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.callbacks.onOpen?.();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as TMessage;
        this.callbacks.onMessage?.(data);
      } catch {
        this.callbacks.onMessage?.(event.data as TMessage);
      }
    };

    this.socket.onclose = (event: CloseEvent) => {
      this.callbacks.onClose?.(event);
      this.socket = null;
      if (
        this.config.reconnect &&
        !event.wasClean &&
        this.reconnectAttempts < this.config.maxReconnectAttempts
      ) {
        this.reconnectAttempts += 1;
        this.reconnectTimeoutId = setTimeout(() => {
          this.reconnectTimeoutId = null;
          this.connect();
        }, this.config.reconnectDelayMs);
      }
    };

    this.socket.onerror = (event: Event) => {
      this.callbacks.onError?.(event);
    };
  }

  disconnect(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    this.reconnectAttempts = this.config.maxReconnectAttempts;
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
  }

  send(data: unknown): void {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    this.socket.send(payload);
  }
}
