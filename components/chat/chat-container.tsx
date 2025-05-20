"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MessageResponseDTO } from '@/types/chat';
import { MessageCircle } from 'lucide-react';
import ChatMessage from './chat-message';
import ScrollToBottomButton from './scroll-to-bottom-button';

interface ChatContainerProps {
  messages: MessageResponseDTO[];
  isLoading: boolean;
  hasMoreMessages: boolean | null; 
  onLoadMoreMessages: () => void;
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  hasMoreMessages,
  onLoadMoreMessages,
  className = ''
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPosition = element.scrollTop;
    const totalHeight = element.scrollHeight;
    const viewportHeight = element.clientHeight;
    
    const atBottom = totalHeight - (scrollPosition + viewportHeight) < 100;
    const hasScrollableContent = totalHeight > viewportHeight;
    
    setShowScrollButton(hasScrollableContent && !atBottom);
  };

  useEffect(() => {
    if (messages.length > 0 && containerRef.current) {
      if (scrollPositionRef.current > 0) {
        const heightDiff = containerRef.current.scrollHeight - scrollPositionRef.current;
        containerRef.current.scrollTop = heightDiff;
      } else {
        scrollToBottom();
      }
    }
  }, [messages]);

  const handleLoadMoreMessages = () => {
    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollHeight;
      onLoadMoreMessages();
    }
  };

  return (
    <div 
      className={`flex-1 p-4 overflow-y-auto flex flex-col relative ${className}`}
      onScroll={handleScroll}
      ref={containerRef}
    >
      {/* Button to load older messages */}
      {hasMoreMessages && (
        <div className="flex justify-center mb-4">
          <button 
            onClick={handleLoadMoreMessages}
            disabled={isLoading}
            className="py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-500 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></span>
                Cargando...
              </>
            ) : (
              <>Cargar mensajes antiguos</>
            )}
          </button>
        </div>
      )}
      
      {isLoading && messages.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full text-gray-500">
          <MessageCircle className="w-12 h-12 text-gray-400 mb-2" />
          <p>No hay mensajes en esta conversación</p>
          <p className="text-sm">Envía un mensaje para comenzar</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}

      {showScrollButton && (
        <ScrollToBottomButton 
          onClick={scrollToBottom} 
          size="md" 
        />
      )}
    </div>
  );
};

export default ChatContainer;
