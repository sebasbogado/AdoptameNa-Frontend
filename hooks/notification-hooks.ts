"use client";

import { useContext, createContext } from "react";
import { Notification } from "@/types/notification";

export interface NotificationContextType {
  bellNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchBellNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
