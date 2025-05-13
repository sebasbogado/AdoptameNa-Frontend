"use client";

import { useState, useCallback } from "react";
import { Notification } from "@/types/notification";
import { notificationQueryParams } from "@/types/pagination";
import { getMyNotifications, markNotificationAsRead as apiMarkAsRead } from "@/utils/notifications.http";

export interface NotificationState {
  bellNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
}

export type NotificationActions = {
  fetchBellNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  addNewNotification: (notification: Notification) => void;
}

export function useNotificationState(authToken: string | null, user: any | null): [NotificationState, NotificationActions] {
  const [bellNotifications, setBellNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBellNotifications = useCallback(async () => {
    if (!authToken || !user) return;

    setLoading(true);
    try {
      const queryParams: notificationQueryParams = {
        page: 0,
        size: 10,
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
      return newList.slice(0, 10);
    });

    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  return [
    { bellNotifications, unreadCount, loading },
    { fetchBellNotifications, markAsRead, addNewNotification }
  ];
}
