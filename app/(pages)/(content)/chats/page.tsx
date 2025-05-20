"use client";

import { useChat } from "@/contexts/chat-context";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatInput from "@/components/chat/chat-input";
import ChatContainer from "@/components/chat/chat-container";
import ChatHeader from "@/components/chat/chat-header";
import ChatUserListItem from "@/components/chat/chat-user-list-item";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

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

  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

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

  const filteredChatUsers = chatUsers.filter(chatUser => 
    chatUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentChatMessages = selectedChat ? messages[selectedChat.id] || [] : [];
  const canLoadMore = selectedChat && hasMoreMessages(selectedChat.id);

  if (loading) return <Loading />;

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
      <h1 className="text-2xl font-bold mb-6 text-purple-800">Mensajes</h1>
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] gap-4 rounded-xl overflow-hidden shadow-lg">
        {/* Lista de Chats */}
        <div className="w-full md:w-1/4 md:min-w-[250px] md:max-w-[300px] bg-white border-r flex flex-col">
          <div className="p-3 border-b">
            <input 
              type="text" 
              placeholder="Buscar conversación..." 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-3.5rem)]">
            {loadingUsers ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredChatUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <p className="mb-2">No se encontraron conversaciones</p>
                <p className="text-sm">Intenta con otro término de búsqueda</p>
              </div>
            ) : (
              filteredChatUsers.map((chatUser) => (
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
        <div className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">
          {selectedChat ? (
            <>
              <ChatHeader 
                name={selectedChat.name} 
                online={selectedChat.online}
              />
              
              <ChatContainer
                messages={currentChatMessages}
                isLoading={loadingMessages}
                hasMoreMessages={canLoadMore}
                onLoadMoreMessages={handleLoadMoreMessages}
                className="overflow-x-hidden"
              />

              <div className="p-4 border-t w-full max-w-full">
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
