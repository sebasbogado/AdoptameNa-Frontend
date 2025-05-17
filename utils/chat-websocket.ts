"use client";

import { useCallback, useEffect, useRef } from "react";
import { MessageResponseDTO } from "@/types/chat";
import { useWebSocket } from "../hooks/websocket-hook";
import { User } from "@/types/auth";

export function useChatWebSocket(
  authToken: string | null,
  user: User | null,
  addNewMessage: (message: MessageResponseDTO) => void,
  handleUnreadUpdate: (data: any) => void
) {
  // Mantener referencias a las suscripciones activas
  const subscriptionsRef = useRef<any[]>([]);
  const userEmailRef = useRef<string | null>(null);
  const userIdRef = useRef<number | null>(null);

  // Función para limpiar suscripciones anteriores
  const cleanupSubscriptions = useCallback(() => {
    if (subscriptionsRef.current.length > 0) {
      console.log(`Cleaning up ${subscriptionsRef.current.length} previous subscriptions`);
      subscriptionsRef.current.forEach((sub) => {
        try {
          if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        } catch (err) {
          console.error("Error unsubscribing:", err);
        }
      });
      subscriptionsRef.current = [];
    }
  }, []);

  // Actualizar las referencias cuando cambia el usuario
  useEffect(() => {
    if (user?.email !== userEmailRef.current || user?.id !== userIdRef.current) {
      userEmailRef.current = user?.email || null;
      userIdRef.current = user?.id || null;
      cleanupSubscriptions();
    }
  }, [user?.email, user?.id, cleanupSubscriptions]);

  const setupSubscriptions = useCallback(
    (client: any) => {
      // Limpiar suscripciones anteriores
      cleanupSubscriptions();
      
      if (!user?.email || !client) {
        console.log("No user email or STOMP client available for WebSocket subscriptions");
        return;
      }

      console.log(`Setting up subscriptions for user ${user.email} (ID: ${user.id})`);

      try {
        // Suscribirse a mensajes privados - probamos diferentes formatos de destino
        // 1. Formato con email
        const privateSub1 = client.subscribe(
          `/user/${user.email}/queue/messages`, 
          (message: { body: string }) => {
            try {
              console.log("📨 Received private message via email route:", message.body);
              const data = JSON.parse(message.body);
              addNewMessage(data);
            } catch (err) {
              console.error("❌ Error parsing chat message:", err);
            }
          }
        );
        subscriptionsRef.current.push(privateSub1);
        
        // 2. Formato con ID (algunas implementaciones usan este formato)
        const privateSub2 = client.subscribe(
          `/user/${user.id}/queue/messages`, 
          (message: { body: string }) => {
            try {
              console.log("📨 Received private message via ID route:", message.body);
              const data = JSON.parse(message.body);
              addNewMessage(data);
            } catch (err) {
              console.error("❌ Error parsing chat message:", err);
            }
          }
        );
        subscriptionsRef.current.push(privateSub2);
        
        // 3. Formato simple (algunas implementaciones usan este formato)
        const privateSub3 = client.subscribe(
          `/user/queue/messages`, 
          (message: { body: string }) => {
            try {
              console.log("📨 Received private message via simplified route:", message.body);
              const data = JSON.parse(message.body);
              addNewMessage(data);
            } catch (err) {
              console.error("❌ Error parsing chat message:", err);
            }
          }
        );
        subscriptionsRef.current.push(privateSub3);

        // Suscribirse a actualizaciones de conteo de mensajes no leídos - también probamos varias rutas
        const unreadSub1 = client.subscribe(
          `/user/${user.email}/queue/unread-count`, 
          (message: { body: string }) => {
            try {
              console.log("🔔 Received unread count update:", message.body);
              const data = JSON.parse(message.body);
              handleUnreadUpdate(data);
            } catch (err) {
              console.error("❌ Error parsing unread count update:", err);
            }
          }
        );
        subscriptionsRef.current.push(unreadSub1);
        
        // Versión alternativa para unread
        const unreadSub2 = client.subscribe(
          `/user/queue/unread-count`, 
          (message: { body: string }) => {
            try {
              console.log("🔔 Received unread count update (simplified route):", message.body);
              const data = JSON.parse(message.body);
              handleUnreadUpdate(data);
            } catch (err) {
              console.error("❌ Error parsing unread count update:", err);
            }
          }
        );
        subscriptionsRef.current.push(unreadSub2);

        // Suscribirse al estado de usuarios en línea
        const statusSub = client.subscribe(
          `/topic/user-status`,
          (message: { body: string }) => {
            try {
              console.log("👤 User status update received:", message.body);
              const data = JSON.parse(message.body);
              
              // Crear un objeto con el formato esperado para el estado del usuario
              const userStatus = {
                userId: data.userId,
                email: data.email,
                online: data.online,
                timestamp: data.timestamp
              };
              
              // La función handleUnreadUpdate manejará las actualizaciones de estado de usuario
              handleUnreadUpdate({ 
                type: 'USER_STATUS_UPDATE', 
                userStatus // Enviar el estado individual del usuario
              });
            } catch (err) {
              console.error("❌ Error parsing user status:", err);
            }
          }
        );
        subscriptionsRef.current.push(statusSub);

        console.log("✅ All WebSocket subscriptions set up successfully");
      } catch (error) {
        console.error("❌ Error setting up WebSocket subscriptions:", error);
      }
    },
    [user, addNewMessage, handleUnreadUpdate, cleanupSubscriptions]
  );

  // Usar el hook de WebSocket con nuestro callback de configuración
  const { isConnected } = useWebSocket(authToken, setupSubscriptions);

  // Efecto de limpieza al desmontar
  useEffect(() => {
    return () => {
      cleanupSubscriptions();
    };
  }, [cleanupSubscriptions]);

  return { connected: isConnected };
}
