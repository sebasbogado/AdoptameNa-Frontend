"use client";

import { useChat } from "@/contexts/chat-context";
import { useFloatingChat } from "@/contexts/floating-chat-context";
import { UserDTO } from "@/types/chat";
import { MessageCircle } from "lucide-react";

interface DirectMessageButtonProps {
  userId: number;
  userName: string;
  userEmail: string;
  className?: string;
}

export default function DirectMessageButton({ 
  userId, 
  userName, 
  userEmail, 
  className = "" 
}: DirectMessageButtonProps) {
  const { selectChat, setChatUsers } = useChat();
  const { openChat } = useFloatingChat();
  
  const handleMessageClick = async () => {
    const userToChat: UserDTO = {
      id: userId,
      name: userName,
      email: userEmail,
      online: false,
      unreadMessagesCount: 0
    };
    
    setChatUsers((prev: UserDTO[]) => {
      const existingUser = prev.find((u: UserDTO) => u.id === userId);
      if (!existingUser) {
        return [...prev, userToChat];
      }
      return prev;
    });

    selectChat(userToChat);
    openChat();
  };    return (
    <button
      onClick={handleMessageClick}
      className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md hover:bg-gray-200 hover:text-gray-800 ${className}`}
    >
      <MessageCircle />
      <span className="font-medium text-sm text-gray-800">Mensaje: </span>
      <span className="font-medium text-sm text-gray-500">
        Enviar mensaje directo
      </span>
    </button>
  );
}
