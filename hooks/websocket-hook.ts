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
    // Limpiar conexión existente si la hay
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    if (!authToken) {
      console.log("No auth token available for WebSocket");
      return () => {};
    }

    const setupWebSocket = async () => {
      try {
        const { Client } = await import("@stomp/stompjs");
        const SockJS = (await import("sockjs-client")).default;

        console.log("Connecting to WebSocket at URL:", WS_BASE_URL);

        const client = new Client({
          webSocketFactory: () => new SockJS(WS_BASE_URL),
          connectHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
          debug: function (str) {
            console.log("STOMP Debug:", str);
          },
          onConnect: () => {
            console.log("✅ Connected to WebSocket server");
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
            console.log("WebSocket disconnected");
            setIsConnected(false);
          },
          onWebSocketClose: () => {
            console.log("WebSocket closed");
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
        console.log("Deactivating WebSocket connection");
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
