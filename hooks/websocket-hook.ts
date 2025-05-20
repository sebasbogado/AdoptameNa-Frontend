"use client";

import { useCallback, useEffect, useState, useRef } from "react";

const WS_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/ws`
  : "http://localhost:8080/ws";

export function useWebSocket(
  authToken: string | null,
  setupSubscriptions: (client: any) => void
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const clientRef = useRef<any>(null);
  const subscriptionsSetupRef = useRef<boolean>(false);

  const setupWebSocketConnection = useCallback(() => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    if (!authToken) {
      return () => {};
    }

    const setupWebSocket = async () => {
      try {
        const { Client } = await import("@stomp/stompjs");
        const SockJS = (await import("sockjs-client")).default;


        const client = new Client({
          webSocketFactory: () => new SockJS(WS_BASE_URL),
          connectHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
       
          onConnect: () => {
            setIsConnected(true);
            clientRef.current = client;

            if (!subscriptionsSetupRef.current) {
              setupSubscriptions(client);
              subscriptionsSetupRef.current = true;
            }
          },
          onStompError: (frame) => {
            console.error("❌ STOMP error:", frame.headers.message);
            setIsConnected(false);
          },
          onDisconnect: () => {
            setIsConnected(false);
          },
          onWebSocketClose: () => {
            setIsConnected(false);
          },
          onWebSocketError: (event) => {
            console.error("WebSocket error:", event);
          },
        });

        client.activate();
        clientRef.current = client;
      } catch (error) {
        console.error("Error initializing WebSocket:", error);
      }
    };

    setupWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        subscriptionsSetupRef.current = false;
        setIsConnected(false);
      }
    };
  }, [authToken, setupSubscriptions]);

  useEffect(() => {
    const cleanup = setupWebSocketConnection();
    return cleanup;
  }, [setupWebSocketConnection]);

  return { isConnected };
}
