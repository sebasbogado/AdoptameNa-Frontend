"use client";
import { useNotifications } from "@/contexts/notification-context";
import { Notification, NotificationType } from "@/types/notification";
import { Check, Clock } from "lucide-react";
import clsx from "clsx";
import Pagination from "@/components/pagination";
import Title from "@/components/title";
import { useAuth } from "@/contexts/auth-context";
import { formatTimeAgo } from "@/utils/date-format";
import { getMyNotifications } from "@/utils/notifications.http";
import { usePagination } from "@/hooks/use-pagination";
import { PaginatedResponse } from "@/types/pagination";
import { useState, useEffect } from "react";

const NotificationsPage = () => {
  const { user, authToken } = useAuth();
  const { markAllAsRead, markAsRead } = useNotifications();

  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  const fetchNotificationsPage = async (
    page: number,
    size: number,
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<Notification>> => {
    if (!authToken || !user) {
      return {
        data: [],
        pagination: {
          page: 0,
          size: 0,
          totalPages: 0,
          totalElements: 0,
          last: true
        }
      };
    }

    const response = await getMyNotifications(authToken, {
      page,
      size,
      sort: "createdAt,desc",
      ...filters
    });

    return {
      data: response.data || [],
      pagination: {
        page: response.pagination?.page || 0,
        size: response.pagination?.size || 0,
        totalPages: response.pagination?.totalPages || 0,
        totalElements: response.pagination?.totalElements || 0,
        last: page >= (response.pagination?.totalPages || 1) - 1
      }
    };
  };

  const {
    data: notifications,
    loading,
    currentPage,
    totalPages,
    handlePageChange
  } = usePagination<Notification>({
    fetchFunction: fetchNotificationsPage,
    initialPage: 1,
    initialPageSize: 10,
    scrollToTop: true
  });

  useEffect(() => {
    if (notifications) {
      setLocalNotifications(notifications);
    }
  }, [notifications]);

  const handleMarkAsRead = async (id: number, isAlreadyRead: boolean) => {
    if (!isAlreadyRead) {
      await markAsRead(id);
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setLocalNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification.id}
      className={clsx(
        "p-4 border rounded-md transition-colors",
        !notification.isRead ? "bg-amber-50 border-amber-200" : "border-gray-200"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{notification.title}</h3>
            <span
              className={clsx(
                "text-xs px-2 py-0.5 rounded-full",
                notification.type === NotificationType.PERSONAL
                  ? "bg-cyan-100 text-cyan-800"
                  : notification.type === NotificationType.ROLE_BASED
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800"
              )}
            >
              {notification.type === NotificationType.PERSONAL
                ? "Personal"
                : notification.type === NotificationType.ROLE_BASED
                ? "Rol"
                : "Global"}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{notification.message}</p>
        </div>

        {!notification.isRead && (
          <button
            onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
            className="ml-4 text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            <Check className="w-4 h-4" /> Marcar como leído
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{formatTimeAgo(notification.createdAt)}</span>
        </div>

        {notification.isRead && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Check className="w-4 h-4" /> Leído
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Title title="Notificaciones" path="/profile/notifications" />

      <div className="bg-white rounded-lg shadow-sm p-6 my-4">
        {/* Botón para marcar todas como leídas */}
        {!loading && localNotifications.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleMarkAllAsRead}
              className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm"
            >
              Marcar todas como leídas
            </button>
          </div>
        )}

        {/* Estado cuando no hay notificaciones */}
        {!loading && localNotifications.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No tienes notificaciones
          </div>
        )}

        {/* Visualización de notificaciones */}
        {!loading && localNotifications.length > 0 && (
          <div className="space-y-4">
            {localNotifications.map(renderNotification)}
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-2"></div>
            <p className="text-amber-600">Cargando notificaciones...</p>
          </div>
        )}

        {/* Paginación - solo visible cuando tenemos más de una página */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;