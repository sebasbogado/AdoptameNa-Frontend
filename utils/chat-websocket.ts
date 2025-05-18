"use client";

import { useCallback, useEffect, useRef } from "react";
import { MessageResponseDTO } from "@/types/chat";
import { useWebSocket } from "../hooks/websocket-hook";
import { User } from "@/types/auth";

type Subscription = {
  unsubscribe: () => void;
};

export function useChatWebSocket(
  authToken: string | null,
  user: User | null,
  addNewMessage: (message: MessageResponseDTO) => void,
  handleUnreadUpdate: (data: any) => void,
  // Optional: separate handler for status updates
  // handleUserStatusUpdate?: (status: UserStatus) => void
) {
  const subscriptionsRef = useRef<Subscription[]>([]);
  const userEmailRef = useRef<string | null>(null);
  const userIdRef = useRef<number | null>(null);

  const cleanupSubscriptions = useCallback(() => {
    if (subscriptionsRef.current.length > 0) {
      console.log(`🧹 Cleaning up ${subscriptionsRef.current.length} subscriptions`);
      subscriptionsRef.current.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (err) {
          console.error("❌ Error unsubscribing:", err);
        }
      });
      subscriptionsRef.current = [];
    }
  }, []);

  useEffect(() => {
    if (user?.email !== userEmailRef.current || user?.id !== userIdRef.current) {
      userEmailRef.current = user?.email || null;
      userIdRef.current = user?.id || null;
      cleanupSubscriptions();
    }
  }, [user?.email, user?.id, cleanupSubscriptions]);

  const setupSubscriptions = useCallback(
    (client: any) => {
      cleanupSubscriptions();

      if (!user?.email || !client) {
        console.warn("⚠️ No user email or client available. Skipping subscriptions.");
        return;
      }

      console.log(`🔌 Setting up subscriptions for ${user.email} (ID: ${user.id})`);

      try {
        const privateMessageSub = client.subscribe(
          `/user/queue/messages`,
          (message: { body: string }) => {
            try {
              console.log("📨 New message:", message.body);
              const data = JSON.parse(message.body);
              addNewMessage(data);
            } catch (err) {
              console.error("❌ Error parsing chat message:", err);
            }
          }
        );
        subscriptionsRef.current.push(privateMessageSub);

        const unreadCountSub = client.subscribe(
          `/user/queue/unread-count`,
          (message: { body: string }) => {
            try {
              console.log("🔔 Unread count update:", message.body);
              const data = JSON.parse(message.body);
              handleUnreadUpdate(data);
            } catch (err) {
              console.error("❌ Error parsing unread count update:", err);
            }
          }
        );
        subscriptionsRef.current.push(unreadCountSub);

        const userStatusSub = client.subscribe(
          `/topic/user-status`,
          (message: { body: string }) => {
            try {
              console.log("👤 User status update:", message.body);
              const data = JSON.parse(message.body);

              const userStatus = {
                userId: data.userId,
                email: data.email,
                online: data.online,
                timestamp: data.timestamp,
              };

              handleUnreadUpdate({
                type: "USER_STATUS_UPDATE",
                userStatus,
              });

              // Optional: use separate handler instead
              // if (handleUserStatusUpdate) {
              //   handleUserStatusUpdate(userStatus);
              // }
            } catch (err) {
              console.error("❌ Error parsing user status:", err);
            }
          }
        );
        subscriptionsRef.current.push(userStatusSub);

        console.log("✅ WebSocket subscriptions established");
      } catch (error) {
        console.error("❌ Error setting up WebSocket subscriptions:", error);
      }
    },
    [user, addNewMessage, handleUnreadUpdate, cleanupSubscriptions]
  );

  const { isConnected } = useWebSocket(authToken, setupSubscriptions);

  useEffect(() => {
    return () => {
      cleanupSubscriptions();
    };
  }, [cleanupSubscriptions]);

  return { connected: isConnected };
}
