"use client";

import { useChat } from "@/contexts/chat-context";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";

export default function ChatsPage() {
  const { 
    chatUsers, 
    selectedChat, 
    selectChat, 
    messages, 
    loadingUsers,
    loadingMessages, 
    sendMessage,
    loadMoreMessages,
    hasMoreMessages
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
    // Función para hacer scroll al final de los mensajes
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Seleccionar el primer chat si no hay ninguno seleccionado
  useEffect(() => {
    if (!selectedChat && chatUsers.length > 0 && !loadingUsers) {
      selectChat(chatUsers[0]);
    }
  }, [chatUsers, selectedChat, selectChat, loadingUsers]);
  // Efecto para manejar el scroll inicial y después de cargar mensajes
  useEffect(() => {
    if (selectedChat && messages[selectedChat.id]) {
      if (scrollPositionRef.current > 0 && chatContainerRef.current) {
        // Calcular la diferencia de altura después de cargar los mensajes antiguos
        const heightDiff = chatContainerRef.current.scrollHeight - scrollPositionRef.current;
        chatContainerRef.current.scrollTop = heightDiff;
      } else {
        // Al cargar inicialmente el chat o al recibir nuevos mensajes, ir al final
        scrollToBottom();
      }
    }
  }, [selectedChat, messages]);

  // Efecto separado para el scroll inicial al cambiar de chat
  useEffect(() => {
    if (selectedChat && chatContainerRef.current) {
      scrollToBottom();
    }
  }, [selectedChat?.id]); // Solo se ejecuta cuando cambia el ID del chat

  // Detectar cuando el usuario no está al final del chat
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
    const handleLoadMoreMessages = () => {
    if (selectedChat && chatContainerRef.current) {
      // Guardar la altura total del scroll antes de cargar más mensajes
      scrollPositionRef.current = chatContainerRef.current.scrollHeight;
      loadMoreMessages(selectedChat.id, true);
    }
  };

  const handleSendMessage = (content: string) => {
    if (selectedChat) {
      sendMessage(content, selectedChat.id);
    }
  };

  const currentChatMessages = selectedChat ? messages[selectedChat.id] || [] : [];
  const canLoadMore = selectedChat && hasMoreMessages(selectedChat.id);

  if (!loadingUsers && chatUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No tienes conversaciones</h3>
        <p className="text-gray-500 max-w-sm">
          Comienza a adoptar mascotas o contacta con usuarios para iniciar una conversación.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-6xl py-6 px-4 h-full">
      <h1 className="text-2xl font-bold mb-6 text-blue-gray-800">Mensajes</h1>
      
      <div className="flex h-[calc(100vh-12rem)] gap-4 rounded-xl overflow-hidden shadow-lg">
        {/* Lista de Chats */}
        <div className="w-1/4 bg-white border-r">
          <div className="p-3 border-b">
            <input 
              type="text" 
              placeholder="Buscar conversación..." 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            {loadingUsers ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-gray-500"></div>
              </div>
            ) : (
              chatUsers.map((chatUser) => (
                <div 
                  key={chatUser.id} 
                  className={`flex items-center p-3 cursor-pointer relative ${selectedChat?.id === chatUser.id ? 'bg-blue-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => selectChat(chatUser)}
                >
                  <div className="w-12 h-12 bg-blue-gray-500 rounded-full text-white flex items-center justify-center mr-3 relative">
                    {chatUser.name.charAt(0)}
                    {chatUser.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{chatUser.name}</p>
                      {chatUser.unreadMessagesCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chatUser.unreadMessagesCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chatUser.online ? 'En línea' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contenido del chat */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex items-center">
                <div className="w-10 h-10 bg-blue-gray-500 rounded-full text-white flex items-center justify-center mr-3 relative">
                  {selectedChat.name.charAt(0)}
                  {selectedChat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.online ? 'En línea' : 'Offline'}
                  </p>
                </div>
              </div>
                <div 
                className="flex-1 p-4 overflow-y-auto flex flex-col relative" 
                onScroll={handleScroll}
                ref={chatContainerRef}
              >
                {/* Botón para cargar mensajes antiguos */}
                {canLoadMore && (
                  <div className="flex justify-center mb-4">
                    <button 
                      onClick={handleLoadMoreMessages}
                      disabled={loadingMessages}
                      className="py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      {loadingMessages ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-gray-500 mr-2"></span>
                          Cargando...
                        </>
                      ) : (
                        <>Cargar mensajes antiguos</>
                      )}
                    </button>
                  </div>
                )}
                
                {loadingMessages && !currentChatMessages.length ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-gray-500"></div>
                  </div>
                ) : currentChatMessages.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-full text-gray-500">
                    <MessageCircle className="w-12 h-12 text-gray-400 mb-2" />
                    <p>No hay mensajes en esta conversación</p>
                    <p className="text-sm">Envía un mensaje para comenzar</p>
                  </div>
                ) : (
                  <>
                    {currentChatMessages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}                {/* Botón de scroll al final */}
                {showScrollButton && (
                  <div className="sticky bottom-4 left-0 right-0 flex justify-end px-4 pointer-events-none">
                    <button
                      onClick={scrollToBottom}
                      className="px-4 py-2 bg-blue-gray-500 text-white rounded-full shadow-lg hover:bg-blue-gray-600 transition-all flex items-center gap-2 pointer-events-auto"
                    >
                      <span>Ir abajo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-lg">Selecciona un chat para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
