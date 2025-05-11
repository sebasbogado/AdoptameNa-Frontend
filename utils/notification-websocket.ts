"use client";

import { useCallback } from "react";
import { USER_ROLE } from "@/types/constants";
import { Notification } from "@/types/notification";
import { useWebSocket } from "../hooks/websocket-hook";
import { User } from "@/types/auth";

export function useNotificationWebSocket(
  authToken: string | null,
  user: User | null,
  addNewNotification: (notification: Notification) => void
) {
  const setupSubscriptions = useCallback(
    (client: any) => {
      const subscribeTo = (destination: string) =>
        client.subscribe(destination, (message: { body: string }) => {
          try {
            const data = JSON.parse(message.body);
            addNewNotification(data);
          } catch (err) {
            console.error("Error parsing notification:", err);
          }
        });

      subscribeTo("/user/queue/notifications");
      subscribeTo("/topic/global-notifications");

      if (user?.role) {
        const roleId =
          user.role === "admin"
            ? USER_ROLE.ADMIN
            : user.role === "user"
            ? USER_ROLE.USER
            : USER_ROLE.ORGANIZATION;
        subscribeTo(`/topic/role-${roleId}`);
      }
    },
    [addNewNotification, user]
  );

  useWebSocket(authToken, setupSubscriptions);
}
