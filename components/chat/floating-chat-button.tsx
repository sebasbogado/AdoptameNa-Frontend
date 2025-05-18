"use client";

import { useChat } from "@/contexts/chat-context";
import { useFloatingChat } from "@/contexts/floating-chat-context";
import { MessageCircle, X, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import ChatInput from "./chat-input";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import ChatContainer from "./chat-container";
import ChatUserListItem from "./chat-user-list-item";

const FloatingChatButton = () => {
  const { isOpen, isMinimized, isVisible, minimizeChat, maximizeChat, toggleChat, closeChat } = useFloatingChat();
  const { chatUsers, unreadCount, selectedChat, selectChat, messages, sendMessage, loadingMessages, markChatAsRead, loadMoreMessages, hasMoreMessages } = useChat();
  const { user } = useAuth();
  const router = useRouter();
    
  useEffect(() => {
    if (isOpen && !selectedChat && chatUsers.length > 0) {
      const sortedUsers = [...chatUsers].sort((a, b) => b.unreadMessagesCount - a.unreadMessagesCount);
      if (sortedUsers[0]) {
        selectChat(sortedUsers[0]);
      }
    }
  }, [isOpen, chatUsers, selectedChat, selectChat]);
  
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
  
  const handleLoadMoreMessages = () => {
    if (selectedChat) {
      loadMoreMessages(selectedChat.id, true);
    }
  };

  const currentChatMessages = selectedChat ? messages[selectedChat.id] || [] : [];  
  const isLoading = !!(selectedChat && loadingMessages);
  const canLoadMore = selectedChat && hasMoreMessages(selectedChat.id);
  
  return (
    <div className="fixed bottom-4 right-16 z-40">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-80 h-96 mb-4 flex flex-col transition-all duration-300">
          <div className="bg-purple-500 text-white p-3 flex justify-between items-center">
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
                className="text-white hover:bg-purple-600 rounded p-1"
              >
                <ChevronDown size={18} />
              </button>
              <button 
                onClick={closeChat}
                className="text-white hover:bg-purple-600 rounded p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {selectedChat ? (
            <>
              <ChatContainer
                messages={currentChatMessages}
                isLoading={isLoading}
                hasMoreMessages={canLoadMore}
                onLoadMoreMessages={handleLoadMoreMessages}
                className="bg-gray-50"
              />
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
                <ChatUserListItem 
                  key={chatUser.id}
                  id={chatUser.id}
                  name={chatUser.name}
                  online={chatUser.online}
                  unreadMessagesCount={chatUser.unreadMessagesCount}
                  isSelected={false}
                  onClick={() => selectChat(chatUser)}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {isVisible && (
        <button 
          onClick={handleOpenChat}
          className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white rounded-lg px-4 py-2.5 flex items-center justify-between shadow-lg relative transition-all duration-300 hover:shadow-xl border border-purple-300"
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
