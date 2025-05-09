"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  Notification,
} from "@/types/notification";
import { notificationQueryParams } from "@/types/pagination";
import { useAuth } from "@/contexts/auth-context";
import {
  getMyNotifications,
  markNotificationAsRead as apiMarkAsRead,
} from "@/utils/notifications.http";
import { USER_ROLE } from "@/types/constants";

interface NotificationContextType {
  bellNotifications: Notification[];
  unreadCount: number;
  loading: boolean;  
  fetchBellNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const WS_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/ws`;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [bellNotifications, setBellNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { authToken, user } = useAuth();

  const fetchBellNotifications = useCallback(async () => {
    if (!authToken || !user) return;

    setLoading(true);
    try {
      const queryParams: notificationQueryParams = {
        page: 0,
        size: 5,
        sort: "createdAt,desc",
      };

      const response = await getMyNotifications(authToken, queryParams);

      if (response?.data) {
        setBellNotifications(response.data);

        const unreadParams: notificationQueryParams = {
          page: 0,
          size: 1,
          isRead: false,
        };

        const unreadResponse = await getMyNotifications(authToken, unreadParams);
        setUnreadCount(unreadResponse?.pagination?.totalElements ?? 0);
      } else {
        setBellNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error fetching bell notifications:", error);
      setBellNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [authToken, user]);

  const markAsRead = useCallback(
    async (id: number) => {
      if (!authToken || !user) return;

      try {
        const bellNotification = bellNotifications.find((n) => n.id === id);
        
        if (bellNotification && bellNotification.isRead) {
          return;
        }

        await apiMarkAsRead(authToken, id);

        setBellNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [authToken, user, bellNotifications]
  );

  const addNewNotification = useCallback((notification: Notification) => {
    setBellNotifications((prev) => {
      const exists = prev.some((n) => n.id === notification.id);
      if (exists) return prev;
      const newList = [notification, ...prev];
      return newList.slice(0, 5);
    });

    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    let client: any = null;

    if (authToken && user) {
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

            const subscribeTo = (destination: string) =>
              client.subscribe(destination, (message: { body: string }) => {
                try {
                  const data = JSON.parse(message.body);
                  addNewNotification(data);
                } catch (err) {
                  console.error("Error parsing notification:", err);
                }
              });

            subscribeTo(`/user/${user.email}/queue/notifications`);
            subscribeTo("/topic/global-notifications");

            if (user.role) {
              const roleId = user.role === "admin" ? USER_ROLE.ADMIN : user.role == "user" ? USER_ROLE.USER : USER_ROLE.ORGANIZATION;
              subscribeTo(`/topic/role-${roleId}`);
            }
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
  }, [authToken, user, addNewNotification]);

  useEffect(() => {
    if (authToken && user) {
      fetchBellNotifications();
    }
  }, [authToken, user, fetchBellNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        bellNotifications,
        unreadCount,
        loading,
        fetchBellNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
