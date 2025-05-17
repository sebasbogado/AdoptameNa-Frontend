"use client";

import { useChat } from "@/contexts/chat-context";
import { useFloatingChat } from "@/contexts/floating-chat-context";
import { MessageCircle, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const FloatingChatButton = () => {
  const { isOpen, isMinimized, isVisible, minimizeChat, maximizeChat, toggleChat, closeChat } = useFloatingChat();
  const { chatUsers, unreadCount, selectedChat, selectChat, messages, sendMessage, loadingMessages, markChatAsRead, loadMoreMessages, hasMoreMessages } = useChat();
  const { user } = useAuth();
  const router = useRouter();
    
  // Si hay mensajes no leídos, mostrar el usuario con más mensajes no leídos
  useEffect(() => {
    if (isOpen && !selectedChat && chatUsers.length > 0) {
      // Ordenar por mensajes no leídos y seleccionar el primero
      const sortedUsers = [...chatUsers].sort((a, b) => b.unreadMessagesCount - a.unreadMessagesCount);
      if (sortedUsers[0]) {
        selectChat(sortedUsers[0]);
      }
    }
  }, [isOpen, chatUsers, selectedChat, selectChat]);
  
  // Marcar mensajes como leídos cuando se abre el chat
  useEffect(() => {
    if (isOpen && selectedChat && selectedChat.unreadMessagesCount > 0) {
      markChatAsRead(selectedChat.id);
    }
  }, [isOpen, selectedChat, markChatAsRead]);
  
  const handleOpenChat = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (isMinimized) {
      maximizeChat();
    } else {
      toggleChat();
    }
  };
  
  const handleSendMessage = (content: string) => {
    if (!selectedChat) return;
    sendMessage(content, selectedChat.id);
  };
  
  const handleViewAllChats = () => {
    router.push('/chats');
    closeChat();
  };
  
  const currentChatMessages = selectedChat ? messages[selectedChat.id] || [] : [];  
  const isLoading = !!(selectedChat && loadingMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPosition = element.scrollTop;
    const totalHeight = element.scrollHeight;
    const viewportHeight = element.clientHeight;
    
    // Mostrar el botón solo si no estamos cerca del final y hay suficiente contenido para scrollear
    const atBottom = totalHeight - (scrollPosition + viewportHeight) < 100;
    const hasScrollableContent = totalHeight > viewportHeight;
    
    setShowScrollButton(hasScrollableContent && !atBottom);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedChat, messages, isOpen]);
  
  const handleLoadMore = () => {
    if (selectedChat && chatContainerRef.current) {
      // Guardar la altura total del scroll antes de cargar más mensajes
      scrollPositionRef.current = chatContainerRef.current.scrollHeight;
      loadMoreMessages(selectedChat.id, true);
    }
  };
  
  // Efecto para manejar el scroll inicial y después de cargar mensajes
  useEffect(() => {
    if (selectedChat && messages[selectedChat.id]) {
      if (scrollPositionRef.current > 0 && chatContainerRef.current) {
        // Calcular la diferencia de altura después de cargar los mensajes antiguos
        const heightDiff = chatContainerRef.current.scrollHeight - scrollPositionRef.current;
        chatContainerRef.current.scrollTop = heightDiff;
      } else if (!hasMoreMessages(selectedChat.id)) {
        scrollToBottom();
      }
    }
  }, [selectedChat, messages, hasMoreMessages]);

  // Efecto separado para el scroll inicial al cambiar de chat
  useEffect(() => {
    if (selectedChat && chatContainerRef.current) {
      scrollToBottom();
    }
  }, [selectedChat?.id]); // Solo se ejecuta cuando cambia el ID del chat

  const canLoadMore = selectedChat && hasMoreMessages(selectedChat.id);
    
  return (
    <div className="fixed bottom-4 right-16 z-40">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-80 h-96 mb-4 flex flex-col transition-all duration-300">
          <div className="bg-blue-gray-500 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {selectedChat ? (
                <div className="relative">
                  <span className="font-semibold">{selectedChat.name}</span>
                  {selectedChat.online && (
                    <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
              ) : (
                <span className="font-semibold">Mensajes</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={minimizeChat}
                className="text-white hover:bg-blue-gray-600 rounded p-1"
              >
                <ChevronDown size={18} />
              </button>
              <button 
                onClick={closeChat}
                className="text-white hover:bg-blue-gray-600 rounded p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {selectedChat ? (
            <>
              <div 
                className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col relative"
                onScroll={handleScroll}
                ref={chatContainerRef}
              >
                {isLoading && !currentChatMessages.length ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : currentChatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No hay mensajes. Envía el primero!
                  </div>
                ) : (                  
                  <>
                    {/* Botón para cargar mensajes antiguos */}
                    {canLoadMore && (
                      <div className="flex justify-center py-2">
                        <button 
                          onClick={handleLoadMore}
                          disabled={isLoading}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full text-xs font-medium transition-colors duration-200 flex items-center"
                        >
                          {isLoading ? 'Cargando...' : 'Cargar mensajes antiguos'}
                        </button>
                      </div>
                    )}
                    
                    {currentChatMessages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                    
                    {/* Botón de scroll al final */}
                    {showScrollButton && (
                      <div className="sticky bottom-2 left-0 right-0 flex justify-end px-2 pointer-events-none">
                        <button
                          onClick={scrollToBottom}
                          className="px-3 py-1.5 bg-blue-gray-500 text-white rounded-full shadow-lg hover:bg-blue-gray-600 transition-all flex items-center gap-1 pointer-events-auto text-xs"
                        >
                          <span>Ir abajo</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}                
              </div>
              <div className="p-3 border-t">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </>
          ) : (
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="text-center text-gray-500 py-4">
                Selecciona un chat para comenzar
              </div>
              {chatUsers.map(chatUser => (
                <div 
                  key={chatUser.id} 
                  className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => selectChat(chatUser)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-gray-500 rounded-full text-white flex items-center justify-center mr-3">
                      {chatUser.name.charAt(0)}
                    </div>
                    {chatUser.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{chatUser.name}</div>
                    {chatUser.unreadMessagesCount > 0 && (
                      <div className="text-xs text-blue-gray-50-500">{chatUser.unreadMessagesCount} mensajes no leídos</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {isVisible && (
        <button 
          onClick={handleOpenChat}
          className="bg-gradient-to-r from-blue-gray-600 to-blue-gray-400 hover:from-blue-gray-700 hover:to-blue-gray-500 text-white rounded-lg px-4 py-2.5 flex items-center justify-between shadow-lg relative transition-all duration-300 hover:shadow-xl border border-blue-300"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <MessageCircle size={20} />
              {selectedChat?.online && (
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></span>
              )}
            </div>
            <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
              {selectedChat ? selectedChat.name : "Mensajes"}
            </span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center ml-2 font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default FloatingChatButton;
