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

  // Usar el hook de WebSocket para establecer la conexión
  const { isConnected } = useWebSocket(authToken, setupSubscriptions);

  // Función para enviar mensajes a través de WebSocket
  const sendMessageWs = useCallback(
    (messageDto: MessageDTO) => {
      if (!stompClientRef.current || !isConnected) {
        console.error("WebSocket connection not established for sending message");
        return false;
      }

      try {
        console.log("Sending message via WebSocket:", messageDto);

        // Usar el método correcto según la API de STOMP.js
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

        console.log("✅ Message sent successfully via WebSocket");
        return true;
      } catch (error) {
        console.error("❌ Error sending message via WebSocket:", error);
        return false;
      }
    },
    [isConnected]
  );

  // Función para marcar mensajes como leídos
  const markAsReadWs = useCallback(
    (markReadDto: MarkReadDTO) => {
      if (!stompClientRef.current || !isConnected) {
        console.error("WebSocket connection not established for marking as read");
        return false;
      }

      try {
        console.log("Marking messages as read via WebSocket:", markReadDto);

        // Usar el método correcto según la API de STOMP.js
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

        console.log("✅ Mark as read sent successfully via WebSocket");
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
