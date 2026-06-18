type MessageHandler = (data: string) => void;
type StatusHandler = (status: ConnectionStatus) => void;

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export interface ChatSocketOptions {
  locale: string;
  /** Called for every inbound message (already JSON-parsed) */
  onMessage: MessageHandler;
  /** Called whenever the connection status changes */
  onStatusChange?: StatusHandler;
  /** Max reconnect attempts before giving up (default: 5) */
  maxRetries?: number;
  /** Base delay in ms for exponential back-off (default: 1000) */
  baseDelay?: number;
}

export class ChatSocket {
  
  private ws: WebSocket | null = null;
  private retryCount = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;

  private readonly url: string;
  private readonly onMessage: MessageHandler;
  private readonly onStatusChange: StatusHandler;
  private readonly maxRetries: number;
  private readonly baseDelay: number;

  constructor(roomId: string, options: ChatSocketOptions) {
    const base =
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/api";
    // const base = "ws://localhost:8001/api";

    this.url = `${base}/chat/ws/${roomId}?locale=${options.locale}`;
    this.onMessage = options.onMessage;
    this.onStatusChange = options.onStatusChange ?? (() => {});
    this.maxRetries = options.maxRetries ?? 5;
    this.baseDelay = options.baseDelay ?? 1_000;
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("[ChatSocket] already connected");
      return;
    }
    console.log("[ChatSocket] connect()");

    this.manuallyClosed = false;
    this.setStatus(this.retryCount > 0 ? "reconnecting" : "connecting");

    const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const token = raw ? JSON.parse(raw).token : null;
    const wsUrl = token ? `${this.url}&token=${token}` : this.url;

    console.log("[ChatSocket] opening", wsUrl);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.handleOpen;
    this.ws.onmessage = this.handleMessage;
    this.ws.onclose = this.handleClose;
    this.ws.onerror = this.handleError;
  }

  send(text: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn("[ChatSocket] send() called while not connected — dropping");
      return;
    }
    this.ws.send(text);
  }

  disconnect(): void {
    this.manuallyClosed = true;
    this.clearRetryTimer();
    this.ws?.close(1000, "client disconnect");
    this.ws = null;
    this.retryCount = 0;
    this.setStatus("disconnected");
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  // ─── Internal ────────────────────────────────────────────────────────────────

  private _status: ConnectionStatus = "idle";

  private setStatus(s: ConnectionStatus) {
    this._status = s;
    this.onStatusChange(s);
  }

  private handleOpen = () => {
    console.log("[ChatSocket] OPEN");
    this.retryCount = 0;
    this.setStatus("connected");
  };

  private handleMessage = (event: MessageEvent) => {
    this.onMessage(event.data as string);
  };

  private handleClose = (event: CloseEvent) => {
  console.log("[ChatSocket] CLOSE", {
    code: event.code,
    reason: event.reason,
    wasClean: event.wasClean,
    manuallyClosed: this.manuallyClosed,
  });

  if (this.manuallyClosed) return;

  // only retry abnormal closes
  if (!event.wasClean) {
    this.scheduleRetry();
  }
};

  private handleError = (event: Event) => {
    console.error("[ChatSocket] WebSocket error", event);
    // onclose fires immediately after onerror — retry is handled there
  };

  private scheduleRetry() {
    console.log("[ChatSocket] retry attempt", this.retryCount + 1);
    if (this.retryCount >= this.maxRetries) {
      console.error("[ChatSocket] Max retries reached — giving up");
      this.setStatus("disconnected");
      return;
    }

    const delay = this.baseDelay * 2 ** this.retryCount;
    console.log("[ChatSocket] reconnecting in", delay, "ms");
    this.retryCount++;
    this.setStatus("reconnecting");

    this.retryTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearRetryTimer() {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }
}