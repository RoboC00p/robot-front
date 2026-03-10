/**
 * Generic types for the API responses
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}

// --- Typings (ws.client.ts ou architecture/api/types.ts) ---

export interface WebSocketClientConfig {
  /** Path appended to base WS URL (e.g. 'robot/status'). */
  path: string;
  /** Reconnect on close (default: true). */
  reconnect?: boolean;
  /** Max reconnect attempts (default: 5). */
  maxReconnectAttempts?: number;
  /** Delay in ms before reconnect (default: 2000). */
  reconnectDelayMs?: number;
}

export type WebSocketConnectionState =
  | 'closed'
  | 'connecting'
  | 'open'
  | 'reconnecting';

export interface WebSocketClientCallbacks<TMessage = unknown> {
  onMessage?: (data: TMessage) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}
