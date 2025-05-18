"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { NotificationContext, NotificationContextType } from "../hooks/notification-hooks";
import { useNotificationState } from "../utils/notification-state";
import { useNotificationWebSocket } from "../utils/notification-websocket";


export function NotificationProvider({ children }: { children: ReactNode }) {
  const { authToken, user } = useAuth();
  
  const [state, actions] = useNotificationState(authToken, user);
  
  useNotificationWebSocket(authToken, user, actions.addNewNotification);
  
  useEffect(() => {
    if (authToken && user) {
      actions.fetchBellNotifications();
    }
  }, [authToken, user, actions.fetchBellNotifications]);

  const contextValue: NotificationContextType = {
    bellNotifications: state.bellNotifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    fetchBellNotifications: actions.fetchBellNotifications,
    markAsRead: actions.markAsRead,
    markAllAsRead: actions.markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export { useNotifications } from "../hooks/notification-hooks";
