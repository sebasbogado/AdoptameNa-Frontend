"use client";

import { useCallback, useRef, useState } from "react";
import { useWebSocket } from "@/hooks/websocket-hook";
import { MarkReadDTO, MessageDTO } from "@/types/chat";

export function useChatMessageSender(authToken: string | null) {
  const stompClientRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);

  const setupSubscriptions = useCallback((client: any) => {
    console.log("Setting up STOMP client for sending messages");
    stompClientRef.current = client;
    setConnected(Boolean(client && client.connected));
  }, []);

  const { isConnected } = useWebSocket(authToken, setupSubscriptions);

  const sendMessageWs = useCallback(
    (messageDto: MessageDTO) => {
      if (!stompClientRef.current || !isConnected) {
        console.error("WebSocket connection not established for sending message");
        return false;
      }

      try {

        if (stompClientRef.current.publish) {
          stompClientRef.current.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(messageDto),
          });
        } else if (stompClientRef.current.send) {
          stompClientRef.current.send(
            "/app/chat.sendMessage",
            {},
            JSON.stringify(messageDto)
          );
        } else {
          console.error("STOMP client has no valid send method");
          return false;
        }

        return true;
      } catch (error) {
        console.error("❌ Error sending message via WebSocket:", error);
        return false;
      }
    },
    [isConnected]
  );

  const markAsReadWs = useCallback(
    (markReadDto: MarkReadDTO) => {
      if (!stompClientRef.current || !isConnected) {
        console.error("WebSocket connection not established for marking as read");
        return false;
      }

      try {
        if (stompClientRef.current.publish) {
          stompClientRef.current.publish({
            destination: "/app/chat.markRead",
            body: JSON.stringify(markReadDto),
          });
        } else if (stompClientRef.current.send) {
          stompClientRef.current.send(
            "/app/chat.markRead",
            {},
            JSON.stringify(markReadDto)
          );
        } else {
          console.error("STOMP client has no valid send method");
          return false;
        }

        return true;
      } catch (error) {
        console.error("❌ Error marking messages as read via WebSocket:", error);
        return false;
      }
    },
    [isConnected]
  );

  return { sendMessageWs, markAsReadWs, connected: isConnected };
}
