"use client";

import { useChat } from "@/contexts/chat-context";
import { UserDTO } from "@/types/chat";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const { selectChat } = useChat();
  const router = useRouter();
  
  const handleMessageClick = () => {
    const userToChat: UserDTO = {
      id: userId,
      name: userName,
      email: userEmail,
      online: false, // No tenemos esta información aquí
      unreadMessagesCount: 0
    };
    
    selectChat(userToChat);
    router.push('/chats');
  };
  
  return (
    <button
      onClick={handleMessageClick}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-gray-500 hover:bg-blue-gray-600 text-white rounded-lg transition-colors ${className}`}
    >
      <MessageCircle size={16} />
      <span>Enviar mensaje</span>
    </button>
  );
}
