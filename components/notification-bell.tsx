"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { 
  Bell, 
  Check, 
  Clock, 
  UserIcon, 
  Users, 
  Globe 
} from "lucide-react";
import { useNotifications } from "@/contexts/notification-context";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { NotificationType } from "@/types/notification";
import { formatTimeAgo } from "@/utils/date-format";
import { Alert } from "@material-tailwind/react";

const NotificationBell = () => {
  const { bellNotifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState<{ title: string; message: string } | null>(null);
  const seenNotificationIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    if (loading) return;
    
    
    if (isFirstLoad.current && bellNotifications.length > 0) {
      bellNotifications.forEach(notification => {
        seenNotificationIds.current.add(notification.id);
      });
      isFirstLoad.current = false;
      return;
    }
    
    if (!isFirstLoad.current && bellNotifications.length > 0) {
      const newNotification = bellNotifications.find(
        notification => !seenNotificationIds.current.has(notification.id)
      );
      
      if (newNotification && !newNotification.isRead) {
        setLatestNotification({
          title: newNotification.title,
          message: newNotification.message
        });
        setShowToast(true);
        
        const timer = setTimeout(() => {
          setShowToast(false);
        }, 5000);
        
        seenNotificationIds.current.add(newNotification.id);
        
        return () => clearTimeout(timer);
      }
      
      bellNotifications.forEach(notification => {
        seenNotificationIds.current.add(notification.id);
      });
    }
  }, [bellNotifications, loading]);

  const handleMarkAsRead = async (id: number, isAlreadyRead: boolean) => {
    if (!isAlreadyRead) {
      await markAsRead(id);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
      case NotificationType.PERSONAL:
        return <UserIcon className="w-4 h-4 text-amber-500" />;
      case NotificationType.ROLE_BASED:
        return <Users className="w-4 h-4 text-purple-500" />;
      case NotificationType.GLOBAL:
      default:
        return <Globe className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <>
      {showToast && latestNotification && (
        <Alert
          open={showToast}
          color="amber"
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          icon={<Bell className="h-5 w-5" />}
          onClose={() => setShowToast(false)}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <div>
            <p className="font-medium">{latestNotification.title}</p>
            <p className="text-sm line-clamp-2">{latestNotification.message}</p>
          </div>
        </Alert>
      )}

      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="relative outline-none flex items-center justify-center">
            <Bell className="text-amber-500 w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[350px] max-w-[400px] bg-white rounded-md p-2 shadow-md z-50"
            sideOffset={5}
            align="end"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <span className="font-medium text-sm text-gray-800">Notificaciones</span>
             <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-amber-500 hover:text-amber-700"
              >
                Marcar todo como leído
              </button>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Cargando notificaciones...</div>
              ) : bellNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No tienes notificaciones</div>
              ) : (
                bellNotifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={clsx(
                      "p-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors",
                      !notification.isRead && "bg-amber-50"
                    )}
                    onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-sm">{notification.title}</div>
                          {!notification.isRead ? (
                            <div className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">Nuevo</div>
                          ) : null}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2 mb-1">{notification.message}</div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {notification.isRead ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Check className="w-3 h-3" /> Leído
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-between items-center px-3 py-2 border-t border-gray-200">
              
              <Link 
                href="/profile/notifications" 
                className="block w-full text-center p-2 text-sm text-amber-600 hover:bg-amber-50 rounded-md mt-1"
                onClick={() => setOpen(false)}
              >
                Ver todas las notificaciones
              </Link>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default NotificationBell;