"use client";

import { MessageResponseDTO } from "@/types/chat";
import { formatTimeAgo } from "@/utils/date-format";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth-context";
import { UserAvatar } from "../ui/user-avatar";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./image-modal";
import { CheckCheck } from "lucide-react";

interface ChatMessageProps {
  message: MessageResponseDTO;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useAuth();
  const isSentByMe = user?.id === message.senderId;
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const hasContent = message.content && message.content.trim().length > 0;
  const hasMedia = message.media && message.media.length > 0;
  
  return (
    <div 
      className={clsx(
        "flex items-start mb-4",
        isSentByMe ? "justify-end" : "justify-start"
      )}
    >      {!isSentByMe && (
        <div className="mr-2">
          <UserAvatar 
            userId={message.senderId}
            fullName={message.senderName}
            size="sm" 
          />
        </div>
      )}
        <div 
        className={clsx(
          "max-w-[80%] rounded-lg overflow-hidden",
          isSentByMe 
            ? "bg-purple-400 text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}
      >
      {/* Media Content */}
        {hasMedia && (
          <div className={clsx(
            "grid gap-1",
            message.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}>
            {message.media.map((media, index) => (
              <div key={media.id} className="relative">
                {!imageError[index] ? (
                  <button
                    onClick={() => handleImageClick(index)}
                    className="relative block cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={media.url}
                      alt="Imagen compartida"
                      width={200}
                      height={200}
                      className={clsx(
                        "object-cover w-full h-auto max-w-[200px] max-h-[200px]",
                        message.media.length === 1 ? "rounded-lg" : "rounded-md"
                      )}
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-md">
                    <span className="text-gray-500 text-sm">Error al cargar imagen</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Text Content */}
        {hasContent && (
          <div className={clsx(
            "text-sm break-words overflow-wrap-anywhere",
            hasMedia ? "p-3 pt-2" : "p-3"
          )}>
            {message.content}
          </div>
        )}
        
        {/* Timestamp */}
        <div className={clsx(
          "text-xs px-3 pb-2 flex justify-between",
          hasContent ? "mt-1" : hasMedia ? "mt-2" : "mt-1",
          isSentByMe ? "text-white/90" : "text-gray-500"
        )}>
          {formatTimeAgo(message.sentAt)}
          {message.read && isSentByMe && (
            <div className="flex items-center">
              <CheckCheck size={12} />
              <span className="ml-1">· Leído</span>
            </div>
          )}
        </div>
      </div>
      {isSentByMe && (
        <div className="ml-2">
          <UserAvatar
            userId={message.senderId}
            fullName={message.senderName}
            size="sm" 
          />
        </div>
      )}

      {/* Image Modal */}
      {hasMedia && (
        <ImageModal
          images={message.media}
          initialIndex={selectedImageIndex}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ChatMessage;
