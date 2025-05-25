"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { 
  MessageCircle, 
  Check,
  X
} from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { useFloatingChat } from "@/contexts/floating-chat-context";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { UserDTO } from "@/types/chat";
import { Alert } from "@material-tailwind/react";

const ChatButton = () => {
  const { chatUsers, unreadCount, markChatAsRead, selectChat } = useChat();
  const { openChat } = useFloatingChat();
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestMessage, setLatestMessage] = useState<{ senderName: string; content: string; userId: number } | null>(null);
  const isFirstLoad = useRef<boolean>(true);
  const previousUnreadCounts = useRef<Record<number, number>>({});

  useEffect(() => {
    if (chatUsers.length === 0) {
      previousUnreadCounts.current = {};
      return;
    }
    
    if (isFirstLoad.current) {
      chatUsers.forEach(user => {
        previousUnreadCounts.current[user.id] = user.unreadMessagesCount;
      });
      isFirstLoad.current = false;
      return;
    }
    
    const newMessageUser = chatUsers.find(user => {
      const previousCount = previousUnreadCounts.current[user.id] || 0;
      const hasNewMessages = user.unreadMessagesCount > previousCount;
      previousUnreadCounts.current[user.id] = user.unreadMessagesCount;
      return hasNewMessages;
    });
    
    if (newMessageUser) {
      setLatestMessage({
        senderName: newMessageUser.name,
        content: `Nuevo mensaje de ${newMessageUser.name}`,
        userId: newMessageUser.id
      });
      setShowToast(true);
      
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [chatUsers]);

  const handleChatSelect = (user: UserDTO) => {
    selectChat(user);
    setOpen(false);
    openChat();
  };

  const handleMarkAsRead = async (userId: number) => {
    await markChatAsRead(userId);
  };

  const handleToastClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.close-button')) {
      return;
    }

    if (latestMessage) {
      const user = chatUsers.find(u => u.id === latestMessage.userId);
      if (user) {
        handleChatSelect(user);
      }
    }
    setShowToast(false);
  };

  return (
    <>
      {showToast && latestMessage && (
        <div 
          onClick={handleToastClick}
          className="fixed top-4 right-4 z-[10001] cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Alert
            open={showToast}
            color="purple"
            animate={{
              mount: { y: 0 },
              unmount: { y: -100 },
            }}
            icon={<MessageCircle className="h-5 w-5" />}
            action={
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToast(false);
                }}
                className="!absolute top-3 right-3 p-1 hover:bg-purple-100 rounded-full close-button"
              >
                <X size={18} className="text-gray-500" />
              </button>
            }
            className="w-72 shadow-lg !pr-12"
          >
            <div>
              <p className="font-medium">{latestMessage.senderName}</p>
              <p className="text-sm line-clamp-2">{latestMessage.content}</p>
            </div>
          </Alert>
        </div>
      )}

      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="relative outline-none flex items-center justify-center">
            <MessageCircle className="text-amber-500 w-6 h-6" id="message-circle"/>
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
              <span className="font-medium text-sm text-gray-800">Mensajes</span>
              <Link
                href="/chats"
                className="text-xs text-amber-600 hover:text-amber-800"
              >
                Ver todos
              </Link>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {chatUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No tienes mensajes</div>
              ) : (
                chatUsers.map(user => (
                  <div 
                    key={user.id}
                    className={clsx(
                      "p-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors",
                      user.unreadMessagesCount > 0 && "bg-amber-50"
                    )}
                    onClick={() => handleChatSelect(user)}
                  >
                    <div className="flex items-start gap-2">                      <div className="mt-0.5 relative">
                        <UserAvatar userId={user.id} fullName={user.name} size="sm" />
                        {user.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-sm">{user.name}</div>
                          {user.unreadMessagesCount > 0 ? (
                            <div className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                              {user.unreadMessagesCount}
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            {user.online ? (
                              <span className="text-green-500">En línea</span>
                            ) : (
                              <span>Offline</span>
                            )}
                          </span>
                          
                          {user.unreadMessagesCount > 0 ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(user.id);
                              }}
                              className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Marcar como leído
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600">
                              <Check className="w-3 h-3" /> Leído
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/chats"
              className="block w-full text-center p-2 text-sm text-amber-600 hover:bg-amber-50 rounded-md mt-1"
            >
              Ver todos los mensajes
            </Link>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default ChatButton;