"use client";

import { useCallback, useEffect } from "react";

const WS_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/ws`;

export function useWebSocket(
  authToken: string | null,
  setupSubscriptions: (client: any) => void
) {
  const setupWebSocketConnection = useCallback(() => {
    let client: any = null;

    if (authToken) {
      const setupWebSocket = async () => {
        const { Client } = await import("@stomp/stompjs");
        const SockJS = (await import("sockjs-client")).default;

        client = new Client({
          webSocketFactory: () => new SockJS(WS_BASE_URL),
          connectHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
          onConnect: () => {
            console.log("Connected to WebSocket");
            setupSubscriptions(client);
          },
          onStompError: (frame) => {
            console.error("STOMP error:", frame.headers.message);
          },
        });

        client.activate();
      };

      setupWebSocket();
    }

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [authToken, setupSubscriptions]);

  useEffect(() => {
    const cleanup = setupWebSocketConnection();
    return cleanup;
  }, [setupWebSocketConnection]);
}
