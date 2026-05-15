"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatSocket, ConnectionStatus } from "@/lib/chatSocket";

export interface ChatMessage {
  username: string;
  message: string;
}

interface ChatContextValue {
  messages: ChatMessage[];
  status: ConnectionStatus;
  sendMessage: (text: string) => void;
}

function parseMessage(raw: string): ChatMessage {
  const idx = raw.indexOf(": ");
  if (idx === -1) return { username: "Anonymous", message: raw };
  return {
    username: raw.slice(0, idx),
    message: raw.slice(idx + 2),
  };
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  roomId: string;
  children: React.ReactNode;
}

export function ChatProvider({ roomId, children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const socketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    console.log("[ChatProvider] mounted", roomId);

    return () => {
      console.log("[ChatProvider] unmounted", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    console.log("[ChatContext] mounting for room", roomId);
    const socket = new ChatSocket(roomId, {
      onMessage: (raw) => {
        setMessages((prev) => [...prev, parseMessage(raw)]);
      },
      onStatusChange: setStatus,
    });

    socketRef.current = socket;
    socket.connect();

    return () => {
      console.log("CHAT PROVIDER UNMOUNT", roomId);
      socket.disconnect();
      socketRef.current = null;
      setMessages([]);
    };
  }, [roomId]);

  const sendMessage = useCallback((text: string) => {
    socketRef.current?.send(text);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, status, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}