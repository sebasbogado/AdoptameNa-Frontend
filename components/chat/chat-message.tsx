"use client";

import { User } from "@/types/auth";
import { MessageResponseDTO } from "@/types/chat";
import { formatTimeAgo } from "@/utils/date-format";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth-context";
import { ChatUserAvatar } from "./chat-user-avatar";

interface ChatMessageProps {
  message: MessageResponseDTO;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useAuth();
  const isSentByMe = user?.id === message.senderId;
  
  return (
    <div 
      className={clsx(
        "flex items-start mb-4",
        isSentByMe ? "justify-end" : "justify-start"
      )}
    >      {!isSentByMe && (
        <div className="mr-2">
          <ChatUserAvatar 
            userId={message.senderId}
            fullName={message.senderName}
            size="sm" 
          />
        </div>
      )}
      
      <div 
        className={clsx(
          "max-w-[80%] p-3 rounded-lg",
          isSentByMe 
            ? "bg-blue-gray-500 text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}
      >
        <div className="text-sm break-words">{message.content}</div>      <div className={clsx(
          "text-xs mt-1",
          isSentByMe ? "bg-blue-gray-500" : "text-gray-500"
        )}>
          {formatTimeAgo(message.sentAt)}
          {message.read && isSentByMe && (
            <span className="ml-1">· Leído</span>
          )}
        </div>
      </div>
        {isSentByMe && (
        <div className="ml-2">
          <ChatUserAvatar 
            userId={message.senderId}
            fullName={message.senderName}
            size="sm" 
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
