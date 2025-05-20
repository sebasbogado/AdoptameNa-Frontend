"use client";

import React, { ReactNode, useState, useEffect } from "react";
import FloatingChatButton from "@/components/chat/floating-chat-button";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";

interface FloatingChatProviderProps {
  children: ReactNode;
}

interface FloatingChatContextValue {
  isOpen: boolean;
  isVisible: boolean;
  isMinimized: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
}

export const FloatingChatContext = React.createContext<FloatingChatContextValue | null>(null);

export const FloatingChatProvider = ({ children }: FloatingChatProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  
  const shouldShowChat = 
    user && 
    !pathname.startsWith('/chats') &&
    !pathname.startsWith('/auth/');
  
  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setIsVisible(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsVisible(false);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    setIsMinimized(false);
    setIsVisible(true);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };
  
  return (
    <FloatingChatContext.Provider      value={{ 
        isOpen, 
        isVisible,
        isMinimized,
        openChat, 
        closeChat, 
        toggleChat,
        minimizeChat,
        maximizeChat
      }}
    >
      {children}
      {shouldShowChat && <FloatingChatButton />}
    </FloatingChatContext.Provider>
  );
};

export const useFloatingChat = () => {
  const context = React.useContext(FloatingChatContext);
  if (!context) {
    throw new Error("useFloatingChat must be used within a FloatingChatProvider");
  }
  return context;
};
