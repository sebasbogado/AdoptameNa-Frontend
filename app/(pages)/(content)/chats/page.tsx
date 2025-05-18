"use client";

import { useChat } from "@/contexts/chat-context";
import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatInput from "@/components/chat/chat-input";
import ChatContainer from "@/components/chat/chat-container";
import ChatHeader from "@/components/chat/chat-header";
import ChatUserListItem from "@/components/chat/chat-user-list-item";

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
    hasMoreMessages,
    markChatAsRead
  } = useChat();

  // Seleccionar el primer chat si no hay ninguno seleccionado
  useEffect(() => {
    if (!selectedChat && chatUsers.length > 0 && !loadingUsers) {
      selectChat(chatUsers[0]);
    }
  }, [chatUsers, selectedChat, selectChat, loadingUsers]);

  const handleSendMessage = (content: string) => {
    if (selectedChat) {
      sendMessage(content, selectedChat.id);
    }
  };

  const handleLoadMoreMessages = () => {
    if (selectedChat) {
      loadMoreMessages(selectedChat.id, true);
    }
  };

  const handleMarkAsRead = (userId: number) => {
    markChatAsRead(userId);
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
                <ChatUserListItem 
                  key={chatUser.id}
                  id={chatUser.id}
                  name={chatUser.name}
                  online={chatUser.online}
                  unreadMessagesCount={chatUser.unreadMessagesCount}
                  isSelected={selectedChat?.id === chatUser.id}
                  onClick={() => selectChat(chatUser)}
                  onMarkAsRead={() => handleMarkAsRead(chatUser.id)}
                  showStatus={true}
                />
              ))
            )}
          </div>
        </div>

        {/* Contenido del chat */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              <ChatHeader 
                name={selectedChat.name} 
                online={selectedChat.online}
                avatarContent={selectedChat.name.charAt(0)}
              />
              
              <ChatContainer
                messages={currentChatMessages}
                isLoading={loadingMessages}
                hasMoreMessages={canLoadMore}
                onLoadMoreMessages={handleLoadMoreMessages}
              />

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
